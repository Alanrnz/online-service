/**
 * Service Requests Routes
 * 
 * Handles CRUD operations for service requests using Sequelize
 * 
 * INTEGRATION POINT 2: Frontend-Backend Data Flow
 * Demonstrates:
 * - Frontend submits form → backend processes → database stores
 * - Frontend fetches list → backend queries database → returns data
 * - Frontend edits request → backend updates database → confirms update
 */

const express = require('express');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Models will be injected via middleware
let ServiceRequest;

// Middleware to set models
router.use((req, res, next) => {
  ServiceRequest = req.app.locals.ServiceRequest;
  next();
});

// ===== POST /api/requests =====
/**
 * Create a new service request
 * 
 * INTEGRATION POINT: Service Request Form Submission
 * Frontend sends form data via POST
 * Backend validates, saves to database, returns confirmation
 * 
 * Request body:
 * {
 *   "serviceType": "Repair",
 *   "description": "My device is not working",
 *   "priority": "High",
 *   "location": "123 Main St"
 * }
 * 
 * Response: { success: true, requestId: "...", status: "Pending" }
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { serviceType, description, priority, location } = req.body;
    const userId = req.userId; // From auth middleware
    
    // ===== INPUT VALIDATION =====
    if (!serviceType || !description) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['serviceType', 'description']
      });
    }
    
    // ===== DATABASE OPERATION: INSERT =====
    const serviceRequest = await ServiceRequest.create({
      userId: userId,
      serviceType: serviceType,
      description: description,
      priority: priority || 'Medium',
      location: location || null
    });
    
    // ===== RESPONSE =====
    res.status(201).json({
      success: true,
      message: 'Service request created successfully',
      data: {
        id: serviceRequest.id,
        userId: serviceRequest.userId,
        serviceType: serviceRequest.serviceType,
        description: serviceRequest.description,
        priority: serviceRequest.priority,
        status: serviceRequest.status,
        createdAt: serviceRequest.createdAt
      }
    });
    
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      error: 'Failed to create service request',
      message: error.message
    });
  }
});

// ===== GET /api/requests =====
/**
 * Fetch all service requests for logged-in user
 * 
 * INTEGRATION POINT: Dashboard Data Loading
 * Frontend calls this on page load to populate dashboard
 * Returns list of user's service requests
 * 
 * Response: { success: true, requests: [...] }
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    
    // ===== DATABASE OPERATION: SELECT =====
    const requests = await ServiceRequest.findAll({
      where: { userId: userId },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      message: `Retrieved ${requests.length} service requests`,
      data: requests.map(req => ({
        id: req.id,
        serviceType: req.serviceType,
        description: req.description,
        priority: req.priority,
        status: req.status,
        location: req.location,
        createdAt: req.createdAt,
        updatedAt: req.updatedAt
      }))
    });
    
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({
      error: 'Failed to fetch service requests',
      message: error.message
    });
  }
});

// ===== GET /api/requests/:id =====
/**
 * Fetch a single service request by ID
 * 
 * Returns detailed information about a specific request
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // ===== DATABASE OPERATION: SELECT BY ID =====
    // SQL Equivalent:
    // SELECT * FROM service_requests WHERE id = 456 AND userId = 123;
    const request = await ServiceRequest.findOne({
      where: {
        id: id,
        userId: req.userId
      }
    });
    
    if (!request) {
      return res.status(404).json({
        error: 'Service request not found',
        message: 'The requested service request does not exist or you do not have access'
      });
    }
    
    res.json({
      success: true,
      data: request
    });
    
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({
      error: 'Failed to fetch service request',
      message: error.message
    });
  }
});

// ===== PUT /api/requests/:id =====
/**
 * Update an existing service request
 * 
 * INTEGRATION POINT: Edit Request
 * Frontend sends updated data, backend updates database
 * 
 * Request body: { serviceType, description, priority, location }
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceType, description, priority, location } = req.body;
    
    // ===== DATABASE OPERATION: UPDATE =====
    const request = await ServiceRequest.findOne({
      where: {
        id: id,
        userId: req.userId
      }
    });
    
    if (!request) {
      return res.status(404).json({
        error: 'Service request not found',
        message: 'Cannot update a request that does not exist'
      });
    }
    
    // Update the request
    await request.update({
      serviceType,
      description,
      priority,
      location
    });
    
    res.json({
      success: true,
      message: 'Service request updated successfully',
      data: request
    });
    
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({
      error: 'Failed to update service request',
      message: error.message
    });
  }
});

// ===== DELETE /api/requests/:id =====
/**
 * Delete a service request
 * 
 * INTEGRATION POINT: Delete Request
 * Frontend sends delete request, backend removes from database
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // ===== DATABASE OPERATION: DELETE =====
    // SQL Equivalent: DELETE FROM requests WHERE id = ? AND userId = ?
    const request = await ServiceRequest.findOne({
      where: {
        id: id,
        userId: req.userId
      }
    });
    
    if (!request) {
      return res.status(404).json({
        error: 'Service request not found',
        message: 'Cannot delete a request that does not exist'
      });
    }

    await request.destroy();
    
    res.json({
      success: true,
      message: 'Service request deleted successfully',
      data: { deletedId: id }
    });
    
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({
      error: 'Failed to delete service request',
      message: error.message
    });
  }
});

module.exports = router;
