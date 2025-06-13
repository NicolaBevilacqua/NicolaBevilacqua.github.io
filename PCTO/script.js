// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const skillBars = document.querySelectorAll('.progress-bar');
const logoSignature = document.querySelector('.logo-signature');
const navbar = document.querySelector('.navbar');
const fabContainer = document.querySelector('.fab-container');
const fabMain = document.querySelector('.fab-main');

// State management
let isMenuOpen = false;
let isFabOpen = false;
let currentSection = 'home';

// Performance optimization - Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Navigation Toggle (Mobile)
function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    navMenu.classList.toggle('active', isMenuOpen);
    navToggle.classList.toggle('active', isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

navToggle?.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) {
            toggleMobileMenu();
        }
    });
});

// Section navigation
function showSection(targetId) {
    if (currentSection === targetId) return;
    
    const currentSectionEl = document.getElementById(currentSection);
    const targetSectionEl = document.getElementById(targetId);
    
    if (!targetSectionEl) return;
    
    // Simple section switching
    currentSectionEl?.classList.remove('active');
    targetSectionEl.classList.add('active');
    
    currentSection = targetId;
    history.pushState(null, null, `#${targetId}`);
    
    // Initialize section-specific content
    if (targetId === 'competenze') {
        setTimeout(() => animateSkillBars(), 100);
    }
    
    updateActiveNavLink(targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update active navigation link
function updateActiveNavLink(targetId) {
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`[data-section="${targetId}"]`);
    activeLink?.classList.add('active');
}

// Add click event listeners to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');
        if (targetSection) {
            showSection(targetSection);
        }
    });
});

// Skill bars animation (semplificata)
function animateSkillBars() {
    skillBars.forEach((bar, index) => {
        const level = bar.getAttribute('data-level') || bar.parentElement.getAttribute('data-level');
        if (level) {
            setTimeout(() => {
                bar.style.width = level + '%';
                bar.classList.add('animated');
            }, index * 100);
        }
    });
}

// Intersection Observer per animazioni al scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            intersectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Counter animation (semplificata)
function animateCounter(element, end, suffix = '') {
    let current = 0;
    const increment = end / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 40);
}

// Navbar scroll effects (ottimizzati)
const handleScroll = throttle(() => {
    const scrolled = window.pageYOffset > 10;
    navbar.style.background = scrolled ? 
        'rgba(255, 255, 255, 0.15)' : 
        'rgba(255, 255, 255, 0.1)';
    navbar.style.backdropFilter = scrolled ? 'blur(25px)' : 'blur(20px)';
    navbar.style.boxShadow = scrolled ? '0 8px 32px rgba(0,0,0,0.1)' : 'none';
}, 32);

window.addEventListener('scroll', handleScroll);

// Logo click
logoSignature?.addEventListener('click', () => {
    logoSignature.style.transform = 'scale(1.1)';
    setTimeout(() => {
        logoSignature.style.transform = 'scale(1)';
    }, 200);
    showSection('home');
});

// FAB functionality
function toggleFAB() {
    isFabOpen = !isFabOpen;
    fabContainer?.classList.toggle('active', isFabOpen);
    if (fabMain) {
        fabMain.style.transform = isFabOpen ? 'rotate(45deg)' : 'rotate(0deg)';
    }
}

fabMain?.addEventListener('click', toggleFAB);

// FAB options
document.querySelectorAll('.fab-option').forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const action = option.getAttribute('data-action');
        switch(action) {
            case 'top':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'contact':
                showSection('contatti');
                break;
            case 'download':
                console.log('Download CV');
                break;
            case 'theme':
                toggleTheme();
                break;
        }
        toggleFAB();
    });
});

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', 
        document.body.classList.contains('dark-theme') ? 'dark' : 'light'
    );
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
            if (target.classList.contains('section')) {
                showSection(targetId);
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isMenuOpen) toggleMobileMenu();
        if (isFabOpen) toggleFAB();
    }
});

// Handle browser navigation
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    const targetSection = hash || 'home';
    showSection(targetSection);
});

// Initialization
function initializePortfolio() {
    // Set initial section
    const hash = window.location.hash.substring(1);
    const initialSection = hash || 'home';
    showSection(initialSection);
    
    // Initialize observers for timeline and skill cards
    document.querySelectorAll('.timeline-item, .skill-card').forEach(element => {
        intersectionObserver.observe(element);
    });
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Initialize home counters
    const statNumbers = document.querySelectorAll('.stat-number');
    const stats = [150, 8, 12];
    const suffixes = ['+', '', '+'];
    
    statNumbers.forEach((element, index) => {
        if (element && stats[index]) {
            setTimeout(() => {
                animateCounter(element, stats[index], suffixes[index]);
            }, index * 300);
        }
    });
    
    console.log('Portfolio initialized successfully!');
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}

// Essential CSS animations
const essentialStyles = `
    .animate-in {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.6s ease;
    }
    
    .timeline-item,
    .skill-card {
        opacity: 0;
        transform: translateY(20px);
    }
    
    .progress-bar.animated {
        transition: width 1s ease;
    }
    
    .nav-menu.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = essentialStyles;
document.head.appendChild(styleSheet);