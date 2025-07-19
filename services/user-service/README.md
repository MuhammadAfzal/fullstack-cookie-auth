# User Service

A microservice for user management operations in our fullstack application.

## 🚀 Features

- **User Management**: CRUD operations for user profiles
- **User Search**: Advanced search with pagination and filtering
- **User Preferences**: Manage user settings and preferences
- **User Statistics**: Track user activity and engagement metrics
- **User Connections**: Handle user relationships (followers/following)
- **User Activities**: Log and retrieve user activities
- **File Uploads**: Handle avatar and media uploads
- **Caching**: Redis-based caching for performance
- **Rate Limiting**: Protect against abuse
- **Health Checks**: Comprehensive health monitoring

## 📁 Project Structure

```
services/user-service/
├── src/
│   ├── controllers/          # Request handlers
│   ├── services/             # Business logic
│   ├── middlewares/          # Express middlewares
│   ├── routes/               # Route definitions
│   ├── validators/           # Input validation schemas
│   ├── utils/                # Utility functions
│   └── index.ts              # Application entry point
├── prisma/
│   └── schema.prisma         # Database schema
├── logs/                     # Application logs
├── uploads/                  # File uploads
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── Dockerfile                # Docker configuration
└── README.md                 # This file
```

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Containerization**: Docker

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- Docker (optional)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database:**

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Docker

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run
```

## 📊 API Endpoints

### Health Checks

- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health with dependencies
- `GET /health/ready` - Readiness check
- `GET /health/live` - Liveness check

### User Management

- `GET /api/users` - Get current user (authenticated)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/username/:username` - Get user by username
- `PUT /api/users` - Update current user (authenticated)
- `DELETE /api/users` - Delete current user (authenticated)

### User Search

- `GET /api/users/search?q=query&page=1&limit=10` - Search users

### User Statistics

- `GET /api/users/:id/stats` - Get user statistics
- `GET /api/users/:id/activities` - Get user activities

### User Preferences

- `GET /api/users/:id/preferences` - Get user preferences
- `PUT /api/users/:id/preferences` - Update user preferences

### Other Services (Placeholder)

- `GET /api/profiles` - Profile management
- `GET /api/connections` - User connections
- `GET /api/activities` - Activity management
- `GET /api/posts` - Post management
- `GET /api/comments` - Comment management
- `GET /api/uploads` - File uploads

## 🔧 Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3002
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/user_service_db"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-for-user-service"
JWT_EXPIRES_IN="24h"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"

# Logging Configuration
LOG_LEVEL="info"
LOG_FILE="./logs/user-service.log"

# Service URLs
AUTH_SERVICE_URL="http://localhost:3001"
API_GATEWAY_URL="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🗄️ Database Schema

The service uses Prisma with the following main models:

- **User**: Core user information
- **UserPreferences**: User settings and preferences
- **UserStatistics**: User activity metrics
- **UserActivity**: User activity log
- **UserConnection**: User relationships
- **Post**: User posts (if handled by this service)
- **Comment**: User comments

## 🔒 Security

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: Redis-based rate limiting
- **CORS**: Configurable CORS policies
- **Helmet**: Security headers
- **SQL Injection**: Protected by Prisma ORM

## 📈 Monitoring

- **Health Checks**: Multiple health check endpoints
- **Logging**: Structured logging with Winston
- **Error Handling**: Comprehensive error handling
- **Metrics**: User activity and performance metrics

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run watch        # Watch mode for TypeScript

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:studio      # Open Prisma Studio
npm run prisma:reset       # Reset database

# Docker
npm run docker:build       # Build Docker image
npm run docker:run         # Run Docker container

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
```

## 🔄 Development Workflow

1. **Start shared package in watch mode:**

   ```bash
   cd ../../shared
   npm run watch
   ```

2. **Start User Service in development:**

   ```bash
   npm run dev
   ```

3. **Make changes and see them reflected immediately**

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build production image
docker build -t user-service .

# Run with environment variables
docker run -p 3002:3002 \
  -e DATABASE_URL="your-db-url" \
  -e REDIS_URL="your-redis-url" \
  user-service
```

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass
5. Follow the microservices architecture patterns

## 📄 License

MIT License - see LICENSE file for details
