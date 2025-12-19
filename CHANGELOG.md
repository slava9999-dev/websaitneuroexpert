# Changelog

All notable changes to NeuroExpert project will be documented in this file.

## [3.0.1] - 2025-12-19

### 🔒 Security

- **Added Rate Limiting** to API endpoints:
  - `/api/chat` - 10 requests/minute per IP
  - `/api/contact` - 5 requests/minute per IP
- Fixed CORS configuration (specific domains instead of wildcard)

### 🤖 AI Changes

- **Switched to GPT-4o-mini** for optimal cost/performance balance:
  - 30x cheaper than GPT-4o
  - Faster response times
  - 128K context window
  - Sufficient intelligence for consultation chat

### 🐛 Bug Fixes

- Fixed timestamp in `database.py` (was using `asyncio.get_event_loop().time()`, now uses `datetime.utcnow()`)
- Fixed Sentry API (updated to modern `browserTracingIntegration()` format)
- Fixed TelegramNotifier import in `contact.py`
- Synchronized version numbers across codebase (now 3.0.0 everywhere)

### 📦 Dependencies

- Generated `package-lock.json` for reproducible builds
- All npm dependencies audited (2 moderate vulnerabilities in dev-only esbuild/vite)

### 📝 Documentation

- Created consolidated `CHANGELOG.md`

---

## [3.0.0] - 2025-12-02

### ✅ Critical Improvements

- Logger utility (no console.log in production)
- Environment variables validation
- CORS security (specific domains)
- Rate limiting infrastructure
- Unified API entry point

### ✅ High Priority

- Sentry integration (Frontend + Backend)
- CSP improvements (removed unsafe-inline for scripts)
- Bundle optimization (code splitting, lazy loading)
- MongoDB indexes for performance
- Web Vitals monitoring

### ✅ Medium Priority

- Section Error Boundaries
- Backend tests (14 test cases)

---

## [2.0.0] - 2025-11-15

### Features

- AI Chat with context memory
- Contact form with Telegram notifications
- Video background (Cloudinary)
- Yandex.Metrika analytics

---

## [1.0.0] - 2025-10-01

### Initial Release

- Landing page with React 18 + Vite
- FastAPI backend
- MongoDB integration
