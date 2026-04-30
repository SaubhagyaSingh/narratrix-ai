from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType
from app.core.config import settings

connections.connect(
    alias="default",
    host=settings.MILVUS_HOST,
    port=settings.MILVUS_PORT
)

def create_collection():
    fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="book_id", dtype=DataType.INT64),
        FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=384),
    ]

    schema = CollectionSchema(fields, "Book Embeddings")
    collection = Collection("book_chunks", schema)
    return collection