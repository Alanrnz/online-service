/**
 * Status Tracking Routes
 * 
 * Handles status updates and tracking for service requests using Sequelize
 * 
 * INTEGRATION POINT 3: Real-time Status Updates
 * Tracks the progression of service requests:
 * Pending → Assigned → In Progress → Completed/Cancelled
 */

const express = require('express');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Models will be injected via middleware
let StatusTracking, ServiceRequest;

// Middleware to set models
router.use((req, res, next) => {
  StatusTracking = req.app.locals.StatusTracking;
  ServiceRequest = req.app.locals.ServiceRequest;
  next();
});

// ===== POST /api/status/track =====
/**
 * Add a new status update to a service request
 * 
 * Request body:
 * {
 *   "requestId": "...",
 *   "status": "In Progress",
 *   "assignedTo": "John Technician",
 *   "notes": "Started working on the issue"
 * }
 * 
 * Response: { success: true, trackingId: "...", message: "Status updated" }
 */
router.post('/track', verifyToken, async (req, res) => {
  try {
    const { requestId, status, assignedTo, notes } = req.body;
    
    // ===== INPUT VALIDATION =====
    if (!requestId || !status) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['requestId', 'status']
      });
    }
    
    // Verify the request belongs to the user
    const request = await ServiceRequest.findOne({
      where: {
        id: requestId,
        userId: req.userId
      }
    });
    
    if (!request) {
      return res.status(404).json({
        error: 'Service request not found',
        message: 'You do not have access to this request'
      });
    }
    
    // ===== DATABASE OPERATION: INSERT (Status Tracking) =====
    const statusUpdate = await StatusTracking.create({
      requestId: requestId,
      status: status,
      assignedTo: assignedTo || null,
      notes: notes || null
    });
    
    // ===== UPDATE SERVICE REQUEST STATUS =====
    await request.update({
      status: status
    });
    
    res.status(201).json({
      success: true,
      message: 'Status update recorded successfully',
      data: {
        trackingId: statusUpdate.id,
        requestId: requestId,
        status: status,
        timestamp: statusUpdate.createdAt
      }
    });
    
  } catch (error) {
    console.error('Error tracking status:', error);
    res.status(500).json({
      error: 'Failed to track status',
      message: error.message
    });
  }
});

// ===== GET /api/status/history/:requestId =====
/**
 * Get status history for a service request
 * 
 * INTEGRATION POINT: Display Status Timeline
 * Frontend displays complete status history on request detail page
 * Shows when status changed and by whom
 * 
 * Returns: Array of status updates with timestamps
 */
router.get('/history/:requestId', verifyToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Verify the request belongs to the user
    const request = await ServiceRequest.findOne({
      where: {
        id: requestId,
        userId: req.userId
      }
    });
    
    if (!request) {
      return res.status(404).json({
        error: 'Service request not found'
      });
    }
    
    // ===== DATABASE OPERATION: SELECT =====
    const history = await StatusTracking.findAll({
      where: { requestId: requestId },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      message: `Retrieved ${history.length} status updates`,
      data: history.map(update => ({
        id: update._id,
        status: update.status,
        assignedTo: update.assignedTo,
        notes: update.notes,
        timestamp: update.createdAt
      }))
    });
    
  } catch (error) {
    console.error('Error fetching status history:', error);
    res.status(500).json({
      error: 'Failed to fetch status history',
      message: error.message
    });
  }
});

// ===== GET /api/status/current/:requestId =====
/**
 * Get the current status of a service request
 * 
 * Returns the latest status without full history
 * Useful for quick status checks on dashboard
 */
router.get('/current/:requestId', verifyToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Verify the request belongs to the user
    const request = await ServiceRequest.findOne({
      where: {
        id: requestId,
        userId: req.userId
      }
    });
    
    if (!request) {
      return res.status(404).json({
        error: 'Service request not found'
      });
    }
    
    // ===== DATABASE OPERATION: SELECT LATEST =====
    const latestStatus = await StatusTracking.findOne({
      where: { requestId: requestId },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: {
        requestId: requestId,
        currentStatus: request.status,
        lastUpdated: request.updatedAt,
        latestUpdate: latestStatus ? {
          status: latestStatus.status,
          assignedTo: latestStatus.assignedTo,
          notes: latestStatus.notes,
          timestamp: latestStatus.createdAt
        } : null
      }
    });
    
  } catch (error) {
    console.error('Error fetching current status:', error);
    res.status(500).json({
      error: 'Failed to fetch current status',
      message: error.message
    });
  }
});

module.exports = router;
