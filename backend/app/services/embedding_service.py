from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn.functional as F

MODEL_NAME = "Qwen/Qwen3-Embedding-0.6B"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)
model.eval()

def get_embeddings(texts: list[str]) -> list[list[float]]:
    inputs = tokenizer(
        texts,
        padding=True,
        truncation=True,
        max_length=512,
        return_tensors="pt"
    )

    with torch.no_grad():
        outputs = model(**inputs)

    # Qwen3-Embedding uses last non-padding token, not mean pooling
    attention_mask = inputs["attention_mask"]
    last_token_idx = attention_mask.sum(dim=1) - 1
    batch_size = outputs.last_hidden_state.shape[0]

    embeddings = outputs.last_hidden_state[
        torch.arange(batch_size), last_token_idx
    ]

    # Normalize so cosine similarity works correctly in Milvus
    embeddings = F.normalize(embeddings.float(), p=2, dim=1)

    return embeddings.numpy().tolist()