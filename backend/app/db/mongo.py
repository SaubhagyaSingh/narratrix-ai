# app/db/mongo.py - UPDATED with async motor and GridFS

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
import os
from dotenv import load_dotenv

load_dotenv()

class MongoDB:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

mongo_db = MongoDB()

async def connect_to_mongo():
    """
    Connect to MongoDB using Motor (async driver)
    """
    print("🔗 Connecting to MongoDB...")
    
    mongo_db.client = AsyncIOMotorClient(
        settings.MONGO_URI,
        serverSelectionTimeoutMS=5000
    )
    
    # Test connection
    try:
        await mongo_db.client.admin.command('ping')
        print("✅ MongoDB connected")
    except Exception as e:
        print(f"❌ MongoDB connection error: {str(e)}")
        raise
    
    mongo_db.db = mongo_db.client.narratrix  # Database name
    
    # Create indexes for better performance
    await create_indexes()

async def close_mongo_connection():
    """
    Close MongoDB connection
    """
    if mongo_db.client:
        mongo_db.client.close()
        print("🔌 MongoDB disconnected")

async def create_indexes():
    """
    Create database indexes for better query performance
    """
    try:
        # Users collection
        await mongo_db.db.users.create_index("email", unique=True)
        
        # Books collection
        await mongo_db.db.books.create_index([("user_id", 1), ("created_at", -1)])
        
        # Chunks collection
        await mongo_db.db.chunks.create_index([("user_id", 1), ("book_id", 1)])
        await mongo_db.db.chunks.create_index([("book_id", 1), ("milvus_id", 1)])
        
        # Audio cache
        await mongo_db.db.audio_cache.create_index("hash", unique=True)
        await mongo_db.db.audio_cache.create_index("created_at", expireAfterSeconds=2592000)  # 30 days
        
        # Shelves collection
        await mongo_db.db.shelves.create_index([("user_id", 1), ("created_at", -1)])
        
        # Chats collection
        await mongo_db.db.chats.create_index([("user_id", 1), ("book_id", 1)])
        
        print("✅ Database indexes created")
    except Exception as e:
        print(f"⚠️ Index creation warning: {str(e)}")

# Export db for easy access
class DBWrapper:
    """Wrapper to access MongoDB collections"""
    
    def __getattr__(self, name):
        if mongo_db.db is not None:
            return mongo_db.db[name]
        raise RuntimeError("MongoDB not connected")

db = DBWrapper()