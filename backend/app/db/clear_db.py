# from pymilvus import utility
# import asyncio
# from app.db.mongo import db

# async def reset():
#     # 🔥 Drop Milvus collection
#     try:
#         utility.drop_collection("book_chunks")
#         print("🔥 Milvus collection dropped")
#     except Exception as e:
#         print("Milvus error:", e)

#     # 🧹 Clear Mongo
#     await db.chunks.delete_many({})
#     print("🧹 Chunks cleared")

#     await db.books.delete_many({})
#     print("🧹 Books cleared")

#     await db.shelves.delete_many({})
#     print("🧹 Shelves cleared")

# asyncio.run(reset())

# from pymilvus import connections, utility
# from app.core.config import settings

# connections.connect(alias="default", uri=settings.ZILLIZ_URI, token=settings.ZILLIZ_TOKEN)
# utility.drop_collection("book_chunks")
# print("dropped")

# #python -m app.db.clear_db


from pymilvus import connections, utility
from app.core.config import settings

connections.connect(alias="default", uri=settings.ZILLIZ_URI, token=settings.ZILLIZ_TOKEN)
utility.drop_collection("book_chunks")
print("dropped")