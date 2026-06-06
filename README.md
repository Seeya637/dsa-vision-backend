# DSA Vision — Backend API 🥷

> Node.js + Express backend for DSA Vision visualizer

🔗 **Frontend:** [github.com/Seeya637/dsa-vision-frontend](https://github.com/Seeya637/dsa-vision-frontend)
🌐 **Live Demo:** [dsa-vision-frontend.vercel.app](https://dsa-vision-frontend.vercel.app)

## 🛠️ Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- Socket.io (WebSocket streaming)
- JWT + bcrypt (Authentication)
- Groq API (DSA Sensei AI)
- nanoid (Share URLs)

## 📡 API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/share | Save visualization state |
| GET | /api/share/:id | Load shared state |
| POST | /api/ai/chat | DSA Sensei AI chat |
| WS | socket.io | Algorithm step streaming |

## 🚀 Run Locally

```bash
git clone https://github.com/Seeya637/dsa-vision-backend
cd dsa-vision-backend
npm install
npm run dev
```

## 🔑 Environment Variables

Create `.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
```
