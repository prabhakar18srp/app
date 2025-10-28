#!/usr/bin/env python3
"""
Create test users with known passwords
"""
from supabase import create_client
import os
from dotenv import load_dotenv
import bcrypt
import uuid
from datetime import datetime, timezone

# Load environment variables
load_dotenv('.env')

# Connect to Supabase
supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_KEY'])

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_or_update_user(email: str, password: str, name: str, is_admin: bool = False):
    """Create or update a user with known password"""
    try:
        # Check if user already exists
        existing = supabase.table('users').select('*').eq('email', email).execute()
        
        password_hash = hash_password(password)
        
        if existing.data:
            # Update existing user
            result = supabase.table('users').update({
                'password_hash': password_hash,
                'name': name,
                'is_admin': is_admin
            }).eq('email', email).execute()
            
            if result.data:
                print(f"✅ Updated user: {email}")
                return True
        else:
            # Create new user
            user_data = {
                'id': str(uuid.uuid4()),
                'email': email,
                'name': name,
                'password_hash': password_hash,
                'is_admin': is_admin,
                'created_at': datetime.now(timezone.utc).isoformat()
            }
            
            result = supabase.table('users').insert(user_data).execute()
            
            if result.data:
                print(f"✅ Created user: {email}")
                return True
        
        return False
            
    except Exception as e:
        print(f"❌ Error with {email}: {str(e)}")
        return False

print("🔧 Setting up Test Users for FundAI/CampaignIQ\n")
print("=" * 80)

# Define test users
test_users = [
    # Admin
    {
        'email': 'prabhakar@gmail.com',
        'password': 'prabhakar@123',
        'name': 'Platform Admin',
        'is_admin': True
    },
    # Regular test users
    {
        'email': 'user1@test.com',
        'password': 'user1pass',
        'name': 'Test User 1',
        'is_admin': False
    },
    {
        'email': 'user2@test.com',
        'password': 'user2pass',
        'name': 'Test User 2',
        'is_admin': False
    },
    {
        'email': 'user3@test.com',
        'password': 'user3pass',
        'name': 'Test User 3',
        'is_admin': False
    },
    {
        'email': 'creator@test.com',
        'password': 'creatorpass',
        'name': 'Campaign Creator',
        'is_admin': False
    },
    {
        'email': 'backer@test.com',
        'password': 'backerpass',
        'name': 'Campaign Backer',
        'is_admin': False
    },
]

# Create/update all test users
for user in test_users:
    create_or_update_user(
        email=user['email'],
        password=user['password'],
        name=user['name'],
        is_admin=user['is_admin']
    )

print("\n" + "=" * 80)
print("\n📋 USER CREDENTIALS LIST")
print("=" * 80)
print("\n🔑 ADMIN ACCOUNT:")
print("   Email: prabhakar@gmail.com")
print("   Password: prabhakar@123")
print("   Role: Administrator")

print("\n👥 REGULAR USER ACCOUNTS:")
print("\n1. Test User 1")
print("   Email: user1@test.com")
print("   Password: user1pass")

print("\n2. Test User 2")
print("   Email: user2@test.com")
print("   Password: user2pass")

print("\n3. Test User 3")
print("   Email: user3@test.com")
print("   Password: user3pass")

print("\n4. Campaign Creator")
print("   Email: creator@test.com")
print("   Password: creatorpass")

print("\n5. Campaign Backer")
print("   Email: backer@test.com")
print("   Password: backerpass")

print("\n" + "=" * 80)
print("\n✅ All test users have been created/updated successfully!")
print("\n💡 You can now use these credentials to login to the application.")
print("=" * 80 + "\n")
