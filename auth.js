// Authentication and Navigation Logic

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${tab}-form`).classList.add('active');
        });
    });

    // Handle login form
    document.getElementById('login').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        if (email && password) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('isLoggedIn', 'true');
            redirectToDashboard();
        } else {
            alert('Please fill in all fields');
        }
    });

    // Handle signup form
    document.getElementById('signup').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const profession = document.getElementById('signup-profession').value;
        if (name && email && password && profession) {
            const userData = {
                name: name,
                email: email,
                profession: profession,
                createdAt: new Date().toISOString()
            };
            // Store user data in a **per-user object**
            localStorage.setItem(`user_${email}`, JSON.stringify(userData));
            localStorage.setItem('userEmail', email);
            localStorage.setItem('isLoggedIn', 'true');
            redirectToSpecificDashboard(profession);
        } else {
            alert('Please fill in all fields');
        }
    });

    // Profession card clicks
    document.querySelectorAll('.profession-card').forEach(card => {
        card.addEventListener('click', () => {
            const field = card.dataset.field;
            if (localStorage.getItem('isLoggedIn') === 'true') {
                redirectToSpecificDashboard(field);
            } else {
                document.getElementById('signup-profession').value = field;
                document.querySelector('[data-tab="signup"]').click();
            }
        });
    });

    // Check if user is already logged in
    checkLoginStatus();
});

// Check login
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    if (isLoggedIn === 'true' && email) {
        const userData = JSON.parse(localStorage.getItem(`user_${email}`) || '{}');
        if (userData.profession) {
            redirectToSpecificDashboard(userData.profession);
        }
    }
}

function redirectToDashboard() {
    window.location.href = 'dashboards/selector.html';
}

function redirectToSpecificDashboard(profession) {
    const dashboardMap = {
        'tech': 'dashboards/tech/',
        'design': 'dashboards/design/',
        'academic': 'dashboards/academic/',
        'business': 'dashboards/business/',
        'content': 'dashboards/content/',
        'music': 'dashboards/music/',
        'sports': 'dashboards/sports/',
        'health': 'dashboards/health/',
        'social': 'dashboards/social/',
        'others': 'dashboards/others/'
    };
    const dashboardPath = dashboardMap[profession];
    if (dashboardPath) {
        window.location.href = dashboardPath;
    } else {
        window.location.href = 'dashboards/selector.html';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = '../index.html';
}

function getCurrentUser() {
    const email = localStorage.getItem('userEmail');
    const userData = JSON.parse(localStorage.getItem(`user_${email}`) || '{}');
    return { ...userData, email };
}

// ✅ Updated: per-user storage
function saveToStorage(key, value) {
    const email = localStorage.getItem('userEmail');
    if (!email) return;
    const storageKey = `${email}_${key}`; // e.g., "userB_designProjects"
    localStorage.setItem(storageKey, JSON.stringify(value));
}

function loadFromStorage(key) {
    const email = localStorage.getItem('userEmail');
    if (!email) return null;
    const storageKey = `${email}_${key}`;
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
}

// Export functions
window.authUtils = {
    logout,
    getCurrentUser,
    saveToStorage,
    loadFromStorage,
    redirectToSpecificDashboard
};
