# app/services/embedding_service.py
from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv

load_dotenv()

embed_client = InferenceClient(
    model="mixedbread-ai/mxbai-embed-large-v1",
    token=os.getenv("HF_TOKEN")
)

def get_embeddings(texts: list[str]) -> list[list[float]]:
    """Get embeddings using HuggingFace Inference API (cloud)"""
    try:
        return embed_client.feature_extraction(texts)
    except Exception as e:
        print(f"❌ Embedding Error: {str(e)}")
        raise

def get_query_embedding(text: str) -> list[float]:
    """Get embedding for a single query (cloud API)"""
    try:
        embedding = embed_client.feature_extraction(text)
        return embedding[0] if isinstance(embedding, list) else embedding
    except Exception as e:
        print(f"❌ Query Embedding Error: {str(e)}")
        raise