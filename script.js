const API_KEY = "$2a$10$9lovVKvnl4Bu3l2cw0/.6Osl604XMjJ14bPtG3EHFU8OUAOdhwJ0C"; 
const BIN_ID = "67e05b9c8960c979a576ffae"; 
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const HEADERS = {
    "Content-Type": "application/json",
    "X-Master-Key": API_KEY
};

// Function to Get JSON Data
async function fetchData() {
    let response = await fetch(BIN_URL, { method: "GET", headers: HEADERS });
    let data = await response.json();
    return data.record;
}

// Function to Update JSON Data
async function updateData(newData) {
    await fetch(BIN_URL, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify(newData)
    });
}

// Sign-Up Function
async function signUp(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let data = await fetchData();
    let users = data.users || [];

    if (users.some(user => user.username === username)) {
        alert("Username already taken!");
        return;
    }

    users.push({ username, password, plans: [] });

    await updateData({ users });

    localStorage.setItem("loggedInUser", username);
    window.location.href = "dashboard.html";
}

// Login Function
async function login(event) {
    event.preventDefault();

    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    let data = await fetchData();
    let users = data.users || [];

    let user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid username or password!");
    }
}

// Load Dashboard Data
async function loadDashboard() {
    let user = localStorage.getItem("loggedInUser");
    if (!user) return (window.location.href = "index.html");

    document.getElementById("user-name").textContent = user;
    let data = await fetchData();
    let users = data.users || [];
    let currentUser = users.find(u => u.username === user);

    let studyList = document.getElementById("study-list");
    studyList.innerHTML = "";
    currentUser.plans.forEach(plan => {
        let li = document.createElement("li");
        li.textContent = `${plan.subject} at ${plan.time}`;
        studyList.appendChild(li);
    });

    // Update Navbar for Logged-in User
    document.getElementById("signup-link").style.display = "none";
    let userDisplay = document.getElementById("username-display");
    userDisplay.textContent = user;
    userDisplay.style.display = "inline";
}

// Add Study Plan
async function addStudyPlan(event) {
    event.preventDefault();

    let user = localStorage.getItem("loggedInUser");
    let subject = document.getElementById("subject").value;
    let time = document.getElementById("time").value;

    let data = await fetchData();
    let users = data.users || [];
    let currentUser = users.find(u => u.username === user);

    currentUser.plans.push({ subject, time });

    await updateData({ users });

    document.getElementById("study-form").reset();
    loadDashboard();
}

// Logout
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

// Delete Account
async function deleteAccount() {
    let user = localStorage.getItem("loggedInUser");
    let data = await fetchData();
    let users = data.users.filter(u => u.username !== user);

    await updateData({ users });

    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

// Event Listeners
document.getElementById("signup-form")?.addEventListener("submit", signUp);
document.getElementById("login-form")?.addEventListener("submit", login);
document.getElementById("study-form")?.addEventListener("submit", addStudyPlan);
document.getElementById("logout-btn")?.addEventListener("click", logout);
document.getElementById("delete-btn")?.addEventListener("click", deleteAccount);
document.addEventListener("DOMContentLoaded", loadDashboard);
