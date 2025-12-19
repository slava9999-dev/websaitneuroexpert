"""AI service clients (Anthropic, OpenAI, Gemini)."""

import asyncio
import httpx
import logging
from typing import Dict, Optional, Any
from config.settings import settings

logger = logging.getLogger(__name__)


class AIClientError(Exception):
    """Base exception for AI client errors."""


class AnthropicClient:
    """Client for Anthropic Claude API."""

    def __init__(self):
        self.api_key = settings.anthropic_api_key
        self.base_url = "https://api.anthropic.com/v1/messages"

    async def generate(self, messages: list, model: str = "claude-sonnet") -> str:
        """Generate response from Claude."""
        if not self.api_key:
            raise AIClientError("Anthropic API key not configured")
        
        headers = {
            "x-api-key": self.api_key,
            "content-type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        
        # Extract system message
        system_prompt = None
        filtered_messages = []
        for msg in messages:
            if msg["role"] == "system":
                system_prompt = msg["content"]
            else:
                filtered_messages.append(msg)
        
        payload = {
            "model": model,
            "max_tokens": 1000,
            "messages": filtered_messages
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(self.base_url, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                return data["content"][0]["text"]
        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            raise AIClientError(f"Anthropic API error: {e}")


class OpenAIClient:
    """Client for OpenAI GPT API."""

    def __init__(self):
        self.api_key = settings.openai_api_key
        self.base_url = "https://api.openai.com/v1/chat/completions"

    async def generate(self, messages: list, model: str = "gpt-4o") -> str:
        """Generate response from GPT."""
        if not self.api_key:
            raise AIClientError("OpenAI API key not configured")
        
        headers = {
            "authorization": f"Bearer {self.api_key}",
            "content-type": "application/json"
        }
        
        payload = {
            "model": model,
            "max_tokens": 1000,
            "messages": messages
        }
        
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(self.base_url, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise AIClientError(f"OpenAI API error: {e}")


class GeminiClient:
    """Client for Google Gemini API."""

    def __init__(self):
        self.api_key = settings.google_api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

    async def generate(self, messages: list, model: str = "gemini-1.5-flash") -> str:
        """Generate response from Gemini."""
        if not self.api_key:
            raise AIClientError("Google API key not configured")
        
        # Convert messages to Gemini format
        contents = []
        system_instruction = None
        
        for msg in messages:
            if msg["role"] == "system":
                system_instruction = {"parts": [{"text": msg["content"]}]}
            else:
                role = "user" if msg["role"] == "user" else "model"
                contents.append({"role": role, "parts": [{"text": msg["content"]}]})
        
        url = f"{self.base_url}/{model}:generateContent?key={self.api_key}"
        
        payload = {"contents": contents}
        if system_instruction:
            payload["system_instruction"] = system_instruction
        
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise AIClientError(f"Gemini API error: {e}")


class EmergentClient:
    """Client for EmergentIntegrations unified API."""

    def __init__(self):
        self.api_key = settings.emergent_llm_key
        self.base_url = "https://api.emergentagent.com/v1/chat/completions"

    async def generate(self, messages: list, model: str = "claude-sonnet") -> str:
        """Generate response using EmergentIntegrations."""
        if not self.api_key:
            raise AIClientError("Emergent LLM key not configured")
        
        headers = {
            "authorization": f"Bearer {self.api_key}",
            "content-type": "application/json"
        }
        
        payload = {
            "model": model,
            "max_tokens": 1000,
            "messages": messages
        }
        
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(self.base_url, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"Emergent API error: {e}")
            raise AIClientError(f"Emergent API error: {e}")


def get_ai_client(model: str) -> Any:
    """Factory function to get appropriate AI client.
    
    Supported models:
    - claude-* -> AnthropicClient
    - gpt-* (including gpt-4o-mini) -> OpenAIClient  
    - gemini-* -> GeminiClient
    - others -> EmergentClient (fallback)
    """
    if model.startswith("claude"):
        return AnthropicClient()
    elif model.startswith("gpt"):
        return OpenAIClient()
    elif model.startswith("gemini"):
        return GeminiClient()
    else:
        # Default to Emergent for unified access
        return EmergentClient()
