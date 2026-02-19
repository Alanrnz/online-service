-- MySQL Setup Script for SmartServe Solutions
-- Run this in MySQL Command Line or MySQL Workbench

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS smartserve;

-- Create user with the specified password
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'S!m@rtSrv3_2026#SQLx';

-- Grant all privileges to the user on the smartserve database
GRANT ALL PRIVILEGES ON smartserve.* TO 'root'@'localhost';

-- Refresh privileges
FLUSH PRIVILEGES;

-- Verify the user was created
SELECT User, Host FROM mysql.user WHERE User='root';
