# Cursor AI Chatbot Skill

Добавляет AI-чатбот на любой сайт с MiniMax API.

## Что делает

Встраивает в сайт мини-чат в правом нижнем углу:
- Приветствует как консультант
- Отвечает на основе загруженных данных (RAG)
- Пользователь вводит свой MiniMax API ключ
- Не галлюцинирует — отвечает только по базе знаний

## Использование на воркшопе

1. Скачать скилл из GitHub
2. Открыть в Cursor
3. Вставить свой MiniMax API ключ
4. Дать данные для обучения (URL сайта или текст)
5. Скилл сгенерирует готовый код чатбота

## Установка

```bash
cd your-project
git clone https://github.com/evgyur/cursor-ai-chatbot.git
```

## Файлы

- `chat-widget.html` — виджет чатбота (вставить на сайт)
- `server.js` — backend для MiniMax API
- `rag.js` — загрузка данных с сайта
- `example-config.js` — пример конфигурации

## MiniMax API

Модель: `MiniMax-M2.5`  
Endpoint: `https://api.minimax.chat/v1/text/chatcompletion_v2`  
Нужен: API Key + Group ID
