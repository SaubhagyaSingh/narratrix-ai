# app/routes/audio.py

from fastapi import APIRouter
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.services.tts_service import text_to_speech

router = APIRouter()

class SpeechRequest(BaseModel):
    text: str

@router.post("/speak")
async def speak(req: SpeechRequest):

    filepath = text_to_speech(req.text)

    return FileResponse(
        path=filepath,
        media_type="audio/mpeg",
        filename="speech.mp3"
    )