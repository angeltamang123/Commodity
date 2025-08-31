import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chatbot , vectorizer
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Commodity AI Backend",
    description="API for chatbot and vectorization services.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot.router, prefix="/chat", tags=["Chatbot"])
app.include_router(vectorizer.router, prefix="/products", tags=["Vectorizer"])

@app.get("/")
async def root():
    return {"message": "Commodity AI API is running."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT")), reload=True)