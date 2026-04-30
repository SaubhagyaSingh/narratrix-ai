from pymongo import MongoClient

uri = "mongodb+srv://saubhagya:test123@cluster0.pzqsddg.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(uri)

try:
    print(client.list_database_names())
    print("✅ Connected")
except Exception as e:
    print("❌ Error:", e)