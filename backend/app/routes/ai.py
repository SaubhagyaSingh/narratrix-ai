from fastapi import APIRouter, UploadFile, File, Depends
import os
import uuid
from bson import ObjectId
from app.core.dependencies import get_current_user
from app.services.pdf_service import extract_pdf_text
from app.services.chunking_service import chunk_text
from app.services.embedding_service import get_embeddings
from app.db.vector_setup import create_collection
from app.db.mongo import db
from app.services.rag_service import retrieve_context
from app.services.llm_service import generate_answer

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# =========================
# 📄 Upload PDF
# =========================
@router.post("/upload-pdf/{book_id}")
async def upload_pdf(
    book_id: str,
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    file_path = f"{UPLOAD_DIR}/{uuid.uuid4()}_{file.filename}"

    # save file
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # process
    text = extract_pdf_text(file_path)
    chunks = chunk_text(text)
    embeddings = get_embeddings(chunks)

    collection = create_collection()

    # store in Milvus
    data = [
        [book_id] * len(chunks),
        embeddings
    ]

    result = collection.insert(data)
    collection.flush()  # ✅ ensures data is searchable

    # store in Mongo
    docs = []
    for i, chunk in enumerate(chunks):
        docs.append({
            "user_id": user["user_id"],
            "book_id": book_id,
            "chunk": chunk,
            "milvus_id": str(result.primary_keys[i])
        })

    await db.chunks.insert_many(docs)
    await db.books.update_one(
        {"_id": ObjectId(book_id), "user_id": user["user_id"]},
        {"$set": {"has_pdf": True}}
    )
    
    return {"msg": "PDF processed successfully"}


# =========================
# 🤖 Ask Question
# =========================
@router.post("/ask/{book_id}")
async def ask_question(
    book_id: str,
    query: str,
    user=Depends(get_current_user)
):
    print("Milvus IDs:")

    # 🔥 correct retrieval (book-specific)
    context = await retrieve_context(
        query,
        user["user_id"],
        book_id
    )

    # generate answer
    answer = generate_answer(context, query)

    return {
        "question": query,
        "answer": answer
    }