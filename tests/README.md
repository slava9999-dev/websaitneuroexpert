# 🧪 Backend Tests

Автоматические тесты для NeuroExpert backend API.

## 📦 Установка

```bash
cd backend
pip install pytest pytest-asyncio pytest-cov
```

## 🚀 Запуск тестов

### Все тесты

```bash
pytest tests/
```

### С покрытием кода

```bash
pytest tests/ --cov=backend --cov-report=html
```

### Конкретный файл

```bash
pytest tests/test_health.py
```

### С подробным выводом

```bash
pytest tests/ -v
```

### Только быстрые тесты (без AI/DB)

```bash
pytest tests/test_health.py tests/test_contact.py -v
```

## 📊 Структура тестов

```
tests/
├── conftest.py          # Fixtures и конфигурация
├── test_health.py       # Health check endpoints
├── test_chat.py         # AI chat endpoint
└── test_contact.py      # Contact form endpoint
```

## ✅ Покрытие тестами

### Health Endpoints (test_health.py)

- ✅ Root endpoint (/)
- ✅ Health check (/api/health)
- ✅ Chat health (/api/chat/health)
- ✅ Contact health (/api/contact/health)

### Chat Endpoint (test_chat.py)

- ✅ Missing session_id validation
- ✅ Missing message validation
- ✅ Valid request handling
- ✅ Empty message handling

### Contact Endpoint (test_contact.py)

- ✅ Valid request handling
- ✅ Missing name validation
- ✅ Missing contact validation
- ✅ Missing service validation
- ✅ Short name validation
- ✅ Optional message field

## 🎯 Целевые метрики

- **Coverage:** 60%+ (текущий baseline)
- **Tests:** 15+ test cases
- **Pass Rate:** 100% (при доступных сервисах)

## 📝 Примечания

- Тесты используют `AsyncClient` для async endpoints
- Некоторые тесты могут падать без MongoDB/AI API
- Health checks должны проходить всегда
- Validation тесты не требуют внешних сервисов

## 🔧 Troubleshooting

### Ошибка импорта backend

```bash
# Добавьте корневую директорию в PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
pytest tests/
```

### Тесты падают из-за DB

```bash
# Запустите только validation тесты
pytest tests/ -k "validation or missing"
```

## 📈 Следующие шаги

- [ ] Добавить моки для AI API
- [ ] Добавить тесты для database.py
- [ ] Добавить integration тесты
- [ ] Настроить CI/CD для автотестов
