# Authentication & Authorization Documentation

## Overview

This Spice E-commerce platform uses **JSON Web Tokens (JWT)** for authentication and role-based access control (RBAC) for authorization. This document explains the authentication flow, security measures, and implementation details.

---

## Table of Contents

1. [Authentication Strategy](#authentication-strategy)
2. [Registration Flow](#registration-flow)
3. [Login Flow](#login-flow)
4. [JWT Token Structure](#jwt-token-structure)
5. [Token Refresh Mechanism](#token-refresh-mechanism)
6. [Password Reset Flow](#password-reset-flow)
7. [Authorization & Role-Based Access](#authorization--role-based-access)
8. [Security Measures](#security-measures)
9. [Implementation Examples](#implementation-examples)

---

## Authentication Strategy

### Why JWT?

- **Stateless**: No need to store sessions on the server
- **Scalable**: Works well with distributed systems
- **Mobile-Friendly**: Easy to implement in mobile apps
- **Cross-Domain**: Can be used across different domains

### Token Types

1. **Access Token**
   - Short-lived (24 hours)
   - Used for API authentication
   - Sent with every authenticated request
   - Stored in memory (recommended) or localStorage

2. **Refresh Token**
   - Long-lived (7 days)
   - Used to obtain new access tokens
   - Stored securely (httpOnly cookie recommended)
   - Can be revoked

---

## Registration Flow

### Step-by-Step Process

```
User → Frontend → Backend → Database → Backend → Frontend → User
```

**1. User Submits Registration Form**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890"
}
```

**2. Backend Validation**
- Email format validation
- Email uniqueness check
- Password strength validation
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character
- Phone number format validation

**3. Password Hashing**
```javascript
// Using bcrypt with salt rounds = 10
const hashedPassword = await bcrypt.hash(password, 10);
```

**4. User Creation**
```javascript
const user = new User({
  firstName,
  lastName,
  email: email.toLowerCase(),
  password: hashedPassword,
  phone,
  role: 'customer', // Default role
  isActive: true,
  createdAt: new Date()
});
await user.save();
```

**5. JWT Token Generation**
```javascript
const token = jwt.sign(
  { 
    userId: user._id, 
    email: user.email,
    role: user.role 
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

**6. Response to User**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**7. Frontend Stores Token**
```javascript
// Option 1: In memory (most secure for web)
let authToken = response.data.token;

// Option 2: localStorage (convenient but less secure)
localStorage.setItem('authToken', response.data.token);

// Option 3: httpOnly cookie (handled by backend)
// Most secure option
```

---

## Login Flow

### Step-by-Step Process

```
User → Frontend → Backend → Database → Backend → Frontend → User
```

**1. User Submits Login Credentials**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**2. Backend Finds User**
```javascript
const user = await User.findOne({ 
  email: email.toLowerCase() 
});

if (!user) {
  return res.status(401).json({
    success: false,
    message: "Invalid credentials"
  });
}
```

**3. Account Status Check**
```javascript
if (!user.isActive) {
  return res.status(403).json({
    success: false,
    message: "Account has been deactivated"
  });
}
```

**4. Password Verification**
```javascript
const isPasswordValid = await bcrypt.compare(
  password, 
  user.password
);

if (!isPasswordValid) {
  return res.status(401).json({
    success: false,
    message: "Invalid credentials"
  });
}
```

**5. Update Last Login**
```javascript
user.lastLogin = new Date();
await user.save();
```

**6. Generate Tokens**
```javascript
// Access Token
const accessToken = jwt.sign(
  { 
    userId: user._id,
    email: user.email,
    role: user.role 
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Refresh Token
const refreshToken = jwt.sign(
  { 
    userId: user._id,
    type: 'refresh'
  },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);
```

**7. Store Refresh Token**
```javascript
// Option 1: In database
user.refreshToken = refreshToken;
await user.save();

// Option 2: In Redis (faster)
await redis.set(
  `refresh_token:${user._id}`, 
  refreshToken, 
  'EX', 
  7 * 24 * 60 * 60 // 7 days
);
```

**8. Send Response**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

---

## JWT Token Structure

### Access Token Payload

```json
{
  "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "email": "john.doe@example.com",
  "role": "customer",
  "iat": 1704448800,
  "exp": 1704535200
}
```

### Token Components

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGYxYTJiM2M0ZDVlNmY3ZzhoOWkwajEiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzA0NDQ4ODAwLCJleHAiOjE3MDQ1MzUyMDB9.signature_here

[Header].[Payload].[Signature]
```

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "email": "john.doe@example.com",
  "role": "customer",
  "iat": 1704448800,
  "exp": 1704535200
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
```

---

## Token Refresh Mechanism

### Why Refresh Tokens?

- Keep access tokens short-lived for security
- Avoid forcing users to re-login frequently
- Allow token revocation

### Refresh Flow

```
Frontend → Backend → Database → Backend → Frontend
```

**1. Access Token Expires**
```javascript
// Frontend detects 401 Unauthorized
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      // Token expired, try to refresh
      return refreshTokenAndRetry(error);
    }
    return Promise.reject(error);
  }
);
```

**2. Request New Access Token**
```javascript
// POST /api/auth/refresh-token
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**3. Backend Validates Refresh Token**
```javascript
// Verify token signature
const decoded = jwt.verify(
  refreshToken, 
  process.env.JWT_REFRESH_SECRET
);

// Check if token exists in database/redis
const storedToken = await redis.get(
  `refresh_token:${decoded.userId}`
);

if (storedToken !== refreshToken) {
  return res.status(401).json({
    success: false,
    message: "Invalid refresh token"
  });
}

// Check if user still exists and is active
const user = await User.findById(decoded.userId);
if (!user || !user.isActive) {
  return res.status(401).json({
    success: false,
    message: "User not found or inactive"
  });
}
```

**4. Generate New Access Token**
```javascript
const newAccessToken = jwt.sign(
  { 
    userId: user._id,
    email: user.email,
    role: user.role 
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

**5. Response**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

**6. Retry Original Request**
```javascript
// Update token and retry failed request
localStorage.setItem('authToken', newAccessToken);
originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
return axios(originalRequest);
```

---

## Password Reset Flow

### Step-by-Step Process

**1. User Requests Password Reset**
```
POST /api/auth/forgot-password
{
  "email": "john.doe@example.com"
}
```

**2. Generate Reset Token**
```javascript
// Create random token
const resetToken = crypto.randomBytes(32).toString('hex');

// Hash token for storage
const hashedToken = crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex');

// Store in database with expiration
user.resetPasswordToken = hashedToken;
user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
await user.save();
```

**3. Send Reset Email**
```javascript
const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

await sendEmail({
  to: user.email,
  subject: 'Password Reset Request',
  template: 'password-reset',
  data: {
    name: user.firstName,
    resetUrl: resetUrl,
    expiresIn: '1 hour'
  }
});
```

**4. User Clicks Email Link**
```
GET https://yourstore.com/reset-password/a1b2c3d4e5f6...
```

**5. User Submits New Password**
```
POST /api/auth/reset-password/a1b2c3d4e5f6...
{
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**6. Verify Reset Token**
```javascript
// Hash the token from URL
const hashedToken = crypto
  .createHash('sha256')
  .update(req.params.token)
  .digest('hex');

// Find user with valid token
const user = await User.findOne({
  resetPasswordToken: hashedToken,
  resetPasswordExpire: { $gt: Date.now() }
});

if (!user) {
  return res.status(400).json({
    success: false,
    message: "Invalid or expired reset token"
  });
}
```

**7. Update Password**
```javascript
// Hash new password
user.password = await bcrypt.hash(newPassword, 10);

// Clear reset token fields
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;

await user.save();
```

**8. Send Confirmation Email**
```javascript
await sendEmail({
  to: user.email,
  subject: 'Password Changed Successfully',
  template: 'password-changed',
  data: {
    name: user.firstName,
    timestamp: new Date().toISOString()
  }
});
```

---

## Authorization & Role-Based Access

### User Roles

1. **customer** - Regular users
   - Can browse products
   - Can manage their cart and wishlist
   - Can place orders
   - Can write reviews

2. **admin** - Administrative users
   - All customer permissions
   - Can manage products (CRUD)
   - Can manage orders
   - Can view analytics
   - Can manage customers
   - Can create flash sales

3. **superadmin** - Super administrators (optional)
   - All admin permissions
   - Can manage other admins
   - Can access system settings

### Middleware Implementation

**Authentication Middleware (auth.js)**
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = authenticate;
```

**Authorization Middleware (adminAuth.js)**
```javascript
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = authorizeRoles;
```

### Route Protection Examples

```javascript
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/adminAuth');
const productController = require('../controllers/productController');

// Public route - no authentication
router.get('/products', productController.getAllProducts);

// Protected route - authentication required
router.post('/cart', authenticate, cartController.addToCart);

// Admin only route
router.post(
  '/products', 
  authenticate, 
  authorizeRoles('admin', 'superadmin'),
  productController.createProduct
);

// Multiple role authorization
router.get(
  '/orders',
  authenticate,
  authorizeRoles('customer', 'admin'),
  orderController.getOrders
);
```

---

## Security Measures

### 1. Password Security

**Hashing with bcrypt**
```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Hash password
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

// Compare password
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

**Password Requirements**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

**Validation Regex**
```javascript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

### 2. Token Security

**JWT Secret Management**
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Environment Variables**
```
JWT_SECRET=your_super_secure_random_secret_key_here
JWT_REFRESH_SECRET=different_secure_key_for_refresh_tokens
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
```

**Token Storage Best Practices**

| Storage Method | Security | Convenience | Recommended For |
|----------------|----------|-------------|-----------------|
| Memory (state) | High | Medium | Web apps (SPA) |
| httpOnly Cookie | High | High | Traditional web apps |
| localStorage | Low | High | Not recommended |
| sessionStorage | Medium | Medium | Acceptable |

### 3. Rate Limiting

Prevent brute force attacks on authentication endpoints.

```javascript
const rateLimit = require('express-rate-limit');

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply to login route
router.post('/login', loginLimiter, authController.login);

// Registration rate limiter
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour
  message: {
    success: false,
    message: 'Too many accounts created. Please try again later.'
  }
});

router.post('/register', registerLimiter, authController.register);
```

### 4. Input Validation

**Using express-validator**
```javascript
const { body, validationResult } = require('express-validator');

// Registration validation
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must meet requirements'),
  
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be 2-50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be 2-50 characters')
];

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

router.post(
  '/register', 
  registerValidation, 
  validate, 
  authController.register
);
```

### 5. CORS Configuration

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 6. Helmet for Security Headers

```javascript
const helmet = require('helmet');

app.use(helmet());
// Sets various HTTP headers for security
```

### 7. XSS Protection

```javascript
const xss = require('xss-clean');

app.use(xss()); // Sanitize user input
```

### 8. MongoDB Injection Prevention

```javascript
const mongoSanitize = require('express-mongo-sanitize');

app.use(mongoSanitize()); // Remove $ and . from user input
```

---

## Implementation Examples

### Complete Auth Middleware Setup

**server.js**
```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(xss());
app.use(mongoSanitize());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // 100 requests per window
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Error handler
app.use(errorHandler);
```

### Frontend Authentication Example

**React with Axios**
```javascript
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          'http://localhost:5000/api/auth/refresh-token',
          { refreshToken }
        );

        const { token } = response.data.data;
        localStorage.setItem('authToken', token);
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Testing Authentication

**Using Jest**
```javascript
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Authentication', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'SecurePass123!'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'weak'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      // Create user first
      await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'SecurePass123!'
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'SecurePass123!'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
```

---

## Best Practices Summary

### ✅ DO

- Use strong JWT secrets (64+ characters, random)
- Hash passwords with bcrypt (salt rounds >= 10)
- Implement token expiration
- Use refresh tokens for long-lived sessions
- Validate all user input
- Implement rate limiting
- Use HTTPS in production
- Store tokens securely
- Implement proper error handling
- Log authentication attempts
- Use httpOnly cookies when possible

### ❌ DON'T

- Store passwords in plain text
- Use weak JWT secrets
- Store sensitive data in JWT payload
- Implement custom crypto (use proven libraries)
- Expose user IDs in URLs unnecessarily
- Return detailed error messages to attackers
- Allow unlimited login attempts
- Store tokens in localStorage (if possible)
- Trust user input without validation
- Log sensitive information (passwords, tokens)

---

## Environment Variables Template

```bash
# JWT Configuration
JWT_SECRET=your_64_character_or_longer_random_secret_here
JWT_REFRESH_SECRET=different_secure_random_secret_for_refresh
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Security
BCRYPT_SALT_ROUNDS=10

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Email Service (for password reset)
EMAIL_SERVICE=SendGrid
EMAIL_API_KEY=your_email_service_api_key
EMAIL_FROM=noreply@yourstore.com
```

---

## Additional Resources

- [JWT.io](https://jwt.io/) - JWT debugger
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Last Updated:** December 2024  
**Version:** 1.0