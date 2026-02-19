# SmartServe Solutions - Quick Start Guide

## 📦 What's Included

This complete full-stack system includes:
- **Frontend**: HTML/CSS/JavaScript pages with responsive design
- **Backend**: Node.js/Express API server with authentication
- **Database**: MongoDB Mongoose models with relationships
- **Documentation**: Complete setup and integration guides

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Node.js
Download from https://nodejs.org/ (LTS version)

### Step 2: Set Up Backend

```bash
cd backend
npm install
```

Create `.env` file in `backend` folder:
```
MONGODB_URI=mongodb://localhost:27017/smartserve
JWT_SECRET=your-secret-key-here
PORT=5000
```

### Step 3: Install & Start MongoDB

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer with default settings
3. MongoDB auto-starts as service

**Or use MongoDB Atlas (Cloud):**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `.env`

### Step 4: Start Backend Server

```bash
cd backend
npm start
```

Expected output:
```
🚀 SmartServe Backend Server running on port 5000
✅ MongoDB Connected successfully
```

### Step 5: Open Frontend

Open `frontend/index.html` in your browser (or use Live Server extension)

---

## 🎯 Test the System

### Register a New User
1. Click "Register here" link
2. Fill in form: username, email, password
3. Click "Register"
4. Auto-redirects to dashboard

### Create a Service Request
1. Click "New Request" button
2. Select service type, enter description
3. Click "Submit Service Request"
4. View in dashboard list

### View Your Requests
1. Dashboard shows all your service requests
2. Click "View" to see full details
3. Click "Edit" to modify request
4. Click "Delete" to remove request

---

## 📁 File Structure Quick Reference

| Folder | Purpose |
|--------|---------|
| `backend/models` | Database schemas (User, ServiceRequest, StatusTracking) |
| `backend/routes` | API endpoints (auth, requests, status) |
| `backend/middleware` | Authentication verification |
| `frontend` | HTML pages (login, dashboard, forms) |
| `frontend/js` | JavaScript logic (API calls, authentication) |
| `frontend/css` | Styling (responsive design) |

---

## 🔑 Key Features

✅ **User Authentication**
- Secure password hashing with bcrypt
- JWT token-based authentication
- Session management with localStorage

✅ **Service Request Management**
- Create, read, update, delete requests
- Priority and status tracking
- Location tracking

✅ **Real-time Status Updates**
- Status history timeline
- Audit trail of changes
- Assignment tracking

✅ **Responsive Design**
- Works on desktop, tablet, mobile
- Professional UI with CSS styling
- Loading states and error handling

✅ **Security**
- Password validation and hashing
- CORS enabled for safe cross-origin requests
- JWT token verification on protected routes
- Input validation on frontend and backend

---

## 🐛 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Backend won't start | Ensure MongoDB is running and `.env` has correct `MONGODB_URI` |
| "Cannot find module" error | Run `npm install` in backend folder |
| CORS error in browser | Frontend is trying to reach wrong backend URL - check API_BASE_URL in `frontend/js/api.js` |
| Login fails | Check that backend is running on port 5000 |
| Form won't submit | Open browser console (F12) to see error messages |

---

## 📚 File Descriptions

### Backend Files

**`server.js`** - Main Express server
- Sets up routes and middleware
- Enables CORS for frontend communication
- Starts HTTP server on port 5000

**`db.js`** - Database connection
- Connects to MongoDB using Mongoose
- Creates database if not exists
- Handles connection errors

**`models/User.js`** - User schema
- username, email, password (hashed)
- Password hashing with bcrypt
- Methods for password comparison

**`models/ServiceRequest.js`** - Service request schema
- Links to User via foreign key
- Stores service type, description, priority, status
- Tracks creation and completion dates

**`models/StatusTracking.js`** - Status history schema
- Records each status change
- Stores who made the change and notes
- Timestamps for audit trail

**`routes/auth.js`** - Login/Register endpoints
- POST /api/auth/login - User login
- POST /api/auth/register - User registration
- Returns JWT token for authentication

**`routes/requests.js`** - Service request CRUD
- POST /api/requests - Create request
- GET /api/requests - List user's requests
- PUT /api/requests/:id - Update request
- DELETE /api/requests/:id - Delete request

**`routes/status.js`** - Status tracking endpoints
- POST /api/status/track - Add status update
- GET /api/status/history/:id - Get status history
- GET /api/status/current/:id - Get current status

**`middleware/auth.js`** - JWT verification
- Validates tokens on protected routes
- Extracts user ID from token
- Redirects to login if token invalid

### Frontend Files

**`index.html`** - Login page
- Email/password form
- Backend connection check
- Register link

**`register.html`** - User registration
- Complete user info form
- Optional phone and address
- Auto-login after registration

**`dashboard.html`** - Service request list
- Shows all user's requests in table
- Filter by status
- Action buttons: View, Edit, Delete
- Create new request button

**`service-request.html`** - Submit new request
- Service type dropdown
- Description textarea with character counter
- Priority selector
- Location input

**`request-detail.html`** - Request details
- Full request information
- Status timeline visualization
- Edit and delete buttons
- Complete status history

**`js/api.js`** - API communication module
- Generic apiRequest() function
- Service request functions (create, read, update, delete)
- Status tracking functions
- Authentication functions

**`js/auth.js`** - Authentication logic
- Login form handler
- Token management
- Session persistence
- User validation

**`css/styles.css`** - Responsive styling
- Modern professional design
- Mobile-friendly layout
- Color scheme and typography
- Responsive breakpoints for all devices

---

## 🚀 API Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Create Request (requires Bearer token)
```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "serviceType":"Repair",
    "description":"Device not working",
    "priority":"High",
    "location":"123 Main St"
  }'
```

### Get All Requests
```bash
curl -X GET http://localhost:5000/api/requests \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 💡 Next Steps to Extend

1. **Add Email Notifications** - Send emails when status changes
2. **Add Admin Dashboard** - View all requests, not just user's own
3. **Add Photo Upload** - Attach images to service requests
4. **Add Messaging** - Chat between user and technician
5. **Add Rating System** - Rate completed requests
6. **Add Payment Integration** - Process payments for services
7. **Add Real-time Updates** - Use Socket.io for live status updates
8. **Add Mobile App** - React Native or Flutter app for mobile

---

## 📞 Support

- **MongoDB Issues**: Check MongoDB docs at https://docs.mongodb.com/
- **Express Issues**: Check docs at https://expressjs.com/
- **JWT Issues**: Verify token format at https://jwt.io/
- **Browser Console**: Press F12 to see detailed error messages

---

**Happy coding! 🎉**
