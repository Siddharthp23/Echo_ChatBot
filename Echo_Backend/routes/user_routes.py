from fastapi import APIRouter, Header, HTTPException
from jose import JWTError
from services.auth_service import decode_token
from models.user_model import UserOut
from database.mongo import get_users_collection

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/details", response_model=UserOut)
async def get_user_details(Authorization: str = Header(None)):
    """
    Fetch logged-in user's details using JWT token
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

    userId = payload["userId"]

    users_collection = get_users_collection()
    user = users_collection.find_one({"userId": userId})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserOut(
        userId=user["userId"],
        name=user["name"],
        contact_number=user.get("contact_number"),
        email=user["email"]
    )
