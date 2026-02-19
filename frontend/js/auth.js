/**
 * Authentication Module
 * 
 * Handles:
 * - User login/logout
 * - JWT token management
 * - Session persistence
 * - Form validation
 */

/**
 * Handle login form submission
 * 
 * INTEGRATION POINT 1: Login Flow
 * 1. User enters credentials in form
 * 2. JavaScript validates input
 * 3. Sends POST /api/auth/login to backend
 * 4. Backend validates against database
 * 5. Backend returns JWT token
 * 6. Frontend stores token in localStorage
 * 7. Frontend redirects to dashboard
 */

// Auto-attach to login form if it exists
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

/**
 * Handle login form submission
 * 
 * @param {Event} event - Form submit event
 */
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('errorMessage');
  
  errorMsg.style.display = 'none';
  
  try {
    // ===== STEP 1: FRONTEND VALIDATION =====
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // ===== STEP 2: SEND LOGIN REQUEST TO BACKEND =====
    // Flow: POST /api/auth/login → Backend validates → Returns JWT token
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    // ===== STEP 3: CHECK RESPONSE =====
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Login failed');
    }
    
    // ===== STEP 4: STORE TOKEN =====
    // Save JWT token to localStorage for authenticated requests
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('userEmail', data.user.email);
    localStorage.setItem('username', data.user.username);
    
    // ===== STEP 5: UPDATE WELCOME MESSAGE =====
    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg) {
      welcomeMsg.innerText = `Welcome, ${data.user.username}!`;
    }
    
    // ===== STEP 6: REDIRECT =====
    // Navigate to dashboard after successful login
    window.location.href = 'dashboard.html';
    
  } catch (error) {
    // ===== ERROR HANDLING =====
    console.error('Login error:', error);
    errorMsg.innerText = '❌ ' + error.message;
    errorMsg.style.display = 'block';
  }
}

/**
 * Handle user logout
 * 
 * Flow:
 * 1. Clear token from localStorage
 * 2. Clear user session data
 * 3. Redirect to login page
 */
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('username');
  
  // Redirect to login
  window.location.href = 'index.html';
}

/**
 * Check if user is authenticated
 * 
 * @returns {boolean} True if token exists in localStorage
 */
function isAuthenticated() {
  return !!localStorage.getItem('token');
}

/**
 * Get current user info from localStorage
 * 
 * @returns {Object} User object with id, email, username
 */
function getCurrentUser() {
  return {
    id: localStorage.getItem('userId'),
    email: localStorage.getItem('userEmail'),
    username: localStorage.getItem('username')
  };
}

/**
 * Validate email format
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * 
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, message: string }
 */
function validatePassword(password) {
  const checks = {
    length: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password)
  };
  
  const isValid = checks.length;
  const messages = [];
  
  if (!checks.length) messages.push('Password must be at least 6 characters');
  
  return {
    isValid,
    message: messages.join('; ') || 'Password is strong'
  };
}

/**
 * Require authentication check
 * Call this in pages that require logged-in user
 * Redirects to login if not authenticated
 * 
 * Usage: requireAuth(); at top of page script
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'index.html';
  }
}
