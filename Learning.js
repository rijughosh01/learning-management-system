// Simple Learning Management System
let currentUser = null;
let courses = [];
let assignments = [];
let grades = [];

// Demo accounts for testing
const demoAccounts = {
  student: {
    email: "student@demo.com",
    password: "student123",
    name: "Jane Smith",
    role: "Student",
  },
  instructor: {
    email: "instructor@demo.com",
    password: "instructor123",
    name: "Dr. John Wilson",
    role: "Instructor",
  },
};

// Sample data
const sampleCourses = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. Johnson",
    description: "Basic programming concepts",
    credits: 3,
    progress: 75,
  },
  {
    id: 2,
    title: "Web Development",
    code: "WD201",
    instructor: "Prof. Davis",
    description: "HTML, CSS, JavaScript",
    credits: 4,
    progress: 60,
  },
  {
    id: 3,
    title: "Database Management",
    code: "DB301",
    instructor: "Dr. Brown",
    description: "SQL and database design",
    credits: 3,
    progress: 90,
  },
];

const sampleAssignments = [
  {
    id: 1,
    title: "Programming Quiz",
    courseName: "CS101",
    description: "Basic programming test",
    dueDate: "2025-09-15",
    points: 50,
    status: "pending",
  },
  {
    id: 2,
    title: "Web Portfolio",
    courseName: "WD201",
    description: "Create a portfolio website",
    dueDate: "2025-09-20",
    points: 100,
    status: "submitted",
  },
  {
    id: 3,
    title: "Database Design",
    courseName: "DB301",
    description: "Design database schema",
    dueDate: "2025-09-25",
    points: 75,
    status: "graded",
    grade: 85,
  },
];

const sampleGrades = [
  {
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    assignmentName: "Midterm Exam",
    pointsEarned: 85,
    totalPoints: 100,
    grade: "B+",
    date: "2025-08-15",
  },
  {
    courseCode: "WD201",
    courseName: "Web Development",
    assignmentName: "HTML/CSS Project",
    pointsEarned: 95,
    totalPoints: 100,
    grade: "A",
    date: "2025-08-20",
  },
  {
    courseCode: "DB301",
    courseName: "Database Management",
    assignmentName: "SQL Lab",
    pointsEarned: 88,
    totalPoints: 100,
    grade: "A-",
    date: "2025-08-22",
  },
];

// Initialize app when page loads
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  // Load sample data
  courses = [...sampleCourses];
  assignments = [...sampleAssignments];
  grades = [...sampleGrades];

  // Set up event listeners
  setupEventListeners();

  // Check if user is logged in
  const savedUser = sessionStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showMainContent();
  } else {
    showSignupSection();
  }
}

function setupEventListeners() {
  // Form submissions
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document
    .getElementById("signup-form")
    .addEventListener("submit", handleSignup);
  document
    .getElementById("new-course-form")
    .addEventListener("submit", handleCourseCreation);
  document
    .getElementById("new-assignment-form")
    .addEventListener("submit", handleAssignmentCreation);
  document
    .getElementById("profile-form")
    .addEventListener("submit", handleProfileUpdate);

  // Assignment filters
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      filterAssignments(this.dataset.filter);
    });
  });

  // Mobile menu toggle
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", function () {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }
}

// Login functions
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userType = document.getElementById("user-type").value;

  let user = null;

  // Check demo accounts
  for (const [type, account] of Object.entries(demoAccounts)) {
    if (
      email === account.email &&
      password === account.password &&
      userType === type
    ) {
      user = {
        email: account.email,
        name: account.name,
        role: account.role,
      };
      break;
    }
  }

  // Check registered users
  if (!user) {
    const registeredUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const registeredUser = registeredUsers.find(
      (u) =>
        u.email === email && u.password === password && u.userType === userType
    );

    if (registeredUser) {
      user = {
        email: registeredUser.email,
        name: `${registeredUser.firstName} ${registeredUser.lastName}`,
        role: userType.charAt(0).toUpperCase() + userType.slice(1),
      };
    }
  }

  // Allow any valid combination for demo
  if (!user && email && password && userType) {
    user = {
      email: email,
      name: email.split("@")[0],
      role: userType.charAt(0).toUpperCase() + userType.slice(1),
    };
  }

  if (user) {
    currentUser = user;
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    showMainContent();
  } else {
    alert("Invalid credentials. Please try again.");
  }
}

function fillDemoAccount(type) {
  const account = demoAccounts[type];
  document.getElementById("email").value = account.email;
  document.getElementById("password").value = account.password;
  document.getElementById("user-type").value = type;
}

function logout() {
  currentUser = null;
  sessionStorage.removeItem("currentUser");
  showLoginSection();
}

// Navigation functions
function showLoginSection() {
  document.getElementById("login-section").style.display = "flex";
  document.getElementById("signup-section").style.display = "none";
  document.getElementById("main-content").style.display = "none";
  document.getElementById("navbar").style.display = "none";
}

function showSignupSection() {
  document.getElementById("signup-section").style.display = "flex";
  document.getElementById("login-section").style.display = "none";
  document.getElementById("main-content").style.display = "none";
  document.getElementById("navbar").style.display = "none";
}

