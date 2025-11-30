# Backend Recovery Guide

## What Was Restored

✅ **Complete FastAPI backend structure**
- `backend/` module with config, memory, utils, routes
- `frontend/api/index.py` for Vercel serverless deployment
- Environment configuration (`env.example`)
- Development scripts (`start-backend.py`, `test-api.py`)

✅ **Core API endpoints**
- `/api/chat` with AI integration (Anthropic/OpenAI/Gemini)
- `/api/contact` with Telegram notifications
- `/api/health` for monitoring
- Root endpoint with API info

✅ **Smart context system**
- MongoDB persistence for chat history
- Token counting with tiktoken
- Session-based conversation memory
- Configurable limits (3000 tokens, 20 messages)

✅ **Integration support**
- Multiple AI providers with fallback
- Telegram notifications for contact forms
- Structured logging and error handling
- CORS configuration for development/production

## Next Steps

### 1. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Fill with actual values:
# - MONGODB_URL (required)
# - DB_NAME (required) 
# - AI API keys (at least one)
# - Telegram tokens (optional)
# - CLIENT_ORIGIN_URL (required for CORS)
```

### 2. Install Dependencies
```bash
# For local development
cd backend
pip install -r ../frontend/api/requirements-backend.txt

# For Vercel deployment
# Dependencies are in frontend/api/requirements.txt
```

### 3. Test Locally
```bash
# Start development server
python scripts/start-backend.py

# Test endpoints
python scripts/test-api.py
```

### 4. Deploy to Vercel
```bash
# Deploy with environment variables
vercel --prod

# Set environment variables in Vercel dashboard:
# - MONGODB_URL
# - DB_NAME
# - ANTHROPIC_API_KEY / OPENAI_API_KEY / GOOGLE_API_KEY
# - TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID
# - CLIENT_ORIGIN_URL
```

## File Structure

```
backend/
├── __init__.py
├── config/
│   ├── __init__.py
│   └── settings.py          # Environment configuration
├── memory/
│   ├── __init__.py
│   └── smart_context.py      # Chat history & token management
├── utils/
│   ├── __init__.py
│   ├── ai_clients.py         # AI provider clients
│   ├── database.py           # MongoDB connection
│   └── telegram.py           # Telegram notifications
├── routes/
│   ├── __init__.py
│   ├── chat.py              # Chat API endpoints
│   └── contact.py           # Contact form endpoints
└── main.py                  # FastAPI application (local dev)

frontend/api/
└── index.py                 # Vercel serverless entry point

scripts/
├── start-backend.py        # Development server
└── test-api.py            # API testing

env.example                 # Environment template
```

## API Endpoints

### Chat API
- `POST /api/chat` - AI chat with context memory
- `GET /api/chat/health` - Chat service health check

### Contact API  
- `POST /api/contact` - Contact form submission
- `GET /api/contact/health` - Contact service health check

### System
- `GET /` - API root with info
- `GET /api/health` - Comprehensive health check

## Configuration

### Required Environment Variables
- `MONGODB_URL` - MongoDB connection string
- `DB_NAME` - Database name
- `CLIENT_ORIGIN_URL` - Frontend URL for CORS

### AI Integration (at least one)
- `ANTHROPIC_API_KEY` - Claude API key
- `OPENAI_API_KEY` - OpenAI API key  
- `GOOGLE_API_KEY` - Gemini API key
- `EMERGENT_LLM_KEY` - Unified API key

### Optional
- `TELEGRAM_BOT_TOKEN` - Bot token for notifications
- `TELEGRAM_CHAT_ID` - Chat ID for notifications
- `ENVIRONMENT` - development/production
- `LOG_LEVEL` - Logging level
- `MAX_CONTEXT_TOKENS` - Chat context limit (default: 3000)
- `MAX_HISTORY_MESSAGES` - Message history limit (default: 20)

## Troubleshooting

### Database Connection Issues
- Verify MongoDB URL format and credentials
- Check MongoDB Atlas network access (allow 0.0.0.0/0 for Vercel)
- Ensure database name matches MongoDB Atlas database

### AI Integration Issues
- Verify API keys are valid and active
- Check rate limits and quotas
- Monitor logs for API-specific errors

### CORS Issues
- Ensure CLIENT_ORIGIN_URL matches frontend domain exactly
- Include protocol (https://) in production URLs
- For local dev, use http://localhost:3000

### Telegram Issues
- Verify bot token and chat ID
- Test bot connection with `/api/contact/health`
- Check bot permissions to send messages

## Monitoring

### Health Checks
- `/api/health` - Overall system health
- `/api/chat/health` - Chat service status
- `/api/contact/health` - Contact service status

### Logging
- Structured JSON logging with request timing
- Error tracking with stack traces
- Database operation logging
- AI API call logging

### Vercel Monitoring
```bash
vercel logs [deployment-url] --follow
```

## Migration from Previous Version

If you had a previous working version:

1. **Backup existing data** from MongoDB if needed
2. **Update environment variables** to match new structure
3. **Test endpoints** with provided test script
4. **Update frontend** if API contract changed
5. **Deploy gradually** and monitor logs

The new backend maintains API compatibility with the frontend while providing improved structure and reliability.
