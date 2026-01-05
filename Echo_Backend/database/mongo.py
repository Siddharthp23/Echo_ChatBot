from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_chat_collection():
    return db["chat_history"]

users_collection = db["users"]
counters_collection = db["counters"]

def get_users_collection():
    return users_collection


async def init_db():
    await users_collection.create_index("email", unique=True)
    await users_collection.create_index("contact_number", unique=False)
