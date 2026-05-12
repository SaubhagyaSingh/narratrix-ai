# app/services/rag_service.py

from langchain_groq import ChatGroq
from app.services.retrieval_service import retrieve_context
from app.services.llm_service import generate_answer
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    model="qwen/qwen3-32b",
    temperature=0,
    max_tokens=200,
    api_key=os.getenv("GROQ_API_KEY")
)

class RAGPipeline:
    
    def __init__(self):
        self.llm = llm
        
    async def answer_question(self, query: str, user_id: str, book_id: str) -> dict:
        try:
            # Retrieve context
            print(f"🔎 Retrieving context for query: {query[:50]}...")
            context = await retrieve_context(query, user_id, book_id)
            
            # Generate clean answer
            print(f"💭 Generating answer...")
            answer = generate_answer(context, query)
            
            return {
                "success": True,
                "answer": answer,
                "context_length": len(context),
                "query": query
            }
            
        except Exception as e:
            print(f"❌ RAG Pipeline Error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "answer": "An error occurred while processing your question."
            }

rag_pipeline = RAGPipeline()