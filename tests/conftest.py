"""Pytest configuration and fixtures."""
import pytest
import asyncio


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def test_session_id():
    """Provide a test session ID."""
    return "test_session_pytest_123"


@pytest.fixture
def test_contact_data():
    """Provide test contact form data."""
    return {
        "name": "Pytest Test User",
        "contact": "pytest@test.com",
        "service": "Тестирование",
        "message": "Automated test message"
    }


@pytest.fixture
def test_chat_message():
    """Provide test chat message."""
    return {
        "session_id": "test_session_pytest",
        "message": "Расскажите про ваши услуги",
        "model": "gpt-4o"
    }
