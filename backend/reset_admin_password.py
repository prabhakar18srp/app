#!/usr/bin/env python3
"""
Verify and reset admin password
"""
from supabase import create_client
import os
from dotenv import load_dotenv
import bcrypt

# Load environment variables
load_dotenv('.env')

# Connect to Supabase
supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_KEY'])

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except:
        return False

# Get admin user
admin_email = 'prabhakar@gmail.com'
admin = supabase.table('users').select('*').eq('email', admin_email).execute()

if not admin.data:
    print(f"❌ Admin user {admin_email} not found")
else:
    admin_data = admin.data[0]
    current_hash = admin_data.get('password_hash')
    
    print(f"Current admin: {admin_data['email']}")
    print(f"Has password hash: {'Yes' if current_hash else 'No'}")
    
    # Test the current password
    test_password = 'prabhakar@123'
    if current_hash:
        is_valid = verify_password(test_password, current_hash)
        print(f"Password 'prabhakar@123' is valid: {is_valid}")
    
    # Reset password to known value
    new_password = 'prabhakar@123'
    new_hash = hash_password(new_password)
    
    result = supabase.table('users').update({
        'password_hash': new_hash
    }).eq('email', admin_email).execute()
    
    if result.data:
        print(f"✅ Password reset successfully!")
        print(f"   Email: {admin_email}")
        print(f"   New Password: {new_password}")
        
        # Verify the new password works
        admin = supabase.table('users').select('*').eq('email', admin_email).execute()
        new_hash_from_db = admin.data[0]['password_hash']
        is_valid = verify_password(new_password, new_hash_from_db)
        print(f"   Verification: {'✅ PASS' if is_valid else '❌ FAIL'}")
