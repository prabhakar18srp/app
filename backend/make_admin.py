#!/usr/bin/env python3
"""
Quick fix: Update Supabase Auth user to be admin
This script uses Supabase REST API to update user metadata
"""
import requests
import os
from dotenv import load_dotenv

load_dotenv('.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']

ADMIN_EMAIL = 'prabhakar@gmail.com'

print("🔧 Updating Admin User in Supabase Auth\n")
print("=" * 80)

# Get user by email
response = requests.get(
    f"{SUPABASE_URL}/auth/v1/admin/users",
    headers={
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
    },
    params={"email": ADMIN_EMAIL}
)

if response.status_code == 200:
    users = response.json().get('users', [])
    if users:
        user_id = users[0]['id']
        print(f"✅ Found user: {ADMIN_EMAIL} (ID: {user_id})")
        
        # Update user app_metadata
        update_response = requests.put(
            f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}",
            headers={
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
            },
            json={
                "app_metadata": {
                    "is_admin": True
                }
            }
        )
        
        if update_response.status_code == 200:
            print(f"✅ Successfully updated {ADMIN_EMAIL} to admin!")
            print("\n📝 You need to:")
            print("   1. Logout from the application")
            print("   2. Login again with the same credentials")
            print("   3. Admin dashboard will now be accessible")
        else:
            print(f"❌ Failed to update user: {update_response.status_code}")
            print(f"   Response: {update_response.text}")
            print("\n⚠️  The anon key might not have admin privileges.")
            print("   Please use the MANUAL METHOD from setup_admin.py")
    else:
        print(f"❌ User {ADMIN_EMAIL} not found")
        print("\n📝 Please make sure the user exists in Supabase Auth first")
else:
    print(f"❌ Failed to fetch users: {response.status_code}")
    print(f"   Response: {response.text}")
    print("\n⚠️  The anon key cannot access admin endpoints.")
    print("   Please use the MANUAL METHOD:")
    print("\n   Run this SQL in Supabase SQL Editor:")
    print(f"""
    UPDATE auth.users 
    SET raw_app_meta_data = raw_app_meta_data || '{{"is_admin": true}}'::jsonb
    WHERE email = '{ADMIN_EMAIL}';
    
    -- Verify:
    SELECT email, raw_app_meta_data FROM auth.users WHERE email = '{ADMIN_EMAIL}';
    """)

print("=" * 80)
