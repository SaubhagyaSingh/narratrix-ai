# app/services/tts_service.py - UPDATED for MongoDB GridFS

import os
import hashlib
from datetime import datetime
from elevenlabs.client import ElevenLabs

from dotenv import load_dotenv
from app.db.mongo import db, mongo_db
from app.routes import audio
from app.services.file_storage_service import FileStorageService

load_dotenv()

client = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY")
)


async def text_to_speech(text: str) -> dict:
    """
    Generate speech with caching using MongoDB GridFS.
    If audio already exists for same text, return cached file_id instead.
    
    Returns dict with:
    - file_id: GridFS file ID for the audio
    - is_cached: Boolean indicating if it was cached
    """

    # Generate SHA256 hash
    text_hash = hashlib.sha256(
        text.encode("utf-8")
    ).hexdigest()

    # 1. Check cache in MongoDB
    existing_audio = await db.audio_cache.find_one({
        "hash": text_hash
    })

    # 2. If exists, return cached file_id
    if existing_audio and existing_audio.get("audio_file_id"):
        print("⚡ Using cached audio from GridFS")
        return {
            "file_id": existing_audio["audio_file_id"],
            "is_cached": True
        }

    # 3. Generate new audio
    print("🎤 Generating new audio...")

    audio = client.text_to_speech.convert(
        voice_id="JBFqnCBsd6RMkjVDRZzb",
        model_id="eleven_multilingual_v2",
        text=text
    )

    # Convert audio to bytes
# Convert generator/chunks to bytes
    audio_content = b"".join(audio)
    # 4. Save to MongoDB GridFS
    file_storage = FileStorageService(mongo_db.db)
    filename = f"audio_{text_hash}.mp3"
    
    audio_file_id = await file_storage.save_audio(
        audio_content=audio_content,
        filename=filename,
        text_hash=text_hash
    )

    # 5. Store cache record (without storing full audio)
    await db.audio_cache.insert_one({
        "hash": text_hash,
        "text": text,
        "audio_file_id": audio_file_id,  # ✅ Reference to GridFS file
        "created_at": datetime.utcnow()
    })

    print("✅ Audio generated and cached in GridFS")

    return {
        "file_id": audio_file_id,
        "is_cached": False
    }