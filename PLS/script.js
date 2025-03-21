const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

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

const colorToggle = document.getElementById('colorToggle');
const colorPicker = document.getElementById('colorPicker');
const colorButtons = colorPicker.querySelectorAll('button');

colorToggle.querySelector('i').style.transition = 'transform 0.3s ease';

colorToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    colorPicker.classList.toggle('show');
    colorToggle.querySelector('i').style.transform = 
        colorPicker.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
});

document.addEventListener('click', (e) => {
    if (!colorToggle.contains(e.target) && !colorPicker.contains(e.target)) {
        colorPicker.classList.remove('show');
        colorToggle.querySelector('i').style.transform = 'rotate(0deg)';
    }
});

colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const color = button.dataset.color;
        document.documentElement.style.setProperty('--title-color', color);
        colorPicker.classList.remove('show');

        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

const style = document.createElement('style');
style.textContent = `
    .content-box, .institutional-logos, .logo-container {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.content-box, .institutional-logos, .logo-container').forEach(section => {
        observer.observe(section);
    });
});