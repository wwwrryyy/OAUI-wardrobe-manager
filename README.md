# OUAI — Outfit Organizer & Wardrobe Shuffler

OUAI (Outfit Selector / Wardrobe Organizer) is a Python-based desktop application that helps users digitize, organize, and randomly generate outfit combinations from their personal wardrobes. It uses **Tkinter** for the graphical user interface, **MySQL** for user-specific data storage, and **Pillow (PIL)** for image processing and rendering.

---

## 🚀 Features

- **User Authentication**: Secure Sign-up and Login screen using MySQL to manage user accounts.
- **Dynamic Wardrobe Tables**: Automatically creates a dedicated SQL table for each registered user to store their wardrobe item paths.
- **Wardrobe Uploader**: Easy-to-use forms to upload paths for **Tops**, **Bottoms**, and **Shoes**.
- **Outfit Shuffler**: Randomly selects a combination of tops, bottoms, and shoes from the user's uploaded wardrobe, displaying them vertically in a layout.
- **Visual Previews**: Renders the JPEG image files of clothing items dynamically within the application UI.

---

## 📂 Project Structure

```text
OUAI-wardobe-manager/
├── main.py                # Main application entry point containing Tkinter UI and logic
├── import mysql.py        # Helper setup script to initialize database and tables
├── SQL MAIN.txt           # Raw SQL queries for database and user schema setup
├── mainlogo.ico           # Application logo icon
└── *.jpeg                 # Sample clothing item images for testing
```

---

## 🛠️ Prerequisites & Setup

### 1. Database Setup
Before running the application, make sure you have **MySQL Server** installed and running.

Run the commands in `SQL MAIN.txt` to initialize the database:
```sql
CREATE DATABASE OUAI;
USE OUAI;

CREATE TABLE USER(
    USER_ID INT PRIMARY KEY AUTO_INCREMENT,
    USERNAME VARCHAR(18) UNIQUE NOT NULL,
    PASSWORD VARCHAR(18) NOT NULL
);
```

> [!IMPORTANT]
> The database connection is configured using environment variables. It is highly recommended to use a dedicated, least-privileged application database user instead of the `root` user:
> - `DB_HOST`: Database host (default: `localhost`)
> - `DB_USER`: Database username (default: `root`)
> - `DB_PASSWORD`: Database password (default: `student`)
> - `DB_NAME`: Database name (default: `ouai`)
>
> You can set these in your terminal session before launching the application:
> ```bash
> export DB_USER="ouai_user"
> export DB_PASSWORD="secure_password"
> ```


### 2. Install Python Dependencies
Install the required libraries using `pip`:
```bash
pip install mysql-connector-python pillow
```

---

## 💻 How to Run

1. Make sure your local MySQL instance is running and the database is configured.
2. Run the entry-point script:
   ```bash
   python main.py
   ```
3. Use the GUI to:
   - **Sign Up**: Create a new account.
   - **Login**: Enter your credentials.
   - **Upload**: Enter paths of your clothing images (Tops, Bottoms, and Shoes).
   - **Shuffle**: Generate a random outfit combination from your wardrobe items.
