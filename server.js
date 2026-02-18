/**
 * AI Chat Backend - MiniMax API
 * Сгенерировано скиллом cursor-ai-chatbot
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// === НАСТРОЙКИ (вставит скилл) ===
const API_KEY = "{{API_KEY}}";        // MiniMax API Key (только ключ, Group ID не нужен!)
const KNOWLEDGE = `{{KNOWLEDGE}}`;   // Данные об услугах

const SYSTEM_PROMPT = `Ты консультант по услугам. 

ПРАВИЛА:
1. Отвечай ТОЛЬКО на основе информации ниже
2. Не выдумывай цены или услуги
3. Если информации нет — скажи "Не знаю"
4. Отвечай кратко

Данные:
${KNOWLEDGE}`;

async function callMiniMax(message) {
  const response = await fetch(
    `https://api.minimax.io/anthropic/v1/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.5',
        messages: [
          { role: 'user', content: message }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        system: SYSTEM_PROMPT
      })
    }
  );

  const data = await response.json();
  const content = data?.content?.[0]?.text;
  
  return content || 'Ошибка';
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Нет сообщения' });

    const response = await callMiniMax(message);
    res.json({ response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🤖 Чатбот запущен на порту ${PORT}`);
});
