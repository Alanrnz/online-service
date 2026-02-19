/**
 * Service Request Model
 * 
 * INTEGRATION POINT: Service Request Management
 * Represents a service request submitted by a user
 * Uses Sequelize ORM for MySQL database
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ServiceRequest = sequelize.define('ServiceRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    serviceType: {
      type: DataTypes.ENUM('Maintenance', 'Repair', 'Installation', 'Support', 'Consultation'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [10, 1000],
          msg: 'Description must be between 10 and 1000 characters'
        }
      }
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
      defaultValue: 'Medium'
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Assigned', 'In Progress', 'On Hold', 'Completed', 'Cancelled'),
      defaultValue: 'Pending'
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  return ServiceRequest;
};
