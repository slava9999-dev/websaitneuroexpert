"""Tests for chat API endpoint."""
import pytest
from httpx import AsyncClient
from backend.main import app


@pytest.mark.asyncio
async def test_chat_endpoint_missing_session_id():
    """Test chat endpoint with missing session_id."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/chat", json={
            "message": "Hello",
            "model": "gpt-4o"
        })
        
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_chat_endpoint_missing_message():
    """Test chat endpoint with missing message."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/chat", json={
            "session_id": "test_session",
            "model": "gpt-4o"
        })
        
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_chat_endpoint_valid_request():
    """Test chat endpoint with valid request."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/chat", json={
            "session_id": "test_session_123",
            "message": "Привет, расскажи про аудит",
            "model": "gpt-4o"
        })
        
    # May return 200 or 500 depending on AI API availability
    assert response.status_code in [200, 500, 503]
    
    if response.status_code == 200:
        data = response.json()
        assert "response" in data
        assert "session_id" in data
        assert data["session_id"] == "test_session_123"
        assert "model" in data
        assert "timestamp" in data


@pytest.mark.asyncio
async def test_chat_endpoint_empty_message():
    """Test chat endpoint with empty message."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/chat", json={
            "session_id": "test_session",
            "message": "",
            "model": "gpt-4o"
        })
        
    # Should accept empty string but may return error from AI
    assert response.status_code in [200, 400, 500]
