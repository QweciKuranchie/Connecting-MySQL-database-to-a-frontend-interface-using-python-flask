

   const API_BASE_URL = 'http://localhost:3001/api';


const loginPage = document.getElementById('login-page');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

const sidebarItems = document.querySelectorAll('.sidebar li');
const sections = {
    students: document.getElementById('students-section'),
    courses: document.getElementById('courses-section'),
    registration: document.getElementById('registration-section'),
    department: document.getElementById('department-section')
};

const studentsTable = document.getElementById('students-table').querySelector('tbody');
const addStudentBtn = document.getElementById('add-student-btn');
const studentModal = document.getElementById('student-modal');
const modalTitle = document.getElementById('modal-title');
const studentForm = document.getElementById('student-form');
const studentIdInput = document.getElementById('student-id');
const closeModalBtn = document.querySelector('.close-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Login
loginBtn.addEventListener('click', async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            loginError.textContent = '';
            loginPage.style.display = 'none';
            dashboard.style.display = 'block';
            loadStudents();
        } else {
            loginError.textContent = data.message || 'Invalid username or password';
        }
    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = 'Failed to connect to server';
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    dashboard.style.display = 'none';
    loginPage.style.display = 'flex';
    usernameInput.value = '';
    passwordInput.value = '';
});

// Sidebar
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        Object.values(sections).forEach(section => {
            section.style.display = 'none';
        });

        const sectionId = item.getAttribute('data-section') + '-section';
        document.getElementById(sectionId).style.display = 'block';

        if (sectionId === 'students-section') loadStudents();
        if (sectionId === 'courses-section') loadCourses();
        if (sectionId === 'registration-section') loadstudents_info();
        if (sectionId === 'department-section') loadDepartments();
    });
});

// Load Students
async function loadStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        const students = await response.json();

        studentsTable.innerHTML = '';

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.StudentID}</td>
                <td>${student.StudentName}</td>
                <td>${student.Department}</td>
                <td>${student.Course1}</td>
                <td>${student.Grade1}</td>
                <td>${student.Course2}</td>
                <td>${student.Grade2}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${student.StudentID}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${student.StudentID}">Delete</button>
                </td>
            `;
            studentsTable.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => editStudent(e.target.getAttribute('data-id')));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => deleteStudent(e.target.getAttribute('data-id')));
        });

    } catch (error) {
        console.error('Error loading students:', error);
        alert('Failed to load students');
    }
}

async function editStudent(studentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`);
        const student = await response.json();

        modalTitle.textContent = 'Edit Student';
        studentIdInput.value = student.StudentID;
        document.getElementById('student-name').value = student.StudentName;
        document.getElementById('department').value = student.Department;
        document.getElementById('course1').value = student.Course1;
        document.getElementById('grade1').value = student.Grade1;
        document.getElementById('course2').value = student.Course2;
        document.getElementById('grade2').value = student.Grade2;

        studentModal.style.display = 'flex';
    } catch (error) {
        console.error('Error fetching student:', error);
        alert('Failed to fetch student data');
    }
}

async function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                loadStudents();
            } else {
                alert('Failed to delete student');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Failed to delete student');
        }
    }
}

addStudentBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Add New Student';
    studentForm.reset();
    studentIdInput.value = '';
    studentModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    studentModal.style.display = 'none';
});

cancelBtn.addEventListener('click', () => {
    studentModal.style.display = 'none';
});

studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentData = {
        StudentID: studentIdInput.value,
        StudentName: document.getElementById('student-name').value,
        Department: document.getElementById('department').value,
        Course1: document.getElementById('course1').value,
        Grade1: document.getElementById('grade1').value,
        Course2: document.getElementById('course2').value,
        Grade2: document.getElementById('grade2').value
    };

    try {
        const method = studentData.StudentID ? 'PUT' : 'POST';
        const url = studentData.StudentID
            ? `${API_BASE_URL}/students/${studentData.StudentID}`
            : `${API_BASE_URL}/students`;

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });

        const data = await response.json();

        if (data.success) {
            studentModal.style.display = 'none';
            loadStudents();
        } else {
            alert('Failed to save student');
        }

    } catch (error) {
        console.error('Error saving student:', error);
        alert('Failed to save student');
    }
});

window.addEventListener('click', (e) => {
    if (e.target === studentModal) {
        studentModal.style.display = 'none';
    }
});

// --- Load Departments ---
async function loadDepartments() {
    try {
        const response = await fetch(`${API_BASE_URL}/departments`);
        const departments = await response.json();

        sections.department.innerHTML = `
            <h2>Departments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Department ID</th>
                        <th>Department Name</th>
                        <th>Head</th>
                    </tr>
                </thead>
                <tbody>
                    ${departments.map(d => `
                        <tr>
                            <td>${d.DepartmentID}</td>
                            <td>${d.DepartmentName}</td>
                            <td>${d.Head}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error("Error loading departments:", error);
        sections.department.innerHTML = "<p>Failed to load departments.</p>";
    }
}

// --- Load Courses ---
async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        const courses = await response.json();

        sections.courses.innerHTML = `
            <h2>Courses</h2>
            <table>
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                    </tr>
                </thead>
                <tbody>
                    ${courses.map(c => `
                        <tr>
                            <td>${c.courseID}</td>
                            <td>${c.CourseName}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error("Error loading courses:", error);
        sections.courses.innerHTML = "<p>Failed to load courses.</p>";
    }
}

// --- Load registration ---
async function loadstudents_info() {
    try {
        const response = await fetch(`${API_BASE_URL}/students_info`);
        const info = await response.json();

        sections.registration.innerHTML = `
            <h2>Student Info</h2>
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Department ID</th>
                    </tr>
                </thead>
                <tbody>
                    ${info.map(i => `
                        <tr>
                            <td>${i.StudentID}</td>
                            <td>${i.StudentName}</td>
                            <td>${i.DepartmentID}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error("Error loading student info:", error);
        sections.registration.innerHTML = "<p>Failed to load student info.</p>";
    }
}
