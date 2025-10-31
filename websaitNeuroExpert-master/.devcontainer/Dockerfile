# Используем базовый образ Debian с Node.js и Python поддержкой
FROM mcr.microsoft.com/vscode/devcontainers/base:0-bullseye

# Устанавливаем Git, Curl
RUN apt-get update \
    && apt-get install -y --no-install-recommends git curl \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем Node.js 20.x и npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем Python 3 и pip
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-pip python3-venv \
    && pip3 install --upgrade pip \
    && rm -rf /var/lib/apt/lists/*

# Меняем рабочую директорию
WORKDIR /workspace

# Устанавливаем Node.js и Python пути
ENV PATH="/usr/local/bin:${PATH}"
