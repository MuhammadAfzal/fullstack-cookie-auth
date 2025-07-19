# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy shared package
COPY ../shared ./shared
RUN cd shared && npm ci --only=production && npm run build

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create uploads directory
RUN mkdir -p uploads/avatars

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=base --chown=nodejs:nodejs /app/dist ./dist
COPY --from=base --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nodejs:nodejs /app/shared ./shared
COPY --from=base --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=base --chown=nodejs:nodejs /app/uploads ./uploads

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"] 