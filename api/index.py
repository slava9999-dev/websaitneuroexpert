"""Vercel serverless function entry point."""
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Import the main app from backend
# This ensures we're using the full FastAPI application with all features:
# - Rate limiting
# - Proper CORS configuration
# - AI chat with memory
# - Contact form with Telegram notifications
# - Health checks
# - Error handling
from main import app
