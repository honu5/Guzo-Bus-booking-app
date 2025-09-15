'use strict'

// Utility function for event handling
const addEventOnElem = (elem, type, callback) => {
    if (elem.length) {
        for (let i = 0; i < elem.length; i++) {
            elem[i].addEventListener(type, callback);
        }
    } else {
        elem.addEventListener(type, callback);
    }
}

// DOM elements
const threedash = document.querySelector('.three-dash');
const sidebar = document.querySelector('.side-bar-container');
const routes = document.querySelector('.routes');

// Sidebar toggle function
const toggleSidebar = () => sidebar.classList.toggle("active");

// Event listeners
addEventOnElem(threedash, 'click', toggleSidebar);

// Close sidebar when clicking outside
document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !threedash.contains(event.target)) {
        sidebar.classList.remove('active');
    }
});

// Scroll effect for routes
window.addEventListener("scroll", () => {
    routes.classList.toggle("active", window.scrollY > 20);
});






