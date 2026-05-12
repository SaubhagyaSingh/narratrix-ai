# main.py - UPDATED with async MongoDB and proper lifespan

from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.routes import auth, books, shelves, ai, audio
from app.db.mongo import connect_to_mongo, close_mongo_connection
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
    print("🚀 Starting Narratrix API with LangChain + MongoDB GridFS...")
    
    # Connect to MongoDB
    await connect_to_mongo()
    
    # Connect to Milvus
    connect_zilliz()
    
    collection = create_collection()
    collection.load()
    print("✅ Milvus collection loaded")
    print("✅ All services initialized")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down Narratrix API...")
    await close_mongo_connection()
    print("✅ Shutdown complete")

app = FastAPI(
    title="Narratrix",
    description="AI-powered PDF knowledge bot with RAG and MongoDB GridFS storage",
    version="2.1.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://narratrix-ai.vercel.app",
        "https://*.vercel.app"  # Allow all Vercel deployments
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
app.include_router(audio.router, prefix="/audio", tags=["Audio"])

@app.get("/")
def root():
    return {
        "message": "Narratrix API running 🚀",
        "version": "2.1.0",
        "backend": "FastAPI + LangChain + MongoDB GridFS",
        "storage": "MongoDB (Vercel compatible)"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "storage": "MongoDB GridFS",
        "timestamp": __import__("datetime").datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)