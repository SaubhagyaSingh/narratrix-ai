from pymilvus import FieldSchema, CollectionSchema, DataType, Collection

def create_books_collection():
    fields = [
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="user_id", dtype=DataType.VARCHAR, max_length=100),
        FieldSchema(name="book_id", dtype=DataType.VARCHAR, max_length=100),
        FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=384)
    ]

    schema = CollectionSchema(fields, description="Books embeddings")

    collection = Collection(name="books", schema=schema)

    print("📚 Collection ready")
    return collection