from pymilvus import FieldSchema, CollectionSchema, DataType, Collection, utility

COLLECTION_NAME = "book_chunks"
EMBEDDING_DIM = 1024  # Qwen3-Embedding-0.6B actual output dim

def create_collection():
    if COLLECTION_NAME in utility.list_collections():
        collection = Collection(COLLECTION_NAME)
    else:
        fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
            FieldSchema(name="book_id", dtype=DataType.VARCHAR, max_length=100),
            FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM)
        ]
        schema = CollectionSchema(fields)
        collection = Collection(name=COLLECTION_NAME, schema=schema)

    if not collection.has_index():
        collection.create_index(
            field_name="embedding",
            index_params={
                "index_type": "IVF_FLAT",
                "metric_type": "COSINE",
                "params": {"nlist": 128}
            }
        )
        print("✅ Index created")

    return collection