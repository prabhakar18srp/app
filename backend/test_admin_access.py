#!/usr/bin/env python3
"""
Test if admin user can authenticate and access admin endpoints
"""
import requests
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('/app/backend/.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']
BACKEND_URL = "http://localhost:8001/api"

ADMIN_EMAIL = 'prabhakar@gmail.com'
ADMIN_PASSWORD = 'prabhakar@123'

print("🧪 Testing Admin Authentication and Access\n")
print("=" * 80)

# Step 1: Test Supabase connection
print("\n1️⃣ Testing Supabase Connection...")
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Supabase client created successfully")
except Exception as e:
    print(f"❌ Failed to create Supabase client: {e}")
    exit(1)

# Step 2: Try to sign in with Supabase Auth
print(f"\n2️⃣ Testing Authentication for {ADMIN_EMAIL}...")
try:
    auth_response = supabase.auth.sign_in_with_password({
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    
    if auth_response and auth_response.session:
        print(f"✅ Authentication successful!")
        print(f"   User ID: {auth_response.user.id}")
        print(f"   Email: {auth_response.user.email}")
        
        # Check if user has admin flag
        app_metadata = auth_response.user.app_metadata or {}
        is_admin = app_metadata.get('is_admin', False)
        
        if is_admin:
            print(f"✅ User has admin flag: {is_admin}")
        else:
            print(f"⚠️  User does NOT have admin flag!")
            print(f"   App Metadata: {app_metadata}")
            print("\n   Please run the SQL command to set is_admin flag:")
            print(f"   UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{{\"is_admin\": true}}'::jsonb WHERE email = '{ADMIN_EMAIL}';")
        
        # Get access token
        access_token = auth_response.session.access_token
        
        # Step 3: Test admin endpoints
        print(f"\n3️⃣ Testing Admin Endpoints...")
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # Test /api/admin/stats
        print("\n   Testing /api/admin/stats...")
        stats_response = requests.get(f"{BACKEND_URL}/admin/stats", headers=headers)
        print(f"   Status Code: {stats_response.status_code}")
        if stats_response.status_code == 200:
            print(f"   ✅ Stats: {stats_response.json()}")
        else:
            print(f"   ❌ Error: {stats_response.text}")
        
        # Test /api/admin/campaigns
        print("\n   Testing /api/admin/campaigns...")
        campaigns_response = requests.get(f"{BACKEND_URL}/admin/campaigns", headers=headers)
        print(f"   Status Code: {campaigns_response.status_code}")
        if campaigns_response.status_code == 200:
            campaigns = campaigns_response.json()
            print(f"   ✅ Found {len(campaigns)} campaigns")
        else:
            print(f"   ❌ Error: {campaigns_response.text}")
        
        # Test /api/admin/users
        print("\n   Testing /api/admin/users...")
        users_response = requests.get(f"{BACKEND_URL}/admin/users", headers=headers)
        print(f"   Status Code: {users_response.status_code}")
        if users_response.status_code == 200:
            users = users_response.json()
            print(f"   ✅ Found {len(users)} users")
        else:
            print(f"   ❌ Error: {users_response.text}")
            
    else:
        print(f"❌ Authentication failed - no session returned")
        
except Exception as e:
    print(f"❌ Authentication failed: {e}")
    print("\n   Possible reasons:")
    print(f"   1. User {ADMIN_EMAIL} doesn't exist in Supabase Auth")
    print(f"   2. Password is incorrect")
    print(f"   3. Email is not verified")

print("\n" + "=" * 80)
print("\n📋 Summary:")
print("   If authentication succeeded but admin endpoints fail,")
print("   you need to set the is_admin flag using the SQL command")
print("   provided in /app/ADMIN_SETUP_INSTRUCTIONS.md")
print("\n" + "=" * 80)
