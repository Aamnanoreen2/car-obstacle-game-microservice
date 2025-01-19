CREATE DATABASE IF NOT EXISTS game_db;

USE game_db;

-- Create a table for storing game data (message)
CREATE TABLE IF NOT EXISTS data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255)
);

-- Create a table for storing scores (only score and date)
CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    score INT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM scores;
SELECT MAX(score) FROM scores;

-- Insert a default message if no rows exist in the 'data' table
INSERT INTO data (message)
SELECT 'Welcome to the Car Obstacle Game!' 
WHERE NOT EXISTS (SELECT 1 FROM data LIMIT 1);
