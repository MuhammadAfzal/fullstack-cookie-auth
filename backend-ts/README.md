# 🔐 Backend API — Fullstack Cookie Auth (TypeScript + Express + Prisma)

This is the backend for the Fullstack Cookie Auth app — built with **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**, with secure cookie-based authentication and role-based access control (RBAC).

---

## 📂 backend-ts/ — Folder Structure Breakdown

backend-ts/
├── prisma/ # Prisma schema & database migration files
│ ├── schema.prisma # User model, Role enum, and datasource
│ └── migrations/ # Auto-generated migration history folders
│
├── src/ # Source code (TypeScript)
│ ├── controllers/ # Route handlers (req → res)
│ │ ├── authController.ts # Handles register, login, logout, /me
│ │ └── adminController.ts # Admin endpoints like user listing
│ │
│ ├── routes/ # API route definitions
│ │ ├── authRoutes.ts # /api/register, /login, /logout, /me
│ │ ├── adminRoutes.ts # /api/admin/users (protected by role)
│ │ └── index.ts # Entry point to combine routes
│ │
│ ├── services/ # Business logic (controller ↔ DB)
│ │ ├── authService.ts # Register, login, JWT sign/verify
│ │ └── userService.ts # User-related services (admin, etc.)
│ │
│ ├── middleware/ # Express middlewares
│ │ ├── authenticateJWT.ts # Verifies JWT & attaches user to request
│ │ ├── requireRole.ts # Role-based route guard middleware
│ │ └── errorHandler.ts # Global error handling
│ │
│ ├── utils/ # Reusable helpers and error classes
│ │ ├── AppError.ts # Custom error classes: Unauthorized, Forbidden, etc.
│ │ └── logger.ts # (Optional) Logger helper
│ │
│ ├── constants/ # Shared enums, magic strings
│ │ └── roles.ts # Role enum (USER, ADMIN, etc.)
│ │
│ ├── db.ts # Centralized PrismaClient instance
│ ├── types.d.ts # Custom TS typings (e.g., augment Express req.user)
│ └── index.ts # Main Express app setup and server bootstrap
│
├── .env # Environment variables (DB, secrets)
├── package.json # Project scripts and dependencies
├── tsconfig.json # TypeScript config
├── README.md # Project documentation (backend-specific)
└── node_modules/ # Installed dependencies (ignored by Git)

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/your-username/fullstack-cookie-auth.git
cd fullstack-cookie-auth/backend-ts

```

Install dependencies

npm install
