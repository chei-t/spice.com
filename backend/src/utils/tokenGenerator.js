import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Generate refresh token (longer expiry)
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d', // 30 days
  });
};

// Verify token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

// Generate password reset token
export const generatePasswordResetToken = (userId) => {
  return jwt.sign({ userId, type: 'passwordReset' }, JWT_SECRET, {
    expiresIn: '10m', // 10 minutes
  });
};

// Generate email verification token
export const generateEmailVerificationToken = (userId) => {
  return jwt.sign({ userId, type: 'emailVerification' }, JWT_SECRET, {
    expiresIn: '24h', // 24 hours
  });
};