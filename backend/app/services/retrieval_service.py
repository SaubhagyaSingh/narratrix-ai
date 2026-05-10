# app/services/retrieval_service.py
from app.services.embedding_service import get_query_embedding
from app.db.vector_setup import create_collection
from app.db.mongo import db
from langchain_core.documents import Document

async def retrieve_context(query: str, user_id: str, book_id: str) -> str:
    """
    Retrieve relevant context from Milvus + MongoDB using LangChain approach
    
    Args:
        query: User's question
        user_id: User ID for filtering
        book_id: Book ID for filtering
    
    Returns:
        Context string combining all relevant chunks
    """
    try:
        # 1. Embed the query
        query_embedding = get_query_embedding(query)
        print(f"✅ Query embedded: {len(query_embedding)} dimensions")

        # 2. Search Milvus for relevant chunks
        collection = create_collection()
        results = collection.search(
            data=[query_embedding],
            anns_field="embedding",
            param={"metric_type": "COSINE", "params": {"nprobe": 10}},
            limit=5,
            expr=f'book_id == "{book_id}"',
            output_fields=["id"]
        )
        
        if not results or not results[0]:
            print("⚠️ No results from Milvus search")
            return "No relevant content found."

        # 3. Extract Milvus IDs from search results
        milvus_ids = [str(hit.id) for hit in results[0]]
        print(f"🔍 Milvus hits: {len(milvus_ids)}")

        # 4. Fetch chunks from MongoDB
        chunks = await db.chunks.find({
            "user_id": user_id,
            "book_id": book_id,
            "milvus_id": {"$in": milvus_ids}
        }).to_list(5)

        if not chunks:
            print("⚠️ No chunks found in MongoDB")
            return "No relevant content found."

        print(f"📄 Chunks matched from Mongo: {len(chunks)}")

        # 5. Create ordered context preserving Milvus ranking
        id_to_chunk = {c["milvus_id"]: c["chunk"] for c in chunks}
        ordered_chunks = [
            id_to_chunk[mid] for mid in milvus_ids if mid in id_to_chunk
        ]

        context = "\n\n".join(ordered_chunks)
        return context

    except Exception as e:
        print(f"❌ Retrieval Error: {str(e)}")
        raise

def create_langchain_documents(chunks: list) -> list[Document]:
    """Convert MongoDB chunks to LangChain Document objects"""
    documents = []
    for chunk in chunks:
        doc = Document(
            page_content=chunk.get("chunk", ""),
            metadata={
                "book_id": chunk.get("book_id"),
                "user_id": chunk.get("user_id"),
                "milvus_id": chunk.get("milvus_id"),
                "page_number": chunk.get("page_number")
            }
        )
        documents.append(doc)
    return documents