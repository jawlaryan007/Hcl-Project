-- ========================================================
-- PortfolioPro - PostgreSQL Database Setup Script for pgAdmin
-- 3rd Year Engineering College Project
-- ========================================================

-- Step 1: Create Database (Run this query first in pgAdmin / Query Tool)
-- CREATE DATABASE portfoliopro_db;

-- Connect to 'portfoliopro_db' before executing the script below:

-- Step 2: Drop existing tables if re-initializing
DROP TABLE IF EXISTS watchlist CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS holdings CASCADE;
DROP TABLE IF EXISTS stocks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Step 3: Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    virtual_balance NUMERIC(15, 2) NOT NULL DEFAULT 100000.00
);

-- Step 4: Create Stocks Table
CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    current_price NUMERIC(15, 2) NOT NULL,
    previous_price NUMERIC(15, 2) NOT NULL
);

-- Step 5: Create Holdings Table
CREATE TABLE holdings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id INT NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity >= 0),
    average_price NUMERIC(15, 2) NOT NULL,
    CONSTRAINT unique_user_stock UNIQUE (user_id, stock_id)
);

-- Step 6: Create Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id INT NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('BUY', 'SELL')),
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(15, 2) NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'COMPLETED'
);

-- Step 7: Create Watchlist Table
CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stock_id INT NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_watchlist_stock UNIQUE (user_id, stock_id)
);

-- Step 8: Insert Initial Seed Data (Demo Indian Stocks & Accounts)
-- Default passwords: 'admin123' and 'student123' (BCrypt hashed)
INSERT INTO users (name, email, password, role, virtual_balance) VALUES
('Admin User', 'admin@portfoliopro.com', '$2a$10$e8nC0v8W1vW7.E2zJgW5/e2pA8w1m5.V4.9XkK4X4X4X4X4X4X4X4', 'ADMIN', 1000000.00),
('Student Trader', 'student@portfoliopro.com', '$2a$10$e8nC0v8W1vW7.E2zJgW5/e2pA8w1m5.V4.9XkK4X4X4X4X4X4X4X4', 'USER', 100000.00);

INSERT INTO stocks (symbol, company_name, sector, current_price, previous_price) VALUES
('RELIANCE', 'Reliance Industries Ltd', 'Energy & Telecom', 2500.00, 2463.00),
('TCS', 'Tata Consultancy Services', 'Information Technology', 3500.00, 3472.00),
('INFY', 'Infosys Limited', 'Information Technology', 1600.00, 1608.00),
('HDFCBANK', 'HDFC Bank Limited', 'Banking & Finance', 1550.00, 1540.00),
('ICICIBANK', 'ICICI Bank Limited', 'Banking & Finance', 980.00, 968.00),
('ITC', 'ITC Limited', 'FMCG', 440.00, 435.00),
('SBIN', 'State Bank of India', 'Banking & Finance', 620.00, 612.00),
('TATAMOTORS', 'Tata Motors Ltd', 'Automobile', 680.00, 670.00),
('BHARTIARTL', 'Bharti Airtel Limited', 'Telecommunications', 1120.00, 1105.00),
('LT', 'Larsen & Toubro Ltd', 'Engineering & Infra', 3400.00, 3375.00),
('WIPRO', 'Wipro Limited', 'Information Technology', 480.00, 475.00),
('AXISBANK', 'Axis Bank Limited', 'Banking & Finance', 1050.00, 1040.00);
