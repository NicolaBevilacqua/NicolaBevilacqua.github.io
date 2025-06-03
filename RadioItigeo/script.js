// Script per il cambio tema
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('i');

// Controlla se il tema è salvato in localStorage
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggleBtn.addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    
    if (document.body.classList.contains('light-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// Script per il cambio colore dei titoli
const colorItems = document.querySelectorAll('.color-menu .dropdown-item');
const defaultColor = '#3b82f6'; // Il tuo colore accent da CSS

// Applica il colore salvato o quello di default
const savedColor = localStorage.getItem('titleColor') || defaultColor;
const titles = document.querySelectorAll('.title');
titles.forEach(title => {
    title.style.color = savedColor;
});

colorItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const color = this.getAttribute('data-color');
        
        titles.forEach(title => {
            title.style.color = color;
        });
        
        // Salva la preferenza di colore
        localStorage.setItem('titleColor', color);
    });
    
    // Imposta il colore di sfondo per ogni voce del menu
    const color = item.getAttribute('data-color');
    item.style.backgroundColor = color;
    
    // Imposta il colore del testo in base allo sfondo
    const rgb = hexToRgb(color);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    item.style.color = brightness > 128 ? '#000' : '#fff';
});

// Funzione per convertire colore HEX in RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Animazioni al caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
    // Aggiungi preloader
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(preloader);
    
    // Rimuovi preloader dopo il caricamento
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('loaded');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 800);
    });
    
    // Inizializza le animazioni di reveal
    initRevealAnimations();
    
    // Inizializza le tooltip di Bootstrap (se necessario)
    initTooltips();
    
    // Aggiungi smooth scroll ai link interni
    addSmoothScroll();
    
    // Migliora l'accessibilità
    improveAccessibility();
});

// Funzione per inizializzare le animazioni di reveal al scroll
function initRevealAnimations() {
    // Aggiungi la classe reveal a tutti i contenitori di episodi
    document.querySelectorAll('.episode-container, .card.bg-glass').forEach(el => {
        el.classList.add('reveal');
    });
    
    // Observer per il reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Osserva tutti gli elementi con la classe reveal
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// Funzione per inizializzare tooltip Bootstrap
function initTooltips() {
    // Controlla se Bootstrap tooltip è disponibile
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        Array.from(tooltipTriggerList).map(tooltipTriggerEl => 
            new bootstrap.Tooltip(tooltipTriggerEl, {
                boundary: document.body
            })
        );
    }
}

// Funzione per aggiungere smooth scroll ai link interni
function addSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Funzione per migliorare l'accessibilità
function improveAccessibility() {
    // Imposta attributi ARIA dove necessario
    document.querySelectorAll('.navbar-toggler').forEach(toggle => {
        toggle.setAttribute('aria-label', 'Apri menu di navigazione');
    });
    
    document.querySelectorAll('audio').forEach((audio, index) => {
        audio.setAttribute('aria-label', 'Player audio per puntata ' + (index + 1));
    });
    
    // Migliora la tabulazione per i contenuti interattivi
    document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').forEach(el => {
        el.setAttribute('tabindex', '0');
    });
}

// Aggiungi trasformazione parallasse (effetto profondità) su scroll
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset;
    
    // Parallax effect per logo nelle cards
    document.querySelectorAll('.logo-animation').forEach(logo => {
        const speed = 0.05;
        const yPos = -(scrollTop * speed);
        logo.style.transform = `translateY(${yPos}px) rotate(${yPos * 0.1}deg)`;
    });
    
    // Verifica se la navbar deve diventare compatta
    makeNavbarCompact(scrollTop);
});

// Funzione per rendere la navbar compatta su scroll
function makeNavbarCompact(scrollTop) {
    const navbar = document.querySelector('.navbar');
    const navbarBrand = document.querySelector('.navbar-brand');
    const navbarBrandImage = navbarBrand ? navbarBrand.querySelector('img') : null;
    
    if (navbar && navbarBrand && navbarBrandImage) {
        if (scrollTop > 100) {
            navbar.classList.add('navbar-compact');
            navbarBrandImage.style.height = '40px';
            navbar.style.padding = '8px 0';
        } else {
            navbar.classList.remove('navbar-compact');
            navbarBrandImage.style.height = '60px';
            navbar.style.padding = '15px 0';
        }
    }
}

// Funzione per controllare il volume dei player audio
document.addEventListener('DOMContentLoaded', function() {
    const audioPlayers = document.querySelectorAll('audio');
    
    audioPlayers.forEach(player => {
        // Imposta un volume predefinito più basso
        player.volume = 0.7;
        
        // Salva il timestamp quando l'utente mette in pausa
        player.addEventListener('pause', function() {
            localStorage.setItem(`audioTime-${player.querySelector('source').getAttribute('src')}`, player.currentTime);
        });
        
        // Ripristina il timestamp se disponibile
        const savedTime = localStorage.getItem(`audioTime-${player.querySelector('source').getAttribute('src')}`);
        if (savedTime) {
            player.currentTime = parseFloat(savedTime);
        }
    });
});