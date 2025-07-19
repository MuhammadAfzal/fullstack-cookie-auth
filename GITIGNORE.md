# Gitignore Configuration

This document explains the `.gitignore` configuration for our microservices architecture.

## 📁 File Structure

```
fullstack-cookie-auth/
├── .gitignore                    # Root-level gitignore
├── shared/
│   ├── .gitignore               # Shared package gitignore
│   └── .dockerignore            # Shared package dockerignore
├── services/
│   └── auth-service/
│       ├── .gitignore           # Auth service gitignore
│       └── .dockerignore        # Auth service dockerignore
└── frontend/
    └── .gitignore               # Frontend gitignore (existing)
```

## 🚫 What's Ignored

### **Dependencies**

- `node_modules/` - All dependency directories
- `npm-debug.log*` - NPM debug logs
- `yarn-debug.log*` - Yarn debug logs
- `yarn-error.log*` - Yarn error logs

### **Build Outputs**

- `dist/` - Compiled TypeScript/JavaScript
- `build/` - Build artifacts
- `*.tsbuildinfo` - TypeScript build cache

### **Environment Variables**

- `.env` - Environment variables (contains secrets)
- `.env.local` - Local environment overrides
- `.env.development.local` - Development environment
- `.env.test.local` - Test environment
- `.env.production.local` - Production environment

### **Logs**

- `logs/` - Application logs directory
- `*.log` - Log files
- Various debug and error logs

### **Database & Cache**

- `prisma/migrations/` - Database migrations (generated)
- `*.db` - SQLite databases
- `dump.rdb` - Redis dump files

### **Uploads & Media**

- `uploads/` - User uploaded files
- `!uploads/.gitkeep` - Keep uploads directory structure

### **Test Files**

- `test-*.js` - Test scripts
- `cookies.txt` - Cookie files for testing
- `*.test.js` - Test files
- `*.spec.js` - Spec files

### **Development Files**

- `.vscode/` - VS Code settings
- `.idea/` - IntelliJ IDEA settings
- `*.swp` - Vim swap files
- `*~` - Backup files

### **OS Files**

- `.DS_Store` - macOS system files
- `Thumbs.db` - Windows thumbnail cache
- `ehthumbs.db` - Windows thumbnail cache

### **Docker**

- `.dockerignore` - Docker ignore files
- `docker-compose.override.yml` - Local Docker overrides

## ✅ What's Tracked

### **Source Code**

- `src/` - TypeScript source files
- `prisma/schema.prisma` - Database schema
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration

### **Configuration**

- `env.example` - Environment variable templates
- `Dockerfile` - Docker build instructions
- `docker-compose.yml` - Service orchestration

### **Documentation**

- `README.md` - Project documentation
- `*.md` - Markdown documentation files

### **Directory Structure**

- `uploads/.gitkeep` - Ensures uploads directory exists
- `logs/.gitkeep` - Ensures logs directory exists

## 🔧 Special Cases

### **Prisma Migrations**

```bash
# Ignored: Generated migration files
prisma/migrations/

# Tracked: Schema definition
prisma/schema.prisma
```

### **Environment Files**

```bash
# Ignored: Actual environment files
.env
.env.local

# Tracked: Template files
env.example
```

### **Build Outputs**

```bash
# Ignored: Compiled code
dist/
build/

# Tracked: Source code
src/
```

## 🚀 Best Practices

### **1. Never Commit Secrets**

- Environment files (`.env`)
- API keys
- Database passwords
- JWT secrets

### **2. Use Templates**

- Create `env.example` files
- Document required environment variables
- Provide default values where safe

### **3. Keep Directories**

- Use `.gitkeep` files for empty directories
- Maintain consistent project structure
- Ensure uploads and logs directories exist

### **4. Optimize Docker Builds**

- Use `.dockerignore` to exclude unnecessary files
- Reduce build context size
- Speed up Docker builds

## 📋 Commands

### **Check Ignored Files**

```bash
git status --ignored
```

### **Force Add Ignored File**

```bash
git add -f path/to/ignored/file
```

### **Check What Would Be Committed**

```bash
git add .
git status
```

### **Clean Untracked Files**

```bash
git clean -fd
```

## 🔍 Verification

To verify our gitignore is working correctly:

1. **Check ignored files:**

   ```bash
   git status --ignored
   ```

2. **Verify sensitive files are ignored:**

   - `.env` files should not appear in `git status`
   - `node_modules/` should be ignored
   - `dist/` should be ignored

3. **Verify important files are tracked:**
   - `package.json` should be tracked
   - `src/` files should be tracked
   - `README.md` should be tracked

## 🛠️ Troubleshooting

### **File Still Being Tracked**

If a file is still being tracked despite being in `.gitignore`:

```bash
# Remove from git cache
git rm --cached path/to/file

# Commit the removal
git commit -m "Remove file from tracking"
```

### **Directory Not Ignored**

If a directory is not being ignored:

```bash
# Check if it's already tracked
git ls-files | grep directory-name

# Remove from tracking if needed
git rm -r --cached directory-name
```

### **Docker Build Issues**

If Docker builds are slow or include unnecessary files:

```bash
# Check build context
docker build --no-cache .

# Verify .dockerignore is working
docker build --progress=plain .
```
