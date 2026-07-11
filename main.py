import os
import random as r
import hashlib
import secrets
import mysql.connector as m
import tkinter as tk
from tkinter import messagebox
from PIL import ImageTk, Image

username_main = None
user_id_main = None

# Get database configuration from environment variables or use defaults
db_host = os.environ.get('DB_HOST', 'localhost')
db_user = os.environ.get('DB_USER', 'root')
db_password = os.environ.get('DB_PASSWORD')
db_name = os.environ.get('DB_NAME', 'ouai')

if not db_password:
    root_temp = tk.Tk()
    root_temp.withdraw()
    messagebox.showerror("Configuration Error", "DB_PASSWORD environment variable must be set.")
    root_temp.destroy()
    raise RuntimeError("DB_PASSWORD environment variable must be set.")

try:
    con = m.connect(
        host=db_host,
        user=db_user,
        passwd=db_password,
        database=db_name,
        auth_plugin='mysql_native_password'
    )
    c = con.cursor()
except Exception as e:
    root_temp = tk.Tk()
    root_temp.withdraw()
    messagebox.showerror("Database Connection Error", f"Failed to connect to MySQL database at {db_host}.\nError: {e}")
    root_temp.destroy()
    raise e

root = tk.Tk()
root.title('OUAI')
try:
    root.iconbitmap('mainlogo.ico')
except Exception:
    pass

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return f"{salt}:{key.hex()}"

