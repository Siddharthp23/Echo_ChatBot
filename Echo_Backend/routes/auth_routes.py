from fastapi import APIRouter, HTTPException
from models.user_model import UserRegister, UserLogin
from services.auth_service import hash_password, verify_password, create_access_token
from database.mongo import users_collection
from datetime import datetime

router = APIRouter(prefix="/api")


# Generate userId like USR001, USR002...
async def generate_userid():
    count =  users_collection.count_documents({})
    new_number = count + 1
    return f"USR{new_number:03d}"


# -------------------------
# REGISTER
# -------------------------
@router.post("/register")
async def register(user: UserRegister):

    # check email exists
    existing =  users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # hash password (argon2 recommended)
    hashed = hash_password(user.password)

    # generate custom userId
    userId = await generate_userid()

    new_user = {
        "userId": userId,
        "name": user.name,
        "contact_number": user.contact,
        "email": user.email,
        "hashed_password": hashed,
        "created_at": datetime.utcnow()
    }

    result =  users_collection.insert_one(new_user)

    return {
        "message": "User registered successfully",
        "userId": userId,
        "_id": str(result.inserted_id)
    }


# -------------------------
# LOGIN
# -------------------------
@router.post("/login")
async def login(user: UserLogin):

    existing =  users_collection.find_one({"email": user.email})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, existing["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    # include custom userId in JWT
    token = create_access_token({
        "userId": existing["userId"],
        "email": existing["email"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "userId": existing["userId"]
    }
