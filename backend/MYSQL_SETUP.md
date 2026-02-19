# MySQL Database Setup Guide

## Overview

This guide walks you through setting up MySQL for the SmartServe Solutions Online Service Management System.

## Prerequisites

- MySQL Server installed on your machine (version 5.7 or higher)
- MySQL Command Line Client or MySQL Workbench
- Administrator access to create databases and users

## Step 1: Install MySQL

### Windows
1. Download MySQL Community Server from: https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the root user
4. MySQL should default to listening on port 3306

### macOS
```bash
brew install mysql
mysql.server start
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

## Step 2: Create Database and User

### Option A: Using MySQL Command Line

1. **Open MySQL Command Line:**
   ```bash
   mysql -u root -p
   ```
   (Enter your root password when prompted)

2. **Create the database:**
   ```sql
   CREATE DATABASE smartserve;
   ```

3. **Create a database user:**
   ```sql
   CREATE USER 'smartserve_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   ```

4. **Grant permissions:**
   ```sql
   GRANT ALL PRIVILEGES ON smartserve.* TO 'smartserve_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. **Exit MySQL:**
   ```sql
   EXIT;
   ```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Create new schema named: `smartserve`
4. Go to Server → Users and Privileges
5. Create new user:
   - Login Name: `smartserve_user`
   - Host: `localhost`
   - Password: `your_secure_password`
6. Grant all privileges on `smartserve` database

## Step 3: Configure Backend

1. **Navigate to backend folder:**
   ```bash
   cd "c:\Users\Admin\Desktop\ONLINE SERVICE\backend"
   ```

2. **Create .env file** (copy from .env.example):
   ```bash
   copy .env.example .env
   ```

3. **Edit .env file** with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=smartserve_user
   DB_PASSWORD=your_secure_password
   DB_NAME=smartserve
   DB_PORT=3306
   JWT_SECRET=your_super_secret_jwt_key_change_this
   ```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Start the Backend Server

```bash
npm start
```

**Expected output:**
```
✅ MySQL Connected successfully
📊 Database: smartserve
📋 Database tables synced
🚀 SmartServe Backend Server running on port 5000
```

## Step 6: Verify Setup

### Check backend health:
```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "Backend is running",
  "timestamp": "2024-01-15T10:30:00Z",
  "message": "SmartServe Solutions System Online"
}
```

### Test user registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "phone": "555-1234",
    "address": "123 Main St"
  }'
```

## Troubleshooting

### MySQL Connection Error: "Error: connect ECONNREFUSED 127.0.0.1:3306"

**Solution:** MySQL is not running
```bash
# Windows
mysql.server start

# macOS
mysql.server start

# Linux
sudo systemctl start mysql
```

### Access Denied Error

1. Check your credentials in .env file match database user
2. Verify user has proper permissions:
   ```sql
   GRANT ALL PRIVILEGES ON smartserve.* TO 'smartserve_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Port Already in Use

If port 3306 is in use, update .env:
```
DB_PORT=3307
```

And start MySQL on that port (port configuration depends on your MySQL setup).

### Database Not Found

Create the database:
```sql
CREATE DATABASE smartserve;
```

## Database Tables

The following tables are automatically created when the server starts:

1. **Users** - User accounts and credentials
   - id, username, email, password, phone, address, role, createdAt, updatedAt

2. **ServiceRequests** - Service request tickets
   - id, userId, serviceType, description, priority, location, status, completedAt, createdAt, updatedAt

3. **StatusTrackings** - Status change history
   - id, requestId, status, assignedTo, notes, createdAt

## Testing the System

### 1. Register a new user:
```bash
POST /api/auth/register
Body: {
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "555-0123",
  "address": "456 Oak Ave"
}
```

### 2. Login:
```bash
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

Response includes JWT token - save for authenticated requests

### 3. Create a service request:
```bash
POST /api/requests
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "serviceType": "Repair",
  "description": "Need urgent repair for my equipment",
  "priority": "High",
  "location": "Downtown Office"
}
```

## Next Steps

1. Start the backend server with `npm start`
2. Open the frontend at `http://localhost:3000` (or serve the HTML files)
3. Test registration and login
4. Create service requests
5. View and manage requests in the dashboard

## Security Notes

- **NEVER commit .env file** to version control
- **Use strong passwords** for database users
- **Change JWT_SECRET** to a random string in production
- **Restrict database user permissions** - only grant necessary privileges
- **Enable MySQL SSL** connections in production
- **Regular backups** of the database

## Additional Resources

- MySQL Official Documentation: https://dev.mysql.com/doc/
- Sequelize Documentation: https://sequelize.org/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
