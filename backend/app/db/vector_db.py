from pymilvus import connections
from app.core.config import settings

def connect_zilliz():
    connections.connect(
        alias="default",
        uri=settings.ZILLIZ_URI,
        token=settings.ZILLIZ_TOKEN
    )
    print("✅ Connected to Zilliz")