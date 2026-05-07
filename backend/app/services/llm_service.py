# app/services/llm_service.py
from groq import Groq
import os
from dotenv import load_dotenv
import re

load_dotenv()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_answer(context: str, query: str) -> str:
    """Generate answer using Groq API with Qwen model"""
    if not context or not query:
        return "Error: Missing context or query"
    
    try:
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant. Answer questions using ONLY the provided context. "
                    "Be concise. If the answer is not in the context, say: Not found in document. "
                    "Do NOT include any thinking or reasoning in your response. Just provide the direct answer."
                )
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {query}"
            }
        ]
        
        completion = groq_client.chat.completions.create(
            model="qwen/qwen3-32b",
            messages=messages,
            temperature=0,
            max_completion_tokens=200,
            top_p=0.95,
            stream=False
        )
        
        answer = completion.choices[0].message.content
        
        # ✅ Method 1: Remove everything inside <think> tags
        answer = re.sub(r'<think>.*?</think>\s*', '', answer, flags=re.DOTALL)
        
        # ✅ Method 2: If still has thinking, extract text after closing tag
        if '<think>' in answer:
            # Split by closing tag and take the part after it
            parts = answer.split('</think>')
            if len(parts) > 1:
                answer = parts[-1].strip()
        
        # ✅ Method 3: Clean up extra whitespace
        answer = re.sub(r'\n\s*\n', '\n', answer)
        answer = answer.strip()
        
        print(f"✅ Generated answer: {len(answer)} chars")
        return answer
        
    except Exception as e:
        print(f"❌ LLM Error: {str(e)}")
        raise