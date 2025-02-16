# AI Movie Character Chatbot

## 🎯 Project Overview
The **AI Movie Character Chatbot** is a conversational AI system that enhances realism by retrieving actual movie dialogues from **Avengers: Endgame** before generating responses. It utilizes **Retrieval-Augmented Generation (RAG)** with **semantic search** to improve chat accuracy.

## 🚀 Key Features
- **Movie Script Database**: Stores **character dialogues** in **MongoDB**.
- **Semantic Search (RAG)**: Converts dialogues into **vector embeddings** using **Gemini AI** and retrieves relevant lines.
- **AI-Powered Responses**: If an exact match is not found, AI generates a response using contextual dialogues.
- **Caching with Redis**: Speeds up dialogue retrieval.
- **Rate Limiting**: Limits requests to **5 per second per user** using **express-rate-limit**.
- **Load Testing with K6**: Ensures system efficiency and performance.
- **Backend Deployment**: Hosted on **Render**.
- **Frontend Deployment**: Hosted on **Vercel**.

## 🛠️ Tech Stack
### **Backend**
- **Node.js & Express.js**
- **MongoDB** (Dialogue storage & vector embeddings)
- **Gemini AI** (Vector embedding conversion & AI responses)
- **Redis** (Caching)
- **Render** (Deployment)
- **K6** (Load testing)

### **Frontend**
- **React.js & Vite**
- **Tailwind CSS**
- **Vercel** (Deployment)

## 📂 Project Structure
### **Backend**
```
backend/
│── controllers/
│   ├── main.js
│── middleware/
│   ├── auth.js
│   ├── checkAuth.js
│── models/
│   ├── dialogue.model.js
│   ├── user.model.js
│── storingdb.js
│── index.js
│── load_test.js
│── package.json
│── .env
│── vercel.json
```

### **Frontend**
```
frontend/
│── pages/
│   ├── AuthProvider.jsx
│   ├── Chat.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Register.jsx
│── public/
│   ├── logo.png
│── src/
│   ├── assets/
│   ├── App.jsx
│   ├── index.jsx
│   ├── main.jsx
│── api.js
│── config.js
│── index.html
│── package.json
│── tailwind.config.js
│── vercel.json
│── vite.config.js
```

## 🚀 Deployment
### **Backend on Render**
- Push to GitHub and connect with **Render**.
- Set up **Environment Variables** in Render.
- Deploy the backend.

### **Frontend on Vercel**
- Push to GitHub and connect with **Vercel**.
- Deploy the frontend.

## 📌 API Endpoints
### **1. Authentication**
| Method | Endpoint     | Description  |
|--------|------------|--------------|
| POST   | `/register` | User Signup  |
| POST   | `/login`    | User Login   |

### **2. Chat Functionality**
| Method | Endpoint  | Description  |
|--------|----------|--------------|
| POST   | `/Chat`  | Retrieves dialogues using Sementic Search & make it More Accurate with AI responses |

## 🎯 Goals & Future Enhancements
✅ **Improve AI accuracy** by refining semantic search.
✅ **Enhance caching** for better performance.
✅ **Expand dialogue database** for other movies.

---

**Developed by Abhishek Pandey**

📌 **Portfolio**: [https://myportfolio-xi-inky-22.vercel.app/](https://myportfolio-xi-inky-22.vercel.app/)
📌 **Deployed Link**: [https://ai-movie-character-chatbot.vercel.app/](https://ai-movie-character-chatbot.vercel.app/)

