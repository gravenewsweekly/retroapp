const API_KEY = "$2a$10$9lovVKvnl4Bu3l2cw0/.6Osl604XMjJ14bPtG3EHFU8OUAOdhwJ0C"; // Your API Key
const BIN_ID = "67e05b9c8960c979a576ffae"; // Your Bin ID
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const HEADERS = {
    "Content-Type": "application/json",
    "X-Master-Key": API_KEY
};

// Sign-Up Function
async function signUp(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let response = await fetch(BIN_URL, { method: "GET", headers: HEADERS });
    let data = await response.json();
    let users = data.record.users || [];

    // Check if user already exists
    if (users.some(user => user.username === username)) {
        alert("Username already taken!");
        return;
    }

    users.push({ username, password });

    await fetch(BIN_URL, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify({ users })
    });

    localStorage.setItem("loggedInUser", username);
    window.location.href = "index.html";
}

// Load User Info
function loadUser() {
    let loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser) {
        document.getElementById("signup-link").style.display = "none";
        let usernameDisplay = document.getElementById("username-display");
        usernameDisplay.textContent = loggedInUser;
        usernameDisplay.style.display = "inline";
        document.getElementById("logout-btn").style.display = "block";
        document.getElementById("delete-btn").style.display = "block";
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.reload();
}

// Delete Account
async function deleteAccount() {
    let loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) return;

    let response = await fetch(BIN_URL, { method: "GET", headers: HEADERS });
    let data = await response.json();
    let users = data.record.users || [];

    users = users.filter(user => user.username !== loggedInUser);

    await fetch(BIN_URL, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify({ users })
    });

    localStorage.removeItem("loggedInUser");
    alert("Account deleted!");
    window.location.reload();
}

// Event Listeners
document.addEventListener("DOMContentLoaded", loadUser);
document.getElementById("signup-form")?.addEventListener("submit", signUp);
document.getElementById("logout-btn")?.addEventListener("click", logout);
document.getElementById("delete-btn")?.addEventListener("click", deleteAccount);
