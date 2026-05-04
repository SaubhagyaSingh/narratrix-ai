from pymilvus import connections, utility
from app.core.config import settings
from app.db.mongo import db
import asyncio

async def reset_all():
    # 🔌 Connect to Milvus (Zilliz)
    connections.connect(
        alias="default",
        uri=settings.ZILLIZ_URI,
        token=settings.ZILLIZ_TOKEN
    )

    # 💣 Drop Milvus collection
    if utility.has_collection("book_chunks"):
        utility.drop_collection("book_chunks")
        print("🗑️ Milvus collection dropped")
    else:
        print("⚠️ Milvus collection not found")

    # 💣 Clear MongoDB chunks collection
    result = await db.chunks.delete_many({})
    print(f"🗑️ MongoDB cleared, deleted {result.deleted_count} documents")
# 💣 Clear MongoDB بالكامل
    
    await db.chunks.delete_many({})
    await db.books.delete_many({})
    await db.shelves.delete_many({})

if __name__ == "__main__":
    asyncio.run(reset_all())
#python -m app.db.clear_db
