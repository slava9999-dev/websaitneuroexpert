#!/usr/bin/env python3
"""Development server startup script for NeuroExpert backend."""

import os
import sys
import uvicorn
from pathlib import Path

# Add backend to Python path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

if __name__ == "__main__":
    # Load environment variables
    from dotenv import load_dotenv
    
    # Try to load .env from multiple locations
    env_paths = [
        Path(__file__).parent.parent / ".env",
        Path(__file__).parent.parent / "env.example",
        Path(__file__).parent.parent / "frontend" / "api" / ".env",
    ]
    
    for env_path in env_paths:
        if env_path.exists():
            print(f"Loading environment from: {env_path}")
            load_dotenv(env_path)
            break
    else:
        print("Warning: No .env file found. Using environment variables only.")
    
    # Start development server
    print("Starting NeuroExpert backend development server...")
    print("API will be available at: http://localhost:8000")
    print("Health check: http://localhost:8000/api/health")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
