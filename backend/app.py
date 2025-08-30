
from flask import Flask, jsonify, request
from flask_cors import CORS
from db_config import get_db_connection

app = Flask(__name__)
CORS(app)

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    if data.get("username") == "admin" and data.get("password") == "admin123":
        return jsonify({"success": True})
    return jsonify({"success": False, "message": "Invalid credentials"})

# --- STUDENTS ---
@app.route("/api/students", methods=["GET"])
def get_students():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)

@app.route("/api/students/<int:student_id>", methods=["GET"])
def get_student(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students WHERE StudentID = %s", (student_id,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(result or {})

@app.route("/api/students", methods=["POST"])
def add_student():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO students (StudentName, Department, Course1, Grade1, Course2, Grade2)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        data["StudentName"], data["Department"], data["Course1"],
        data["Grade1"], data["Course2"], data["Grade2"]
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"success": True})

@app.route("/api/students/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE students SET StudentName=%s, Department=%s, Course1=%s,
        Grade1=%s, Course2=%s, Grade2=%s WHERE StudentID=%s
    """, (
        data["StudentName"], data["Department"], data["Course1"],
        data["Grade1"], data["Course2"], data["Grade2"], student_id
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"success": True})

@app.route("/api/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM students WHERE StudentID = %s", (student_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"success": True})

# --- DEPARTMENTS ---
@app.route("/api/departments", methods=["GET"])
def get_departments():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM department")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)

# --- COURSES ---
@app.route("/api/courses", methods=["GET"])
def get_courses():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM courses")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)



# --- STUDENT INFO ---
@app.route("/api/students_info", methods=["GET"])
def get_student_info():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students_info")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)

if __name__ == "__main__":
    app.run(port=3001, debug=True)
