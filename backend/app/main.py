# main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.routes import auth, books, shelves, ai
from app.db.vector_db import connect_zilliz
from app.db.vector_setup import create_collection

@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_zilliz()
    collection = create_collection()
    collection.load()
    print("✅ Collection loaded")
    yield

app = FastAPI(title="Narratrix", lifespan=lifespan)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(books.router, prefix="/books", tags=["Books"])
app.include_router(shelves.router, prefix="/shelves", tags=["Shelves"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "Narratrix API running 🚀"}