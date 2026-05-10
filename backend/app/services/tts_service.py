# app/services/tts_service.py

from elevenlabs.client import ElevenLabs
from elevenlabs import save
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

client = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY")
)

AUDIO_DIR = "audio_outputs"

os.makedirs(AUDIO_DIR, exist_ok=True)

def text_to_speech(text: str) -> str:
    """
    Convert text to speech and save mp3
    """

    filename = f"{uuid.uuid4()}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)

    # ✅ Use default free voice
    audio = client.text_to_speech.convert(
        voice_id="JBFqnCBsd6RMkjVDRZzb",  # George (free/default)
        model_id="eleven_multilingual_v2",
        text=text
    )

    save(audio, filepath)

    return filepath