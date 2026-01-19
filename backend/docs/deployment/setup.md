# Setup Instructions

## Overview

This guide covers the complete setup process for the spice store-commerce backend platform, from initial installation to running the application locally.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.x or higher | Runtime environment |
| npm | 9.x or higher | Package manager |
| MongoDB | 6.0 or higher | Database |
| Git | Latest | Version control |

### Optional Tools

| Tool | Purpose |
|------|---------|
| MongoDB Compass | Database GUI |
| Postman | API testing |
| VS Code | Code editor |
| Docker | Containerization |

### Check Installed Versions

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB version
mongod --version

# Check Git version
git --version
```

---

## Local Development Setup

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-username/ecommerce-backend.git

# Navigate to project directory
cd ecommerce-backend
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# Or use yarn
yarn install
```

**Core Dependencies:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-validator": "^7.0.1",
    "express-rate-limit": "^7.1.5",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.41.0",
    "nodemailer": "^6.9.7",
    "stripe": "^14.7.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.55.0"
  }
}
```

### Step 3: Project Structure

Verify your project structure:

```
ecommerce-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   └── cloudinary.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── ...
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── ...
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── ...
│   ├── utils/
│   │   ├── emailService.js
│   │   └── ...
│   └── validators/
│       └── ...
├── tests/
├── docs/
├── migrations/
├── uploads/
├── logs/
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

## Environment Configuration

### Step 1: Create Environment File

```bash
# Copy example environment file
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit `.env` file:

```bash
# ==========================================
# SERVER CONFIGURATION
# ==========================================
NODE_ENV=development
PORT=5000
API_VERSION=v1

# ==========================================
# DATABASE CONFIGURATION
# ==========================================
MONGODB_URI=mongodb://localhost:27017/ecommerce_dev
MONGODB_URI_TEST=mongodb://localhost:27017/ecommerce_test

# MongoDB Options
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=2

# ==========================================
# JWT CONFIGURATION
# ==========================================
JWT_SECRET=your_super_secure_jwt_secret_key_at_least_64_characters_long
JWT_REFRESH_SECRET=your_super_secure_refresh_token_secret_key_different_from_jwt
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# ==========================================
# SECURITY CONFIGURATION
# ==========================================
BCRYPT_SALT_ROUNDS=10

# ==========================================
# CORS CONFIGURATION
# ==========================================
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# ==========================================
# FILE UPLOAD CONFIGURATION
# ==========================================
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OR AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# ==========================================
# EMAIL CONFIGURATION
# ==========================================
EMAIL_SERVICE=SendGrid
EMAIL_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@yourstore.com
EMAIL_FROM_NAME=Your Store

# OR SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# ==========================================
# PAYMENT GATEWAY CONFIGURATION
# ==========================================
# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal (Optional)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# ==========================================
# RATE LIMITING
# ==========================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ==========================================
# LOGGING
# ==========================================
LOG_LEVEL=debug
LOG_FILE=logs/app.log

# ==========================================
# ANALYTICS
# ==========================================
GOOGLE_ANALYTICS_ID=UA-XXXXX-Y
```

### Step 3: Generate Secure Keys

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate refresh token secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Database Setup

### Option 1: Local MongoDB

#### Install MongoDB

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
```

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

**Windows:**
Download from https://www.mongodb.com/try/download/community

#### Start MongoDB

```bash
# macOS
brew services start mongodb-community@6.0

# Linux
sudo systemctl start mongod
sudo systemctl enable mongod

# Windows
# MongoDB runs as a service automatically
```

#### Verify MongoDB

```bash
# Connect to MongoDB shell
mongosh

# Check databases
show dbs

# Exit
exit
```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier
   - Select region closest to you

3. **Create Database User**
   - Database Access → Add New Database User
   - Choose password authentication
   - Set username and password

4. **Configure Network Access**
   - Network Access → Add IP Address
   - For development: Allow Access from Anywhere (0.0.0.0/0)

5. **Get Connection String**
   - Clusters → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

6. **Update .env**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

### Option 3: Docker

```bash
# Create docker-compose.yml
version: '3.8'
services:
  mongodb:
    image: mongo:6.0
    container_name: ecommerce_mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: ecommerce
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:

# Start MongoDB
docker-compose up -d

# Update .env
MONGODB_URI=mongodb://admin:password@localhost:27017/ecommerce?authSource=admin
```

### Initialize Database

```bash
# Run database initialization script
npm run db:init

# Or manually create indexes
npm run db:create-indexes
```

**db:init script (package.json):**
```json
{
  "scripts": {
    "db:init": "node scripts/initDatabase.js",
    "db:seed": "node scripts/seedData.js",
    "db:create-indexes": "node scripts/createIndexes.js"
  }
}
```

---

## Running the Application

### Development Mode

```bash
# Start with nodemon (auto-restart on changes)
npm run dev

# Or
yarn dev
```

**package.json scripts:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --watchAll",
    "test:ci": "jest --coverage",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix"
  }
}
```

### Production Mode

```bash
# Start production server
npm start

# Or with PM2 (recommended)
npm install -g pm2
pm2 start server.js --name ecommerce-api
pm2 save
pm2 startup
```

### Server Output

You should see:
```
🚀 Server running on port 5000
✅ MongoDB connected successfully
🌍 Environment: development
📝 API Documentation: http://localhost:5000/api-docs
```

---

## Verification

### 1. Health Check

```bash
# Test server is running
curl http://localhost:5000/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### 2. Database Connection

```bash
# Test database connection
curl http://localhost:5000/api/health/db

# Expected response:
{
  "status": "ok",
  "database": "connected",
  "collections": 9
}
```

### 3. API Endpoints

```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:ci

# Run specific test file
npm test -- auth.test.js
```

### 5. Import Postman Collection

1. Open Postman
2. Import `docs/api/postman-collection.json`
3. Set up environment variables
4. Test all endpoints

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

#### 2. MongoDB Connection Failed

**Error:** `MongoServerError: connection refused`

**Solutions:**
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB
brew services start mongodb-community@6.0  # macOS
sudo systemctl start mongod                 # Linux

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/ecommerce_dev
```

#### 3. Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. JWT Secret Not Set

**Error:** `JWT_SECRET is not defined`

**Solution:**
```bash
# Generate and add to .env
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Add to .env
JWT_SECRET=generated_secret_here
```

#### 5. Permission Denied

**Error:** `EACCES: permission denied`

**Solution:**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config

# Or use nvm instead of system Node.js
```

#### 6. Cloudinary Upload Failed

**Error:** `Invalid cloud name`

**Solution:**
```bash
# Verify Cloudinary credentials in .env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret

# Test credentials in Cloudinary dashboard
```

### Debug Mode

```bash
# Run with debug logs
DEBUG=* npm run dev

# Or set in .env
LOG_LEVEL=debug
```

### Check Logs

```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log
```

---

## Next Steps

After successful setup:

1. ✅ [Read API Documentation](../api/endpoints.md)
2. ✅ [Import Postman Collection](../api/postman-collection.json)
3. ✅ [Review Database Schema](../database/schema.md)
4. ✅ [Set up Deployment](deployment-guide.md)
5. ✅ Start building features!

---

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

---

## Support

For issues or questions:
- Check [Troubleshooting](#troubleshooting) section
- Review [GitHub Issues](https://github.com/your-username/ecommerce-backend/issues)
- Contact development team

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Author:** solomon mwangi  [object Object],[object Object]
**Contact:** solomonmuriithi370@gmail.com
**License:** MIT
