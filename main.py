import random as r
import mysql.connector as m
from tkinter import *
from PIL import ImageTk,Image
username_main=None
e_main=None
con=m.connect(host='localhost',user='root',passwd='student',database='ouai',auth_plugin='mysql_native_password')
c=con.cursor()
root=Tk()
root.title('OUAI')
root.iconbitmap('mainlogo.ico')
def main():
    frame=LabelFrame(root,padx=0,pady=0)
    frame.pack(padx=100,pady=100)

    b1=Button(frame, text="login",padx=25,command=login)
    b2=Button(frame, text="sign up",padx=25,command=signup)
    b1.grid(row=0, column=0)
    b2.grid(row=0, column=2)

def clear_root():
    for widget in root.winfo_children():
        widget.destroy()

def update():
    clear_root()
    frame=LabelFrame(root,padx=0,pady=0)
    frame.pack(padx=100,pady=100)
    
    b1=Button(frame, text="upload",command=table_entry,padx=25)
    b2=Button(frame, text="shuffle",padx=25,command=shuffler)
    b1.grid(row=0, column=0)
    b2.grid(row=0, column=2)

def signup():
    root.withdraw()
    top = Toplevel()
    top.title('OUAI')
    top.iconbitmap('mainlogo.ico')
    frame=LabelFrame(top,padx=100,pady=100,)
    frame.pack(padx=0,pady=0)
    e1=Entry(frame,width=25)
    e2=Entry(frame,width=25)
    e1.insert(0,'Enter your username')
    e2.insert(1,'Enter your password')
    e1.grid(row=0, column=0)
    e2.grid(row=1, column=0)

    def myclick():
        username=e1.get()
        password=e2.get()
        q="INSERT INTO USER(username,password) VALUES('{}','{}')".format(username,password)
        c.execute(q)
        c.execute('''CREATE TABLE {}(
                TOPS_PATH VARCHAR(100),
                BOTTOMS_PATH VARCHAR(100),
                SHOES_PATH VARCHAR(100));'''.format(username)) 
        con.commit()
        print("record inserted")
        top.destroy()
        root.deiconify()

    mybutton=Button(frame,text="submit", command=myclick)
    mybutton.grid(row=2, column=0)
    
def login():
    root.withdraw()
    top = Toplevel()
    top.title('OUAI')
    top.iconbitmap('mainlogo.ico')
    frame=LabelFrame(top,padx=100,pady=100,)
    frame.pack(padx=0,pady=0)
    e1=Entry(frame,width=25)
    e2=Entry(frame,width=25)
    e1.insert(0,'Enter your username')
    e2.insert(1,'Enter your password')
    e1.grid(row=0, column=0)
    e2.grid(row=1, column=0)

    def myclick():
        global username_main
        username_main=e1.get()
        password=e2.get()
        c.execute("select* from user where username='{}'".format(username_main))
        data=c.fetchall()
        if data[0][2]==password:
            print('welcome')
            top.destroy()
            root.deiconify()
            update()
        else:
            l2=Label(frame,text='incorrect password')
            l2.grid(row=3,column=0)

    mybutton=Button(frame,text="submit", command=myclick)
    mybutton.grid(row=2, column=0)

