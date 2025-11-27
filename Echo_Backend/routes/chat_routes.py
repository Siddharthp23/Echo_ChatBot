# routes/chat_routes.py
import os
from fastapi import APIRouter, Depends, HTTPException
from models.chat_model import ChatRequest, ChatResponse
from services.gemini_service import call_gemini, parse_response, create_pdf_from_markdown
from database.mongo import get_chat_collection
from services.auth_service import get_current_user
from datetime import datetime

router = APIRouter(prefix="/chat", tags=["chat"])

# safe load of master_prompt.txt from backend root
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MASTER_PROMPT_PATH = os.path.join(ROOT, "master_prompt.txt")
MASTER_PROMPT = ""
if os.path.exists(MASTER_PROMPT_PATH):
    MASTER_PROMPT = open(MASTER_PROMPT_PATH, "r", encoding="utf-8").read()

@router.post("/chat", response_model=ChatResponse)
def generate_notes(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    userId = current_user.get("userId")  # guaranteed to exist by dependency

    final_prompt = MASTER_PROMPT.replace("{USER_INPUT}", request.user_query)
    raw_output = call_gemini(final_prompt)
    metadata, markdown_data, pdf_filename = parse_response(raw_output)
    pdf_path = create_pdf_from_markdown(markdown_data, pdf_filename)

    chat_collection = get_chat_collection()
    chat_collection.insert_one({
        "userId": userId,
        "query": request.user_query,
        "response": markdown_data,
        "pdf": pdf_filename,
        "created_at": datetime.utcnow()
    })

    return ChatResponse(
        answer=markdown_data,
        pdf_url=f"/storage/{pdf_filename}"
    )