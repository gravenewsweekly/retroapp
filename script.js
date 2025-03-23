const API_KEY = "$2a$10$9lovVKvnl4Bu3l2cw0/.6Osl604XMjJ14bPtG3EHFU8OUAOdhwJ0C"; 
const BIN_ID = "67e05b9c8960c979a576ffae"; 
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const HEADERS = {
    "Content-Type": "application/json",
    "X-Master-Key": API_KEY
};

// Function to Fetch Data from JSONBin
async function fetchData() {
    try {
        let response = await fetch(BIN_URL, { method: "GET", headers: HEADERS });
        let data = await response.json();
        return data.record;
    } catch (error) {
        console.error("Error fetching data:", error);
        return { users: [] }; 
    }
}

// Function to Update Data in JSONBin
async function updateData(newData) {
    try {
        await fetch(BIN_URL, {
            method: "PUT",
            headers: HEADERS,
            body: JSON.stringify(newData)
        });
    } catch (error) {
        console.error("Error updating data:", error);
    }
}

// Sign-Up Function
async function signUp(event) {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please enter both username and password!");
        return;
    }

    let data = await fetchData();
    let users = data.users || [];

    if (users.some(user => user.username === username)) {
        alert("Username already exists!");
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

    let username = document.getElementById("login-username").value.trim();
    let password = document.getElementById("login-password").value.trim();

    let data = await fetchData();
    let users = data.users || [];

    let user = users.find(u => u.username === username && u.password === password);

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
    
    if (currentUser && currentUser.plans.length > 0) {
        currentUser.plans.forEach(plan => {
            let li = document.createElement("li");
            li.textContent = `${plan.subject} at ${plan.time}`;
            studyList.appendChild(li);
        });
    }
}

// Add Study Plan
async function addStudyPlan(event) {
    event.preventDefault();

    let user = localStorage.getItem("loggedInUser");
    if (!user) {
        alert("Please log in first!");
        return;
    }

    let subject = document.getElementById("subject").value.trim();
    let time = document.getElementById("time").value.trim();

    if (!subject || !time) {
        alert("Please fill in both fields!");
        return;
    }

    let data = await fetchData();
    let users = data.users || [];
    let currentUser = users.find(u => u.username === user);

    if (!currentUser) {
        alert("User not found!");
        return;
    }

    // Push new plan
    currentUser.plans.push({ subject, time });

    await updateData({ users });

    document.getElementById("study-form").reset();
    loadDashboard();
}

// Logout Function
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
