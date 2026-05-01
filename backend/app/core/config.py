import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
    DATABASE_URL = os.getenv("DATABASE_URL")
    HF_TOKEN = os.getenv("HF_TOKEN")
    MONGO_URI = os.getenv("MONGO_URI")

    ZILLIZ_URI = os.getenv("ZILLIZ_URI")
    ZILLIZ_TOKEN = os.getenv("ZILLIZ_TOKEN")

    SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
    
settings = Settings()