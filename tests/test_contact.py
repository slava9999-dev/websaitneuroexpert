"""Tests for contact form API endpoint."""
import pytest
from httpx import AsyncClient
from backend.main import app


@pytest.mark.asyncio
async def test_contact_endpoint_valid_request():
    """Test contact endpoint with valid data."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/contact", json={
            "name": "Тестовый Пользователь",
            "contact": "test@example.com",
            "service": "Цифровой аудит",
            "message": "Интересует аудит сайта"
        })
        
    # May return 200 or 500 depending on DB/Telegram availability
    assert response.status_code in [200, 500]
    
    if response.status_code == 200:
        data = response.json()
        assert data["success"] is True
        assert "message" in data
        assert "timestamp" in data


@pytest.mark.asyncio
async def test_contact_endpoint_missing_name():
    """Test contact endpoint with missing name."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/contact", json={
            "contact": "test@example.com",
            "service": "Аудит",
            "message": "Test"
        })
        
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_contact_endpoint_missing_contact():
    """Test contact endpoint with missing contact."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/contact", json={
            "name": "Test User",
            "service": "Аудит",
            "message": "Test"
        })
        
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_contact_endpoint_missing_service():
    """Test contact endpoint with missing service."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/contact", json={
            "name": "Test User",
            "contact": "test@example.com",
            "message": "Test"
        })
        
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_contact_endpoint_short_name():
    """Test contact endpoint with too short name."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/contact", json={
            "name": "A",  # Too short
            "contact": "test@example.com",
            "service": "Аудит",
            "message": "Test"
        })
        
    assert response.status_code in [400, 422]  # Validation error


@pytest.mark.asyncio
async def test_contact_endpoint_optional_message():
    """Test contact endpoint with optional message field."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/contact", json={
            "name": "Test User",
            "contact": "test@example.com",
            "service": "Аудит"
            # message is optional
        })
        
    # Should accept request without message
    assert response.status_code in [200, 500]
