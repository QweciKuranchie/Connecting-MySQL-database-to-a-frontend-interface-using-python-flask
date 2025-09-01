from flask import Flask, jsonify
import os
import mysql.connector

app = Flask(__name__)

@app.route("/")
def index():
    return jsonify({"message": "Hello from Flask on Vercel!"})

@app.route("/db")
def db_check():
    try:
        conn = mysql.connector.connect(
            host=os.environ.get("MYSQL_HOST"),
            user=os.environ.get("MYSQL_USER"),
            password=os.environ.get("MYSQL_PASSWORD"),
            database=os.environ.get("MYSQL_DATABASE"),
            port=int(os.environ.get("MYSQL_PORT", 3306))
        )
        cursor = conn.cursor()
        cursor.execute("SELECT NOW()")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify({"db_time": str(result[0])})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Vercel looks for 'app' or 'handler'
handler = app