def table_entry():
    root.withdraw()  
    top = Toplevel()
    top.title('OUAI')
    top.iconbitmap('mainlogo.ico')
    frame=LabelFrame(top,padx=100,pady=100,)
    frame.pack(padx=0,pady=0)
    def myclick():
        top.destroy()
        root.deiconify()
        update()

    mybutton=Button(frame,text="Back", command=myclick,padx=20)
    mybutton.grid(row=1, column=1)

    def Tops():
        top2=Toplevel(top)
        top2.title('OUAI')
        top2.iconbitmap('mainlogo.ico')
        frame=LabelFrame(top2,padx=100,pady=100,)
        frame.pack(padx=0,pady=0)
        e=Entry(frame,width=25)
        e.insert(0,'Enter Tops Path')
        e.grid(row=0,column=0)

        def top_entry():
            global e_main
            e_main=e.get()
            c.execute("INSERT INTO {} (Tops_Path) values ('{}')".format(username_main,e.get()))
            con.commit()
            top2.destroy()
            top.deiconify()
            
        def back():
            top2.destroy()
            top.deiconify()

        mybutton1=Button(frame,text="Back", command=back,padx=20)    
        mybutton=Button(frame,text="Submit", command=top_entry,padx=20)
        mybutton.grid(row=1, column=0)
        mybutton1.grid(row=2, column=0)

    def shoes():
        top4=Toplevel(top)
        top4.title('OUAI')
        top4.iconbitmap('mainlogo.ico')
        frame=LabelFrame(top4,padx=100,pady=100,)
        frame.pack(padx=0,pady=0)
        e=Entry(frame,width=25)
        e.insert(0,'Enter Shoes Path')
        e.grid(row=0,column=0)

        def shoes_entry():
            c.execute("UPDATE {} SET SHOES_PATH='{}' WHERE TOPS_PATH='{}'".format(username_main, e.get(), e_main))
            con.commit()
            top4.destroy()
            top.deiconify()

        def back():
            top4.destroy()
            top.deiconify()

        mybutton1=Button(frame,text="Back", command=back,padx=20)    
        mybutton=Button(frame,text="Submit", command=shoes_entry,padx=20)
        mybutton.grid(row=1, column=0)
        mybutton1.grid(row=2, column=0)
    def Bottoms():
        top3=Toplevel(top)
        top3.title('OUAI')
        top3.iconbitmap('mainlogo.ico')
        frame1=LabelFrame(top3,padx=100,pady=100,)
        frame1.pack(padx=0,pady=0)
        e=Entry(frame1,width=25)
        e.insert(0,'Enter Bottoms Path')
        e.grid(row=0,column=0)

        def bottom_entry():
            c.execute("UPDATE {} SET BOTTOMS_PATH='{}' WHERE TOPS_PATH='{}'".format(username_main, e.get(), e_main))
            con.commit()
            top3.destroy()
            top.deiconify()
            
        def back():
            top3.destroy()
            top.deiconify()
 
        mybutton1=Button(frame1,text="Back", command=back,padx=20)
        mybutton=Button(frame1,text="Submit", command=bottom_entry,padx=20)
        mybutton.grid(row=1, column=0)
        mybutton1.grid(row=2, column=0)
    button1=Button(frame,text='Tops',padx=27,command=Tops)
    button2=Button(frame,text='Bottom',padx=20,command=Bottoms)
    button3=Button(frame,text='Shoes',padx=25,command=shoes)
    button1.grid(row=0, column=0)
    button2.grid(row=0, column=1)
    button3.grid(row=0, column=2)

def shuffler():
    c.execute(f"SELECT TOPS_PATH, BOTTOMS_PATH, SHOES_PATH FROM {username_main}")
    items = c.fetchall()
    if not items:
        print("No outfits found.")
        return

    tops = [i[0] for i in items if i[0]]
    bottoms = [i[1] for i in items if i[1]]
    shoes = [i[2] for i in items if i[2]]

    top = tops[r.randint(0, len(tops) - 1)] if tops else None
    bottom = bottoms[r.randint(0, len(bottoms) - 1)] if bottoms else None
    shoe = shoes[r.randint(0, len(shoes) - 1)] if shoes else None

    if not all([top, bottom, shoe]):
        print("One or more wardrobe items are missing.")
        return

    top_window = Toplevel()
    top_window.title("OUAI")
    top_window.iconbitmap('mainlogo.ico')

    image_frame = Frame(top_window)
    image_frame.pack(padx=100, pady=100)
    def show_image(path, row):
        try:
            img = Image.open(path)
            img = img.resize((150, 150))
            photo = ImageTk.PhotoImage(img)

            label = Label(image_frame, image=photo)
            label.image = photo  
            label.grid(row=row, column=0, padx=5)
        except:
            Label(image_frame, text="Couldn't load image").grid(row=0, column=column)

    show_image(top, 0)
    show_image(bottom, 1)
    show_image(shoe, 2)

main()
