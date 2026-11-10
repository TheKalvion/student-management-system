
const API_URL = "http://localhost:8080/api/students";

const studentForm = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");
const submitBtn = document.getElementById("submitBtn");

let students = [];
let editingStudentId = null;

// HTML එකට ආරක්ෂිතව text ඇතුළත් කිරීම
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// Database එකෙන් Students ලබාගැනීම
async function loadStudents() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Students load failed");
        }

        students = await response.json();

        displayStudents(students);
        updateDashboard();

    } catch (error) {
        console.error("Error:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Backend එක සම්බන්ධ වී නැහැ.
                    Spring Boot server එක run කරලා නැවත උත්සාහ කරන්න.
                </td>
            </tr>
        `;
    }
}

// Students Table එක පෙන්වීම
function displayStudents(studentList) {
    if (studentList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">No students found.</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = studentList.map(student => {
        const name = student.fullName || "";
        const initials = name
            .split(" ")
            .filter(Boolean)
            .map(word => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

        const status = student.status || "Active";
        const statusClass = status.toLowerCase() === "active"
            ? "active-status"
            : "inactive-status";

        return `
            <tr>
                <td>#${escapeHTML(student.studentCode)}</td>

                <td>
                    <div class="student-name">
                        <div class="student-avatar purple-avatar">
                            ${escapeHTML(initials)}
                        </div>
                        <div>
                            <strong>${escapeHTML(name)}</strong>
                            <small>${escapeHTML(student.gender)}</small>
                        </div>
                    </div>
                </td>

                <td>${escapeHTML(student.email)}</td>
                <td>${escapeHTML(student.course)}</td>

                <td>
                    <span class="status ${statusClass}">
                        ${escapeHTML(status)}
                    </span>
                </td>

                <td class="actions">
                    <button class="action-btn edit-btn"
                        data-action="edit"
                        data-id="${student.id}">
                        Edit
                    </button>

                    <button class="action-btn delete-btn"
                        data-action="delete"
                        data-id="${student.id}">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

// Dashboard Statistics යාවත්කාලීන කිරීම
function updateDashboard() {
    const totalElement = document.getElementById("totalStudents");
    const activeElement = document.getElementById("activeStudents");

    const total = students.length;

    const active = students.filter(student =>
        (student.status || "").toLowerCase() === "active"
    ).length;

    if (totalElement) {
        totalElement.textContent = total;
    }

    if (activeElement) {
        activeElement.textContent = active;
    }
}

// Student Add / Update කිරීම
studentForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const student = {
        studentCode: document.getElementById("student-id").value.trim().replace(/^#/, ""),
        fullName: document.getElementById("student-name").value.trim(),
        email: document.getElementById("student-email").value.trim(),
        phone: document.getElementById("student-phone").value.trim(),
        course: document.getElementById("student-course").value,
        gender: document.getElementById("student-gender").value,
        dateOfBirth: document.getElementById("student-dob").value || null,
        address: document.getElementById("student-address").value.trim(),
        status: "Active"
    };

    try {
        const url = editingStudentId
            ? `${API_URL}/${editingStudentId}`
            : API_URL;

        const response = await fetch(url, {
            method: editingStudentId ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Unable to save student");
        }

        alert(editingStudentId
            ? "Student updated successfully!"
            : "Student added successfully!");

        studentForm.reset();
        editingStudentId = null;

        if (submitBtn) {
            submitBtn.textContent = "+ Add Student";
        }

        await loadStudents();

    } catch (error) {
        console.error("Error:", error);
        alert("Student save කරන්න බැරි වුණා. Backend එක සහ දත්ත පරීක්ෂා කරන්න.");
    }
});

// Edit / Delete Buttons
tableBody.addEventListener("click", async function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const studentId = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "edit") {
        editStudent(studentId);
    }

    if (action === "delete") {
        await deleteStudent(studentId);
    }
});

// Student Edit කිරීම
function editStudent(id) {
    const student = students.find(item => item.id === id);

    if (!student) return;

    editingStudentId = id;

    document.getElementById("student-id").value = student.studentCode || "";
    document.getElementById("student-name").value = student.fullName || "";
    document.getElementById("student-email").value = student.email || "";
    document.getElementById("student-phone").value = student.phone || "";
    document.getElementById("student-course").value = student.course || "";
    document.getElementById("student-gender").value = student.gender || "";
    document.getElementById("student-dob").value = student.dateOfBirth || "";
    document.getElementById("student-address").value = student.address || "";

    if (submitBtn) {
        submitBtn.textContent = "Update Student";
    }

    studentForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// Student Delete කිරීම
async function deleteStudent(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert("Student deleted successfully!");

        await loadStudents();

    } catch (error) {
        console.error("Error:", error);
        alert("Student delete කරන්න බැරි වුණා.");
    }
}

// Search කිරීම
function searchStudents() {
    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredStudents = students.filter(student =>
        [
            student.studentCode,
            student.fullName,
            student.email,
            student.course
        ].some(value =>
            String(value || "").toLowerCase().includes(searchValue)
        )
    );

    displayStudents(filteredStudents);
}

// Course Filter කිරීම
function filterStudents() {
    const selectedCourse = courseFilter.value;

    const filteredStudents = students.filter(student =>
        selectedCourse === "" ||
        selectedCourse.toLowerCase() === "all courses" ||
        student.course === selectedCourse
    );

    displayStudents(filteredStudents);
}

// Search සහ Filter එකට ක්‍රියා කිරීම
function applyFilters() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedCourse = courseFilter.value;

    const filteredStudents = students.filter(student => {
        const matchesSearch = [
            student.studentCode,
            student.fullName,
            student.email,
            student.course
        ].some(value =>
            String(value || "").toLowerCase().includes(searchValue)
        );

        const matchesCourse =
            selectedCourse === "" ||
            selectedCourse.toLowerCase() === "all courses" ||
            student.course === selectedCourse;

        return matchesSearch && matchesCourse;
    });

    displayStudents(filteredStudents);
}

if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
}

if (courseFilter) {
    courseFilter.addEventListener("change", applyFilters);
}

// Page එක load වන විට Students ලබාගැනීම
loadStudents();
