/**
 * Status Tracking Model
 * 
 * INTEGRATION POINT: Status Audit Trail
 * Records status changes for service requests using Sequelize
 * Provides audit trail and history of request progression
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StatusTracking = sequelize.define('StatusTracking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    requestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ServiceRequests',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Assigned', 'In Progress', 'On Hold', 'Completed', 'Cancelled'),
      allowNull: false
    },
    assignedTo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Notes cannot exceed 500 characters'
        }
      }
    }
  }, {
    timestamps: false,
    createdAt: 'timestamp',
    updatedAt: false
  });

  return StatusTracking;
};
