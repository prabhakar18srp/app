#!/usr/bin/env python3
"""
Verify if user has admin flag in Supabase Auth
"""
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv('.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

ADMIN_EMAIL = 'prabhakar@gmail.com'

print("🔍 Checking Admin Status\n")
print("=" * 80)

# Try to query using RPC or direct table access
try:
    # This query will work if we have proper permissions
    result = supabase.rpc('get_user_by_email', {'email_input': ADMIN_EMAIL}).execute()
    print(f"✅ User found via RPC")
    print(f"Data: {result.data}")
except Exception as e:
    print(f"⚠️  Cannot query users directly with anon key")
    print(f"   Error: {str(e)}")

print("\n" + "=" * 80)
print("\n📋 To verify and fix admin status:\n")
print("1. Go to Supabase Dashboard:")
print(f"   https://supabase.com/dashboard/project/owiswasjugljbntqeuad/auth/users\n")
print(f"2. Find user: {ADMIN_EMAIL}\n")
print("3. Check if 'App metadata' contains:")
print('   {')
print('     "provider": "email",')
print('     "providers": ["email"],')
print('     "is_admin": true    <-- This should be present')
print('   }\n')
print("4. If 'is_admin' is missing, run this SQL in SQL Editor:")
print(f"""
   UPDATE auth.users 
   SET raw_app_meta_data = raw_app_meta_data || '{{"is_admin": true}}'::jsonb
   WHERE email = '{ADMIN_EMAIL}';
   
   -- Verify:
   SELECT email, raw_app_meta_data FROM auth.users WHERE email = '{ADMIN_EMAIL}';
""")
print("5. After updating, LOGOUT and LOGIN again in the app")
print("\n" + "=" * 80)
