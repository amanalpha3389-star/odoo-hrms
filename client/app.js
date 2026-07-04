// ================= AUTH CHECK =================

const protectedPages = [
    "dashboard.html",
    "employees.html",
    "attendance.html",
    "leave.html",
    "payroll.html",
    "profile.html"
];

const currentPage = window.location.pathname.split("/").pop();

if (
    protectedPages.includes(currentPage) &&
    !localStorage.getItem("loggedInUser")
) {
    window.location.href = "index.html";
}

// Password Toggle
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

if (togglePassword && password) {
    togglePassword.addEventListener("click", () => {

        const type =
            password.type === "password"
                ? "text"
                : "password";

        password.type = type;

        togglePassword.innerHTML =
            type === "password"
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';
    });
}


// Confirm Password Toggle
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const confirmPassword = document.getElementById("confirmPassword");

if (toggleConfirmPassword && confirmPassword) {
    toggleConfirmPassword.addEventListener("click", () => {

        const type =
            confirmPassword.type === "password"
                ? "text"
                : "password";

        confirmPassword.type = type;

        toggleConfirmPassword.innerHTML =
            type === "password"
                ? '<i class="fa-regular fa-eye"></i>'
                : '<i class="fa-regular fa-eye-slash"></i>';
    });
}

// ================= REGISTER =================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const employeeId = document.getElementById("employeeId").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const role = document.getElementById("role").value;

        if (
            !fullName ||
            !employeeId ||
            !email ||
            !password ||
            !confirmPassword ||
            !role
        ) {
            alert("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const emailExists = users.find(user => user.email === email);

        if (emailExists) {
            alert("Email already exists.");
            return;
        }

        const employeeExists = users.find(user => user.employeeId === employeeId);

        if (employeeExists) {
            alert("Employee ID already exists.");
            return;
        }

        const newUser = {
            fullName,
            employeeId,
            email,
            password,
            role
        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration Successful!");

        window.location.href = "index.html";

    });

}

// ================= LOGIN =================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(
            u => u.email === email && u.password === password
        );

        if (!user) {
            alert("Invalid Email or Password");
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(user));

        alert("Login Successful!");

        window.location.href = "dashboard.html";

    });

}

// ================= DASHBOARD =================

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (loggedInUser && document.getElementById("welcomeText")) {

    document.getElementById("welcomeText").innerText =
        `Welcome, ${loggedInUser.fullName}`;

    const employees = JSON.parse(localStorage.getItem("employees")) || [];

    document.getElementById("employeeCount").innerText = employees.length;

    const attendance =
        JSON.parse(localStorage.getItem("attendance")) || [];

    document.getElementById("attendanceCount").innerText =
        attendance.length;

    const leaves =
        JSON.parse(localStorage.getItem("leaveRequests")) || [];

    document.getElementById("leaveCount").innerText =
        leaves.length;

    const payroll =
        JSON.parse(localStorage.getItem("payroll")) || [];

    document.getElementById("payrollCount").innerText =
        payroll.length;
}

// Logout

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("loggedInUser");

        window.location.href = "index.html";

    });

}

// ================= EMPLOYEE MANAGEMENT =================

const employeeForm = document.getElementById("employeeForm");

