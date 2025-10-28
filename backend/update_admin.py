import asyncio
from supabase import create_client
import os
from dotenv import load_dotenv
from pathlib import Path
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def update_admin():
    """Update or create admin user with new credentials"""
    
    old_email = "admin123@gmail.com"
    new_email = "prabhakar@gmail.com"
    new_password = "prabhakar@123"
    
    print(f"Updating admin credentials...")
    
    # Check if new admin already exists
    result = supabase.table("users").select("*").eq("email", new_email).execute()
    new_admin = result.data[0] if result.data else None
    
    if new_admin:
        # Update existing new admin to ensure it has correct password and admin rights
        supabase.table("users").update({
            "password_hash": hash_password(new_password),
            "is_admin": True,
            "name": "Prabhakar"
        }).eq("email", new_email).execute()
        print(f"✅ Updated existing user {new_email} with new password and admin rights")
        
        # Remove old admin if exists and is different
        result = supabase.table("users").select("*").eq("email", old_email).execute()
        old_admin = result.data[0] if result.data else None
        if old_admin and old_email != new_email:
            supabase.table("users").delete().eq("email", old_email).execute()
            print(f"✅ Removed old admin: {old_email}")
    else:
        # Check if old admin exists
        result = supabase.table("users").select("*").eq("email", old_email).execute()
        old_admin = result.data[0] if result.data else None
        
        if old_admin:
            print(f"Found old admin: {old_email}")
            # Update existing admin
            supabase.table("users").update({
                "email": new_email,
                "password_hash": hash_password(new_password),
                "name": "Prabhakar",
                "is_admin": True
            }).eq("email", old_email).execute()
            print(f"✅ Updated admin credentials from {old_email} to {new_email}")
        else:
            # Create new admin
            import uuid
            from datetime import datetime, timezone
            
            supabase.table("users").insert({
                "id": str(uuid.uuid4()),
                "email": new_email,
                "name": "Prabhakar",
                "password_hash": hash_password(new_password),
                "is_admin": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            }).execute()
            print(f"✅ Created new admin: {new_email}")
    
    print(f"\n🔑 Admin Credentials:")
    print(f"   Email: {new_email}")
    print(f"   Password: {new_password}")

if __name__ == "__main__":
    asyncio.run(update_admin())
