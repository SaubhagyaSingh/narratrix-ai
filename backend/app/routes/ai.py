# app/routes/ai.py - FIXED form data handling
from fastapi import APIRouter, HTTPException, File, UploadFile, Depends, Query, Form
from pydantic import BaseModel
from typing import Optional
import os
import shutil
from bson import ObjectId
from app.core.security import get_current_user
from app.services.pdf_upload_service import upload_and_process_pdf
from app.services.rag_service import rag_pipeline
from app.db.mongo import db

router = APIRouter()

class AnswerResponse(BaseModel):
    answer: str
    success: bool
    context_length: Optional[int] = None
    error: Optional[str] = None

# ✅ FIXED: Accept title as Form data (not Query)
@router.post("/upload-pdf/{book_id}")
async def upload_pdf(
    book_id: str,
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    """Upload PDF and process with LangChain"""
    user_id = current_user.get("user_id")
    
    if not book_id:
        raise HTTPException(status_code=400, detail="book_id required")
    
    try:
        print(f"📤 Uploading PDF: {file.filename} for book {book_id}")
        
        # Save temporary file
        temp_file = f"/tmp/{file.filename}"
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"📝 Processing PDF...")
        
        book = await db.books.find_one({"_id": ObjectId(book_id)})
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        title = book.get("title", "Untitled")

        # Process PDF with LangChain
        result = await upload_and_process_pdf(
            file_path=temp_file,
            user_id=user_id,
            book_id=book_id,
            title=title
        )
        
        # Cleanup
        if os.path.exists(temp_file):
            os.remove(temp_file)
        
        print(f"✅ PDF processed: {result.get('chunks_created')} chunks created")
        
        # Update book with PDF status
        await db.books.update_one(
            {"_id": ObjectId(book_id)},
            {"$set": {"has_pdf": True, "chunks_count": result.get("chunks_created", 0)}}
        )
        
        return result
        
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