if (employeeForm) {

    const tableBody = document.querySelector("#employeeTable tbody");

    function loadEmployees() {

        tableBody.innerHTML = "";

        const employees = JSON.parse(localStorage.getItem("employees")) || [];

        employees.forEach((employee, index) => {

            tableBody.innerHTML += `
                <tr>
                    <td>${employee.name}</td>
                    <td>${employee.id}</td>
                    <td>${employee.email}</td>
                    <td>${employee.role}</td>
                    <td>
                        <button onclick="deleteEmployee(${index})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;

        });

    }

    employeeForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = document.getElementById("empName").value.trim();
        const id = document.getElementById("empId").value.trim();
        const email = document.getElementById("empEmail").value.trim();
        const role = document.getElementById("empRole").value;

        let employees = JSON.parse(localStorage.getItem("employees")) || [];

        employees.push({
            name,
            id,
            email,
            role
        });

        localStorage.setItem("employees", JSON.stringify(employees));

        employeeForm.reset();

        loadEmployees();

    });

    window.deleteEmployee = function (index) {

        let employees = JSON.parse(localStorage.getItem("employees")) || [];

        employees.splice(index, 1);

        localStorage.setItem("employees", JSON.stringify(employees));

        loadEmployees();

    }

    loadEmployees();

}

// ================= ATTENDANCE =================

const attendanceForm = document.getElementById("attendanceForm");

if (attendanceForm) {

    const employeeSelect = document.getElementById("attendanceEmployee");
    const attendanceTable = document.querySelector("#attendanceTable tbody");

    // Load employees into dropdown
    const employees = JSON.parse(localStorage.getItem("employees")) || [];

    employees.forEach(emp => {
        employeeSelect.innerHTML += `
            <option value="${emp.name}">
                ${emp.name}
            </option>
        `;
    });

    // Load attendance table
    function loadAttendance() {

        attendanceTable.innerHTML = "";

        const attendance =
            JSON.parse(localStorage.getItem("attendance")) || [];

        attendance.forEach(record => {

            attendanceTable.innerHTML += `
                <tr>
                    <td>${record.name}</td>
                    <td>${record.status}</td>
                    <td>${record.date}</td>
                </tr>
            `;

        });

    }

    attendanceForm.addEventListener("submit", function(e){

        e.preventDefault();

        const name = employeeSelect.value;
        const status = document.getElementById("attendanceStatus").value;

        const today = new Date().toLocaleDateString();

        let attendance =
            JSON.parse(localStorage.getItem("attendance")) || [];

        attendance.push({
            name,
            status,
            date: today
        });

        localStorage.setItem(
            "attendance",
            JSON.stringify(attendance)
        );

        attendanceForm.reset();

        loadAttendance();

    });

    loadAttendance();

}

// ================= LEAVE MANAGEMENT =================

const leaveForm = document.getElementById("leaveForm");

if (leaveForm) {

    const employeeSelect = document.getElementById("leaveEmployee");
    const tableBody = document.querySelector("#leaveTable tbody");

    const employees =
        JSON.parse(localStorage.getItem("employees")) || [];

    employees.forEach(emp => {

        employeeSelect.innerHTML += `
            <option value="${emp.name}">
                ${emp.name}
            </option>
        `;

    });

    function loadLeaves(){

        tableBody.innerHTML = "";

        const leaves =
            JSON.parse(localStorage.getItem("leaveRequests")) || [];

        leaves.forEach(leave => {

            tableBody.innerHTML += `
                <tr>
                    <td>${leave.name}</td>
                    <td>${leave.reason}</td>
                    <td>${leave.start}</td>
                    <td>${leave.end}</td>
                    <td>${leave.status}</td>
                </tr>
            `;

        });

    }

    leaveForm.addEventListener("submit",function(e){

        e.preventDefault();

        let leaves =
            JSON.parse(localStorage.getItem("leaveRequests")) || [];

        leaves.push({

            name:employeeSelect.value,

            reason:document.getElementById("leaveReason").value,

            start:document.getElementById("leaveStart").value,

            end:document.getElementById("leaveEnd").value,

            status:"Pending"

        });

        localStorage.setItem(
            "leaveRequests",
            JSON.stringify(leaves)
        );

        leaveForm.reset();

        loadLeaves();

    });

    loadLeaves();

}


// ================= PAYROLL =================

const payrollForm = document.getElementById("payrollForm");

if (payrollForm) {

    const employeeSelect = document.getElementById("payEmployee");
    const tableBody = document.querySelector("#payrollTable tbody");

    const employees =
        JSON.parse(localStorage.getItem("employees")) || [];

    employees.forEach(emp => {

        employeeSelect.innerHTML += `
            <option value="${emp.name}">
                ${emp.name}
            </option>
        `;

    });

    function loadPayroll(){

        tableBody.innerHTML="";

        const payroll =
            JSON.parse(localStorage.getItem("payroll")) || [];

        payroll.forEach(record=>{

            tableBody.innerHTML+=`
            <tr>
                <td>${record.name}</td>
                <td>₹${record.salary}</td>
                <td>₹${record.bonus}</td>
                <td>₹${record.deduction}</td>
                <td><strong>₹${record.netSalary}</strong></td>
            </tr>
            `;

        });

    }

    payrollForm.addEventListener("submit",function(e){

        e.preventDefault();

        const salary=Number(document.getElementById("salary").value);
        const bonus=Number(document.getElementById("bonus").value);
        const deduction=Number(document.getElementById("deduction").value);

        const netSalary=salary+bonus-deduction;

        let payroll=
            JSON.parse(localStorage.getItem("payroll")) || [];

        payroll.push({

            name:employeeSelect.value,
            salary,
            bonus,
            deduction,
            netSalary

        });

        localStorage.setItem(
            "payroll",
            JSON.stringify(payroll)
        );

        payrollForm.reset();

        loadPayroll();

    });

    loadPayroll();

}