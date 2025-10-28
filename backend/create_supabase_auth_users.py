#!/usr/bin/env python3
"""
Create admin user in Supabase Auth
"""
from supabase import create_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env')

# Connect to Supabase
SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']  # This is the service_role key for admin operations

print("🔧 Creating Admin User in Supabase Auth\n")
print("=" * 80)

# Admin credentials
ADMIN_EMAIL = 'prabhakar@gmail.com'
ADMIN_PASSWORD = 'prabhakar@123'
ADMIN_NAME = 'Platform Admin'

print(f"""
⚠️  IMPORTANT: To create users in Supabase Auth, you need to:

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/owiswasjugljbntqeuad
2. Click on "Authentication" in the left sidebar
3. Click "Add User" button
4. Fill in the details:
   - Email: {ADMIN_EMAIL}
   - Password: {ADMIN_PASSWORD}
   - Auto Confirm User: YES (check this box)
   - User Metadata: {{"name": "{ADMIN_NAME}", "is_admin": true}}

5. Click "Create User"

OR use the SQL Editor with this query:
""")

sql_query = f"""
-- Create admin user in Supabase Auth
-- Run this in Supabase SQL Editor

-- First, you need to use Supabase dashboard to create the user:
-- Email: {ADMIN_EMAIL}
-- Password: {ADMIN_PASSWORD}
-- Then run this to add metadata:

-- Add custom claims/metadata (run AFTER creating user via dashboard)
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{{"name": "{ADMIN_NAME}", "is_admin": true}}'::jsonb
WHERE email = '{ADMIN_EMAIL}';
"""

print(sql_query)
print("\n" + "=" * 80)

print(f"""
✅ After creating the admin user, you can login with:
   Email: {ADMIN_EMAIL}
   Password: {ADMIN_PASSWORD}
   
📝 Create Additional Test Users:

1. user1@test.com / user1pass
2. user2@test.com / user2pass  
3. user3@test.com / user3pass

Use the same process above for each user (without the is_admin flag).
""")

print("=" * 80 + "\n")
