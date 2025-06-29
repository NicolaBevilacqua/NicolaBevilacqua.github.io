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
    
    if (!targetSectionEl) {
        console.warn(`Sezione non trovata: ${targetId}`);
        return;
    }
    
    // Nascondi sezione corrente
    if (currentSectionEl) {
        currentSectionEl.classList.remove('active');
    }
    
    // Mostra nuova sezione
    targetSectionEl.classList.add('active');
    
    // Aggiorna stato
    currentSection = targetId;
    
    // Aggiorna URL senza ricaricare la pagina
    history.pushState(null, null, `#${targetId}`);
    
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
    
    console.log(`Navigato a sezione: ${targetId}`);
}

/**
 * Aggiorna il link di navigazione attivo
 */
function updateActiveNavLink(targetId) {
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`[data-section="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
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
        case 'contatti':
            // Anima cards contatti
            setTimeout(animateContactCards, 100);
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
    navMenu.classList.toggle('active', isMenuOpen);
    navToggle.classList.toggle('active', isMenuOpen);
    
    // Blocca/sblocca scroll body
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    
    // Accessibility
    navToggle.setAttribute('aria-expanded', isMenuOpen);
    navMenu.setAttribute('aria-hidden', !isMenuOpen);
    
    console.log(`Menu mobile: ${isMenuOpen ? 'aperto' : 'chiuso'}`);
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
    fabOptions.classList.toggle('active', isFabOpen);
    fabMain.classList.toggle('active', isFabOpen);
    
    // Accessibility
    fabMain.setAttribute('aria-expanded', isFabOpen);
    fabOptions.setAttribute('aria-hidden', !isFabOpen);
    
    console.log(`FAB: ${isFabOpen ? 'aperto' : 'chiuso'}`);
}

/**
 * Gestisce azioni FAB
 */
function handleFABAction(action) {
    switch(action) {
        case 'top':
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
        case 'contact':
            showSection('contatti');
            break;
        case 'download':
            handleCVDownload();
            break;
        case 'theme':
            toggleTheme();
            break;
        default:
            console.warn(`Azione FAB non riconosciuta: ${action}`);
    }
    
    // Chiudi FAB dopo azione
    if (isFabOpen) {
        toggleFAB();
    }
}

/**
 * Gestisce download CV (placeholder)
 */
function handleCVDownload() {
    // Placeholder per download CV
    const link = document.createElement('a');
    link.href = '#'; // Sostituire con URL reale del CV
    link.download = 'CV_Nicola_Bevilacqua.pdf';
    
    // Feedback visivo
    showNotification('Download CV avviato', 'info');
    console.log('Download CV richiesto');
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
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    }
    
    // Aggiorna icona FAB tema
    const themeIcon = document.querySelector('[data-action="theme"] i');
    if (themeIcon) {
        themeIcon.className = isLightTheme ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    console.log(`Tema cambiato a: ${isLightTheme ? 'scuro' : 'chiaro'}`);
}

/**
 * Inizializza tema da localStorage
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        const themeIcon = document.querySelector('[data-action="theme"] i');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
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
    
    console.log('Animazione barre competenze avviata');
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
    const counters = [
        { selector: '.stat-number:nth-child(1)', end: 150, suffix: '+' },
        { selector: '.stat-number:nth-child(2)', end: 8, suffix: '' },
        { selector: '.stat-number:nth-child(3)', end: 12, suffix: '+' }
    ];
    
    counters.forEach((counter, index) => {
        const element = document.querySelector(counter.selector);
        if (element) {
            setTimeout(() => {
                animateNumber(element, 0, counter.end, counter.suffix);
            }, index * 300);
        }
    });
}

/**
 * Anima cards contatti
 */
function animateContactCards() {
    const cards = document.querySelectorAll('.contact-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate-in');
        }, index * 100);
    });
}

// =============================================
// SCROLL EFFECTS
// =============================================

/**
 * Gestisce effetti scroll navbar
 */
const handleNavbarScroll = throttle(() => {
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
// NOTIFICATION SYSTEM
// =============================================

/**
 * Mostra notifica temporanea
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animazione entrata
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Rimozione automatica
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// =============================================
// EVENT LISTENERS
// =============================================

/**
 * Inizializza event listeners
 */
function initializeEventListeners() {
    // Mobile menu toggle
    navToggle?.addEventListener('click', toggleMobileMenu);
    
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
    logoSignature?.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home');
    });
    
    // FAB main button
    fabMain?.addEventListener('click', toggleFAB);
    
    // FAB options
    document.querySelectorAll('.fab-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = option.getAttribute('data-action');
            if (action) {
                handleFABAction(action);
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
    if (isMenuOpen && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        toggleMobileMenu();
    }
    
    // Chiudi FAB se click fuori
    if (isFabOpen && !fabContainer.contains(e.target)) {
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
        document.querySelectorAll('.timeline-item, .skill-card, .contact-card').forEach(element => {
            intersectionObserver.observe(element);
        });
        
        // Inizializza contatori se siamo nella home
        if (initialSection === 'home') {
            setTimeout(initializeCounters, 500);
        }
        
        // Accessibilità iniziale
        navToggle?.setAttribute('aria-expanded', 'false');
        navMenu?.setAttribute('aria-hidden', 'true');
        fabMain?.setAttribute('aria-expanded', 'false');
        fabOptions?.setAttribute('aria-hidden', 'true');
        
        console.log('Portfolio PCTO inizializzato con successo!');
        
    } catch (error) {
        console.error('Errore durante inizializzazione:', error);
    }
}

// =============================================
// START APPLICATION
// =============================================

// Avvia applicazione quando DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}

// Esporta funzioni per debug (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.PortfolioDebug = {
        showSection,
        toggleTheme,
        toggleMobileMenu,
        toggleFAB,
        animateSkillBars,
        currentSection: () => currentSection
    };
}