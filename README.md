# SmartServe Solutions - Full-Stack Integration Guide

## Project Overview

SmartServe Solutions is a complete **Online Service Management System** demonstrating full-stack integration between:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose ORM

---

## 🏗️ Project Structure

```
ONLINE SERVICE/
├── backend/
│   ├── models/
│   │   ├── User.js                 # User schema with password hashing
│   │   ├── ServiceRequest.js       # Service request schema
│   │   └── StatusTracking.js       # Status history schema
│   ├── routes/
│   │   ├── auth.js                 # Login/Register endpoints
│   │   ├── requests.js             # CRUD for service requests
│   │   └── status.js               # Status tracking endpoints
│   ├── middleware/
│   │   └── auth.js                 # JWT token verification
│   ├── server.js                   # Express server setup
│   ├── db.js                       # Database connection
│   └── package.json                # Dependencies
│
└── frontend/
    ├── index.html                  # Login page
    ├── register.html               # Registration page
    ├── dashboard.html              # Client dashboard
    ├── service-request.html        # Submit request form
    ├── css/
    │   └── styles.css              # Responsive styling
    └── js/
        ├── api.js                  # API communication functions
        └── auth.js                 # Authentication logic
```

---

## 📊 Database Schema

### 1. **Users Collection**
Stores user credentials and profile information.

```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

**SQL Equivalent:**
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. **ServiceRequests Collection**
Stores service requests submitted by users.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  serviceType: String (Maintenance, Repair, Installation, Support, Consultation),
  description: String,
  priority: String (Low, Medium, High, Urgent),
  location: String,
  status: String (Pending, Assigned, In Progress, On Hold, Completed, Cancelled),
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

**SQL Equivalent:**
```sql
CREATE TABLE service_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  serviceType VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'Medium',
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completedAt TIMESTAMP NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. **StatusTracking Collection**
Records the audit trail of status changes for each service request.

```javascript
{
  _id: ObjectId,
  requestId: ObjectId (reference to ServiceRequest),
  status: String,
  assignedTo: String,
  notes: String,
  timestamp: Date
}
```

**SQL Equivalent:**
```sql
CREATE TABLE status_tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  requestId INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  assignedTo VARCHAR(255),
  notes TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requestId) REFERENCES service_requests(id) ON DELETE CASCADE,
  INDEX idx_requestId (requestId)
);
```

---

## 🔄 Data Flow Diagrams

### 1. **Login Flow**
```
┌─────────────────┐
│  Login Form     │
│  (index.html)   │
└────────┬────────┘
         │ User enters email/password
         ↓
┌─────────────────────────────────────┐
│  JavaScript: handleLogin()           │
│  - Validate input                    │
│  - Call POST /api/auth/login         │
└────────┬────────────────────────────┘
         │ fetch() with JSON body
         ↓
┌─────────────────────────────────────┐
│  Backend: POST /api/auth/login       │
│  - Express route handler             │
│  - Query User in database            │
│  - Compare password hash             │
└────────┬────────────────────────────┘
         │ Database lookup
         ↓
┌─────────────────────────────────────┐
│  MongoDB: User Collection            │
│  - Find user by email                │
│  - Return user with hashed password  │
└────────┬────────────────────────────┘
         │ bcrypt.compare() validates
         ↓
┌─────────────────────────────────────┐
│  Backend: Generate JWT Token         │
│  - Create token with userId          │
│  - Token expires in 24 hours         │
└────────┬────────────────────────────┘
         │ Return JSON response
         ↓
┌─────────────────────────────────────┐
│  Frontend: Handle Response           │
│  - Store token in localStorage       │
│  - Redirect to dashboard.html        │
└─────────────────────────────────────┘
```

### 2. **Service Request Submission Flow**
```
┌──────────────────────────┐
│  Service Request Form    │
│  (service-request.html)  │
└──────────┬───────────────┘
           │ User fills form
           ↓
┌──────────────────────────────────┐
│  JavaScript: handleFormSubmit()   │
│  - Collect form data              │
│  - Client-side validation         │
└──────────┬───────────────────────┘
           │ POST /api/requests
           │ Headers: Authorization: Bearer <token>
           ↓
┌──────────────────────────────────┐
│  Backend: POST /api/requests      │
│  - Express route handler          │
│  - Middleware: verifyToken()      │
│  - Validate input                 │
└──────────┬───────────────────────┘
           │ Create ServiceRequest
           ↓
┌──────────────────────────────────┐
│  MongoDB: service_requests        │
│  INSERT INTO service_requests ... │
│  - Save new document              │
│  - Return with generated _id      │
└──────────┬───────────────────────┘
           │ Response: { success: true, data: {...} }
           ↓
┌──────────────────────────────────┐
│  Frontend: Handle Success         │
│  - Show confirmation message      │
│  - Redirect to dashboard          │
│  - List updated with new request  │
└──────────────────────────────────┘
```

