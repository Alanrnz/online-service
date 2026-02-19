/**
 * INTEGRATION SUMMARY DOCUMENT
 * 
 * Shows how Frontend, Backend, and Database are connected
 * Demonstrates complete request-response flow
 */

// ===== SYSTEM ARCHITECTURE =====
/*

┌─────────────────────────────────────────────────────────────────────┐
│                    SMARTSERVE SOLUTIONS ARCHITECTURE                │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐        ┌──────────────────────┐        ┌─────────────────┐
│     FRONTEND         │        │     BACKEND          │        │   DATABASE      │
│   (HTML/CSS/JS)      │  HTTP  │  (Express.js/Node)   │ Query  │  (MongoDB)      │
│                      │◄──────►│                      │◄──────►│                 │
├──────────────────────┤        ├──────────────────────┤        ├─────────────────┤
│ • Login Page         │        │ • Route Handlers     │        │ • Users         │
│ • Dashboard          │ JSON   │ • Authentication     │        │ • Requests      │
│ • Forms              │ Fetch  │ • Validation         │ CRUD   │ • Status        │
│ • localStorage       │        │ • Database Queries   │        │                 │
│   (Token Storage)    │        │ • Error Handling     │        │                 │
└──────────────────────┘        └──────────────────────┘        └─────────────────┘

FLOW:
1. User fills form → JavaScript collects data
2. JavaScript sends fetch() POST request → Backend receives JSON
3. Backend validates input → Queries database
4. Database returns result → Backend sends response
5. Frontend receives JSON → Displays data on page


// ===== DETAILED INTEGRATION POINTS =====

INTEGRATION POINT 1: USER AUTHENTICATION
─────────────────────────────────────────

Frontend (index.html):
├─ User enters email/password in form
└─ Submits form → handleLogin() in auth.js

JavaScript (js/auth.js):
├─ Validates input
└─ fetch('POST /api/auth/login', { email, password })

Backend (routes/auth.js):
├─ POST /api/auth/login route
├─ Receives { email, password } in req.body
├─ Queries MongoDB: User.findOne({ email })
├─ Compares password using bcrypt
└─ Returns JWT token

Frontend (js/auth.js):
├─ Receives { token, user }
├─ Saves token to localStorage
└─ Redirects to dashboard.html


INTEGRATION POINT 2: SERVICE REQUEST SUBMISSION
─────────────────────────────────────────────────

Frontend (service-request.html):
├─ User fills service type, description, priority
└─ Submits form → JavaScript handler

JavaScript (Inline in service-request.html):
├─ Collects { serviceType, description, priority, location }
├─ Gets JWT token from localStorage
└─ fetch('POST /api/requests', {
     headers: { Authorization: 'Bearer ' + token },
     body: JSON.stringify(data)
   })

Backend (routes/requests.js):
├─ POST /api/requests route
├─ Middleware: verifyToken() checks Authorization header
├─ Creates new ServiceRequest document:
│  ├─ userId (extracted from token)
│  ├─ serviceType
│  ├─ description
│  ├─ priority
│  └─ location
├─ Calls serviceRequest.save()
└─ Returns { success: true, data: {...} }

Database (MongoDB):
├─ ServiceRequest collection
└─ Document inserted with:
   ├─ _id (auto-generated)
   ├─ userId (reference to User)
   ├─ fields as provided
   └─ timestamps

Frontend (Inline in service-request.html):
├─ Receives success response
├─ Shows confirmation message
└─ Redirects to dashboard.html


INTEGRATION POINT 3: LOAD & DISPLAY DASHBOARD
────────────────────────────────────────────────

Frontend (dashboard.html):
├─ Page loads
└─ DOMContentLoaded → loadServiceRequests()

JavaScript (Inline in dashboard.html):
├─ Gets JWT token from localStorage
├─ fetch('GET /api/requests', {
│    headers: { Authorization: 'Bearer ' + token }
│  })
└─ Receives array of requests

Backend (routes/requests.js):
├─ GET /api/requests route
├─ Middleware: verifyToken() extracts userId
├─ Queries MongoDB:
│  └─ ServiceRequest.find({ userId: req.userId })
│     .sort({ createdAt: -1 })
├─ Returns array of request objects
└─ Response: { success: true, data: [...] }

Frontend (JavaScript):
├─ Receives response with requests array
├─ Loops through requests
├─ Creates table rows dynamically
├─ Attaches event listeners to action buttons
└─ Displays complete dashboard


INTEGRATION POINT 4: UPDATE/DELETE OPERATIONS
──────────────────────────────────────────────

Update Request:
Frontend → fetch('PUT /api/requests/:id', { updated_fields })
Backend → ServiceRequest.findOneAndUpdate()
Database → Update document
Response → Updated document returned

Delete Request:
Frontend → fetch('DELETE /api/requests/:id')
Backend → ServiceRequest.findOneAndDelete()
Database → Remove document
Response → Confirmation returned


// ===== DATA TRANSFORMATION FLOW =====

FORM INPUT → JSON → HTTP REQUEST → BACKEND VALIDATION → 
DATABASE INSERT → DATABASE RESPONSE → BACKEND RESPONSE (JSON) → 
FRONTEND PARSING → DISPLAY UPDATE


// ===== SECURITY LAYERS =====

1. Frontend:
   ├─ Client-side input validation
   ├─ Token stored in localStorage
   └─ Token sent in Authorization header

2. Backend:
   ├─ JWT verification middleware (verifyToken)
   ├─ Input validation on every route
   ├─ Error handling with try-catch
   ├─ Password hashing with bcrypt (10 salt rounds)
   └─ CORS enabled for trusted origins

3. Database:
   ├─ Schema validation in Mongoose
   ├─ Required field enforcement
   ├─ Unique constraints (email, username)
   └─ Foreign key relationships


// ===== API RESPONSE FLOW =====

Success Response (201 Created):
{
  "success": true,
  "message": "Service request created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "serviceType": "Repair",
    "status": "Pending",
    "createdAt": "2026-02-04T10:30:00Z"
  }
}
↓ (Frontend receives)
Frontend updates UI with data
Shows success message
Redirects or refreshes display


Error Response (400/401/500):
{
  "error": "Missing required fields",
  "message": "Service type and description are required"
}
↓ (Frontend receives)
Frontend catches error
Displays error message to user
Keeps form filled for correction


// ===== AUTHENTICATION FLOW DETAILED =====

USER LOGIN:
1. User enters email/password
2. Frontend validation (email format, password length)
3. POST /api/auth/login with credentials
4. Backend finds user by email
5. Backend calls bcrypt.compare(enteredPassword, storedHash)
6. If match: Generate JWT with { userId, email, expiresIn: '24h' }
7. Return token to frontend
8. Frontend saves token in localStorage
9. Frontend includes token in Authorization header for future requests

REQUEST WITH AUTHENTICATION:
1. Frontend retrieves token: localStorage.getItem('token')
2. Sends fetch with header: { Authorization: 'Bearer ' + token }
3. Backend middleware (verifyToken) receives request
4. Extracts token from Authorization header
5. Calls jwt.verify(token, SECRET)
6. If valid: Extracts userId, attaches to req object
7. Route handler uses req.userId for database queries
8. If invalid/expired: Return 401 Unauthorized
9. Frontend detects 401, clears token, redirects to login


// ===== DATABASE RELATIONSHIP DIAGRAM =====

Users (1) ───────────────────────┐
                                 │
                      (Many) ServiceRequests
                                 │
                                 ├─ userId: Reference to User
                                 │
                      (Many) StatusTracking
                                 │
                      ├─ requestId: Reference to ServiceRequest
                      │
                      └─ Records when status changes


// ===== ERROR HANDLING FLOW =====

Frontend Form Submission:
try {
  send request
  catch parsing errors → show message
} catch API errors → show error response
  catch network errors → show connection error

Backend Route Handler:
try {
  validate input → throw Error if invalid
  query database → throw Error if fails
  return success response
} catch error → return 500 with error message

Frontend Response Handler:
if response.status === 401 → redirect to login
if response.status === 400 → show validation error
if response.status === 500 → show server error
if response.ok → process success


// ===== MONGOOSE OPERATIONS MAPPING =====

CREATE:
Frontend sends data
Backend: new ServiceRequest({ ... }).save()
SQL Equivalent: INSERT INTO service_requests ...

READ:
Frontend requests data
Backend: ServiceRequest.find({ userId })
SQL Equivalent: SELECT * FROM service_requests WHERE userId = ?

UPDATE:
Frontend sends updated fields
Backend: ServiceRequest.findOneAndUpdate({ _id }, { updates })
SQL Equivalent: UPDATE service_requests SET ... WHERE id = ?

DELETE:
Frontend requests deletion
Backend: ServiceRequest.findOneAndDelete({ _id })
SQL Equivalent: DELETE FROM service_requests WHERE id = ?


// ===== COMPLETE REQUEST-RESPONSE EXAMPLE =====

SCENARIO: User creates a service request

=== REQUEST ===
HTTP POST /api/requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "serviceType": "Repair",
  "description": "Device screen is cracked",
  "priority": "High",
  "location": "123 Main Street"
}

=== BACKEND PROCESSING ===
1. Route: POST /api/requests matched
2. Middleware: verifyToken() ✓ Valid token
3. Extract userId from token: "507f1f77bcf86cd799439011"
4. Validate input:
   - serviceType: "Repair" ✓
   - description: "Device screen is cracked" ✓
5. Create Mongoose document:
   ServiceRequest {
     userId: "507f1f77bcf86cd799439011",
     serviceType: "Repair",
     description: "Device screen is cracked",
     priority: "High",
     location: "123 Main Street",
     status: "Pending"  (default)
   }
6. Save to MongoDB: ✓ Inserted
7. Return response

=== RESPONSE ===
HTTP 201 Created
{
  "success": true,
  "message": "Service request created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "serviceType": "Repair",
    "description": "Device screen is cracked",
    "priority": "High",
    "location": "123 Main Street",
    "status": "Pending",
    "createdAt": "2026-02-04T10:30:45.123Z"
  }
}

=== FRONTEND HANDLING ===
1. Receive response
2. Parse JSON
3. Check response.ok (201 is ok)
4. Extract data.id
5. Show success message
6. Wait 2 seconds
7. Redirect to dashboard
8. Dashboard reloads requests, shows the new one


// ===== TOKEN REFRESH SCENARIO =====

Scenario: User's 24-hour token expires while using app

1. User is on dashboard
2. Token expires (24 hours passed)
3. User clicks "View Request"
4. Frontend sends: GET /api/requests/:id with expired token
5. Backend: jwt.verify() throws TokenExpiredError
6. Backend returns: 401 Unauthorized
7. Frontend catches 401:
   localStorage.removeItem('token')
   Redirect to index.html (login page)
8. User must login again to get fresh token


// ===== CSRF & CORS PROTECTION =====

CORS Configuration in server.js:
app.use(cors({
  origin: 'http://localhost:3000',  // Only allow requests from frontend
  credentials: true
}));

Why? Prevents malicious sites from making requests to our API

Example blocked request:
Evil site (attacker.com) tries to:
POST http://localhost:5000/api/requests
Origin: attacker.com
→ BLOCKED by CORS policy


// ===== PRACTICAL INTEGRATION EXAMPLE =====

File: service-request.html
<form id="serviceRequestForm">
  <input type="text" id="description" />
  <button type="submit">Submit</button>
</form>

<script>
  document.getElementById('serviceRequestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // STEP 1: Collect data from form
    const formData = {
      serviceType: document.getElementById('serviceType').value,
      description: document.getElementById('description').value
    };
    
    // STEP 2: Send to backend
    const response = await fetch('http://localhost:5000/api/requests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    // STEP 3: Handle response
    const data = await response.json();
    if (response.ok) {
      alert('Request created! ID: ' + data.data.id);
      window.location.href = 'dashboard.html';
    } else {
      alert('Error: ' + data.error);
    }
  });
</script>

Backend (routes/requests.js):
router.post('/', verifyToken, async (req, res) => {
  // STEP 1: Middleware verifies token, extracts userId
  // req.userId now available
  
  // STEP 2: Create document
  const request = new ServiceRequest({
    userId: req.userId,
    serviceType: req.body.serviceType,
    description: req.body.description
  });
  
  // STEP 3: Save to database
  await request.save();
  
  // STEP 4: Send response back
  res.status(201).json({
    success: true,
    data: request
  });
});

Result: User's request appears in dashboard within seconds!
*/

// ===== QUICK INTEGRATION CHECKLIST =====
/*
Frontend ✓
□ HTML pages created (login, register, dashboard, forms)
□ JavaScript logic for form handling
□ fetch() calls to backend API
□ Token management (localStorage)
□ Error handling and display
□ Responsive CSS styling

Backend ✓
□ Express server running on port 5000
□ Database connection configured
□ Models defined (User, ServiceRequest, StatusTracking)
□ Routes created (auth, requests, status)
□ Authentication middleware (JWT verification)
□ Input validation on all routes
□ Error handling in all functions
□ CORS enabled for frontend origin

Database ✓
□ MongoDB running locally or Atlas
□ Users collection with proper schema
□ ServiceRequests collection with userId reference
□ StatusTracking collection with requestId reference
□ Indexes for performance

Integration ✓
□ Frontend sends requests to backend API
□ Backend queries MongoDB
□ Database returns data
□ Backend processes and returns response
□ Frontend receives and displays data
□ All CRUD operations working
□ Authentication flow working
□ Error handling on both sides
*/
