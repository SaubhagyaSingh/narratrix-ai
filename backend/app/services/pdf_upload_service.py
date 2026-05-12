# app/services/pdf_upload_service.py - UPDATED for MongoDB GridFS

from app.services.document_service import process_pdf
from app.services.embedding_service import get_embeddings
from app.services.file_storage_service import FileStorageService
from app.db.vector_setup import create_collection
from app.db.mongo import db, mongo_db
from datetime import datetime
from io import BytesIO
import os

async def upload_and_process_pdf(
    file_bytes: bytes,
    filename: str,
    user_id: str,
    book_id: str,
    title: str
) -> dict:
    """
    Upload PDF, process with LangChain, embed, and store in Milvus + MongoDB + GridFS
    Now uses MongoDB GridFS instead of filesystem
    """

    try:
        # 1. Save PDF to MongoDB GridFS
        print(f"📤 Uploading PDF to GridFS: {filename}")
        file_storage = FileStorageService(mongo_db.db)        
        
        pdf_file_id = await file_storage.save_pdf(
            file_content=file_bytes,
            filename=filename,
            user_id=user_id,
            book_id=book_id
        )

        # 2. Load and split PDF using LangChain (from bytes)
        print(f"📖 Processing PDF: {title}")
        
        # Save temporarily to process with LangChain
        # LangChain's PyPDFLoader requires a file path, so we use a BytesIO workaround
        # or process directly from bytes
        from langchain_community.document_loaders import PyPDFLoader
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        
        # Create temporary path for processing
        temp_path = f"/tmp/temp_{book_id}.pdf"
        with open(temp_path, 'wb') as temp_file:
            temp_file.write(file_bytes)
        
        # Load and process
        documents = process_pdf(temp_path)
        
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

        if not documents:
            return {
                "success": False,
                "error": "No content extracted from PDF"
            }

        # 3. Prepare chunks
        chunks_to_process = []

        for doc in documents:
            chunks_to_process.append({
                "content": doc.page_content,
                "page_number": doc.metadata.get("page", 0),
                "metadata": doc.metadata
            })

        # 4. Generate embeddings
        print(f"⚙️ Embedding {len(chunks_to_process)} chunks...")

        chunk_contents = [c["content"] for c in chunks_to_process]

        embeddings_list = get_embeddings(chunk_contents)

        # 5. Prepare Milvus insert data
        collection = create_collection()

        milvus_data = []

        for chunk_info, embedding in zip(chunks_to_process, embeddings_list):
            milvus_data.append({
                "user_id": user_id,
                "book_id": book_id,
                "embedding": embedding
            })

        # 6. Insert into Milvus
        print(f"📊 Inserting {len(milvus_data)} chunks into Milvus...")

        insert_result = collection.insert(milvus_data)

        collection.flush()

        # Get Milvus IDs
        milvus_ids = insert_result.primary_keys

        # 7. Prepare MongoDB documents with GridFS file_id reference
        mongo_chunks = []

        for idx, chunk_info in enumerate(chunks_to_process):

            mongo_chunk = {
                "milvus_id": str(milvus_ids[idx]),
                "user_id": user_id,
                "book_id": book_id,
                "pdf_file_id": pdf_file_id,  # ✅ Reference to GridFS file
                "chunk": chunk_info["content"],
                "page_number": chunk_info["page_number"],
                "created_at": datetime.utcnow()
            }

            mongo_chunks.append(mongo_chunk)

        # 8. Insert chunks into MongoDB
        print(f"💾 Storing {len(mongo_chunks)} chunks in MongoDB...")

        if mongo_chunks:
            await db.chunks.insert_many(mongo_chunks)

        # 9. Update book metadata
        from bson import ObjectId
        await db.books.update_one(
            {"_id": ObjectId(book_id)},
            {
                "$set": {
                    "has_pdf": True,
                    "chunks_count": len(documents),
                    "pdf_file_id": pdf_file_id  # ✅ Store GridFS file_id
                }
            }
        )

        print(f"✅ Successfully processed and stored {len(documents)} chunks")

        return {
            "success": True,
            "chunks_created": len(documents),
            "book_id": book_id,
            "pdf_file_id": pdf_file_id,
            "message": f"PDF processed successfully with {len(documents)} chunks"
        }

    except Exception as e:
        print(f"❌ PDF Upload Error: {str(e)}")
        raise e