// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Color picker functionality
const colorToggle = document.getElementById('colorToggle');
const colorPicker = document.getElementById('colorPicker');
const colorButtons = colorPicker.querySelectorAll('button');

colorToggle.addEventListener('click', () => {
    colorPicker.classList.toggle('show');
});

colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const color = button.dataset.color;
        document.documentElement.style.setProperty('--title-color', color);
        colorPicker.classList.remove('show');
    });
});

// Close color picker when clicking outside
document.addEventListener('click', (e) => {
    if (!colorToggle.contains(e.target) && !colorPicker.contains(e.target)) {
        colorPicker.classList.remove('show');
    }
});