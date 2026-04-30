# app/main.py
from fastapi import FastAPI
from app.routes import auth, books, shelves, ai
from app.db.vector_db import connect_zilliz

app = FastAPI(title="Narratrix")
@app.on_event("startup")
def startup():
    connect_zilliz()

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(books.router, prefix="/books", tags=["Books"])
app.include_router(shelves.router, prefix="/shelves", tags=["Shelves"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "Narratrix API running 🚀"}