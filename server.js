/**
 * AI Chat Backend - MiniMax API
 * Запустить: node server.js
 * 
 * Переменные окружения:
 * - PORT: порт сервера (по умолчанию 3000)
 * - DATA_FILE: путь к файлу с базой знаний (по умолчанию knowledge.json)
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Загрузка базы знаний
let knowledgeBase = '';
const dataFile = process.env.DATA_FILE || path.join(__dirname, 'knowledge.json');

function loadKnowledge() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      // Форматируем для промпта
      if (Array.isArray(data)) {
        knowledgeBase = data.map(item => 
          `Q: ${item.question || item.q}\nA: ${item.answer || item.a}`
        ).join('\n\n');
      } else if (typeof data === 'string') {
        knowledgeBase = data;
      } else {
        knowledgeBase = JSON.stringify(data, null, 2);
      }
      console.log(`База знаний загружена: ${knowledgeBase.length} символов`);
    }
  } catch (err) {
    console.error('Ошибка загрузки базы знаний:', err.message);
  }
}

loadKnowledge();

// System prompt - ограничивает ответы базой знаний
const SYSTEM_PROMPT = `Ты консультант по услугам. 

ПРАВИЛА:
1. Отвечай ТОЛЬКО на основе предоставленной информации ниже
2. Если информации недостаточно - скажи "Я не располагаю этой информацией"
3. Не выдумывай цены, услуги или факты которых нет в базе
4. Отвечай кратко и по делу
5. Если спрашивают про цену - используй данные из базы
6. Если спрашивают чего нет - скажи что не знаешь

База знаний:
${knowledgeBase || 'Нет данных'}

Отвечай на русском языке.`;

// MiniMax API
async function callMiniMax(apiKey, groupId, message) {
  const response = await fetch(
    `https://api.minimax.chat/v1/text/chatcompletion_v2?GroupId=${groupId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.5',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 0.95
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiniMax API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (typeof content === 'string') {
    return content;
  } else if (Array.isArray(content)) {
    return content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('');
  }
  
  return 'Не удалось получить ответ';
}

// API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, apiKey, groupId } = req.body;
    
    if (!message || !apiKey || !groupId) {
      return res.status(400).json({ 
        error: 'Требуются message, apiKey и groupId' 
      });
    }

    const response = await callMiniMax(apiKey, groupId, message);
    res.json({ response });
    
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', knowledge_loaded: !!knowledgeBase });
});

// Обновление базы знаний без перезапуска
app.post('/api/knowledge/update', (req, res) => {
  const { data } = req.body;
  if (data) {
    if (typeof data === 'string') {
      knowledgeBase = data;
    } else {
      knowledgeBase = JSON.stringify(data, null, 2);
    }
    res.json({ status: 'ok', size: knowledgeBase.length });
  } else {
    res.status(400).json({ error: 'Нет данных' });
  }
});

app.listen(PORT, () => {
  console.log(`AI Chat server running on port ${PORT}`);
  console.log(`База знаний: ${knowledgeBase ? 'загружена' : 'отсутствует'}`);
});
