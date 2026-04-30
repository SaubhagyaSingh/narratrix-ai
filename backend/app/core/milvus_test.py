from pymilvus import connections, utility
from app.core.config import settings  # your Settings class

def test_zilliz_connection():
    try:
        connections.connect(
            alias="default",
            uri=settings.ZILLIZ_URI,
            token=settings.ZILLIZ_TOKEN
        )

        print("✅ Connected to Zilliz")

        collections = utility.list_collections()
        print("📦 Collections:", collections)

    except Exception as e:
        print("❌ Connection failed")
        print(e)


if __name__ == "__main__":
    test_zilliz_connection()