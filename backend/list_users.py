#!/usr/bin/env python3
"""
List all users in the database
"""
from supabase import create_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env')

# Connect to Supabase
supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_KEY'])

print("📋 All Users in Database:\n")
print("=" * 80)

# Get all users
users = supabase.table('users').select('*').execute()

if not users.data:
    print("No users found in the database.")
else:
    for user in users.data:
        print(f"\n{'='*80}")
        print(f"Name: {user.get('name', 'N/A')}")
        print(f"Email: {user.get('email', 'N/A')}")
        print(f"Admin: {'Yes' if user.get('is_admin') else 'No'}")
        print(f"Created: {user.get('created_at', 'N/A')}")
        print(f"ID: {user.get('id', 'N/A')}")
        # Note: We don't show password hash for security
        print(f"Has Password: {'Yes' if user.get('password_hash') else 'No'}")

print(f"\n{'='*80}")
print(f"\nTotal Users: {len(users.data)}")
print(f"Admin Users: {sum(1 for u in users.data if u.get('is_admin'))}")
print(f"Regular Users: {sum(1 for u in users.data if not u.get('is_admin'))}")
