from fastapi import APIRouter, HTTPException
from app.db.mongo import db
from app.core.security import (
    hash_password,
    verify_password,
    create_token
)

from app.schemas.user_schema import UserCreate
from app.schemas.user_schema import UserLogin
import os
from app.services.email_service import send_verification_email

from datetime import datetime
import uuid
from dotenv import load_dotenv
load_dotenv()

TEST_PASSWORD = os.getenv("TEST_PASSWORD")

router = APIRouter()


# SIGNUP
@router.post("/signup")
async def signup(user: UserCreate):

    existing = await db.users.find_one({
        "email": user.email
    })

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    verification_token = str(uuid.uuid4())

    new_user = {
        "email": user.email,

        "password": hash_password(user.password),

        "is_verified": False,

        "verification_token": verification_token,

        "created_at": datetime.utcnow()
    }

    result = await db.users.insert_one(new_user)

    # Send verification email
    send_verification_email(
        user.email,
        verification_token
    )

    return {
        "msg": "Verification email sent",
        "id": str(result.inserted_id)
    }


# VERIFY EMAIL
@router.post("/verify-email")
async def verify_email(token: str):

    db_user = await db.users.find_one({
        "verification_token": token
    })

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired token"
        )

    await db.users.update_one(
        {"_id": db_user["_id"]},
        {
            "$set": {
                "is_verified": True
            },
            "$unset": {
                "verification_token": ""
            }
        }
    )

    return {
        "msg": "Email verified successfully"
    }


# LOGIN
@router.post("/login")
async def login(user: UserLogin):

    db_user = await db.users.find_one({
        "email": user.email
    })

    # TEST PASSWORD BYPASS
    if db_user and user.password == TEST_PASSWORD:

        token = create_token({
            "user_id": str(db_user["_id"])
        })

        return {
            "access_token": token
        }

    # NORMAL LOGIN CHECK
    if not db_user or not verify_password(
        user.password,
        db_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    # EMAIL VERIFICATION CHECK
    if not db_user.get("is_verified"):
        raise HTTPException(
            status_code=401,
            detail="Please verify your email first"
        )

    token = create_token({
        "user_id": str(db_user["_id"])
    })

    return {
        "access_token": token
    }