function showMainContent() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("signup-section").style.display = "none";
  document.getElementById("main-content").style.display = "block";
  document.getElementById("navbar").style.display = "block";

  document.getElementById("username-display").textContent = currentUser.name;

  loadDashboard();
  loadCourses();
  loadAssignments();
  loadGrades();
  loadProfile();

  showSection("dashboard");
}

// Sign up functions
function handleSignup(event) {
  event.preventDefault();

  const firstName = document.getElementById("signup-first-name").value;
  const lastName = document.getElementById("signup-last-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById(
    "signup-confirm-password"
  ).value;
  const userType = document.getElementById("signup-user-type").value;
  const termsAccepted = document.getElementById("signup-terms").checked;

  // Validation
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !userType
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  if (!termsAccepted) {
    alert("Please accept the terms.");
    return;
  }

  // Check if email exists
  const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
  if (existingUsers.some((user) => user.email === email)) {
    alert("Email already exists. Please login instead.");
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    userType: userType,
    createdAt: new Date().toISOString(),
  };

  existingUsers.push(newUser);
  localStorage.setItem("users", JSON.stringify(existingUsers));

  alert("Account created successfully! Please login.");
  showLoginSection();

  document.getElementById("email").value = newUser.email;
  document.getElementById("user-type").value = newUser.userType;
}

function showTerms() {
  alert(
    "Terms of Service: This is a demo application for educational purposes."
  );
}

function showPrivacy() {
  alert("Privacy Policy: Your data is stored locally for this demo.");
}

// Section navigation
function showSection(sectionName) {
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active");
  });

  document.getElementById(sectionName + "-section").classList.add("active");
}

// Dashboard functions
function loadDashboard() {
  document.getElementById("enrolled-courses").textContent = courses.length;
  document.getElementById("pending-assignments").textContent =
    assignments.filter((a) => a.status === "pending").length;
  document.getElementById("average-grade").textContent = "85%";
  document.getElementById("upcoming-events").textContent = "2";

  loadRecentActivity();
  loadUpcomingDeadlines();
}

function loadRecentActivity() {
  const activityList = document.getElementById("activity-list");
  const activities = [
    { message: 'You submitted "Web Portfolio Project"', time: "2 hours ago" },
    { message: 'New grade posted for "Database Design"', time: "1 day ago" },
    { message: "New announcement in CS101", time: "2 days ago" },
  ];

  activityList.innerHTML = activities
    .map(
      (activity) => `
    <div class="activity-item">
      <p><strong>${activity.message}</strong></p>
      <small>${activity.time}</small>
    </div>
  `
    )
    .join("");
}

function loadUpcomingDeadlines() {
  const deadlineList = document.getElementById("deadline-list");
  const upcoming = assignments
    .filter((a) => new Date(a.dueDate) > new Date() && a.status === "pending")
    .slice(0, 3);

  deadlineList.innerHTML = upcoming
    .map(
      (assignment) => `
    <div class="deadline-item">
      <h4>${assignment.title}</h4>
      <p>${assignment.courseName}</p>
      <small>Due: ${formatDate(assignment.dueDate)}</small>
    </div>
  `
    )
    .join("");
}

// Course functions
function loadCourses() {
  const coursesGrid = document.getElementById("courses-grid");
  const assignmentCourseSelect = document.getElementById("assignment-course");

  coursesGrid.innerHTML = courses
    .map(
      (course) => `
    <div class="course-card">
      <div class="course-header">
        <h3>${course.title}</h3>
        <p>${course.code}</p>
      </div>
      <div class="course-body">
        <p><strong>Instructor:</strong> ${course.instructor}</p>
        <p>${course.description}</p>
        <div class="progress-bar" style="background: #f0f0f0; border-radius: 10px; overflow: hidden; margin: 1rem 0;">
          <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 8px; width: ${course.progress}%;"></div>
        </div>
        <small>Progress: ${course.progress}%</small>
      </div>
      <div class="course-footer">
        <span class="status-badge status-active">${course.credits} Credits</span>
      </div>
    </div>
  `
    )
    .join("");

  // Update assignment course options
  assignmentCourseSelect.innerHTML =
    '<option value="">Select Course</option>' +
    courses
      .map(
        (course) =>
          `<option value="${course.id}">${course.code} - ${course.title}</option>`
      )
      .join("");
}

