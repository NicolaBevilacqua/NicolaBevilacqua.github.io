/* =============================================
   PORTFOLIO PCTO - NICOLA BEVILACQUA
   File: script.js
   Descrizione: JavaScript per navigazione SPA e interazioni
   ============================================= */

// =============================================
// DOM ELEMENTS
// =============================================
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const skillBars = document.querySelectorAll('.progress-bar');
const navbar = document.querySelector('.navbar');
const fabContainer = document.querySelector('.fab-container');
const fabMain = document.querySelector('.fab-main');
const fabOptions = document.querySelector('.fab-options');
const logoSignature = document.querySelector('.nav-logo');

// =============================================
// STATE MANAGEMENT
// =============================================
let isMenuOpen = false;
let isFabOpen = false;
let currentSection = 'home';
let skillsAnimated = false;

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Throttle function per ottimizzare le performance
 */
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

/**
 * Debounce function per ottimizzare le performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =============================================
// NAVIGATION FUNCTIONS
// =============================================

/**
 * Mostra una sezione specifica (SPA navigation)
 */
function showSection(targetId) {
    // Evita navigazione inutile
    if (currentSection === targetId) return;
    
    const currentSectionEl = document.getElementById(currentSection);
    const targetSectionEl = document.getElementById(targetId);
    
    if (!targetSectionEl) return;
    
    // Nascondi sezione corrente
    if (currentSectionEl) {
        currentSectionEl.classList.remove('active');
    }
    
    // Mostra nuova sezione
    targetSectionEl.classList.add('active');
    
    // Aggiorna stato
    currentSection = targetId;
    
    // Aggiorna URL senza ricaricare la pagina
    if (history.pushState) {
        history.pushState(null, null, `#${targetId}`);
    }
    
    // Aggiorna navigazione attiva
    updateActiveNavLink(targetId);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Inizializza contenuto specifico della sezione
    initializeSectionContent(targetId);
    
    // Chiudi menu mobile se aperto
    if (isMenuOpen) {
        toggleMobileMenu();
    }
}

/**
 * Aggiorna il link di navigazione attivo
 */
