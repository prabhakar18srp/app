import asyncio
import os
from datetime import datetime, timezone
import uuid
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# 15 campaigns across all 15 categories - only 1 fully funded
CAMPAIGNS = [
    {
        "title": "Digital Art Masterclass: From Beginner to Pro",
        "description": "Comprehensive online course teaching digital art fundamentals, advanced techniques, and portfolio building. Includes lifetime access, 50+ video lessons, downloadable resources, and community support from professional artists.",
        "category": "Art",
        "goal_amount": 25000.0,
        "raised_amount": 18750.0,  # 75% funded
        "backers_count": 245,
        "image_url": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop"
    },
    {
        "title": "The Adventures of Captain Nova - Sci-Fi Comic Series",
        "description": "A thrilling space opera comic series following Captain Nova as she explores the galaxy. 12-issue series with stunning artwork, compelling characters, and an epic storyline that will keep you on the edge of your seat.",
        "category": "Comics",
        "goal_amount": 15000.0,
        "raised_amount": 19500.0,  # 130% funded - FULLY FUNDED
        "backers_count": 487,
        "image_url": "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&h=600&fit=crop"
    },
    {
        "title": "Handcrafted Wooden Toys: Eco-Friendly & Educational",
        "description": "Beautiful handmade wooden toys for children that promote creativity and learning. Each toy is crafted from sustainable wood, non-toxic finishes, and designed to last generations. Perfect for conscious parents.",
        "category": "Crafts",
        "goal_amount": 12000.0,
        "raised_amount": 7200.0,  # 60% funded
        "backers_count": 156,
        "image_url": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop"
    },
    {
        "title": "Contemporary Dance Festival: Breaking Boundaries",
        "description": "Annual contemporary dance festival featuring emerging choreographers and dancers from around the world. 3-day event with workshops, performances, and networking opportunities. Celebrating diversity and innovation in dance.",
        "category": "Dance",
        "goal_amount": 40000.0,
        "raised_amount": 28000.0,  # 70% funded
        "backers_count": 312,
        "image_url": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=600&fit=crop"
    },
    {
        "title": "Modular Furniture System: Design Your Perfect Space",
        "description": "Revolutionary modular furniture that adapts to your lifestyle. Mix and match pieces to create custom configurations. Minimalist design meets maximum functionality. Perfect for urban living and small spaces.",
        "category": "Design",
        "goal_amount": 50000.0,
        "raised_amount": 35000.0,  # 70% funded
        "backers_count": 423,
        "image_url": "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=600&fit=crop"
    },
    {
        "title": "Sustainable Fashion: Zero-Waste Clothing Line",
        "description": "Fashion that doesn't cost the earth. Our zero-waste clothing line uses organic materials and circular design principles. Every piece is ethically made, stylish, and built to last. Join the sustainable fashion movement.",
        "category": "Fashion",
        "goal_amount": 35000.0,
        "raised_amount": 24500.0,  # 70% funded
        "backers_count": 389,
        "image_url": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop"
    },
    {
        "title": "Documentary: The Last Wildflowers",
        "description": "Powerful documentary exploring the impact of climate change on endangered plant species. Shot over 3 years across 5 continents. Features leading botanists and conservationists. A call to action for biodiversity preservation.",
        "category": "Film & Video",
        "goal_amount": 75000.0,
        "raised_amount": 48750.0,  # 65% funded
        "backers_count": 567,
        "image_url": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop"
    },
    {
        "title": "Farm to Table: Community Supported Agriculture",
        "description": "Connect directly with local organic farmers. Weekly deliveries of fresh, seasonal produce. Support sustainable agriculture and know exactly where your food comes from. Includes recipes and cooking tips from local chefs.",
        "category": "Food",
        "goal_amount": 20000.0,
        "raised_amount": 14000.0,  # 70% funded
        "backers_count": 278,
        "image_url": "https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=800&h=600&fit=crop"
    },
    {
        "title": "Quantum Quest: The Strategy Board Game",
        "description": "Award-winning strategy board game combining quantum mechanics with epic adventure. 2-6 players, 90-minute playtime. Features stunning artwork, innovative mechanics, and endless replayability. From the creators of Galaxy Wars.",
        "category": "Games",
        "goal_amount": 45000.0,
        "raised_amount": 31500.0,  # 70% funded
        "backers_count": 645,
        "image_url": "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&h=600&fit=crop"
    },
    {
        "title": "Investigative Journalism: Uncovering Corporate Corruption",
        "description": "Independent investigative journalism project exposing corruption in major corporations. 6-month investigation with full transparency. Support truth-telling journalism in the public interest. Results published freely for all.",
        "category": "Journalism",
        "goal_amount": 30000.0,
        "raised_amount": 19500.0,  # 65% funded
        "backers_count": 234,
        "image_url": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop"
    },
    {
        "title": "Debut Album: Echoes of Tomorrow",
        "description": "Indie rock band's debut album featuring 12 original songs. Recorded in professional studio with award-winning producer. Includes digital download, vinyl pressing, and exclusive behind-the-scenes content. Help us share our music with the world.",
        "category": "Music",
        "goal_amount": 28000.0,
        "raised_amount": 18200.0,  # 65% funded
        "backers_count": 412,
        "image_url": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop"
    },
    {
        "title": "Street Photography Project: Urban Stories",
        "description": "Coffee table book showcasing 200+ stunning street photographs from 30 cities worldwide. Each image tells a story of urban life, culture, and humanity. Premium quality printing, hardcover edition. Limited first edition of 1000 copies.",
        "category": "Photography",
        "goal_amount": 22000.0,
        "raised_amount": 15400.0,  # 70% funded
        "backers_count": 298,
        "image_url": "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop"
    },
    {
        "title": "Publishing Independent Authors: New Voices Series",
        "description": "Publishing platform dedicated to launching debut authors. Includes professional editing, cover design, marketing support, and distribution. Help us bring diverse, unheard voices to readers worldwide. First batch: 10 authors.",
        "category": "Publishing",
        "goal_amount": 38000.0,
        "raised_amount": 26600.0,  # 70% funded
        "backers_count": 356,
        "image_url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop"
    },
    {
        "title": "Smart Home Hub: AI-Powered Home Automation",
        "description": "Next-generation smart home hub with AI that learns your habits and preferences. Control all your devices from one app. Voice control, energy monitoring, security features, and seamless integration with 200+ brands.",
        "category": "Technology",
        "goal_amount": 60000.0,
        "raised_amount": 42000.0,  # 70% funded
        "backers_count": 534,
        "image_url": "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop"
    },
    {
        "title": "Community Theater Production: Shakespeare Reimagined",
        "description": "Groundbreaking theater production reimagining Shakespeare's classics in modern settings. Diverse cast, innovative staging, and accessible prices for all. Bringing theater to underserved communities. 20 performances planned.",
        "category": "Theater",
        "goal_amount": 32000.0,
        "raised_amount": 20800.0,  # 65% funded
        "backers_count": 267,
        "image_url": "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop"
    }
]

