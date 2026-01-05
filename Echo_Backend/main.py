from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat_routes import router as chat_router
from routes.auth_routes import router as auth_router
from routes.user_routes import router as user_router

app = FastAPI(title="Echo_ChatBot Backend")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
app.include_router(user_router, prefix="/api")

@app.get("/")
def home():
    return {"message": "Echo Backend Running"}
