from pydantic import BaseModel

class ChatRequest(BaseModel):
    user_query: str

class ChatResponse(BaseModel):
    answer: str
    pdf_url: str | None = None
