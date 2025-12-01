"""Vercel serverless function entry point."""
import sys
import os

# Add parent directory to path to import backend
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Import the FastAPI app
from backend.main import app

# Vercel expects 'app' to be exported
# No need for handler wrapper with modern Vercel