function toggleCourseForm() {
  const form = document.getElementById("course-form");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

function handleCourseCreation(event) {
  event.preventDefault();

  const newCourse = {
    id: courses.length + 1,
    title: document.getElementById("course-title").value,
    code: document.getElementById("course-code").value,
    instructor: document.getElementById("course-instructor").value,
    description: document.getElementById("course-description").value,
    credits: parseInt(document.getElementById("course-credits").value),
    progress: 0,
  };

  courses.push(newCourse);
  loadCourses();
  toggleCourseForm();
  document.getElementById("new-course-form").reset();

  alert("Course created successfully!");
}

// Assignment functions
function loadAssignments() {
  filterAssignments("all");
}

function filterAssignments(filter) {
  const assignmentsList = document.getElementById("assignments-list");
  let filteredAssignments = assignments;

  if (filter !== "all") {
    filteredAssignments = assignments.filter(
      (assignment) => assignment.status === filter
    );
  }

  assignmentsList.innerHTML = filteredAssignments
    .map(
      (assignment) => `
    <div class="assignment-item ${assignment.status}">
      <div class="assignment-header">
        <div>
          <h3>${assignment.title}</h3>
          <p class="course-name">${assignment.courseName}</p>
        </div>
        <div class="assignment-status">
          <span class="status-badge ${getStatusClass(assignment.status)}">
            ${assignment.status.toUpperCase()}
          </span>
        </div>
      </div>
      <div class="assignment-body">
        <p>${assignment.description}</p>
        <div class="assignment-meta">
          <span><i class="fas fa-calendar"></i> Due: ${formatDate(
            assignment.dueDate
          )}</span>
          <span><i class="fas fa-star"></i> ${assignment.points} points</span>
          ${
            assignment.grade
              ? `<span><i class="fas fa-check"></i> Grade: ${assignment.grade}%</span>`
              : ""
          }
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

function getStatusClass(status) {
  switch (status) {
    case "pending":
      return "status-pending";
    case "submitted":
      return "status-active";
    case "graded":
      return "status-completed";
    default:
      return "status-pending";
  }
}

function toggleAssignmentForm() {
  const form = document.getElementById("assignment-form");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

function handleAssignmentCreation(event) {
  event.preventDefault();

  const courseId = parseInt(document.getElementById("assignment-course").value);
  const course = courses.find((c) => c.id === courseId);

  const newAssignment = {
    id: assignments.length + 1,
    title: document.getElementById("assignment-title").value,
    courseName: course ? course.code : "",
    description: document.getElementById("assignment-description").value,
    dueDate: document.getElementById("assignment-due").value,
    points: parseInt(document.getElementById("assignment-points").value),
    status: "pending",
  };

  assignments.push(newAssignment);
  loadAssignments();
  toggleAssignmentForm();
  document.getElementById("new-assignment-form").reset();

  alert("Assignment created successfully!");
}

function submitAssignment(assignmentId) {
  const assignment = assignments.find((a) => a.id === assignmentId);
  if (assignment) {
    assignment.status = "submitted";
    loadAssignments();
    loadDashboard();
    alert("Assignment submitted successfully!");
  }
}

// Grades functions
function loadGrades() {
  const gradesTableBody = document.getElementById("grades-tbody");

  gradesTableBody.innerHTML = grades
    .map(
      (grade) => `
    <tr>
      <td>
        <div>
          <strong>${grade.courseCode}</strong>
          <br>
          <small>${grade.courseName}</small>
        </div>
      </td>
      <td>${grade.assignmentName}</td>
      <td>${grade.pointsEarned}</td>
      <td>${grade.totalPoints}</td>
      <td>
        <span class="grade-badge ${getGradeClass(grade.grade)}">
          ${grade.grade}
        </span>
      </td>
      <td>${formatDate(grade.date)}</td>
    </tr>
  `
    )
    .join("");

  updateGradesSummary();
}

function getGradeClass(grade) {
  if (grade.includes("A")) return "grade-a";
  if (grade.includes("B")) return "grade-b";
  return "grade-c";
}

function updateGradesSummary() {
  const totalPoints = grades.reduce(
    (sum, grade) => sum + grade.pointsEarned,
    0
  );
  const maxPoints = grades.reduce((sum, grade) => sum + grade.totalPoints, 0);
  const gpa =
    maxPoints > 0 ? ((totalPoints / maxPoints) * 4.0).toFixed(2) : "0.00";

  document.getElementById("overall-gpa").textContent = gpa;
  document.getElementById("completed-credits").textContent = courses.reduce(
    (sum, course) => sum + course.credits,
    0
  );
}

// Profile functions
function loadProfile() {
  document.getElementById("profile-name").textContent = currentUser.name;
  document.getElementById("profile-email").textContent = currentUser.email;
  document.getElementById("profile-role").textContent = currentUser.role;

  const nameParts = currentUser.name.split(" ");
  document.getElementById("first-name").value = nameParts[0] || "";
  document.getElementById("last-name").value =
    nameParts.slice(1).join(" ") || "";
  document.getElementById("profile-email-input").value = currentUser.email;
}

function handleProfileUpdate(event) {
  event.preventDefault();

  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const email = document.getElementById("profile-email-input").value;

  currentUser.name = `${firstName} ${lastName}`;
  currentUser.email = email;

  sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

  document.getElementById("username-display").textContent = currentUser.name;
  document.getElementById("profile-name").textContent = currentUser.name;
  document.getElementById("profile-email").textContent = currentUser.email;

  alert("Profile updated successfully!");
}

// Utility functions
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Make functions available globally
window.showSection = showSection;
window.logout = logout;
window.fillDemoAccount = fillDemoAccount;
window.toggleCourseForm = toggleCourseForm;
window.toggleAssignmentForm = toggleAssignmentForm;
window.submitAssignment = submitAssignment;
