#!/usr/bin/env python3
"""
Setup admin user in Supabase Auth by updating user metadata
"""
from supabase import create_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env')

# Connect to Supabase with service role key (if available) or anon key
SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

ADMIN_EMAIL = 'prabhakar@gmail.com'

print("🔧 Setting up Admin User in Supabase\n")
print("=" * 80)

print(f"""
⚠️  IMPORTANT: To make {ADMIN_EMAIL} an admin, you need to:

OPTION 1: Run this SQL query in Supabase SQL Editor
--------------------------------------------------
UPDATE auth.users 
SET raw_app_meta_data = 
  CASE 
    WHEN raw_app_meta_data IS NULL THEN '{{"is_admin": true}}'::jsonb
    ELSE raw_app_meta_data || '{{"is_admin": true}}'::jsonb
  END
WHERE email = '{ADMIN_EMAIL}';

-- Verify it worked:
SELECT email, raw_app_meta_data 
FROM auth.users 
WHERE email = '{ADMIN_EMAIL}';


OPTION 2: Use Supabase Dashboard
--------------------------------------------------
1. Go to: https://supabase.com/dashboard/project/owiswasjugljbntqeuad/auth/users
2. Find user: {ADMIN_EMAIL}
3. Click on the user
4. Scroll to "User Metadata" section
5. Click "Edit User"  
6. In "App metadata" field, add:
   {{
     "is_admin": true
   }}
7. Click "Save"


✅ After updating, the user metadata will look like this:
{{
  "id": "...",
  "email": "{ADMIN_EMAIL}",
  ...
  "raw_app_meta_data": {{
    "provider": "email",
    "providers": ["email"],
    "is_admin": true    <-- This field will be added
  }},
  ...
}}

📝 Then refresh the browser and login again with:
   Email: {ADMIN_EMAIL}
   Password: prabhakar@123
""")

print("=" * 80 + "\n")
