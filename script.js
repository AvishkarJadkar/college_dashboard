// Initial Data (Simulation of a Database)
const defaultStudents = [
    { id: 1, name: "John Doe", course: "Computer Science", date: "Oct 12, 2023", status: "Active" },
    { id: 2, name: "Jane Smith", course: "Business Management", date: "Oct 11, 2023", status: "Pending" },
    { id: 3, name: "Mike Ross", course: "Information Tech", date: "Oct 10, 2023", status: "Active" },
    { id: 4, name: "Rachel Zane", course: "Civil Law", date: "Oct 09, 2023", status: "On Hold" }
];

// Load students from localStorage or use defaults
let students = JSON.parse(localStorage.getItem('eduDash_students')) || defaultStudents;

// DOM Elements
const studentTableBody = document.getElementById('studentTableBody');
const addStudentForm = document.getElementById('addStudentForm');
const totalStudentsCount = document.getElementById('totalStudentsCount');
const sidebarCollapse = document.getElementById('sidebarCollapse');
const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');

// --- Core Functionalities ---

// 1. Render Table
function renderTable() {
    studentTableBody.innerHTML = '';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="ps-3 d-flex align-items-center">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random" class="rounded-circle me-3" width="35" alt="${student.name}">
                <div class="fw-medium">${student.name}</div>
            </td>
            <td>${student.course}</td>
            <td>${student.date}</td>
            <td><span class="badge rounded-pill bg-${getStatusClass(student.status)}-soft text-${getStatusClass(student.status)}">${student.status}</span></td>
            <td class="text-end pe-3">
                <button class="btn btn-action btn-delete text-muted" onclick="deleteStudent(${student.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        studentTableBody.appendChild(row);
    });
    
    updateStats();
    saveToLocalStorage();
}

// 2. Add Student
if (addStudentForm) {
    addStudentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newStudent = {
            id: Date.now(), // Unique ID based on timestamp
            name: document.getElementById('studentName').value,
            course: document.getElementById('studentCourse').value,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: document.getElementById('studentStatus').value
        };
        
        students.unshift(newStudent); // Add to the beginning of the array
        renderTable();
        
        // Hide modal
        const modalElement = document.getElementById('addStudentModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        
        // Reset form
        addStudentForm.reset();
    });
}

// 3. Delete Student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== id);
        renderTable();
    }
}

// 4. Update Stats
function updateStats() {
    if (totalStudentsCount) {
        totalStudentsCount.innerText = students.length.toLocaleString();
    }
}

// 5. Helper: Save to LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('eduDash_students', JSON.stringify(students));
}

// 6. Helper: Status Class
function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'active': return 'success';
        case 'pending': return 'warning';
        case 'on hold': return 'danger';
        default: return 'primary';
    }
}

// --- UI Logic ---

// Sidebar Toggle
if (sidebarCollapse) {
    sidebarCollapse.addEventListener('click', function () {
        sidebar.classList.toggle('active');
        content.classList.toggle('active');
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', renderTable);
