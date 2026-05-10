# app/services/llm_service.py

from groq import Groq
import os
from dotenv import load_dotenv
import re

load_dotenv()

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def clean_reasoning(answer: str) -> str:
    """
    Remove reasoning traces from Qwen responses
    """

    # Remove <think> blocks
    answer = re.sub(
        r'<think>.*?</think>',
        '',
        answer,
        flags=re.DOTALL
    )

    # Remove common reasoning starters
    reasoning_patterns = [
        r"^Okay,.*?(?=[A-Z])",
        r"^Let's see.*?(?=[A-Z])",
        r"^The user is asking.*?(?=[A-Z])",
        r"^First, I'll.*?(?=[A-Z])",
        r"^I need to.*?(?=[A-Z])",
    ]

    for pattern in reasoning_patterns:
        answer = re.sub(
            pattern,
            '',
            answer,
            flags=re.DOTALL
        )

    # Cleanup whitespace
    answer = re.sub(r'\n\s*\n', '\n', answer)
    answer = answer.strip()

    return answer


def generate_answer(context: str, query: str) -> str:
    """
    Generate answer using Groq API
    """

    if not context or not query:
        return "Error: Missing context or query"

    try:

        completion = groq_client.chat.completions.create(
            model="qwen/qwen3-32b",
            messages=[
                {
                    "role": "system",
                    "content": """
You are a RAG assistant.

STRICT RULES:
- Answer ONLY from provided context
- NEVER explain reasoning
- NEVER think step-by-step
- NEVER output internal thoughts
- NEVER say things like:
  'Okay, let's see'
  'The user is asking'
  'First I will'
- ONLY give the final answer
- Keep answers concise
- If answer missing, say:
Not found in document.
"""
                },
                {
                    "role": "user",
                    "content": f"""
Context:
{context}

Question:
{query}

Answer:
"""
                }
            ],
            temperature=0,
            max_completion_tokens=150,
            top_p=0.9,
            stream=False
        )

        answer = completion.choices[0].message.content

        answer = clean_reasoning(answer)

        print(f"✅ Generated answer: {len(answer)} chars")

        return answer

    except Exception as e:
        print(f"❌ LLM Error: {str(e)}")
        raise