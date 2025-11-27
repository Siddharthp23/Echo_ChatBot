from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# Input model for registration
class UserRegister(BaseModel):
    name: str 
    contact: Optional[str] = None
    email: EmailStr
    password: str 

# Input model for login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Model stored in DB
class UserInDB(BaseModel):
    userId: str
    name: str
    contact_number: Optional[str]
    email: EmailStr
    hashed_password: str
    created_at: datetime

# Response model (public)
class UserOut(BaseModel):
    userId: str
    name: str
    contact_number: Optional[str]
    email: EmailStr
