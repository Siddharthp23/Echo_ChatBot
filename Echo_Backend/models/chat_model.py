from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ChatRequest(BaseModel):
    user_query: str

class ChatResponse(BaseModel):
    answer: str
    pdf_url: str | None = None

class ChatHistoryOut(BaseModel):
    query : str
    answer: str
    pdf_url: Optional[str] = None
    created_at: Optional[datetime] = None