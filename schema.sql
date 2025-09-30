-- SQL Script for the Complete Grocery Management System
-- This script creates the database and all tables from scratch.

-- 1. Create and select the database
CREATE DATABASE IF NOT EXISTS grocery_store;
USE grocery_store;


-- 2. Create tables with no foreign key dependencies first
CREATE TABLE IF NOT EXISTS `Users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('Admin') NOT NULL DEFAULT 'Admin',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Suppliers` (
    `supplier_id` INT AUTO_INCREMENT PRIMARY KEY,
    `supplier_name` VARCHAR(255) NOT NULL,
    `contact_person` VARCHAR(100),
    `contact_no` VARCHAR(20) NOT NULL,
    `address` TEXT,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Customers` (
    `customer_id` INT AUTO_INCREMENT PRIMARY KEY,
    `customer_name` VARCHAR(255) NOT NULL,
    `contact_no` VARCHAR(20) UNIQUE,
    `address` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 3. Create tables that depend on the ones above
CREATE TABLE IF NOT EXISTS `Products` (
    `product_id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100),
    `brand` VARCHAR(100),
    `unit` ENUM('kg', 'gram', 'liter', 'ml', 'piece', 'packet') NOT NULL,
    `cost_price` DECIMAL(10, 2) NOT NULL,
    `selling_price` DECIMAL(10, 2) NOT NULL,
    `quantity_in_stock` INT NOT NULL DEFAULT 0,
    `expiry_date` DATE,
    `low_stock_threshold` INT DEFAULT 10,
    `supplier_id` INT,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_product_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `Suppliers`(`supplier_id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `Bills` (
    `bill_id` INT AUTO_INCREMENT PRIMARY KEY,
    `bill_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `customer_id` INT,
    `sub_total` DECIMAL(10, 2) NOT NULL,
    `discount_percentage` DECIMAL(5, 2) DEFAULT 0.00,
    `discount_amount` DECIMAL(10, 2) DEFAULT 0.00,
    `tax_percentage` DECIMAL(5, 2) DEFAULT 0.00,
    `tax_amount` DECIMAL(10, 2) DEFAULT 0.00,
    `net_amount` DECIMAL(10, 2) NOT NULL,
    CONSTRAINT `fk_bill_customer` FOREIGN KEY (`customer_id`) REFERENCES `Customers`(`customer_id`) ON DELETE SET NULL
);


-- 4. Create the final junction table
CREATE TABLE IF NOT EXISTS `Bill_Items` (
    `bill_item_id` INT AUTO_INCREMENT PRIMARY KEY,
    `bill_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity_sold` INT NOT NULL,
    `price_per_unit` DECIMAL(10, 2) NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    CONSTRAINT `fk_item_bill` FOREIGN KEY (`bill_id`) REFERENCES `Bills`(`bill_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_item_product` FOREIGN KEY (`product_id`) REFERENCES `Products`(`product_id`) ON DELETE RESTRICT
);


-- 5. Add indexes for performance
CREATE INDEX `idx_product_name` ON `Products`(`product_name`);

-- End of script --