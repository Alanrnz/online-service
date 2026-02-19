/**
 * Database Connection Setup
 * 
 * INTEGRATION POINT: Database Layer
 * This file connects the backend to MySQL using Sequelize ORM
 */

const { Sequelize } = require('sequelize');

// ===== MySQL CONNECTION =====
console.log('📝 Database Config:');
console.log('  Host:', process.env.DB_HOST || 'localhost');
console.log('  User:', process.env.DB_USER || 'root');
console.log('  Database:', process.env.DB_NAME || 'smartserve');
console.log('  Password provided:', !!process.env.DB_PASSWORD);

const sequelize = new Sequelize(
  process.env.DB_NAME || 'smartserve',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected successfully');
    console.log(`📊 Database: ${process.env.DB_NAME}`);
    
    // Sync models with database (creates tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('📋 Database tables synced');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

// ===== DATABASE SCHEMA DESIGN =====
// Tables/Collections and their relationships:
//
// 1. USERS Collection
//    Fields: id, username, email, password (hashed), phone, address, createdAt
//    Purpose: Store user login credentials and profile info
//
// 2. SERVICE_REQUESTS Collection
//    Fields: id, userId (foreign key), serviceType, description, priority, 
//            createdAt, updatedAt
//    Purpose: Store service requests submitted by users
//    Relationship: Many-to-One with Users (each user can have multiple requests)
//
// 3. STATUS_TRACKING Collection
//    Fields: id, requestId (foreign key), status, timestamp, notes
//    Purpose: Track status updates for each service request
//    Status flow: Pending → In Progress → Completed
//    Relationship: One-to-Many with ServiceRequests (each request has multiple status updates)
//
// ===== SQL QUERIES EQUIVALENT =====
// 
// Create User:
// INSERT INTO users (username, email, password) VALUES ('john', 'john@example.com', 'hashed_pwd');
//
// Get User Services:
// SELECT sr.* FROM service_requests sr
// INNER JOIN users u ON sr.userId = u.id
// WHERE u.id = 123;
//
// Update Request Status:
// UPDATE service_requests SET status = 'In Progress' WHERE id = 456;
//
// Get Status History:
// SELECT * FROM status_tracking WHERE requestId = 456 ORDER BY timestamp DESC;
