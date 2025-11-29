# routes/chat_routes.py
import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Header
from models.chat_model import ChatRequest, ChatResponse, ChatHistoryOut
from services.gemini_service import call_gemini, parse_response, create_pdf_from_markdown
from database.mongo import get_chat_collection
from services.auth_service import get_current_user, decode_token
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


@router.get("/chat_details", response_model=List[ChatHistoryOut])
async def chat_details(Authorization: str = Header(None)):
    """
    Return chat history (answer + pdf_url + created_at) for the logged-in user.
    Expects header: Authorization: Bearer <token>
    """
    if Authorization is None:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    if not Authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")

    token = Authorization.split(" ")[1]

    try:
        payload = decode_token(token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if "userId" not in payload:
        raise HTTPException(status_code=401, detail="Token missing userId")

    user_id = payload["userId"]

    chat_collection = get_chat_collection()

    # Query for user's chat history (most recent first). Adjust query field names if you use different field names.
    cursor = chat_collection.find({"userId": user_id}).sort("created_at", -1).limit(200)
    docs =  cursor.to_list(length=200)

    results = []
    for d in docs:
        results.append(
            ChatHistoryOut(
                query = d.get("query"),
                answer=d.get("response") or d.get("answer") or "",
                pdf_url=d.get("pdf") or d.get("pdf_url"),
                created_at=d.get("created_at") or d.get("timestamp")
            )
        )

    return results