function updateActiveNavLink(targetId) {
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`[data-section="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
    
    // Rimuovi aria-current dagli altri link
    navLinks.forEach(link => {
        if (link !== activeLink) {
            link.removeAttribute('aria-current');
        }
    });
}

/**
 * Inizializza contenuto specifico per sezione
 */
function initializeSectionContent(sectionId) {
    switch(sectionId) {
        case 'competenze':
            // Anima barre competenze con ritardo
            setTimeout(() => {
                if (!skillsAnimated) {
                    animateSkillBars();
                    skillsAnimated = true;
                }
            }, 200);
            break;
        case 'home':
            // Riavvia animazioni contatori se necessario
            setTimeout(initializeCounters, 300);
            break;
    }
}

// =============================================
// MOBILE MENU FUNCTIONS
// =============================================

/**
 * Toggle menu mobile
 */
function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    
    // Aggiorna classi
    if (navMenu) navMenu.classList.toggle('active', isMenuOpen);
    if (navToggle) navToggle.classList.toggle('active', isMenuOpen);
    
    // Blocca/sblocca scroll body
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    
    // Accessibility
    if (navToggle) navToggle.setAttribute('aria-expanded', isMenuOpen);
    if (navMenu) navMenu.setAttribute('aria-hidden', !isMenuOpen);
}

// =============================================
// FLOATING ACTION BUTTON (FAB)
// =============================================

/**
 * Toggle FAB menu
 */
function toggleFAB() {
    isFabOpen = !isFabOpen;
    
    // Aggiorna classi e stili
    if (fabOptions) fabOptions.classList.toggle('active', isFabOpen);
    if (fabMain) fabMain.classList.toggle('active', isFabOpen);
    
    // Accessibility
    if (fabMain) fabMain.setAttribute('aria-expanded', isFabOpen);
    if (fabOptions) fabOptions.setAttribute('aria-hidden', !isFabOpen);
}

/**
 * Gestisce azioni FAB
 */
function handleFABAction(action) {
    switch(action) {
        case 'scroll-top':
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
        case 'home':
            showSection('home');
            break;
        case 'theme':
            toggleTheme();
            break;
        default:
            break;
    }
    
    // Chiudi FAB dopo azione
    if (isFabOpen) {
        toggleFAB();
    }
}

// =============================================
// THEME MANAGEMENT
// =============================================

/**
 * Toggle tema chiaro/scuro
 */
function toggleTheme() {
    const isLightTheme = document.body.classList.contains('light-theme');
    
    if (isLightTheme) {
        document.body.classList.remove('light-theme');
        if (typeof Storage !== "undefined") {
            localStorage.setItem('theme', 'dark');
        }
    } else {
        document.body.classList.add('light-theme');
        if (typeof Storage !== "undefined") {
            localStorage.setItem('theme', 'light');
        }
    }
    
    // Aggiorna icona FAB tema
    const themeIcon = document.querySelector('[data-action="theme"] i');
    if (themeIcon) {
        themeIcon.className = isLightTheme ? 'fas fa-moon' : 'fas fa-sun';
    }
}

/**
 * Inizializza tema da localStorage
 */
function initializeTheme() {
    if (typeof Storage !== "undefined") {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            const themeIcon = document.querySelector('[data-action="theme"] i');
            if (themeIcon) {
                themeIcon.className = 'fas fa-sun';
            }
        }
    }
}

// =============================================
// ANIMATIONS
// =============================================

/**
 * Anima barre competenze
 */
function animateSkillBars() {
    skillBars.forEach((bar, index) => {
        const skillCard = bar.closest('.skill-card');
        const percentage = skillCard?.getAttribute('data-skill') || '0';
        
        setTimeout(() => {
            bar.style.width = percentage + '%';
            bar.classList.add('animated');
            
            // Anima anche il numero percentuale
            const percentageElement = skillCard?.querySelector('.skill-percentage');
            if (percentageElement) {
                animateNumber(percentageElement, 0, parseInt(percentage), '%');
            }
        }, index * 150);
    });
}

/**
 * Anima contatori numerici
 */
function animateNumber(element, start, end, suffix = '') {
    if (!element) return;
    
    const duration = 1500;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = end + suffix;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/**
 * Inizializza contatori home
 */
function initializeCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const counters = [
        { element: statNumbers[0], end: 150, suffix: '+' },
        { element: statNumbers[1], end: 8, suffix: '' },
        { element: statNumbers[2], end: 12, suffix: '' }
    ];
    
    counters.forEach((counter, index) => {
        if (counter.element) {
            setTimeout(() => {
                animateNumber(counter.element, 0, counter.end, counter.suffix);
            }, index * 300);
        }
    });
}

// =============================================
// SCROLL EFFECTS
// =============================================

/**
 * Gestisce effetti scroll navbar
 */
const handleNavbarScroll = throttle(() => {
    if (!navbar) return;
    
    const scrolled = window.pageYOffset > 20;
    
    if (scrolled) {
        navbar.style.background = document.body.classList.contains('light-theme') 
            ? 'rgba(248, 250, 252, 0.9)' 
            : 'rgba(10, 10, 10, 0.9)';
        navbar.style.backdropFilter = 'blur(25px)';
        navbar.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = document.body.classList.contains('light-theme')
            ? 'rgba(248, 250, 252, 0.85)'
            : 'rgba(10, 10, 10, 0.85)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = 'none';
    }
}, 16);

// =============================================
// INTERSECTION OBSERVER
// =============================================

/**
 * Observer per animazioni al scroll
 */
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Se è una skill card, anima anche la barra
            if (entry.target.classList.contains('skill-card') && currentSection === 'competenze') {
                const progressBar = entry.target.querySelector('.progress-bar');
                const percentage = entry.target.getAttribute('data-skill');
                
                if (progressBar && percentage) {
                    setTimeout(() => {
                        progressBar.style.width = percentage + '%';
                    }, 200);
                }
            }
            
            // Smetti di osservare l'elemento
            intersectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// =============================================
// EVENT LISTENERS
// =============================================

/**
 * Inizializza event listeners
 */
function initializeEventListeners() {
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMobileMenu();
        });
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            if (targetSection) {
                showSection(targetSection);
            }
        });
    });
    
    // Logo click - torna home
    if (logoSignature) {
        logoSignature.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('home');
        });
    }
    
    // FAB main button
    if (fabMain) {
        fabMain.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFAB();
        });
    }
    
    // FAB options
    document.querySelectorAll('.fab-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const action = option.getAttribute('data-action');
            if (action) {
                handleFABAction(action);
            }
        });
    });
    
    // CTA buttons in hero section
    document.querySelectorAll('.cta-primary, .cta-secondary').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const onclick = button.getAttribute('onclick');
            if (onclick) {
                // Esegui la funzione onclick in modo sicuro
                try {
                    eval(onclick);
                } catch (error) {
                    // Fallback: cerca data-section o usa default
                    const section = button.getAttribute('data-section') || 'percorso';
                    showSection(section);
                }
            }
        });
    });
    
    // Scroll events
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Browser navigation (back/forward)
    window.addEventListener('popstate', handleBrowserNavigation);
    
    // Click fuori per chiudere menu
    document.addEventListener('click', handleOutsideClick);
    
    // Resize window
    window.addEventListener('resize', debounce(handleWindowResize, 250));
}

/**
 * Gestisce navigazione da tastiera
 */
function handleKeyboardNavigation(e) {
    switch(e.key) {
        case 'Escape':
            if (isMenuOpen) toggleMobileMenu();
            if (isFabOpen) toggleFAB();
            break;
        case 'Tab':
            // Gestione focus trap per menu mobile
            if (isMenuOpen) {
                trapFocusInMenu(e);
            }
            break;
    }
}

/**
 * Gestisce navigazione browser
 */
function handleBrowserNavigation() {
    const hash = window.location.hash.substring(1);
    const targetSection = hash || 'home';
    
    if (targetSection !== currentSection) {
        showSection(targetSection);
    }
}

/**
 * Gestisce click fuori per chiudere menu
 */
function handleOutsideClick(e) {
    // Chiudi menu mobile se click fuori
    if (isMenuOpen && navMenu && navToggle && 
        !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        toggleMobileMenu();
    }
    
    // Chiudi FAB se click fuori
    if (isFabOpen && fabContainer && !fabContainer.contains(e.target)) {
        toggleFAB();
    }
}

/**
 * Gestisce ridimensionamento finestra
 */
function handleWindowResize() {
    // Chiudi menu mobile su resize a desktop
    if (window.innerWidth > 768 && isMenuOpen) {
        toggleMobileMenu();
    }
}

/**
 * Trap focus nel menu mobile per accessibility
 */
function trapFocusInMenu(e) {
    if (!navMenu) return;
    
    const focusableElements = navMenu.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
    }
}

// =============================================
// INITIALIZATION
// =============================================

/**
 * Inizializza portfolio
 */
function initializePortfolio() {
    try {
        // Inizializza tema
        initializeTheme();
        
        // Determina sezione iniziale
        const hash = window.location.hash.substring(1);
        const initialSection = hash || 'home';
        
        // Mostra sezione iniziale
        showSection(initialSection);
        
        // Inizializza event listeners
        initializeEventListeners();
        
        // Inizializza intersection observer
        document.querySelectorAll('.timeline-item, .skill-card').forEach(element => {
            intersectionObserver.observe(element);
        });
        
        // Inizializza contatori se siamo nella home
        if (initialSection === 'home') {
            setTimeout(initializeCounters, 500);
        }
        
        // Accessibilità iniziale
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        if (navMenu) navMenu.setAttribute('aria-hidden', 'true');
        if (fabMain) fabMain.setAttribute('aria-expanded', 'false');
        if (fabOptions) fabOptions.setAttribute('aria-hidden', 'true');
        
    } catch (error) {
        // Gestione errori silenziosa
    }
}

// =============================================
// GLOBAL FUNCTIONS (per onclick inline)
// =============================================

// Rendi showSection globale per gli onclick inline nell'HTML
window.showSection = showSection;

// =============================================
// START APPLICATION
// =============================================

// Avvia applicazione quando DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}