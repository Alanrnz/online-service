/**
 * Authentication Routes
 * 
 * Handles:
 * - User registration
 * - User login
 * - Token generation
 * 
 * INTEGRATION POINT 1: Frontend Form Submission
 * Frontend sends form data → POST /api/auth/login
 * Backend validates credentials, returns JWT token
 * Frontend stores token and uses it for authenticated requests
 */

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Models will be injected via middleware
let User;

// Middleware to set models
router.use((req, res, next) => {
  User = req.app.locals.User;
  next();
});

// ===== HELPER: Generate JWT Token =====
const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email: email },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: '24h' } // Token valid for 24 hours
  );
};

// ===== POST /api/auth/register =====
/**
 * Register a new user
 * 
 * Request body:
 * {
 *   "username": "string",
 *   "email": "string",
 *   "password": "string",
 *   "phone": "string (optional)",
 *   "address": "string (optional)"
 * }
 * 
 * Response: { success: true, token: "jwt_token", userId: "..." }
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone, address } = req.body;
    
    // ===== INPUT VALIDATION =====
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['username', 'email', 'password']
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email },
          { username }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'Email or username is already registered'
      });
    }
    
    // ===== DATABASE OPERATION: INSERT =====
    // Create new user (password will be hashed by Sequelize hook)
    const user = await User.create({
      username,
      email,
      password,
      phone,
      address
    });
    
    // ===== GENERATE TOKEN & RESPONSE =====
    const token = generateToken(user.id, user.email);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: token,
      userId: user.id,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});

// ===== POST /api/auth/login =====
/**
 * User login
 * 
 * INTEGRATION POINT: Frontend Login Form
 * Frontend form submits username/password
 * Backend validates against database
 * Returns JWT token for subsequent requests
 * 
 * Request body:
 * {
 *   "email": "string",
 *   "password": "string"
 * }
 * 
 * Response: { success: true, token: "jwt_token", user: {...} }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // ===== INPUT VALIDATION =====
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }
    
    // ===== DATABASE OPERATION: SELECT =====
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }
    
    // Compare provided password with stored hash
    const passwordMatch = await user.comparePassword(password);
    
    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }
    
    // ===== GENERATE TOKEN & RESPONSE =====
    const token = generateToken(user.id, user.email);
    
    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      userId: user.id,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

module.exports = router;
