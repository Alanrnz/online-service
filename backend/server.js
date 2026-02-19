/**
 * SmartServe Solutions - Express Server Setup
 * 
 * INTEGRATION POINT 1: Frontend-to-Backend Communication
 * This server exposes RESTful API endpoints that the frontend calls via fetch()
 * 
 * DATA FLOW:
 * 1. Frontend submits form (JavaScript fetch) → POST /api/requests
 * 2. Server receives request, validates input
 * 3. Server connects to database (MySQL with Sequelize) and saves data
 * 4. Database confirms save, returns response
 * 5. Frontend receives response and updates dashboard
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection and models
const { connectDB, sequelize } = require('./db');

// Import model factories
const User = require('./models/User');
const ServiceRequest = require('./models/ServiceRequest');
const StatusTracking = require('./models/StatusTracking');

// Import routes
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const statusRoutes = require('./routes/status');

const app = express();

// ===== INITIALIZE SEQUELIZE MODELS =====
const models = {
  User: User(sequelize),
  ServiceRequest: ServiceRequest(sequelize),
  StatusTracking: StatusTracking(sequelize)
};

// Store models in app.locals for route access
app.locals.User = models.User;
app.locals.ServiceRequest = models.ServiceRequest;
app.locals.StatusTracking = models.StatusTracking;

// Setup associations
models.ServiceRequest.belongsTo(models.User, { foreignKey: 'userId' });
models.User.hasMany(models.ServiceRequest, { foreignKey: 'userId' });

models.StatusTracking.belongsTo(models.ServiceRequest, { foreignKey: 'requestId' });
models.ServiceRequest.hasMany(models.StatusTracking, { foreignKey: 'requestId' });

// ===== MIDDLEWARE =====
// Enable CORS (allows frontend to call backend from different origin)
// Allow requests from the frontend and common dev servers (Live Server)
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // reflect the origin for development convenience (falls back to whitelist)
    return callback(null, origin);
  },
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// ===== DATABASE CONNECTION & SYNC =====
// Connect to MySQL and sync models before starting server
connectDB();

// ===== API ROUTES =====
// INTEGRATION POINT 2: Route Organization
// These routes handle specific business logic for:
// - Authentication (login/register)
// - Service requests (CRUD operations)
// - Status tracking

app.use('/api/auth', authRoutes);      // POST /api/auth/login, /api/auth/register
app.use('/api/requests', requestRoutes); // GET, POST, PUT, DELETE service requests
app.use('/api/status', statusRoutes);    // GET, UPDATE service request status

// ===== HEALTH CHECK ENDPOINT =====
// Frontend can call this to verify backend is running
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running',
    timestamp: new Date().toISOString(),
    message: 'SmartServe Solutions System Online'
  });
});

// ===== ERROR HANDLING =====
// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SmartServe Backend Server running on port ${PORT}`);
  console.log(`📍 Frontend should connect to: http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for: http://localhost:3000`);
});
