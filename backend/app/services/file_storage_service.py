# app/services/file_storage_service.py

from motor.motor_asyncio import (
    AsyncIOMotorDatabase,
    AsyncIOMotorGridFSBucket
)

from bson import ObjectId
from datetime import datetime


class FileStorageService:

    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.fs = AsyncIOMotorGridFSBucket(db)

    # =========================================================
    # PDF FUNCTIONS
    # =========================================================

    async def save_pdf(
        self,
        file_content: bytes,
        filename: str,
        user_id: str,
        book_id: str
    ) -> str:
        """
        Save PDF to MongoDB GridFS
        Returns GridFS file_id as string
        """

        try:

            upload_stream = self.fs.open_upload_stream(
                filename,
                metadata={
                    "type": "pdf",
                    "user_id": user_id,
                    "book_id": book_id,
                    "uploaded_at": datetime.utcnow()
                }
            )

            await upload_stream.write(file_content)
            await upload_stream.close()

            print(f"✅ PDF stored in GridFS: {upload_stream._id}")

            return str(upload_stream._id)

        except Exception as e:
            print(f"❌ PDF Storage Error: {str(e)}")
            raise

    async def get_pdf(self, file_id: str) -> bytes:
        """
        Retrieve PDF from GridFS
        """

        try:

            download_stream = await self.fs.open_download_stream(
                ObjectId(file_id)
            )

            data = await download_stream.read()

            print(f"✅ PDF retrieved from GridFS: {file_id}")

            return data

        except Exception as e:
            print(f"❌ PDF Retrieval Error: {str(e)}")
            raise

    async def delete_pdf(self, file_id: str) -> bool:
        """
        Delete PDF from GridFS
        """

        try:

            await self.fs.delete(
                ObjectId(file_id)
            )

            print(f"✅ PDF deleted from GridFS: {file_id}")

            return True

        except Exception as e:
            print(f"❌ PDF Deletion Error: {str(e)}")
            return False

    # =========================================================
    # AUDIO FUNCTIONS
    # =========================================================

    async def save_audio(
        self,
        audio_content: bytes,
        filename: str,
        text_hash: str
    ) -> str:
        """
        Save audio to MongoDB GridFS
        Returns GridFS file_id as string
        """

        try:

            upload_stream = self.fs.open_upload_stream(
                filename,
                metadata={
                    "type": "audio",
                    "text_hash": text_hash,
                    "uploaded_at": datetime.utcnow()
                }
            )

            await upload_stream.write(audio_content)
            await upload_stream.close()

            print(f"✅ Audio stored in GridFS: {upload_stream._id}")

            return str(upload_stream._id)

        except Exception as e:
            print(f"❌ Audio Storage Error: {str(e)}")
            raise

    async def get_audio(self, file_id: str) -> bytes:
        """
        Retrieve audio from GridFS
        """

        try:

            download_stream = await self.fs.open_download_stream(
                ObjectId(file_id)
            )

            data = await download_stream.read()

            print(f"✅ Audio retrieved from GridFS: {file_id}")

            return data

        except Exception as e:
            print(f"❌ Audio Retrieval Error: {str(e)}")
            raise

    async def delete_audio(self, file_id: str) -> bool:
        """
        Delete audio from GridFS
        """

        try:

            await self.fs.delete(
                ObjectId(file_id)
            )

            print(f"✅ Audio deleted from GridFS: {file_id}")

            return True

        except Exception as e:
            print(f"❌ Audio Deletion Error: {str(e)}")
            return False