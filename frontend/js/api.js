/**
 * Frontend API Integration Module
 * 
 * INTEGRATION POINT: Frontend-to-Backend Communication
 * This module provides reusable functions for all API calls from frontend to backend
 * Handles:
 * - HTTP requests with JWT authentication
 * - Error handling and token refresh
 * - Response parsing
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generic API Request Handler
 * 
 * Handles all HTTP requests with:
 * - JWT token attachment from localStorage
 * - Error handling
 * - Response parsing
 * 
 * @param {string} endpoint - API endpoint (e.g., '/requests')
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Object>} Parsed response data
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add JWT token to Authorization header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // ===== HANDLE 401 UNAUTHORIZED =====
    // Token expired or invalid - redirect to login
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = 'index.html';
      throw new Error('Session expired. Please log in again.');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'API request failed');
    }
    
    return data;
    
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ===== SERVICE REQUEST API FUNCTIONS =====

/**
 * Fetch all service requests for current user
 * 
 * @returns {Promise<Array>} Array of service request objects
 */
async function fetchServiceRequests() {
  const data = await apiRequest('/requests', {
    method: 'GET'
  });
  return data.data || [];
}

/**
 * Fetch a single service request by ID
 * 
 * @param {string} requestId - ID of the request to fetch
 * @returns {Promise<Object>} Service request object
 */
async function fetchServiceRequestById(requestId) {
  const data = await apiRequest(`/requests/${requestId}`, {
    method: 'GET'
  });
  return data.data;
}

/**
 * Create a new service request
 * 
 * INTEGRATION POINT: Form Submission Flow
 * Frontend form → JavaScript function → POST to backend
 * Backend validates → saves to database → returns confirmation
 * 
 * @param {Object} requestData - Service request details
 *   {
 *     serviceType: string,
 *     description: string,
 *     priority: string,
 *     location: string (optional)
 *   }
 * @returns {Promise<Object>} Created request object with ID
 */
async function createServiceRequest(requestData) {
  const data = await apiRequest('/requests', {
    method: 'POST',
    body: JSON.stringify(requestData)
  });
  return data.data;
}

/**
 * Update an existing service request
 * 
 * @param {string} requestId - ID of the request to update
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated request object
 */
async function updateServiceRequest(requestId, updates) {
  const data = await apiRequest(`/requests/${requestId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
  return data.data;
}

/**
 * Delete a service request
 * 
 * @param {string} requestId - ID of the request to delete
 * @returns {Promise<Object>} Confirmation response
 */
async function deleteServiceRequest(requestId) {
  const data = await apiRequest(`/requests/${requestId}`, {
    method: 'DELETE'
  });
  return data;
}

// ===== STATUS TRACKING API FUNCTIONS =====

/**
 * Get status history for a service request
 * 
 * INTEGRATION POINT: Request Detail Page
 * Displays timeline of all status changes
 * Shows when status changed, by whom, and what notes were added
 * 
 * @param {string} requestId - ID of the service request
 * @returns {Promise<Array>} Array of status tracking records
 */
async function fetchStatusHistory(requestId) {
  const data = await apiRequest(`/status/history/${requestId}`, {
    method: 'GET'
  });
  return data.data || [];
}

/**
 * Get current status of a service request
 * 
 * @param {string} requestId - ID of the service request
 * @returns {Promise<Object>} Current status and last update info
 */
async function fetchCurrentStatus(requestId) {
  const data = await apiRequest(`/status/current/${requestId}`, {
    method: 'GET'
  });
  return data.data;
}

/**
 * Add a status update to a service request
 * 
 * @param {string} requestId - ID of the service request
 * @param {Object} statusUpdate - Status update details
 *   {
 *     status: string,
 *     assignedTo: string (optional),
 *     notes: string (optional)
 *   }
 * @returns {Promise<Object>} Created status tracking record
 */
async function updateRequestStatus(requestId, statusUpdate) {
  const data = await apiRequest('/status/track', {
    method: 'POST',
    body: JSON.stringify({
      requestId,
      ...statusUpdate
    })
  });
  return data.data;
}

// ===== AUTH API FUNCTIONS =====

/**
 * User login
 * 
 * INTEGRATION POINT: Login Form
 * Frontend form → POST /api/auth/login
 * Backend validates credentials → generates JWT
 * Frontend stores token for authenticated requests
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} { token: "...", user: {...} }
 */
async function loginUser(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return data;
}

/**
 * User registration
 * 
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} { token: "...", user: {...} }
 */
async function registerUser(userData) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  return data;
}

/**
 * Check backend connection health
 * Useful for verifying backend is running
 * 
 * @returns {Promise<Object>} Health status
 */
async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return await response.json();
}
