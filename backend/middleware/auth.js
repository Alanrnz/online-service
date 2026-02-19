/**
 * Authentication Middleware
 * 
 * Verifies JWT tokens from frontend requests
 * Protects routes that require authentication
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 * Attach this to protected routes
 * 
 * INTEGRATION POINT: Frontend-Backend Authentication Flow
 * 1. Frontend logs in via POST /api/auth/login
 * 2. Backend returns JWT token
 * 3. Frontend stores token in localStorage
 * 4. Frontend includes token in Authorization header for subsequent requests
 * 5. This middleware verifies the token on protected routes
 */
const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer token"
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Authentication required. Please log in.'
      });
    }
    
    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    
    // Attach user info to request for use in route handlers
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please log in again.'
      });
    }
    
    return res.status(403).json({ 
      error: 'Invalid token',
      message: 'Authentication failed. Please log in again.'
    });
  }
};

module.exports = { verifyToken };
