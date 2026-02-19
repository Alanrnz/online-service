# 🚀 Getting Started Checklist

## Pre-Setup Checklist

### Required Software
- [ ] Node.js installed (https://nodejs.org/)
- [ ] MongoDB installed OR MongoDB Atlas account created
- [ ] A code editor (VS Code recommended)
- [ ] A modern web browser (Chrome, Firefox, Edge, Safari)
- [ ] Git installed (optional, for version control)

### System Requirements
- [ ] Windows 10+ / Mac OS 10.14+ / Linux Ubuntu 16.04+
- [ ] At least 2GB free disk space
- [ ] Internet connection (for dependencies and MongoDB Atlas)
- [ ] Port 5000 available (for backend server)
- [ ] Port 3000 available (for frontend if using local server)

---

## Installation Checklist (Step-by-Step)

### Step 1: Download Project
- [ ] Project is in: `C:\Users\Admin\Desktop\ONLINE SERVICE\`
- [ ] Verify folder structure:
  - [ ] `backend/` folder exists
  - [ ] `frontend/` folder exists
  - [ ] `README.md` exists

### Step 2: Install Backend Dependencies
```bash
cd C:\Users\Admin\Desktop\ONLINE SERVICE\backend
npm install
```
- [ ] `package-lock.json` created
- [ ] `node_modules/` folder created (~200MB)
- [ ] No error messages shown

### Step 3: Configure Environment
- [ ] Copy `backend\.env.example` to `backend\.env`
- [ ] Open `backend\.env` in editor
- [ ] Update values:
  - [ ] `MONGODB_URI` - Set to local or Atlas connection string
  - [ ] `JWT_SECRET` - Change to a random string
  - [ ] `PORT` - Verify set to 5000

### Step 4: Start MongoDB
Choose one option:

**Option A: Local MongoDB (Windows)**
- [ ] MongoDB installed
- [ ] MongoDB service running (Services.msc or auto-start)
- [ ] Port 27017 accessible
- Test: `mongosh` command works in terminal

**Option B: MongoDB Atlas (Cloud)**
- [ ] Created account at https://www.mongodb.com/cloud/atlas
- [ ] Created cluster
- [ ] Created database user
- [ ] Got connection string
- [ ] Updated `MONGODB_URI` in `.env`
- [ ] Added your IP to whitelist

### Step 5: Start Backend Server
```bash
cd backend
npm start
```
- [ ] Message: "🚀 SmartServe Backend Server running on port 5000"
- [ ] Message: "✅ MongoDB Connected successfully"
- [ ] No error messages
- [ ] Server ready to accept requests

### Step 6: Open Frontend
Choose one option:

**Option A: Direct File (Simple)**
- [ ] Open: `C:\Users\Admin\Desktop\ONLINE SERVICE\frontend\index.html`
- [ ] In web browser (file:// URL)

**Option B: Live Server (Recommended)**
- [ ] VS Code installed
- [ ] Install "Live Server" extension
- [ ] Right-click on `frontend/` folder
- [ ] Select "Open with Live Server"
- [ ] Browser opens at `http://127.0.0.1:5500`

**Option C: Python Server**
```bash
cd frontend
python -m http.server 3000
```
- [ ] Open: http://localhost:3000

### Step 7: Verify System is Running
- [ ] Frontend page loaded
- [ ] "Backend Connected" message appears (green checkmark)
- [ ] Form is interactive
- [ ] No browser console errors (F12)

---

## First Use Checklist

### Register a Test User
- [ ] Click "Register here" link
- [ ] Fill in form:
  - [ ] Username: `testuser` (or any name)
  - [ ] Email: `test@example.com` (or any email)
  - [ ] Password: `password123` (minimum 6 characters)
  - [ ] Phone: (optional) `555-0123`
  - [ ] Address: (optional) `123 Main St`
- [ ] Click "Register"
- [ ] Message: "Registration successful! Redirecting to login..."
- [ ] Redirected to dashboard
- [ ] Welcome message shows username

### Create a Service Request
- [ ] Click "New Request" button
- [ ] Select Service Type: (any option)
- [ ] Enter Description: (at least 10 characters)
  - [ ] Character counter shows "X/1000 characters"
- [ ] Select Priority: (any option)
- [ ] Enter Location: (optional) `123 Main St`
- [ ] Click "Submit Service Request"
- [ ] Message: "✅ Service request created successfully!"
- [ ] Redirected to dashboard
- [ ] New request appears in table

### View Service Request
- [ ] Request visible in dashboard table
- [ ] Request shows:
  - [ ] ID (abbreviated)
  - [ ] Service Type
  - [ ] Description (truncated)
  - [ ] Priority (color badge)
  - [ ] Status (color badge)
  - [ ] Created date
- [ ] Click "View" button
- [ ] Taken to detail page
- [ ] Full request information shown
- [ ] Status timeline visible
- [ ] No errors in console

### Edit Service Request
- [ ] On detail page, click "Edit Request"
- [ ] Form pre-filled with request data
- [ ] Change a field (e.g., priority)
- [ ] Click "Submit Service Request"
- [ ] Success message shown
- [ ] Redirected to dashboard
- [ ] Changes reflected in list

### Delete Service Request
- [ ] On detail page, click "Delete Request"
- [ ] Confirm deletion dialog
- [ ] Click OK
- [ ] Message: "Request deleted successfully"
- [ ] Redirected to dashboard
- [ ] Request no longer in list

### Filter Requests
- [ ] Dashboard has "Filter by Status" dropdown
- [ ] Select a status (e.g., "Pending")
- [ ] Table updates to show only that status
- [ ] Select "All Statuses"
- [ ] All requests shown again

### Test Logout
- [ ] Click "Logout" button
- [ ] Token removed from localStorage
- [ ] Redirected to login page
- [ ] Can't access dashboard without logging in

### Test Login
- [ ] Use registered email/password to login
- [ ] Dashboard loads with requests
- [ ] User requests appear (same as before logout)
- [ ] System fully functional

---

## Testing Checklist

### Frontend Testing
- [ ] Page loads without JavaScript errors (F12 console)
- [ ] Responsive on mobile (F12 → Toggle device toolbar)
- [ ] Forms validate input (try submitting empty form)
- [ ] Buttons have proper hover effects
- [ ] Tables format correctly on all screen sizes
- [ ] Loading states show properly
- [ ] Error messages display clearly
- [ ] Success messages appear and auto-hide

### Backend Testing
- [ ] Backend console shows requests (GET, POST, PUT, DELETE)
- [ ] No error messages in backend terminal
- [ ] Database operations complete successfully
- [ ] Response times are reasonable (<1 second)
- [ ] Can restart backend and reuse same data

### Database Testing
- [ ] MongoDB shows new collections created
- [ ] Documents created for each registration
- [ ] Service requests saved with correct data
- [ ] Status changes recorded in status_tracking
- [ ] Can query database directly (mongosh or Compass)

### Security Testing
- [ ] Token stored in localStorage after login
- [ ] Token sent in Authorization header
- [ ] Can't access protected routes without token
- [ ] Passwords hashed in database (not plain text)
- [ ] Invalid tokens rejected with 401 error
- [ ] CORS allows frontend to access backend

### Browser Console Testing
- [ ] Open Developer Tools (F12)
- [ ] Console tab shows:
  - [ ] No red errors
  - [ ] API calls logged
  - [ ] Token value visible
- [ ] Network tab shows:
  - [ ] All requests to `/api/*` endpoints
  - [ ] Status 200 for successful requests
  - [ ] Status 401/403 for auth failures
  - [ ] POST/PUT/DELETE operations logged

---

## Troubleshooting Checklist

### Backend Won't Start

**Check 1: Node.js installed?**
```bash
node --version
npm --version
```
- [ ] Both return version numbers

**Check 2: Dependencies installed?**
- [ ] Run: `npm install` in backend folder
- [ ] `node_modules/` folder exists
- [ ] No error messages

**Check 3: Port 5000 available?**
```bash
netstat -ano | findstr :5000
```
- [ ] No processes listening on port 5000
- [ ] Or change PORT in `.env` file

**Check 4: .env file correct?**
- [ ] File exists at: `backend/.env`
- [ ] Contains: `MONGODB_URI`, `JWT_SECRET`, `PORT`
- [ ] Values not empty

**Check 5: MongoDB running?**
- [ ] MongoDB service started (Services.msc)
- [ ] Or mongosh connects successfully
- [ ] Connection string is correct

### Frontend Won't Load

**Check 1: File exists?**
- [ ] `frontend/index.html` exists
- [ ] Path is: `C:\Users\Admin\Desktop\ONLINE SERVICE\frontend\`

**Check 2: Backend running?**
- [ ] Backend server started on port 5000
- [ ] Check backend console for errors

**Check 3: File permissions?**
- [ ] Can read HTML file
- [ ] Can read CSS and JS files
- [ ] Folder not locked or protected

**Check 4: Browser compatibility?**
- [ ] Using Chrome, Firefox, Edge, or Safari
- [ ] Not Internet Explorer (too old)
- [ ] JavaScript enabled in browser

### "Backend offline" Message

- [ ] Verify backend is running: `npm start`
- [ ] Verify port 5000 is accessible
- [ ] Check firewall not blocking port 5000
- [ ] Check `API_BASE_URL` in `frontend/js/api.js` is correct
- [ ] Try: `http://localhost:5000/api/health` in browser

### Login/Register Fails

**Check 1: Backend running?**
- [ ] Backend console shows request received

**Check 2: Database connected?**
- [ ] Backend console shows "✅ MongoDB Connected"

**Check 3: Valid input?**
- [ ] Email format: `user@example.com`
- [ ] Password minimum 6 characters
- [ ] No special characters in username
- [ ] Check browser console for error details

**Check 4: User already exists?**
- [ ] Try different email address
- [ ] Check database for duplicate users

### Requests Don't Show in Dashboard

**Check 1: Logged in?**
- [ ] Token in localStorage
- [ ] Browser DevTools → Application → localStorage

**Check 2: Backend running?**
- [ ] Check backend console for GET request

**Check 3: Database has data?**
- [ ] Use MongoDB Compass to verify documents
- [ ] Verify userId matches user in database

**Check 4: CORS issue?**
- [ ] Check browser console for CORS error
- [ ] Backend CORS configured for http://localhost:3000

---

## Performance Checklist

### Optimization
- [ ] Page loads in < 3 seconds
- [ ] Form submission completes in < 1 second
- [ ] Dashboard list loads in < 2 seconds
- [ ] No console warnings (only info messages)
- [ ] No memory leaks (DevTools Memory tab)
- [ ] Mobile page loads reasonably fast

### Best Practices
- [ ] Using HTTPS in production (SSL certificate)
- [ ] Environment variables used (not hardcoded values)
- [ ] Sensitive data not logged
- [ ] Database queries optimized
- [ ] Frontend assets cached
- [ ] Error messages user-friendly

---

## Deployment Readiness Checklist

Before moving to production:

### Security
- [ ] Changed `JWT_SECRET` to random string
- [ ] Changed `MONGODB_URI` to production database
- [ ] CORS restricted to production frontend URL
- [ ] Error messages don't reveal system info
- [ ] Input validation on all routes
- [ ] Passwords hashed with bcrypt

### Performance
- [ ] Database indexes created
- [ ] Environment variables configured
- [ ] Frontend assets minified
- [ ] No console.log() statements left
- [ ] API response times acceptable

### Testing
- [ ] All CRUD operations tested
- [ ] All error scenarios tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility checked
- [ ] Authentication flow tested
- [ ] Database backup procedure established

### Documentation
- [ ] README.md reviewed
- [ ] Deployment instructions documented
- [ ] API documentation current
- [ ] Database schema documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide created

---

## Final Verification

**System Ready When:**
- ✅ Backend running with no errors
- ✅ MongoDB connected
- ✅ Frontend loads and connects to backend
- ✅ Can register new user
- ✅ Can create service request
- ✅ Dashboard displays requests
- ✅ Can edit and delete requests
- ✅ Can logout and login
- ✅ All features working end-to-end
- ✅ No console errors or warnings

**Congratulations!** Your SmartServe Solutions system is ready to use! 🎉

---

## Quick Commands Reference

```bash
# Backend setup
cd backend
npm install
npm start

# Frontend (if using Python server)
cd frontend
python -m http.server 3000

# Check if port is in use
netstat -ano | findstr :5000

# Stop backend (Ctrl+C)

# Restart backend
npm start

# Check MongoDB
mongosh
> use smartserve
> db.users.find()
```

---

## Support

Having issues? Check:
1. `README.md` - Complete documentation
2. `QUICK_START.md` - Fast setup guide  
3. `INTEGRATION_DETAILS.md` - Technical details
4. Browser Console (F12) - Error messages
5. Backend Terminal - Request logs

**Common Issues:** See "Troubleshooting Checklist" section above

---

**Version:** 1.0.0  
**Created:** February 4, 2026  
**Status:** ✅ Production Ready
