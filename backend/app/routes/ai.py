# app/routes/ai.py - UPDATED for MongoDB GridFS

from fastapi import APIRouter, HTTPException, File, UploadFile, Depends, Query
from pydantic import BaseModel
from typing import Optional
from bson import ObjectId
from app.core.security import get_current_user
from app.services.file_storage_service import FileStorageService
from app.services.pdf_upload_service import upload_and_process_pdf
from app.services.rag_service import rag_pipeline
from app.db.mongo import db, mongo_db

router = APIRouter()

class AnswerResponse(BaseModel):
    answer: str
    success: bool
    context_length: Optional[int] = None
    error: Optional[str] = None

@router.post("/upload-pdf/{book_id}")
async def upload_pdf(
    book_id: str,
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    """Upload PDF and process with LangChain - stores in MongoDB GridFS"""
    user_id = current_user.get("user_id")
    
    if not book_id:
        raise HTTPException(status_code=400, detail="book_id required")
    
    try:
        print(f"📤 Uploading PDF: {file.filename} for book {book_id}")
        
        # Read file bytes (no temp file)
        file_bytes = await file.read()
        
        print(f"📝 Processing PDF...")
        
        book = await db.books.find_one({"_id": ObjectId(book_id)})
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        
        # Verify user owns this book
        if book.get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        title = book.get("title", "Untitled")

        # Process PDF with LangChain (now with bytes)
        result = await upload_and_process_pdf(
            file_bytes=file_bytes,
            filename=file.filename,
            user_id=user_id,
            book_id=book_id,
            title=title
        )
        
        print(f"✅ PDF processed: {result.get('chunks_created')} chunks created")
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ask/{book_id}", response_model=AnswerResponse)
async def ask_question(
    book_id: str,
    query: str = Query(...),
    current_user = Depends(get_current_user)
):
    """Ask a question about a PDF using LangChain RAG"""
    user_id = current_user.get("user_id")
    
    if not query or not book_id:
        raise HTTPException(status_code=400, detail="query and book_id required")
    
    try:
        print(f"❓ Question: {query[:50]}... for book {book_id}")
        
        # Use LangChain RAG pipeline
        result = await rag_pipeline.answer_question(
            query=query,
            user_id=user_id,
            book_id=book_id
        )
        
        return AnswerResponse(**result)
        
    except Exception as e:
        print(f"❌ Ask error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chat-history/{book_id}")
async def get_chat_history(
    book_id: str,
    current_user = Depends(get_current_user)
):
    """Get chat history for a book"""
    user_id = current_user.get("user_id")
    
    try:
        chats = await db.chats.find({
            "user_id": user_id,
            "book_id": book_id
        }).to_list(50)
        
        # Convert ObjectIds to strings
        for chat in chats:
            chat["_id"] = str(chat["_id"])
        
        return {"chats": chats, "count": len(chats)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/chats/{chat_id}")
async def delete_chat(
    chat_id: str,
    current_user = Depends(get_current_user)
):
    """Delete a chat"""
    user_id = current_user.get("user_id")
    
    try:
        result = await db.chats.delete_one({
            "_id": ObjectId(chat_id),
            "user_id": user_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        return {"message": "Chat deleted", "deleted_count": result.deleted_count}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download-pdf/{book_id}")
async def download_pdf(
    book_id: str,
    current_user = Depends(get_current_user)
):
    """Download original PDF from GridFS"""
    from fastapi.responses import StreamingResponse
    
    user_id = current_user.get("user_id")
    
    try:
        # Get book and verify ownership
        book = await db.books.find_one({
            "_id": ObjectId(book_id),
            "user_id": user_id
        })
        
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        
        pdf_file_id = book.get("pdf_file_id")
        if not pdf_file_id:
            raise HTTPException(status_code=404, detail="PDF not found")
        
        # Retrieve from GridFS

        file_storage = FileStorageService(mongo_db.db)
        pdf_bytes = await file_storage.get_pdf(pdf_file_id)
        
        return StreamingResponse(
            iter([pdf_bytes]),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={book.get('title', 'document')}.pdf"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Download error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))