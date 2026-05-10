# app/services/tts_service.py

import os
import hashlib
from datetime import datetime

from elevenlabs.client import ElevenLabs
from elevenlabs import save

from dotenv import load_dotenv

from app.db.mongo import db

load_dotenv()

client = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY")
)

AUDIO_DIR = "audio"

# Create audio folder if missing
os.makedirs(AUDIO_DIR, exist_ok=True)


async def text_to_speech(text: str):
    """
    Generate speech with caching.
    If audio already exists for same text,
    return cached file instead of regenerating.
    """

    # Generate SHA256 hash
    text_hash = hashlib.sha256(
        text.encode("utf-8")
    ).hexdigest()

    # 1. Check cache in MongoDB
    existing_audio = await db.audio_cache.find_one({
        "hash": text_hash
    })

    # 2. If exists and file exists on disk
    if existing_audio and os.path.exists(existing_audio["audio_path"]):

        print("⚡ Using cached audio")

        return existing_audio["audio_path"]

    # 3. Generate new audio
    print("🎤 Generating new audio...")

    audio = client.text_to_speech.convert(
        voice_id="JBFqnCBsd6RMkjVDRZzb",
        model_id="eleven_multilingual_v2",
        text=text
    )

    # Unique filename
    filename = f"{text_hash}.mp3"

    filepath = os.path.join(
        AUDIO_DIR,
        filename
    )

    # Save MP3
    save(audio, filepath)

    # 4. Store cache record
    await db.audio_cache.insert_one({
        "hash": text_hash,
        "text": text,
        "audio_path": filepath,
        "created_at": datetime.utcnow()
    })

    print("✅ Audio cached")

    return filepath