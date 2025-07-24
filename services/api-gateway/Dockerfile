# Multi-stage build for API Gateway
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy shared package first
COPY ../../shared ./shared

# Build shared package
WORKDIR /app/shared
RUN npm install
RUN npm run build

# Copy API Gateway package files
WORKDIR /app
COPY services/api-gateway/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy API Gateway source code
COPY services/api-gateway/src ./src
COPY services/api-gateway/tsconfig.json ./

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Create necessary directories
RUN mkdir -p logs uploads && chown -R nodejs:nodejs logs uploads

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"] 