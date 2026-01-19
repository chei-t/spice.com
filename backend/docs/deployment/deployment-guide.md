# Deployment Guide

## Overview

This guide covers deploying the e-commerce backend to production environments including cloud platforms, CI/CD setup, monitoring, and best practices.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Platform Options](#platform-options)
3. [Heroku Deployment](#heroku-deployment)
4. [AWS Deployment](#aws-deployment)
5. [DigitalOcean Deployment](#digitalocean-deployment)
6. [Docker Deployment](#docker-deployment)
7. [CI/CD Setup](#cicd-setup)
8. [Environment Management](#environment-management)
9. [Monitoring & Logging](#monitoring--logging)
10. [Security Hardening](#security-hardening)
11. [Performance Optimization](#performance-optimization)
12. [Backup & Recovery](#backup--recovery)

---

## Pre-Deployment Checklist

### Code Readiness

- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] No console.logs in production code
- [ ] Environment variables configured
- [ ] Dependencies updated
- [ ] Security vulnerabilities checked (`npm audit`)
- [ ] Documentation complete

### Database

- [ ] Production database created
- [ ] Database indexes created
- [ ] Migrations tested
- [ ] Backup strategy defined
- [ ] Connection pooling configured

### Security

- [ ] HTTPS/SSL configured
- [ ] Environment secrets secured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation complete
- [ ] Authentication tested

### Performance

- [ ] Database queries optimized
- [ ] Caching strategy implemented
- [ ] Image optimization configured
- [ ] API response times acceptable
- [ ] Load testing completed

---

## Platform Options

### Comparison

| Platform | Pros | Cons | Best For |
|----------|------|------|----------|
| **Heroku** | Easy setup, managed services | Limited free tier, expensive at scale | MVPs, prototypes |
| **AWS** | Highly scalable, full control | Complex setup, steep learning curve | Enterprise apps |
| **DigitalOcean** | Simple, predictable pricing | Less managed services | Small to medium apps |
| **Vercel/Netlify** | Great for serverless | Not ideal for traditional backends | Serverless APIs |
| **Railway** | Modern, easy to use | Relatively new platform | Modern apps |

---

## Heroku Deployment

### Prerequisites

```bash
# Install Heroku CLI
brew install heroku/brew/heroku  # macOS
# Or download from https://devcenter.heroku.com/articles/heroku-cli
```

### Step 1: Create Heroku App

```bash
# Login to Heroku
heroku login

# Create new app
heroku create ecommerce-api-production

# Or specify region
heroku create ecommerce-api-production --region eu
```

### Step 2: Add MongoDB

```bash
# Add MongoDB Atlas addon (free tier)
heroku addons:create mongolab:sandbox

# Or use your own MongoDB Atlas
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/ecommerce"
```

### Step 3: Configure Environment Variables

```bash
# Set all environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_jwt_secret
heroku config:set JWT_REFRESH_SECRET=your_refresh_secret
heroku config:set FRONTEND_URL=https://yourstore.com
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
heroku config:set STRIPE_SECRET_KEY=your_stripe_secret
heroku config:set EMAIL_API_KEY=your_email_api_key

# View all config vars
heroku config
```

### Step 4: Create Procfile

**Procfile:**
```
web: node server.js
```

### Step 5: Deploy

```bash
# Add Heroku remote
heroku git:remote -a ecommerce-api-production

# Deploy to Heroku
git push heroku main

# Or deploy from specific branch
git push heroku develop:main
```

### Step 6: Scale and Monitor

```bash
# Scale web dynos
heroku ps:scale web=1

# View logs
heroku logs --tail

# Open app
heroku open

# Run migrations
heroku run npm run migrate:up
```

### Heroku-Specific Files

**package.json:**
```json
{
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  },
  "scripts": {
    "start": "node server.js",
    "heroku-postbuild": "npm run migrate:up"
  }
}
```

---

## AWS Deployment

### Option 1: AWS Elastic Beanstalk

#### Prerequisites

```bash
# Install EB CLI
pip install awsebcli
```

#### Step 1: Initialize Application

```bash
# Initialize Elastic Beanstalk
eb init

# Follow prompts:
# - Select region
# - Create new application
# - Select Node.js platform
# - Set up SSH
```

#### Step 2: Create Environment

```bash
# Create production environment
eb create ecommerce-production

# Set environment variables
eb setenv NODE_ENV=production \
  JWT_SECRET=your_jwt_secret \
  MONGODB_URI=your_mongodb_uri \
  FRONTEND_URL=https://yourstore.com
```

#### Step 3: Deploy

```bash
# Deploy application
eb deploy

# Open application
eb open

# View logs
eb logs

# SSH into instance
eb ssh
```

#### Configuration

**.ebextensions/nodejs.config:**
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    NodeVersion: 18.x
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

### Option 2: AWS EC2

#### Step 1: Launch EC2 Instance

1. **Choose AMI:** Ubuntu Server 22.04 LTS
2. **Instance Type:** t2.micro (free tier) or t3.medium
3. **Configure Security Group:**
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
   - Custom TCP (5000) - Anywhere (temporarily)

#### Step 2: Connect to Instance

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

#### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (optional if using Atlas)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### Step 4: Deploy Application

```bash
# Clone repository
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend

# Install dependencies
npm install --production

# Create .env file
nano .env
# Add all production environment variables

# Start with PM2
pm2 start server.js --name ecommerce-api
pm2 save
pm2 startup
```

#### Step 5: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ecommerce-api
```

**/etc/nginx/sites-available/ecommerce-api:**
```nginx
server {
    listen 80;
    server_name api.yourstore.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ecommerce-api /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Step 6: SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d api.yourstore.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

---

## DigitalOcean Deployment

### Option 1: App Platform (PaaS)

#### Step 1: Create App

1. Go to DigitalOcean App Platform
2. Click "Create App"
3. Connect GitHub repository
4. Configure:
   - Branch: `main`
   - Build Command: `npm install`
   - Run Command: `npm start`

#### Step 2: Add Database

1. Add MongoDB database component
2. Or use external MongoDB Atlas

#### Step 3: Configure Environment

Add environment variables in App Platform settings

#### Step 4: Deploy

App automatically deploys on git push

### Option 2: Droplet (IaaS)

Follow similar steps to AWS EC2 deployment

```bash
# Create droplet
doctl compute droplet create ecommerce-api \
  --region nyc1 \
  --size s-1vcpu-1gb \
  --image ubuntu-22-04-x64

# SSH and follow EC2 setup steps
```

---

## Docker Deployment

### Dockerfile

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["node", "server.js"]
```

**healthcheck.js:**
```javascript
const http = require('http');

const options = {
  host: 'localhost',
  port: 5000,
  path: '/health',
  timeout: 2000
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', () => {
  process.exit(1);
});

request.end();
```

**.dockerignore:**
```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
docs/
tests/
.vscode/
*.md
```

### Docker Compose

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  api:
    build: .
    container_name: ecommerce-api
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=mongodb://mongo:27017/ecommerce
    env_file:
      - .env
    depends_on:
      - mongo
    restart: unless-stopped
    networks:
      - ecommerce-network

  mongo:
    image: mongo:6.0
    container_name: ecommerce-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
      - MONGO_INITDB_DATABASE=ecommerce
    restart: unless-stopped
    networks:
      - ecommerce-network

  nginx:
    image: nginx:alpine
    container_name: ecommerce-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - api
    restart: unless-stopped
    networks:
      - ecommerce-network

volumes:
  mongo-data:

networks:
  ecommerce-network:
    driver: bridge
```

### Deploy with Docker

```bash
# Build image
docker build -t ecommerce-api:latest .

# Run container
docker run -d \
  --name ecommerce-api \
  -p 5000:5000 \
  --env-file .env \
  ecommerce-api:latest

# Or use docker-compose
docker-compose up -d

# View logs
docker logs -f ecommerce-api

# Stop containers
docker-compose down
```

---

## CI/CD Setup

### GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm run test:ci
      env:
        MONGODB_URI: ${{ secrets.MONGODB_URI_TEST }}
        JWT_SECRET: ${{ secrets.JWT_SECRET }}
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3

  deploy:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.14
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
        heroku_email: ${{ secrets.HEROKU_EMAIL }}
    
    - name: Slack notification
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: 'Deployment completed!'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
      if: always()
```

### GitLab CI/CD

**.gitlab-ci.yml:**
```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm run lint
    - npm run test:ci
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy_production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - curl -X POST https://api.heroku.com/apps/$HEROKU_APP_NAME/builds
  only:
    - main
```

---

## Environment Management

### Multiple Environments

**config/environments.js:**
```javascript
const environments = {
  development: {
    port: 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_dev',
    logLevel: 'debug',
    corsOrigin: 'http://localhost:3000'
  },
  
  staging: {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    logLevel: 'info',
    corsOrigin: process.env.FRONTEND_URL
  },
  
  production: {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    logLevel: 'error',
    corsOrigin: process.env.FRONTEND_URL
  }
};

const env = process.env.NODE_ENV || 'development';

module.exports = environments[env];
```

---

## Monitoring & Logging

### Application Monitoring

**Install Winston for Logging:**
```bash
npm install winston winston-daily-rotate-file
```

**config/logger.js:**
```javascript
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

module.exports = logger;
```

### External Monitoring Tools

1. **New Relic**
```bash
npm install newrelic
```

2. **Datadog**
```bash
npm install dd-trace --save
```

3. **Sentry** (Error Tracking)
```bash
npm install @sentry/node
```

**config/sentry.js:**
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

module.exports = Sentry;
```

---

## Security Hardening

### Security Headers

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Rate Limiting (Production)

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### Environment Variable Validation

```javascript
const requiredEnvVars = [
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Environment variable ${varName} is required`);
  }
});
```

---

## Performance Optimization

### Caching with Redis

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});

// Cache product details
app.get('/api/products/:id', async (req, res) => {
  const cacheKey = `product:${req.params.id}`;
  
  // Check cache
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Fetch from database
  const product = await Product.findById(req.params.id);
  
  // Cache for 1 hour
  await client.setEx(cacheKey, 3600, JSON.stringify(product));
  
  res.json(product);
});
```

### Compression

```javascript
const compression = require('compression');

app.use(compression());
```

### Database Connection Pooling

```javascript
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

---

## Backup & Recovery

### Automated Backups

**scripts/backup.sh:**
```bash
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
DB_NAME="ecommerce"

# Create backup
mongodump \
  --uri="${MONGODB_URI}" \
  --db="${DB_NAME}" \
  --out="${BACKUP_DIR}/${DATE}"

# Upload to S3
aws s3 sync "${BACKUP_DIR}/${DATE}" "s3://your-backup-bucket/${DATE}"

# Delete local backup older than 7 days
find "${BACKUP_DIR}" -type d -mtime +7 -exec rm -rf {} +

echo "Backup completed: ${DATE}"
```

**Cron job:**
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

### Restore

```bash
mongorestore \
  --uri="${MONGODB_URI}" \
  --db=ecommerce \
  /path/to/backup/ecommerce
```

---

## Post-Deployment

### Final Checks

- [ ] API endpoints responding
- [ ] Database connection working
- [ ] Authentication working
- [ ] File uploads working
- [ ] Email sending working
- [ ] Payment processing working
- [ ] Logs being written
- [ ] Monitoring alerts configured
- [ ] SSL certificate valid
- [ ] Domain configured correctly

### Load Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test API endpoint
ab -n 1000 -c 100 https://api.yourstore.com/api/products
```

---

**Last Updated:** December 2025  
**Version:** 1.0.0