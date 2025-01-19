import mysql.connector
import os

# Database connection function
def get_db_connection():
    conn = mysql.connector.connect(
        host=os.getenv('DATABASE_HOST', 'localhost'),
        user=os.getenv('DATABASE_USER', 'root'),
        password=os.getenv('DATABASE_PASSWORD', 'password'),
        database=os.getenv('DATABASE_NAME', 'game_db')
    )
    return conn

# Create the required tables if they don't exist
def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create table for storing game data if it doesn't exist
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        message VARCHAR(255)
    );
    """)
    
    # Create table for storing scores if it doesn't exist (without player name)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        score INT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    conn.commit()
    cursor.close()
    conn.close()

# Function to insert a new score into the 'scores' table
def insert_score(score):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    INSERT INTO scores (score)
    VALUES (%s);
    """, (score,))
    
    conn.commit()
    cursor.close()
    conn.close()

# Function to retrieve the highest score
def get_high_score():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT MAX(score) FROM scores;
    """)
    high_score = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    return high_score

# Call the create_tables function to initialize the database when the app starts
create_tables()
