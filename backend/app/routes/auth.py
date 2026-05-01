from fastapi import APIRouter, HTTPException
from app.db.mongo import db
from app.core.security import hash_password, verify_password, create_token
from app.schemas.user_schema import UserCreate
from app.schemas.user_schema import UserLogin

router = APIRouter()

# SIGNUP
@router.post("/signup")
async def signup(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = {
        "email": user.email,
        "password": hash_password(user.password)
    }

    result = await db.users.insert_one(new_user)

    return {"msg": "User created", "id": str(result.inserted_id)}

# LOGIN
@router.post("/login")
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})

    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"user_id": str(db_user["_id"])})

    # Store session in Redis
    # redis_client.setex(f"session:{db_user['_id']}", 86400, token)

    return {"access_token": token}