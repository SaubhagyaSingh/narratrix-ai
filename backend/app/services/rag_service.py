from app.services.embedding_service import get_embeddings
from app.db.vector_setup import create_collection
from app.db.mongo import db

async def retrieve_context(query: str, user_id: str, book_id: str) -> str:
    # 1. Embed the query using the same model used during upload
    query_embedding = get_embeddings([query])[0]

    # 2. Search Milvus for the most relevant chunks for this book
    collection = create_collection()

    results = collection.search(
        data=[query_embedding],
        anns_field="embedding",
        param={"metric_type": "COSINE", "params": {"nprobe": 10}},
        limit=5,
        expr=f'book_id == "{book_id}"',
        output_fields=["id"]
    )
    print("🔍 Milvus hits:", len(results[0]) if results else 0)  # ADD

    if not results or not results[0]:
        return "No relevant content found."

    # 3. Pull the milvus IDs from search results
    milvus_ids = [str(hit.id) for hit in results[0]]
    print("🆔 Milvus IDs from search:", milvus_ids)  # ADD

    sample = await db.chunks.find_one({"book_id": book_id})
    print("📦 Sample Mongo chunk:", sample)  # ADD

    # 4. Fetch only those matching chunks from MongoDB
    chunks = await db.chunks.find({
        "user_id": user_id,
        "book_id": book_id,
        "milvus_id": {"$in": milvus_ids}
    }).to_list(5)
    print("📄 Chunks matched from Mongo:", len(chunks))  # ADD

    if not chunks:
        return "No relevant content found."

    # 5. Return as a single context string
    return "\n\n".join([c["chunk"] for c in chunks])