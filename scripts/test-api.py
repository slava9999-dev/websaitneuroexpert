#!/usr/bin/env python3
"""Quick API test script for development."""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint."""
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Health check passed: {data['status']}")
            return True
        else:
            print(f"✗ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Health check error: {e}")
        return False

def test_contact():
    """Test contact form endpoint."""
    print("Testing contact form...")
    test_data = {
        "name": "Тестовый Клиент",
        "contact": "+7 999 123 4567",
        "service": "Цифровой аудит",
        "message": "Тестовое сообщение"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json=test_data,
            timeout=30
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Contact form working: {data.get('success')}")
            return True
        else:
            print(f"✗ Contact form failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"✗ Contact form error: {e}")
        return False

def test_chat():
    """Test chat endpoint."""
    print("Testing chat endpoint...")
    session_id = f"test-session-{int(time.time())}"
    test_data = {
        "session_id": session_id,
        "message": "Привет, расскажите о ваших услугах",
        "model": "claude-sonnet"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json=test_data,
            timeout=60
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Chat working: {len(data.get('response', ''))} chars")
            return True
        else:
            print(f"✗ Chat failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"✗ Chat error: {e}")
        return False

if __name__ == "__main__":
    print("NEUROEXPERT API TEST")
    print(f"Testing against: {BASE_URL}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("-" * 40)
    
    results = []
    results.append(("Health Check", test_health()))
    results.append(("Contact Form", test_contact()))
    results.append(("Chat API", test_chat()))
    
    print("\n" + "=" * 40)
    print("TEST SUMMARY")
    print("=" * 40)
    
    passed = 0
    for test_name, result in results:
        status = "PASSED" if result else "FAILED"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("✅ All API endpoints working correctly")
    else:
        print("❌ Some API endpoints have issues")
