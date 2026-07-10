import mysql.connector as m 
con=m.connect(host='localhost', user='root', password='student', database='ouai')
c=con.cursor()
def craete_table():
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE
    )''')
    con.commit()
craete_table()