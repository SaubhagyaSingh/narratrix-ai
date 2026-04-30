from fastapi import APIRouter, Depends
from datetime import datetime
from app.db.mongo import db
from app.schemas.book_schema import BookCreate
from app.core.dependencies import get_current_user
from fastapi import HTTPException
from bson import ObjectId

router = APIRouter()

@router.post("/")
async def add_book(book: BookCreate, user=Depends(get_current_user)):
    new_book = {
        "title": book.title,
        "author": book.author,
        "theme": book.theme,
        "tags": book.tags,
        "user_id": user["user_id"],
        "shelf_id": ObjectId(book.shelf_id) if book.shelf_id else None,
        "milvus_ids": [],
        "created_at": datetime.utcnow()
    }

    result = await db.books.insert_one(new_book)

    return {
        "msg": "Book added",
        "id": str(result.inserted_id)
    }


@router.get("/")
async def get_books(user=Depends(get_current_user)):
    books = await db.books.find({"user_id": user["user_id"]}).to_list(100)

    for book in books:
        book["_id"] = str(book["_id"])

        if book.get("shelf_id"):
            book["shelf_id"] = str(book["shelf_id"])

    return books

@router.delete("/{book_id}")
async def delete_book(book_id: str, user=Depends(get_current_user)):
    # check if book exists AND belongs to user
    book = await db.books.find_one({
        "_id": ObjectId(book_id),
        "user_id": user["user_id"]
    })

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    await db.books.delete_one({"_id": ObjectId(book_id)})

    return {"msg": "Book deleted successfully"}

@router.get("/shelf/{shelf_id}")
async def get_books_by_shelf(shelf_id: str, user=Depends(get_current_user)):
    try:
        shelf_obj_id = ObjectId(shelf_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid shelf ID")

    books = await db.books.find({
        "user_id": user["user_id"],
        "shelf_id": shelf_obj_id
    }).to_list(100)

    for book in books:
        book["_id"] = str(book["_id"])
        if book.get("shelf_id"):
            book["shelf_id"] = str(book["shelf_id"])

    return books