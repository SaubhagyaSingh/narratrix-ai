from pydantic import BaseModel,Field
from typing import List, Optional

class BookCreate(BaseModel):
    title: str
    author: str
    theme: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    shelf_id: Optional[str] = None