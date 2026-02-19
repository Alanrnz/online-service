/**
 * User Model
 * 
 * INTEGRATION POINT: User Authentication
 * Defines the structure of the user table in MySQL using Sequelize
 * Handles password hashing and validation
 */

const { DataTypes } = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 50],
          msg: 'Username must be between 3 and 50 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Invalid email format'
        }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: {
          args: [6, 255],
          msg: 'Password must be at least 6 characters'
        }
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcryptjs.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcryptjs.hash(user.password, 10);
        }
      }
    }
  });

  /**
   * Compare password with hashed password
   * @param {string} plainPassword - Password to compare
   * @returns {Promise<boolean>}
   */
  User.prototype.comparePassword = async function(plainPassword) {
    return await bcryptjs.compare(plainPassword, this.password);
  };

  return User;
};
