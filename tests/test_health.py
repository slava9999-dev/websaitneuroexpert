"""Tests for health check endpoints."""
import pytest
from httpx import AsyncClient
from backend.main import app


@pytest.mark.asyncio
async def test_root_endpoint():
    """Test root endpoint returns API information."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/")
        
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "NeuroExpert API"
    assert data["version"] == "1.0.0"
    assert data["status"] == "running"
    assert "endpoints" in data


@pytest.mark.asyncio
async def test_health_check_endpoint():
    """Test health check endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/health")
        
    assert response.status_code in [200, 503]  # May fail if DB not connected
    data = response.json()
    assert "status" in data
    assert "timestamp" in data
    assert "services" in data or "message" in data


@pytest.mark.asyncio
async def test_chat_health_endpoint():
    """Test chat service health check."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/chat/health")
        
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "timestamp" in data


@pytest.mark.asyncio
async def test_contact_health_endpoint():
    """Test contact service health check."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/contact/health")
        
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "timestamp" in data
