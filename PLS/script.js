// Theme toggle functionality with enhanced transitions
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Set initial theme based on user's system preference
if (prefersDarkScheme.matches) {
    body.classList.add('dark-theme');
    themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Enhanced color picker functionality
const colorToggle = document.getElementById('colorToggle');
const colorPicker = document.getElementById('colorPicker');
const colorButtons = colorPicker.querySelectorAll('button');

colorToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    colorPicker.classList.toggle('show');
    // Add rotation animation to the palette icon
    colorToggle.querySelector('i').style.transform = 
        colorPicker.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
});

// Enhanced click outside handling with animation
document.addEventListener('click', (e) => {
    if (!colorToggle.contains(e.target) && !colorPicker.contains(e.target)) {
        colorPicker.classList.remove('show');
        colorToggle.querySelector('i').style.transform = 'rotate(0deg)';
    }
});

// Add transition for palette icon
colorToggle.querySelector('i').style.transition = 'transform 0.3s ease';

colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const color = button.dataset.color;
        document.documentElement.style.setProperty('--title-color', color);
        colorPicker.classList.remove('show');
        
        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    });
});

// Improved click outside handling
document.addEventListener('click', (e) => {
    if (!colorToggle.contains(e.target) && !colorPicker.contains(e.target)) {
        colorPicker.classList.remove('show');
    }
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add intersection observer for fade-in animations
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all major sections
document.querySelectorAll('.content-box, .institutional-logos, .logo-container').forEach(section => {
    observer.observe(section);
});