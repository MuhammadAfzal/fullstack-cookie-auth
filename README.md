# Fullstack Cookie Auth - Microservices Architecture

A production-ready fullstack authentication system built with TypeScript, Express, React, and microservices architecture.

## 🏗️ Architecture Overview

This project demonstrates a modern microservices architecture with:

- **Shared Package**: Common utilities, types, and middleware
- **Auth Service**: Authentication, authorization, and user profiles
- **User Service**: User management and admin operations
- **Dashboard Service**: Analytics, stats, and activity feeds
- **API Gateway**: Request routing and load balancing
- **Redis**: Caching and session storage
- **PostgreSQL**: Primary database

## 📁 Project Structure

```
fullstack-cookie-auth/
├── shared/                 # Shared utilities and types
│   ├── src/
│   │   ├── types.ts       # Common TypeScript types
│   │   ├── errors.ts      # Error classes
│   │   ├── logger.ts      # Winston logger
│   │   ├── middleware.ts  # Express middleware
│   │   └── redis.ts       # Redis client
│   └── package.json
├── services/              # Microservices
│   ├── auth-service/      # Authentication & profiles
│   ├── user-service/      # User management
│   └── dashboard-service/ # Analytics & stats
├── gateway/               # API Gateway
├── frontend/              # React frontend
├── docker-compose.yml     # Development orchestration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Development Setup

1. **Clone and install dependencies:**

   ```bash
   git clone <repository>
   cd fullstack-cookie-auth

   # Install shared package
   cd shared && npm install && npm run build

   # Install frontend
   cd ../frontend && npm install

   # Install auth service
   cd ../services/auth-service && npm install
   ```

2. **Set up environment variables:**

   ```bash
   # Copy example env files
   cp services/auth-service/.env.example services/auth-service/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Start with Docker Compose:**

   ```bash
   docker-compose up -d
   ```

4. **Run database migrations:**

   ```bash
   cd services/auth-service
   npx prisma migrate dev
   ```

5. **Start development servers:**

   ```bash
   # Auth Service
   cd services/auth-service && npm run dev

   # Frontend
   cd frontend && npm run dev
   ```

## 🔧 Development Workflow

### Adding a New Service

1. Create service directory: `mkdir services/new-service`
2. Copy structure from existing service
3. Update `docker-compose.yml`
4. Add service to API Gateway routes

### Shared Package Development

```bash
cd shared
npm run dev  # Watch mode for TypeScript compilation
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

## 📊 Service Endpoints

### Auth Service (Port 5001)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/avatar` - Upload avatar

### User Service (Port 5002)

- `GET /api/admin/users` - Get all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Dashboard Service (Port 5003)

- `GET /api/dashboard/summary` - Dashboard summary
- `GET /api/dashboard/chart-data` - Chart data
- `GET /api/dashboard/activity` - Activity feed
- `GET /api/dashboard/metrics` - Performance metrics

### API Gateway (Port 5000)

Routes all requests to appropriate services.

## 🛠️ Production Deployment

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Redis
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=your-super-secret-key

# CORS
CORS_ORIGIN=https://yourdomain.com

# Service URLs (for gateway)
AUTH_SERVICE_URL=http://auth-service:5001
USER_SERVICE_URL=http://user-service:5002
DASHBOARD_SERVICE_URL=http://dashboard-service:5003
```

### Docker Deployment

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

```bash
# Run tests for a specific service
cd services/auth-service && npm test

# Run all tests
npm run test:all
```

## 📈 Monitoring & Logging

- **Health Checks**: Each service exposes `/health` endpoint
- **Logging**: Winston logger with structured JSON logs
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Caching**: Redis for session storage and API response caching

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Helmet.js security headers
- Rate limiting (can be added)
- Input validation with Zod

## 🚀 Performance Optimizations

- Redis caching for frequently accessed data
- Database connection pooling
- Virtual scrolling for large datasets
- Image optimization for avatars
- API response compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Check if ports 5000-5003 are available
2. **Database connection**: Ensure PostgreSQL is running
3. **Redis connection**: Ensure Redis is running
4. **CORS issues**: Check CORS_ORIGIN environment variable

### Debug Commands

```bash
# Check service health
curl http://localhost:5001/health

# View logs
docker-compose logs auth-service

# Access database
docker-compose exec postgres psql -U postgres -d fullstack_auth
```
