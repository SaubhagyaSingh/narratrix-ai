from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId
from app.db.mongo import db
from app.schemas.shelf_schema import ShelfCreate
from app.core.dependencies import get_current_user

router = APIRouter()

@router.post("/")
async def create_shelf(shelf: ShelfCreate, user=Depends(get_current_user)):
    new_shelf = {
        "name": shelf.name,
        "user_id": user["user_id"],
        "created_at": datetime.utcnow()
    }

    result = await db.shelves.insert_one(new_shelf)

    return {
        "msg": "Shelf created",
        "id": str(result.inserted_id)
    }

@router.get("/")
async def get_shelves(user=Depends(get_current_user)):
    shelves = await db.shelves.find(
        {"user_id": user["user_id"]}
    ).to_list(100)

    for shelf in shelves:
        shelf["_id"] = str(shelf["_id"])

    return shelves