### 3. **Dashboard Data Loading Flow**
```
┌────────────────┐
│  Dashboard     │
│  Page Loads    │
└────────┬───────┘
         │ DOMContentLoaded event
         ↓
┌──────────────────────────────────┐
│  JavaScript: loadServiceRequests()│
│  - Check authentication token     │
│  - Call GET /api/requests         │
└──────────┬───────────────────────┘
           │ Headers: Authorization: Bearer <token>
           ↓
┌──────────────────────────────────┐
│  Backend: GET /api/requests       │
│  - Middleware: verifyToken()      │
│  - Extract userId from token      │
│  - Query database                 │
└──────────┬───────────────────────┘
           │ db.find({ userId: ... })
           ↓
┌──────────────────────────────────┐
│  MongoDB: Query service_requests  │
│  - Filter by current user's ID    │
│  - Sort by creation date (newest) │
│  - Return array of requests       │
└──────────┬───────────────────────┘
           │ Response: { success: true, data: [...] }
           ↓
┌──────────────────────────────────┐
│  Frontend: Populate Table         │
│  - Iterate through requests       │
│  - Create table rows dynamically  │
│  - Display status badges          │
│  - Show action buttons (View, Edit, Delete)
└──────────────────────────────────┘
```

---

## 🔐 API Endpoints Reference

### **Authentication Routes** (`/api/auth`)

#### Register User
- **Endpoint**: `POST /api/auth/register`
- **Body**: 
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "phone": "+1-234-567-8900",
    "address": "123 Main St"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "507f1f77bcf86cd799439011",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
  ```

#### Login User
- **Endpoint**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**: Same as register (with token)

### **Service Request Routes** (`/api/requests`)

#### Create Request
- **Endpoint**: `POST /api/requests`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "serviceType": "Repair",
    "description": "My device is not working properly",
    "priority": "High",
    "location": "123 Main Street"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "507f1f77bcf86cd799439011",
      "serviceType": "Repair",
      "status": "Pending",
      "createdAt": "2026-02-04T10:30:00Z"
    }
  }
  ```

#### Get All User Requests
- **Endpoint**: `GET /api/requests`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      { "id": "...", "serviceType": "Repair", "status": "Pending", ... },
      { "id": "...", "serviceType": "Support", "status": "In Progress", ... }
    ]
  }
  ```

#### Update Request
- **Endpoint**: `PUT /api/requests/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "description": "Updated description",
    "priority": "Medium"
  }
  ```

#### Delete Request
- **Endpoint**: `DELETE /api/requests/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "success": true, "data": { "deletedId": "..." } }`

### **Status Tracking Routes** (`/api/status`)

#### Add Status Update
- **Endpoint**: `POST /api/status/track`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "requestId": "507f1f77bcf86cd799439011",
    "status": "In Progress",
    "assignedTo": "John Technician",
    "notes": "Started working on the issue"
  }
  ```

#### Get Status History
- **Endpoint**: `GET /api/status/history/:requestId`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "...",
        "status": "In Progress",
        "assignedTo": "John Technician",
        "timestamp": "2026-02-04T11:00:00Z"
      }
    ]
  }
  ```

---

## 🚀 Setup Instructions

### **Backend Setup**

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file** in backend directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/smartserve
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

   Or use MongoDB Atlas:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartserve
   ```

3. **Start MongoDB**
   - **Local MongoDB**: Ensure MongoDB service is running
   - **MongoDB Atlas**: Verify connection string in `.env`

4. **Start Backend Server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   Expected output:
   ```
   🚀 SmartServe Backend Server running on port 5000
   ✅ MongoDB Connected successfully
   ```

### **Frontend Setup**

1. **No installation required** - Pure HTML/CSS/JavaScript

2. **Open in Browser**
   - Option A: Open `frontend/index.html` directly in browser
   - Option B: Use Live Server extension in VS Code
   - Option C: Run simple HTTP server:
     ```bash
     cd frontend
     python -m http.server 3000
     # or
     npx http-server
     ```

3. **Configure API URL** (if backend is on different port)
   - Edit `frontend/js/api.js`
   - Change `API_BASE_URL` value

---

## 🔄 Integration Points Explained

### **Integration Point 1: Frontend Form Submission → Backend API**

**File**: `frontend/service-request.html` + `frontend/js/auth.js`

When user submits the login form:
```javascript
// Frontend collects data
const formData = {
  email: email_value,
  password: password_value
};

// Frontend sends to backend
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)  // ← Data goes HERE
});

// Frontend receives response
const data = await response.json();
localStorage.setItem('token', data.token);  // Store for auth requests
```

**Backend Route**: `backend/routes/auth.js`
```javascript
router.post('/login', async (req, res) => {
  // ← Receives the formData here
  const { email, password } = req.body;
  
  // Query database for user
  const user = await User.findOne({ email });
  
  // Validate password
  const passwordMatch = await user.comparePassword(password);
  
  // Return token
  res.json({ token: generateToken(...) });
});
```

### **Integration Point 2: Backend → Database (Mongoose)**

**File**: `backend/routes/requests.js`