def verify_password(stored_password_hash: str, provided_password: str) -> bool:
    try:
        salt, key_hex = stored_password_hash.split(':')
        key = hashlib.pbkdf2_hmac(
            'sha256',
            provided_password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return key.hex() == key_hex
    except (ValueError, AttributeError):
        return False

def main():
    frame = tk.LabelFrame(root, padx=0, pady=0)
    frame.pack(padx=100, pady=100)

    b1 = tk.Button(frame, text="login", padx=25, command=login)
    b2 = tk.Button(frame, text="sign up", padx=25, command=signup)
    b1.grid(row=0, column=0)
    b2.grid(row=0, column=2)

def clear_root():
    for widget in root.winfo_children():
        widget.destroy()

def update():
    clear_root()
    frame = tk.LabelFrame(root, padx=0, pady=0)
    frame.pack(padx=100, pady=100)
    
    b1 = tk.Button(frame, text="upload", command=table_entry, padx=25)
    b2 = tk.Button(frame, text="shuffle", padx=25, command=shuffler)
    b1.grid(row=0, column=0)
    b2.grid(row=0, column=2)

def signup():
    root.withdraw()
    top = tk.Toplevel()
    top.title('OUAI')
    try:
        top.iconbitmap('mainlogo.ico')
    except Exception:
        pass
    frame = tk.LabelFrame(top, padx=100, pady=100)
    frame.pack(padx=0, pady=0)
    e1 = tk.Entry(frame, width=25)
    e2 = tk.Entry(frame, width=25, show="*")
    e1.insert(0, 'Enter your username')
    e2.insert(1, 'Enter your password')
    e1.grid(row=0, column=0)
    e2.grid(row=1, column=0)

    top.protocol("WM_DELETE_WINDOW", lambda: [top.destroy(), root.deiconify()])

    def myclick():
        username = e1.get().strip()
        password = e2.get().strip()
        
        if not username or username == 'Enter your username' or not password or password == 'Enter your password':
            l_err = tk.Label(frame, text="Please enter username and password", fg="red")
            l_err.grid(row=3, column=0)
            return

        # Check if user already exists
        c.execute("SELECT USER_ID FROM USER WHERE USERNAME = %s", (username,))
        if c.fetchone():
            l_err = tk.Label(frame, text="Username already exists", fg="red")
            l_err.grid(row=3, column=0)
            return

        password_hash = hash_password(password)
        q = "INSERT INTO USER(USERNAME, PASSWORD_HASH) VALUES(%s, %s)"
        c.execute(q, (username, password_hash))
        con.commit()
        print("record inserted")
        top.destroy()
        root.deiconify()

    mybutton = tk.Button(frame, text="submit", command=myclick)
    mybutton.grid(row=2, column=0)
    
def login():
    root.withdraw()
    top = tk.Toplevel()
    top.title('OUAI')
    try:
        top.iconbitmap('mainlogo.ico')
    except Exception:
        pass
    frame = tk.LabelFrame(top, padx=100, pady=100)
    frame.pack(padx=0, pady=0)
    e1 = tk.Entry(frame, width=25)
    e2 = tk.Entry(frame, width=25, show="*")
    e1.insert(0, 'Enter your username')
    e2.insert(1, 'Enter your password')
    e1.grid(row=0, column=0)
    e2.grid(row=1, column=0)

    top.protocol("WM_DELETE_WINDOW", lambda: [top.destroy(), root.deiconify()])

    def myclick():
        global username_main, user_id_main
        username_main = e1.get().strip()
        password = e2.get().strip()
        
        c.execute("SELECT USER_ID, PASSWORD_HASH FROM USER WHERE USERNAME = %s", (username_main,))
        data = c.fetchall()
        if data and verify_password(data[0][1], password):
            user_id_main = data[0][0]
            print('welcome')
            top.destroy()
            root.deiconify()
            update()
        else:
            l2 = tk.Label(frame, text='incorrect password or username', fg="red")
            l2.grid(row=3, column=0)

    mybutton = tk.Button(frame, text="submit", command=myclick)
    mybutton.grid(row=2, column=0)

def table_entry():
    root.withdraw()  
    top = tk.Toplevel()
    top.title('OUAI')
    try:
        top.iconbitmap('mainlogo.ico')
    except Exception:
        pass
    frame = tk.LabelFrame(top, padx=100, pady=100)
    frame.pack(padx=0, pady=0)
    
    top.protocol("WM_DELETE_WINDOW", lambda: [top.destroy(), root.deiconify(), update()])

    def myclick():
        top.destroy()
        root.deiconify()
        update()

    mybutton = tk.Button(frame, text="Back", command=myclick, padx=20)
    mybutton.grid(row=1, column=1)

    def Tops():
        top2 = tk.Toplevel(top)
        top2.title('OUAI')
        try:
            top2.iconbitmap('mainlogo.ico')
        except Exception:
            pass
        frame = tk.LabelFrame(top2, padx=100, pady=100)
        frame.pack(padx=0, pady=0)
        e = tk.Entry(frame, width=25)
        e.insert(0, 'Enter Tops Path')
        e.grid(row=0, column=0)

        top2.protocol("WM_DELETE_WINDOW", lambda: [top2.destroy(), top.deiconify()])

        def top_entry():
            path = e.get().strip()
            if path and path != 'Enter Tops Path':
                c.execute("INSERT INTO WARDROBE_ITEM (USER_ID, CATEGORY, IMAGE_PATH) VALUES (%s, 'top', %s)", (user_id_main, path))
                con.commit()
            top2.destroy()
            top.deiconify()
            
        def back():
            top2.destroy()
            top.deiconify()

        mybutton1 = tk.Button(frame, text="Back", command=back, padx=20)    
        mybutton_sub = tk.Button(frame, text="Submit", command=top_entry, padx=20)
        mybutton_sub.grid(row=1, column=0)
        mybutton1.grid(row=2, column=0)

    def shoes():
        top4 = tk.Toplevel(top)
        top4.title('OUAI')
        try:
            top4.iconbitmap('mainlogo.ico')
        except Exception:
            pass
        frame = tk.LabelFrame(top4, padx=100, pady=100)
        frame.pack(padx=0, pady=0)
        e = tk.Entry(frame, width=25)
        e.insert(0, 'Enter Shoes Path')
        e.grid(row=0, column=0)

        top4.protocol("WM_DELETE_WINDOW", lambda: [top4.destroy(), top.deiconify()])

        def shoes_entry():
            path = e.get().strip()
            if path and path != 'Enter Shoes Path':
                c.execute("INSERT INTO WARDROBE_ITEM (USER_ID, CATEGORY, IMAGE_PATH) VALUES (%s, 'shoes', %s)", (user_id_main, path))
                con.commit()
            top4.destroy()
            top.deiconify()

        def back():
            top4.destroy()
            top.deiconify()

        mybutton1 = tk.Button(frame, text="Back", command=back, padx=20)    
        mybutton_sub = tk.Button(frame, text="Submit", command=shoes_entry, padx=20)
        mybutton_sub.grid(row=1, column=0)
        mybutton1.grid(row=2, column=0)

    def Bottoms():
        top3 = tk.Toplevel(top)
        top3.title('OUAI')
        try:
            top3.iconbitmap('mainlogo.ico')
        except Exception:
            pass
        frame1 = tk.LabelFrame(top3, padx=100, pady=100)
        frame1.pack(padx=0, pady=0)
        e = tk.Entry(frame1, width=25)
        e.insert(0, 'Enter Bottoms Path')
        e.grid(row=0, column=0)

        top3.protocol("WM_DELETE_WINDOW", lambda: [top3.destroy(), top.deiconify()])

        def bottom_entry():
            path = e.get().strip()
            if path and path != 'Enter Bottoms Path':
                c.execute("INSERT INTO WARDROBE_ITEM (USER_ID, CATEGORY, IMAGE_PATH) VALUES (%s, 'bottom', %s)", (user_id_main, path))
                con.commit()
            top3.destroy()
            top.deiconify()
            
        def back():
            top3.destroy()
            top.deiconify()
 
        mybutton1 = tk.Button(frame1, text="Back", command=back, padx=20)
        mybutton_sub = tk.Button(frame1, text="Submit", command=bottom_entry, padx=20)
        mybutton_sub.grid(row=1, column=0)
        mybutton1.grid(row=2, column=0)

    button1 = tk.Button(frame, text='Tops', padx=27, command=Tops)
    button2 = tk.Button(frame, text='Bottom', padx=20, command=Bottoms)
    button3 = tk.Button(frame, text='Shoes', padx=25, command=shoes)
    button1.grid(row=0, column=0)
    button2.grid(row=0, column=1)
    button3.grid(row=0, column=2)

def shuffler():
    c.execute("SELECT CATEGORY, IMAGE_PATH FROM WARDROBE_ITEM WHERE USER_ID = %s", (user_id_main,))
    items = c.fetchall()
    if not items:
        print("No outfits found.")
        return

    tops = [i[1] for i in items if i[0] == 'top' and i[1]]
    bottoms = [i[1] for i in items if i[0] == 'bottom' and i[1]]
    shoes = [i[1] for i in items if i[0] == 'shoes' and i[1]]

    top_item = tops[r.randint(0, len(tops) - 1)] if tops else None
    bottom_item = bottoms[r.randint(0, len(bottoms) - 1)] if bottoms else None
    shoe_item = shoes[r.randint(0, len(shoes) - 1)] if shoes else None

    if not all([top_item, bottom_item, shoe_item]):
        print("One or more wardrobe items are missing.")
        return

    top_window = tk.Toplevel()
    top_window.title("OUAI")
    try:
        top_window.iconbitmap('mainlogo.ico')
    except Exception:
        pass

    image_frame = tk.Frame(top_window)
    image_frame.pack(padx=100, pady=100)
    
    def show_image(path, row):
        try:
            img = Image.open(path)
            img = img.resize((150, 150))
            photo = ImageTk.PhotoImage(img)

            label = tk.Label(image_frame, image=photo)
            label.image = photo  
            label.grid(row=row, column=0, padx=5)
        except Exception:
            tk.Label(image_frame, text=f"Couldn't load image: {os.path.basename(path)}").grid(row=row, column=0)

    show_image(top_item, 0)
    show_image(bottom_item, 1)
    show_image(shoe_item, 2)

main()
root.mainloop()
