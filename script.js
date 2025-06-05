// DOM Elements
const usersGrid = document.getElementById('usersGrid');
const reloadBtn = document.getElementById('reloadBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorContainer = document.getElementById('errorContainer');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');

// API URL
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// State
let users = [];

// Theme Management
const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
};

themeToggle.addEventListener('click', toggleTheme);

// Function to show/hide loading spinner
const toggleLoading = (show) => {
    loadingSpinner.classList.toggle('hidden', !show);
};

// Function to show/hide error message
const toggleError = (show) => {
    errorContainer.classList.toggle('hidden', !show);
};

// Function to create a user card with icons
const createUserCard = (user) => {
    const card = document.createElement('div');
    card.className = 'user-card';
    
    card.innerHTML = `
        <h2 class="user-name">${user.name}</h2>
        <p class="user-email">
            <i class="fas fa-envelope"></i>
            ${user.email}
        </p>
        <div class="user-address">
            <p>
                <i class="fas fa-map-marker-alt"></i>
                ${user.address.street}, ${user.address.suite}
            </p>
            <p>
                <i class="fas fa-city"></i>
                ${user.address.city}, ${user.address.zipcode}
            </p>
        </div>
    `;
    
    return card;
};

// Function to filter users based on search input
const filterUsers = (searchTerm) => {
    const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    displayUsers(filtered);
};

// Function to display users
const displayUsers = (usersToDisplay) => {
    usersGrid.innerHTML = '';
    usersToDisplay.forEach(user => {
        const userCard = createUserCard(user);
        usersGrid.appendChild(userCard);
    });
};

// Function to fetch and display users
const fetchUsers = async () => {
    // Clear previous content and show loading spinner
    usersGrid.innerHTML = '';
    toggleError(false);
    toggleLoading(true);
    
    try {
        // Fetch users data
        const response = await fetch(API_URL);
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse JSON response
        users = await response.json();
        
        // Display users
        displayUsers(users);
        
    } catch (error) {
        console.error('Error fetching users:', error);
        toggleError(true);
    } finally {
        toggleLoading(false);
    }
};

// Event Listeners
reloadBtn.addEventListener('click', fetchUsers);

searchInput.addEventListener('input', (e) => {
    filterUsers(e.target.value);
});

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', fetchUsers);