async def create_campaigns():
    try:
        # Connect to Supabase
        SUPABASE_URL = os.environ.get('SUPABASE_URL')
        SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
        
        if not SUPABASE_URL or not SUPABASE_KEY:
            print("❌ Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file")
            return
            
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Connected to Supabase")
        
        # Get or create a creator user
        creator_user_id = str(uuid.uuid4())
        try:
            # Check if demo user exists
            user_result = supabase.table("users").select("*").eq("email", "campaigns@demo.com").execute()
            if user_result.data and len(user_result.data) > 0:
                creator_user_id = user_result.data[0]["id"]
                print(f"✅ Using existing user: {creator_user_id}")
            else:
                # Create new user for these campaigns
                user_data = {
                    "id": creator_user_id,
                    "email": "campaigns@demo.com",
                    "name": "Demo Campaign Creator",
                    "is_admin": False,
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                user_insert = supabase.table("users").insert(user_data).execute()
                print(f"✅ Created new user: {creator_user_id}")
        except Exception as e:
            print(f"⚠️  User creation note: {e}")
        
        # First, delete all existing campaigns
        print("\n🗑️  Deleting existing campaigns...")
        try:
            existing = supabase.table("campaigns").select("id").execute()
            if existing.data:
                for camp in existing.data:
                    supabase.table("campaigns").delete().eq("id", camp["id"]).execute()
                print(f"✅ Deleted {len(existing.data)} existing campaigns")
        except Exception as e:
            print(f"⚠️  Deletion note: {e}")
        
        # Insert 15 new campaigns
        print("\n📝 Creating 15 new campaigns...")
        created_count = 0
        for campaign_data in CAMPAIGNS:
            try:
                campaign = {
                    "id": str(uuid.uuid4()),
                    "title": campaign_data["title"],
                    "description": campaign_data["description"],
                    "category": campaign_data["category"],
                    "goal_amount": campaign_data["goal_amount"],
                    "raised_amount": campaign_data["raised_amount"],
                    "backers_count": campaign_data["backers_count"],
                    "creator_id": creator_user_id,
                    "creator_name": "Demo Campaign Creator",
                    "image_url": campaign_data["image_url"],
                    "status": "active",
                    "duration_days": 30,
                    "tags": [campaign_data["category"].lower()],
                    "reward_tiers": [],
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                
                result = supabase.table("campaigns").insert(campaign).execute()
                if result.data:
                    created_count += 1
                    funded_pct = (campaign_data["raised_amount"] / campaign_data["goal_amount"]) * 100
                    status = "✅ FULLY FUNDED" if funded_pct >= 100 else f"📊 {funded_pct:.0f}% funded"
                    print(f"  ✓ {campaign_data['category']:15} - {campaign_data['title'][:40]:40} {status}")
            except Exception as e:
                print(f"  ✗ Error creating {campaign_data['title']}: {e}")
        
        print(f"\n✅ Successfully created {created_count} campaigns!")
        print(f"📊 Categories covered: {len(set(c['category'] for c in CAMPAIGNS))}")
        print(f"💰 Fully funded campaigns: {sum(1 for c in CAMPAIGNS if c['raised_amount'] >= c['goal_amount'])}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(create_campaigns())
