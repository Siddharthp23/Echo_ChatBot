# routes/chat_routes.py
import os
from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.responses import FileResponse

from models.chat_model import ChatRequest, ChatResponse, ChatHistoryOut
from services.gemini_service import (
    call_gemini,
    parse_response,
    create_pdf_from_markdown,
)
from database.mongo import get_chat_collection
from services.auth_service import get_current_user, decode_token

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
def generate_notes(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["userId"]

    raw_output = call_gemini(request.user_query)
    metadata, markdown_data, pdf_filename = parse_response(raw_output)

    pdf_path = create_pdf_from_markdown(markdown_data, pdf_filename)

    chat_collection = get_chat_collection()
    chat_collection.insert_one(
        {
            "userId": user_id,
            "query": request.user_query,
            "response": markdown_data,
            "pdf_filename": pdf_filename,
            "created_at": datetime.utcnow(),
        }
    )

    return ChatResponse(
        answer=markdown_data,
        pdf_url=f"/api/chat/download/{pdf_filename}",
    )


@router.get("/download/{filename}")
def download_pdf(filename: str):
    temp_dir = "/tmp"
    pdf_path = os.path.join(temp_dir, filename)

    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found")

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=filename,
    )


@router.get("/chat_details", response_model=List[ChatHistoryOut])
async def chat_details(Authorization: str = Header(None)):
    if Authorization is None or not Authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = Authorization.split(" ")[1]

    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("userId")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing userId")

    chat_collection = get_chat_collection()
    cursor = (
        chat_collection.find({"userId": user_id})
        .sort("created_at", -1)
        .limit(200)
    )

    docs = cursor.to_list(length=200)

    results = []
    for d in docs:
        results.append(
            ChatHistoryOut(
                query=d.get("query"),
                answer=d.get("response", ""),
                pdf_url=f"/api/chat/download/{d.get('pdf_filename')}"
                if d.get("pdf_filename")
                else None,
                created_at=d.get("created_at"),
            )
        )

    return results
