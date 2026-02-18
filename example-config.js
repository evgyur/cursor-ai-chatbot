// example-config.js
// Скопируйте и настройте под себя

window.aiChatConfig = {
  // === Настройки консультанта ===
  
  // Имя консультанта (показывается в чате)
  consultantName: "Консультант",
  
  // Заголовок чата
  chatTitle: "Консультация по услугам",
  
  // Приветственное сообщение
  welcomeMessage: "Здравствуйте! Я консультант по услугам. Могу рассказать о наших услугах, ценах и помочь с выбором. О чем хотите спросить?",
  
  // === Цветовая схема ===
  
  // Основной цвет (CSS переменная)
  primaryColor: "#6366f1",  // Индиго
  // Другие варианты:
  // primaryColor: "#059669",  // Изумрудный
  // primaryColor: "#dc2626",  // Красный
  // primaryColor: "#7c3aed",  // Фиолетовый
  
  // === API ===
  
  // URL backend (если запускаете на отдельном сервере)
  // Для локальной разработки: 'http://localhost:3000/api/chat'
  apiUrl: '/api/chat'
};

// === Как использовать ===

/*
1. Вставьте chat-widget.html перед </body> на каждой странице

2. Настройте consultantName, chatTitle, welcomeMessage

3. Запустите сервер:
   cd your-project
   npm install express cors
   node server.js

4. Загрузите данные о ваших услугах:
   node rag.js https://yoursite.com/services
   или
   node rag.js --file your-data.json

5. Готово! Чат появится в правом нижнем углу.
*/
