# 📦 WhatsApp Smart Inventory Bot

A society-based project designed to help small and mid-sized wholesalers manage inventory via a WhatsApp chatbot using voice/text input and AI processing.

## 🚀 Features

- 📱 WhatsApp Bot for inventory tracking
- 🎤 Voice-to-text using Whisper
- 🧠 AI input understanding via LLaMA 4
- 📊 Admin dashboard (React) – *planned*
- 🧾 Invoice parsing (PDF/Excel) – *planned*
- 🔔 Real-time alerts: low stock, billing insights
- 🗣️ Supports regional languages and voice input

---

## 🧰 Tech Stack

| Component         | Tech Used         |
|------------------|-------------------|
| Messaging Bot    | WhatsApp via **Baileys API** |
| Backend          | **Node.js**       |
| AI/NLP           | **Whisper**, **LLaMA 4** |
| Database         | **Supabase**      |
| File Parsing     | Excel/PDF parsing (planned) |

---

## 🛠️ Setup Instructions

### ✅ Prerequisites

- Node.js and npm installed
- Supabase account and project created
- WhatsApp number for bot
- (Optional) Whisper and LLaMA installed for real-time AI processing

---

### 📂 Installation Steps

1. **Clone or Extract the Project**
   ```bash
   git clone <repo_url>
   cd major-demo
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create `.env` file in `/backend`:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_api_key
   ```

4. **WhatsApp Authentication**

   - Make sure `backend/auth/` has session credentials.
   - If missing, Baileys will prompt QR code login on first run.

5. **Start the Server**
   ```bash
   node backend/server.js
   ```

---

## ✅ How to Use

- Send WhatsApp messages to the bot like:
  - `"Add 10 units of Sugar"`
  - `"Check inventory"`
  - `"Generate report"`

- The bot will reply with appropriate inventory actions and summaries.

---

## 📁 Project Structure

```
major-demo/
│
├── backend/               # Node.js backend with Baileys, Whisper, LLaMA, Supabase
│   ├── auth/              # Baileys WhatsApp session files
│   ├── whisper.js         # STT using Whisper
│   ├── llama.js           # Input parsing via LLaMA
│   ├── server.js          # Entry point
│   └── ...
│
├── package.json
├── .env (you create this)
└── readme.txt
```

---

## 🤖 Future Enhancements

- Admin dashboard in React
- PDF/Excel parsing for invoices
- Multilingual AI enhancements
- Analytics dashboard

---
