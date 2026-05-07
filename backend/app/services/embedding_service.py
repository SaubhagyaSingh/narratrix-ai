from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize embedding client
embed_client = InferenceClient(
    model="mixedbread-ai/mxbai-embed-large-v1",
    token=os.getenv("HF_TOKEN")
)

def get_embeddings(texts: list[str]) -> list[list[float]]:
    """Get embeddings from Hugging Face Inference API"""
    embeddings = embed_client.feature_extraction(texts)
    return embeddings