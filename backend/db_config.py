
import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="kuranchie",
        password="@DadMum@23",
        database="registrationsystem",
        auth_plugin='caching_sha2_password'  
    )