```javascript
// Frontend sends service request
const serviceRequest = new ServiceRequest({
  userId: userId_from_token,
  serviceType: req.body.serviceType,
  description: req.body.description,
  priority: req.body.priority
});

// Save to MongoDB
await serviceRequest.save();  // ← INSERT operation

// Fetch user's requests
const requests = await ServiceRequest.find({ userId: userId })
  .sort({ createdAt: -1 });  // ← SELECT operation

// Update status
await ServiceRequest.findOneAndUpdate(
  { _id: id, userId: userId },
  { status: newStatus }  // ← UPDATE operation
);

// Delete request
await ServiceRequest.findOneAndDelete({ _id: id });  // ← DELETE operation
```

### **Integration Point 3: JWT Authentication**

**File**: `backend/middleware/auth.js`

Token flow:
```
1. User logs in → Backend generates JWT
   jwt.sign({ id: userId, email }, SECRET, { expiresIn: '24h' })
   
2. Frontend stores token
   localStorage.setItem('token', token)
   
3. Frontend includes token in requests
   headers: { 'Authorization': 'Bearer ' + token }
   
4. Backend verifies token on protected routes
   const decoded = jwt.verify(token, SECRET)
   req.userId = decoded.id  // ← Use in route handlers
   
5. If token expired, user redirected to login
```

---

## 📝 Example Database Queries

### **SQL Equivalent Queries**

**Insert User:**
```sql
INSERT INTO users (username, email, password, createdAt)
VALUES ('john_doe', 'john@example.com', 'hashed_password', NOW());
```

**Mongoose Equivalent:**
```javascript
const user = new User({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'plain_password'  // Hashed by pre-save middleware
});
await user.save();
```

**Select User Requests:**
```sql
SELECT sr.* FROM service_requests sr
WHERE sr.userId = 123
ORDER BY sr.createdAt DESC
LIMIT 10;
```

**Mongoose Equivalent:**
```javascript
const requests = await ServiceRequest.find({ userId: userId })
  .sort({ createdAt: -1 })
  .limit(10);
```

**Join: User with Requests:**
```sql
SELECT u.username, sr.*
FROM service_requests sr
JOIN users u ON sr.userId = u.id
WHERE sr.id = 456;
```

**Mongoose Equivalent:**
```javascript
const request = await ServiceRequest.findById(456)
  .populate('userId', 'username email');  // ← Join with user
```

**Update Status:**
```sql
UPDATE service_requests 
SET status = 'In Progress', updatedAt = NOW()
WHERE id = 456 AND userId = 123;
```

**Mongoose Equivalent:**
```javascript
await ServiceRequest.findOneAndUpdate(
  { _id: 456, userId: 123 },
  { status: 'In Progress', updatedAt: Date.now() },
  { new: true }
);
```

**Delete with Cascade:**
```sql
DELETE FROM status_tracking WHERE requestId = 456;
DELETE FROM service_requests WHERE id = 456;
```

**Mongoose Equivalent:**
```javascript
// Automatically cascades with: ON DELETE CASCADE
await ServiceRequest.findByIdAndDelete(456);
```

---

## 🧪 Testing the System

### **1. Test User Registration**
1. Go to `frontend/register.html`
2. Fill in: username, email, password, phone (optional), address (optional)
3. Click "Register"
4. Should redirect to dashboard

### **2. Test Service Request Creation**
1. Go to `frontend/service-request.html` (or click "New Request" on dashboard)
2. Select service type
3. Enter description
4. Set priority and location
5. Click "Submit Service Request"
6. Verify request appears in dashboard

### **3. Test Dashboard Display**
1. Go to dashboard
2. Should show all user's service requests in table
3. Try filtering by status
4. Click "View" to see detail page

### **4. Test API Directly**
Using curl or Postman:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Requests (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/requests \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB is running; check `MONGODB_URI` in `.env` |
| CORS error | Backend CORS is configured for `http://localhost:3000` - adjust if needed |
| Token expired | User will auto-redirect to login page |
| "Backend offline" message | Start backend with `npm start` on port 5000 |
| Form submission fails | Check browser console for error messages; verify backend is running |
| Requests not showing in dashboard | Check that user is logged in; verify token in localStorage |

---

## 📚 Additional Resources

- **Express.js**: https://expressjs.com/
- **Mongoose**: https://mongoosejs.com/
- **MongoDB**: https://www.mongodb.com/
- **JWT**: https://jwt.io/
- **Bcryptjs**: https://github.com/dcodeIO/bcrypt.js

---

## ✅ Deliverables Checklist

- ✅ Frontend: Login, Registration, Dashboard, Service Request Form
- ✅ Backend: Express server with organized routes
- ✅ Database: Mongoose models with relationships
- ✅ Authentication: JWT token management
- ✅ CRUD: Complete Create, Read, Update, Delete operations
- ✅ Integration: Full request-response flow documented
- ✅ Comments: Integration points clearly marked with `// INTEGRATION POINT`
- ✅ Error Handling: Try-catch blocks and validation
- ✅ Responsive Design: CSS for desktop and mobile
- ✅ Documentation: Complete setup and usage guide

---

**SmartServe Solutions © 2026**
