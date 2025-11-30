# NeuroExpert Backend

Бэкенд для платформы NeuroExpert, построенный на FastAPI и MongoDB.

## Технологии

- **FastAPI**: Современный, быстрый веб-фреймворк для создания API.
- **MongoDB (Motor)**: Асинхронный драйвер для MongoDB.
- **Pydantic**: Валидация данных.
- **Uvicorn**: ASGI-сервер.
- **AI Integration**: Поддержка Anthropic (Claude), OpenAI (GPT), Google (Gemini).

## Установка и запуск

1.  **Создание виртуального окружения**:

    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/macOS
    venv\Scripts\activate     # Windows
    ```

2.  **Установка зависимостей**:

    ```bash
    pip install -r requirements.txt
    ```

3.  **Настройка окружения**:
    Создайте файл `.env` в корне папки `backend` и добавьте необходимые переменные (см. `config/settings.py`).

4.  **Запуск сервера**:
    ```bash
    python -m uvicorn main:app --reload
    ```
    API будет доступно по адресу `http://localhost:8000`.
    Документация API: `http://localhost:8000/docs`.

## Структура проекта

- `main.py`: Точка входа приложения.
- `routes/`: Маршруты API (чат, контакты).
- `utils/`: Утилиты (база данных, AI-клиенты, Telegram).
- `config/`: Настройки приложения.
- `memory/`: Управление контекстом диалога (SmartContext).

## API Эндпоинты

- `POST /api/chat`: Отправка сообщения AI-ассистенту.
- `POST /api/contact`: Отправка формы обратной связи.
- `GET /api/health`: Проверка состояния сервисов.
