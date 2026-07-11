import os
import mysql.connector as m 

# Get database configuration from environment variables or use defaults
db_host = os.environ.get('DB_HOST', 'localhost')
db_user = os.environ.get('DB_USER', 'root')
db_password = os.environ.get('DB_PASSWORD')
if not db_password:
    raise RuntimeError("DB_PASSWORD environment variable must be set")
db_name = os.environ.get('DB_NAME', 'ouai')

# Try to connect without database name first to create it if it doesn't exist
try:
    con = m.connect(host=db_host, user=db_user, password=db_password)
    c = con.cursor()
    c.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
    con.commit()
    con.close()
except Exception as e:
    print(f"Error creating database: {e}")
    raise e

con = m.connect(host=db_host, user=db_user, password=db_password, database=db_name)
c = con.cursor()

def create_tables():
    c.execute('''CREATE TABLE IF NOT EXISTS USER (
        USER_ID INT AUTO_INCREMENT PRIMARY KEY,
        USERNAME VARCHAR(18) UNIQUE NOT NULL,
        PASSWORD_HASH VARCHAR(255) NOT NULL
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS WARDROBE_ITEM (
        ITEM_ID INT AUTO_INCREMENT PRIMARY KEY,
        USER_ID INT NOT NULL,
        CATEGORY VARCHAR(20) NOT NULL,
        IMAGE_PATH VARCHAR(255) NOT NULL,
        FOREIGN KEY (USER_ID) REFERENCES USER(USER_ID) ON DELETE CASCADE
    )''')
    con.commit()

if __name__ == '__main__':
    create_tables()
    print("Database and tables initialized successfully.")