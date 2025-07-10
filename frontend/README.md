# 🔐 Fullstack Cookie-Based Auth App

A fullstack authentication template built with **React**, **Express**, and **Tailwind CSS**, using **HTTP-only cookies** for secure session handling.

This project demonstrates a clean, scalable login flow with a modern UI and proper backend session management — ideal for learning or reusing in real projects.

---

## 🧰 Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Component-based architecture

**Backend**
- Node.js / Express
- Cookie-based authentication (HTTP-only)
- CORS and secure headers

**Dev Tools**
- Vite
- GitHub CLI
- Postman / Thunder Client for API testing

---

## ✨ Features

- 🔐 Secure login with HTTP-only cookies
- 🎨 Responsive and beautiful UI with Tailwind CSS
- 💡 Scalable frontend structure (components, services, utils)
- ⚙️ Full-stack integration with clean separation of concerns
- 🛡️ Basic CSRF protection pattern-ready
- 📦 Ready for deployment on Vercel + Railway (or your own stack)

---

## 📦 Folder Structure

```bash
fullstack-cookie-auth/
├── backend/           # Express server (auth, session)
├── client/            # React frontend (Vite + Tailwind)
│   ├── components/    # Reusable UI components
│   ├── services/      # API interaction
│   ├── utils/         # Constants, helpers
│   └── App.jsx
└── README.md

