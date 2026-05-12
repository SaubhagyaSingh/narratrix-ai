# app/routes/audio.py

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.services.tts_service import text_to_speech
from app.services.file_storage_service import FileStorageService
from app.db.mongo import mongo_db

router = APIRouter()


class SpeechRequest(BaseModel):
    text: str


@router.post("/speak")
async def speak(req: SpeechRequest):
    """
    Convert text to speech and directly stream audio
    """

    try:

        # Generate or retrieve cached audio
        result = await text_to_speech(req.text)

        file_id = result["file_id"]
        is_cached = result["is_cached"]

        print(
            f"🎤 Audio {'retrieved from cache' if is_cached else 'generated'}: {file_id}"
        )

        # Retrieve audio bytes from GridFS
        file_storage = FileStorageService(mongo_db.db)

        audio_bytes = await file_storage.get_audio(file_id)

        # Stream MP3 directly
        return StreamingResponse(
            iter([audio_bytes]),
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=speech.mp3",
                "Cache-Control": "no-cache"
            }
        )

    except Exception as e:
        print(f"❌ Speech generation error: {str(e)}")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )