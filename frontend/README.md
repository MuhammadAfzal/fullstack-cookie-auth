# ⚛️ Fullstack Cookie Auth · Frontend

A modern React + TypeScript frontend with role-based access control (RBAC), authentication via HTTP-only cookies, and a clean dashboard UI — part of a fullstack project built with Express, Prisma, and PostgreSQL.

---

## 🚀 Features

- 🔐 **Authentication** using secure HTTP-only JWT cookies
- 🔑 **RBAC**: Supports roles like `USER`, `ADMIN`, `SUPER_ADMIN`
- ⚡️ **Fast UI** with Vite + Tailwind CSS + TypeScript
- 🎨 **Dark mode** support via Tailwind and context
- 📈 **Dashboard with charts** (Chart.js)
- 🧠 **Context API** for authentication state management
- 🧩 **ProtectedRoute** and **RoleGate** components
- 🛎️ **Toast notifications** using `sonner`
- ♻️ **Reusable layouts** (top bar, sidebar, logout)
- 💻 **API service layer** for typed communication with backend
- ✅ **Form validation** with Zod (mirrors backend validation)
- 📦 Ready for deployment on Vercel + Railway (or your own stack)

---

## 🧰 Tech Stack

**Frontend**

## 🧰 Tech Stack

- **React** (with hooks & functional components)
- **TypeScript**
- **Vite** – Fast dev server & optimized build
- **Tailwind CSS** – Utility-first styling
- **Chart.js** – Dashboard charting
- **React Router v6**
- **Zod** – Frontend schema validation
- **Sonner** – Toast notifications

**Backend**

- Node.js / Express
- Cookie-based authentication (HTTP-only)
- CORS and secure headers

**Dev Tools**

- Vite
- GitHub CLI
- Postman / Thunder Client for API testing

---

## 📦 Folder Structure

```
fullstack-cookie-auth/
├── backend-ts/                    # 🧠 Backend – Express + Prisma + TypeScript
│   ├── prisma/                    #  ┣ Prisma schema & migrations
│   │   ├── schema.prisma          #  ┃ Database schema with Role enum, models
│   │   └── migrations/            #  ┃ Auto-generated SQL migrations
│   ├── src/                       #  ┣ Main source code
│   │   ├── controllers/           #  ┃ Express route controllers (auth, admin)
│   │   ├── middleware/            #  ┃ Auth, JWT, error, and RBAC guards
│   │   ├── routes/                #  ┃ Route definitions (auth, user, admin)
│   │   ├── services/              #  ┃ Business logic for auth, users, etc.
│   │   ├── constants/             #  ┃ Role enums, app constants
│   │   ├── utils/                 #  ┃ Error classes, helpers
│   │   ├── db.ts                  #  ┃ Prisma client instance
│   │   ├── index.ts               #  ┃ Entry point (Express app + server)
│   │   └── types.d.ts             #  ┃ Custom type definitions (like req.user)
│   ├── .env                       #  ┃ DB URL, JWT secret
│   ├── package.json               #  ┃ Scripts & dependencies
│   └── tsconfig.json              #  ┃ TypeScript config

├── frontend/                      # 🎨 Frontend – React + Vite + Tailwind
│   ├── public/                    #  ┃ Static assets (favicon, index.html)
│   ├── src/                       #  ┣ Source code
│   │   ├── components/            #  ┃ Shared components (charts, RoleGate, etc.)
│   │   ├── constants/             #  ┃ Static config (role enum, API URL)
│   │   ├── context/               #  ┃ AuthContext & ThemeContext providers
│   │   ├── layout/                #  ┃ App layout with top bar and sidebar
│   │   ├── pages/                 #  ┃ Route views (Login, Register, Dashboard, Profile)
│   │   ├── routes/                #  ┃ AppRoutes, ProtectedRoute logic
│   │   ├── services/              #  ┃ API layer (login, register, fetchUsers)
│   │   ├── types/                 #  ┃ TS types (User, Role, etc.)
│   │   ├── utils/                 #  ┃ Toast, theme, validation helpers
│   │   ├── App.tsx                #  ┃ Main App component
│   │   └── main.tsx               #  ┃ Entry point (ReactDOM.createRoot)
│   ├── .env                       #  ┃ Frontend env (VITE_API_URL)
│   ├── index.html                 #  ┃ Base HTML template
│   ├── tailwind.config.js         #  ┃ Tailwind config
│   ├── postcss.config.js          #  ┃ PostCSS plugins
│   ├── tsconfig.json              #  ┃ TypeScript config
│   └── vite.config.ts             #  ┃ Vite config (proxy, plugins)

├── .gitignore                     # Common ignore rules for both frontend/backend
├── README.md                      # 📖 Root documentation
└── package.json                   # Optional monorepo root config (if using workspaces)


```

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-org/fullstack-cookie-auth.git
cd fullstack-cookie-auth/frontend

Install dependencies

npm install
# or
yarn install


```
