# main.py - Refactored with LangChain
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.routes import auth, books, shelves, ai
from app.db.vector_db import connect_zilliz
from app.db.vector_setup import create_collection
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pymilvus import utility

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """App startup and shutdown events"""
    # Startup
    print("🚀 Starting Narratrix API with LangChain...")
    connect_zilliz()
    if utility.has_collection("books"):
        utility.drop_collection("books")
        print("🗑️ Old Milvus collection dropped")

    collection = create_collection()
    collection.load()
    print("✅ Milvus collection loaded")
    print("✅ LangChain services initialized")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down Narratrix API...")

app = FastAPI(
    title="Narratrix",
    description="AI-powered PDF knowledge bot with RAG",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://narratrix-ai.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(books.router, prefix="/books", tags=["Books"])
app.include_router(shelves.router, prefix="/shelves", tags=["Shelves"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])

@app.get("/")
def root():
    return {
        "message": "Narratrix API running 🚀",
        "version": "2.0.0",
        "backend": "FastAPI + LangChain"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)