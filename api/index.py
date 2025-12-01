"""Vercel serverless function - minimal test."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all CORS for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "Minimal FastAPI is working on Vercel"}

@app.post("/api/contact")
async def contact():
    return {"success": True, "message": "Contact endpoint is alive"}

@app.post("/api/chat")
async def chat():
    return {"response": "Chat endpoint is alive", "session_id": "test"}

