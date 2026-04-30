from pydantic import BaseModel

class ShelfCreate(BaseModel):
    name: str