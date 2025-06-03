/**
 * Enhanced JavaScript for Modern Website - OTTIMIZZATO
 * Features: Theme switching, color customization, animations, performance optimizations
 * Fix: Animazioni card dei loghi ottimizzate e sistemate
 */

class WebsiteController {
    constructor() {
        this.isInitialized = false;
        this.observers = new Map();
        this.eventListeners = new Map();
        this.animationQueue = [];
        this.animationStates = new Map(); // Track animation states
        this.preferredColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        // Performance tracking
        this.lastScrollTime = 0;
        this.ticking = false;
        this.isPageVisible = !document.hidden;
        
        // Bind methods to maintain context
        this.handleThemeToggle = this.handleThemeToggle.bind(this);
        this.handleColorToggle = this.handleColorToggle.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleColorSelection = this.handleColorSelection.bind(this);
        this.handleSmoothScroll = this.handleSmoothScroll.bind(this);
        this.handleIntersection = this.handleIntersection.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleResize = this.debounce(this.handleResize.bind(this), 250);
        this.handleScroll = this.throttle(this.handleScroll.bind(this), 16);
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            await this.waitForDOM();
            this.cacheElements();
            this.setupTheme();
            this.setupColorPicker();
            this.setupAnimations();
            this.setupIntersectionObserver();
            this.setupScrollEffects();
            this.setupKeyboardNavigation();
            this.setupPerformanceOptimizations();
            this.setupAccessibilityFeatures();
            this.isInitialized = true;
            this.logInfo('Website controller initialized successfully');
        } catch (error) {
            this.logError('Failed to initialize website controller:', error);
        }
    }

    /**
     * Wait for DOM to be fully loaded
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
            } else {
                resolve();
            }
        });
    }

    /**
     * Cache frequently used DOM elements with improved selectors
     */
    cacheElements() {
        this.elements = {
            body: document.body,
            themeToggle: document.getElementById('themeToggle'),
            colorToggle: document.getElementById('colorToggle'),
            colorPicker: document.getElementById('colorPicker'),
            colorButtons: document.querySelectorAll('#colorPicker button'),
            // Selettori migliorati per le card dei loghi
            logoCards: document.querySelectorAll('.institution-card, .logo-card, .content-box'),
            logoContainers: document.querySelectorAll('.logo-container, .institutional-logos'),
            logoImages: document.querySelectorAll('.institution-logo, .logo-img'),
            animatedElements: document.querySelectorAll('.content-box, .institutional-logos, .logo-container, .institution-card'),
            smoothScrollLinks: document.querySelectorAll('a[href^="#"]'),
            focusableElements: document.querySelectorAll('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'),
            controlButtons: document.querySelectorAll('.control-button')
        };

        // Log degli elementi trovati per debugging
        this.logInfo(`Found ${this.elements.logoCards.length} logo cards`);
        this.logInfo(`Found ${this.elements.logoImages.length} logo images`);

        // Validate critical elements
        if (!this.elements.themeToggle || !this.elements.colorToggle) {
            throw new Error('Critical UI elements not found');
        }
    }

    /**
     * Setup theme switching functionality
     */
    setupTheme() {
        try {
            // Apply saved theme or system preference
            const savedTheme = localStorage.getItem('website-theme');
            const isDark = savedTheme === 'dark' || 
                          (!savedTheme && this.preferredColorScheme.matches);
            
            this.applyTheme(isDark);

            // Listen for theme toggle
            this.addEventListener(this.elements.themeToggle, 'click', this.handleThemeToggle);
            
            // Listen for system theme changes
            this.addEventListener(this.preferredColorScheme, 'change', (e) => {
                if (!localStorage.getItem('website-theme')) {
                    this.applyTheme(e.matches);
                }
            });

        } catch (error) {
            this.logError('Theme setup failed:', error);
        }
    }

    /**
     * Apply theme with smooth transition
     */
    applyTheme(isDark) {
        requestAnimationFrame(() => {
            this.elements.body.classList.toggle('dark-theme', isDark);
            const icon = this.elements.themeToggle?.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon', !isDark);
                icon.classList.toggle('fa-sun', isDark);
            }
        });
    }

    /**
     * Handle theme toggle with animation
     */
    handleThemeToggle() {
        const isDark = !this.elements.body.classList.contains('dark-theme');
        
        // Add transition effect
        this.elements.body.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        this.applyTheme(isDark);
        
        // Save preference
        try {
            localStorage.setItem('website-theme', isDark ? 'dark' : 'light');
        } catch (error) {
            this.logError('Failed to save theme preference:', error);
        }
        
        // Remove transition after completion
        setTimeout(() => {
            this.elements.body.style.transition = '';
        }, 300);

        // Trigger custom event
        this.dispatchCustomEvent('themeChanged', { isDark });
    }

    /**
     * Setup color picker functionality
     */
    setupColorPicker() {
        try {
            // Load saved color
            const savedColor = localStorage.getItem('website-title-color');
            if (savedColor) {
                document.documentElement.style.setProperty('--title-color', savedColor);
            }

            // Setup toggle animation
            const toggleIcon = this.elements.colorToggle.querySelector('i');
            if (toggleIcon) {
                toggleIcon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }

            // Event listeners
            this.addEventListener(this.elements.colorToggle, 'click', this.handleColorToggle);
            this.addEventListener(document, 'click', this.handleOutsideClick);
            
            // Color selection
            this.elements.colorButtons.forEach(button => {
                this.addEventListener(button, 'click', () => this.handleColorSelection(button));
                
                // Add hover effects
                this.addEventListener(button, 'mouseenter', () => {
                    if (!this.prefersReducedMotion.matches) {
                        button.style.transform = 'translateX(12px) scale(1.05)';
                    }
                });
                
                this.addEventListener(button, 'mouseleave', () => {
                    button.style.transform = '';
                });
            });

        } catch (error) {
            this.logError('Color picker setup failed:', error);
        }
    }

    /**
     * Handle color picker toggle
     */
    handleColorToggle(e) {
        e.stopPropagation();
        const isOpen = this.elements.colorPicker.classList.contains('show');
        
        this.elements.colorPicker.classList.toggle('show');
        
        const icon = this.elements.colorToggle.querySelector('i');
        if (icon && !this.prefersReducedMotion.matches) {
            icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }

        // Announce to screen readers
        this.elements.colorToggle.setAttribute('aria-expanded', !isOpen);
    }

    /**
     * Handle clicks outside color picker
     */
    handleOutsideClick(e) {
        if (!this.elements.colorToggle.contains(e.target) && 
            !this.elements.colorPicker.contains(e.target)) {
            
            this.elements.colorPicker.classList.remove('show');
            const icon = this.elements.colorToggle.querySelector('i');
            if (icon && !this.prefersReducedMotion.matches) {
                icon.style.transform = 'rotate(0deg)';
            }
            this.elements.colorToggle.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * Handle color selection with animation
     */
    handleColorSelection(button) {
        const color = button.dataset.color;
        if (!color) return;

        // Apply color with smooth transition
        document.documentElement.style.transition = 'color 0.3s ease';
        document.documentElement.style.setProperty('--title-color', color);
        
        // Save preference
        try {
            localStorage.setItem('website-title-color', color);
        } catch (error) {
            this.logError('Failed to save color preference:', error);
        }

        // Button feedback animation
        if (!this.prefersReducedMotion.matches) {
            button.style.transform = 'scale(0.95)';
            requestAnimationFrame(() => {
                setTimeout(() => {
                    button.style.transform = '';
                }, 100);
            });
        }

        // Close picker
        this.elements.colorPicker.classList.remove('show');
        this.elements.colorToggle.setAttribute('aria-expanded', 'false');

        // Clean up transition
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);

        // Trigger custom event
        this.dispatchCustomEvent('colorChanged', { color });
    }

    /**
     * Setup advanced animations and transitions - OTTIMIZZATO
     */
    setupAnimations() {
        if (this.prefersReducedMotion.matches) {
            this.logInfo('Reduced motion detected, using simple animations');
            this.injectSimpleAnimationStyles();
            return;
        }

        this.injectAnimationStyles();
        this.setupEnhancedLogoAnimations(); // NUOVO: Animazioni specifiche per i loghi
        this.setupHoverEffects();
    }

    /**
     * Inject enhanced animation styles - MIGLIORATO
     */
    injectAnimationStyles() {
        const styles = `
            /* Animazioni base migliorate */
            .enhanced-fade-in {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
                transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                will-change: opacity, transform;
            }
            
            .enhanced-fade-in.visible {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            
            /* Animazioni staggered ottimizzate */
            .stagger-animation {
                animation-delay: calc(var(--stagger-delay, 0) * 0.15s);
                transition-delay: calc(var(--stagger-delay, 0) * 0.1s);
            }
            
            /* Animazioni specifiche per i loghi - NUOVO */
            .logo-card {
                position: relative;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                transform-origin: center;
                will-change: transform, box-shadow;
            }
            
            .logo-card:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                z-index: 10;
            }
            
            .logo-card.floating {
                animation: gentleFloat 4s ease-in-out infinite;
            }
            
            .logo-image {
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                transform-origin: center;
            }
            
            .logo-card:hover .logo-image {
                transform: scale(1.1) rotate(2deg);
            }
            
            /* Floating animation migliorata */
            @keyframes gentleFloat {
                0%, 100% { 
                    transform: translateY(0px) rotate(0deg);
                }
                25% { 
                    transform: translateY(-5px) rotate(0.5deg);
                }
                50% { 
                    transform: translateY(-3px) rotate(0deg);
                }
                75% { 
                    transform: translateY(-7px) rotate(-0.5deg);
                }
            }
            
            /* Pulse glow ottimizzato */
            .pulse-glow {
                animation: pulse-glow 3s ease-in-out infinite alternate;
            }
            
            @keyframes pulse-glow {
                from { 
                    box-shadow: 0 0 15px rgba(116, 185, 255, 0.2);
                    transform: scale(1);
                }
                to { 
                    box-shadow: 0 0 25px rgba(116, 185, 255, 0.4);
                    transform: scale(1.01);
                }
            }
            
            /* Parallax ottimizzato - solo quando necessario */
            .parallax-element {
                transform: translate3d(0, 0, 0);
                backface-visibility: hidden;
                will-change: transform;
            }
            
            /* Animazioni ridotte per performance */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
            
            /* Focus states migliorati */
            .keyboard-focused {
                outline: 2px solid #74b9ff;
                outline-offset: 2px;
            }
            
            /* Stato di caricamento */
            .loading-shimmer {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
            }
            
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
        `;

        this.injectStyles(styles);
    }

    /**
     * Inject simple animations for reduced motion
     */
    injectSimpleAnimationStyles() {
        const styles = `
            .enhanced-fade-in {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .enhanced-fade-in.visible {
                opacity: 1;
            }
            
            .logo-card:hover {
                opacity: 0.8;
            }
        `;
        
        this.injectStyles(styles);
    }

    /**
     * Helper per iniettare stili
     */
    injectStyles(styles) {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    /**
     * Setup enhanced logo animations - NUOVO
     */
    setupEnhancedLogoAnimations() {
        // Inizializza le animazioni per le card dei loghi
        this.elements.logoCards.forEach((card, index) => {
            // Imposta proprietà CSS personalizzate
            card.style.setProperty('--stagger-delay', index);
            card.classList.add('logo-card', 'stagger-animation');
            
            // Trova l'immagine del logo all'interno della card
            const logoImage = card.querySelector('img, .logo-image, .institution-logo');
            if (logoImage) {
                logoImage.classList.add('logo-image');
            }
            
            // Setup event listeners ottimizzati
            this.setupLogoCardEvents(card, index);
            
            // Traccia lo stato dell'animazione
            this.animationStates.set(card, {
                isHovered: false,
                isFloating: false,
                isVisible: false
            });
        });

        // Setup animazioni casuali per alcuni loghi
        this.setupRandomFloatingAnimation();
    }

    /**
     * Setup eventi per le card dei loghi
     */
    setupLogoCardEvents(card, index) {
        let hoverTimeout;
        
        // Mouse enter
        this.addEventListener(card, 'mouseenter', () => {
            clearTimeout(hoverTimeout);
            
            const state = this.animationStates.get(card);
            if (!state.isHovered && this.isPageVisible) {
                state.isHovered = true;
                
                // Aggiungi effetto glow se non è già presente
                if (!card.classList.contains('pulse-glow')) {
                    card.classList.add('pulse-glow');
                }
                
                // Rimuovi floating temporaneamente per l'hover
                if (state.isFloating) {
                    card.classList.remove('floating');
                }
            }
        });
        
        // Mouse leave
        this.addEventListener(card, 'mouseleave', () => {
            const state = this.animationStates.get(card);
            state.isHovered = false;
            
            // Rimuovi glow dopo un delay
            hoverTimeout = setTimeout(() => {
                card.classList.remove('pulse-glow');
                
                // Ripristina floating se era attivo
                if (state.isFloating) {
                    card.classList.add('floating');
                }
            }, 200);
        });
        
        // Focus/blur per accessibilità
        this.addEventListener(card, 'focus', () => {
            card.classList.add('keyboard-focused');
        });
        
        this.addEventListener(card, 'blur', () => {
            card.classList.remove('keyboard-focused');
        });
    }

    /**
     * Setup animazione floating casuale
     */
    setupRandomFloatingAnimation() {
        if (this.prefersReducedMotion.matches) return;
        
        // Seleziona casualmente alcune card per l'animazione floating
        const floatingCount = Math.min(3, Math.floor(this.elements.logoCards.length / 3));
        const selectedCards = this.getRandomElements(Array.from(this.elements.logoCards), floatingCount);
        
        selectedCards.forEach((card, index) => {
            const state = this.animationStates.get(card);
            state.isFloating = true;
            
            // Aggiungi delay casuali per evitare sincronizzazione
            setTimeout(() => {
                if (!state.isHovered && this.isPageVisible) {
                    card.classList.add('floating');
                }
            }, index * 800 + Math.random() * 1000);
        });
    }

    /**
     * Setup enhanced hover effects - MIGLIORATO
     */
    setupHoverEffects() {
        // Control buttons
        this.elements.controlButtons.forEach(button => {
            this.addEventListener(button, 'mouseenter', () => {
                if (!this.prefersReducedMotion.matches) {
                    button.classList.add('pulse-glow');
                }
            });
            
            this.addEventListener(button, 'mouseleave', () => {
                button.classList.remove('pulse-glow');
            });
        });
    }

    /**
     * Setup enhanced intersection observer - MIGLIORATO
     */
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            threshold: [0.1, 0.5],
            rootMargin: '50px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(this.handleIntersection, observerOptions);
        this.observers.set('intersection', observer);

        // Observe elements with enhanced animations
        this.elements.animatedElements.forEach((element, index) => {
            element.classList.add('enhanced-fade-in');
            element.style.setProperty('--stagger-delay', index);
            observer.observe(element);
        });
    }

    /**
     * Handle intersection observer events - MIGLIORATO
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            const { target, isIntersecting, intersectionRatio } = entry;
            
            if (isIntersecting && intersectionRatio > 0.1) {
                // Gestisci lo stato di visibilità
                const state = this.animationStates.get(target);
                if (state) {
                    state.isVisible = true;
                }
                
                // Add staggered animation con controllo performance
                const delay = parseInt(target.style.getPropertyValue('--stagger-delay') || 0) * 100;
                
                setTimeout(() => {
                    if (this.isPageVisible) {
                        target.classList.add('visible');
                        
                        // Attiva parallax solo se necessario
                        if (target.classList.contains('logo-card')) {
                            target.classList.add('parallax-element');
                        }
                    }
                }, delay);
                
                // Unobserve after animation
                this.observers.get('intersection')?.unobserve(target);
                
                // Trigger custom event
                this.dispatchCustomEvent('elementVisible', { element: target });
            }
        });
    }

    /**
     * Setup smooth scrolling with enhanced features
     */
    setupScrollEffects() {
        this.elements.smoothScrollLinks.forEach(link => {
            this.addEventListener(link, 'click', this.handleSmoothScroll);
        });
    }

    /**
     * Handle smooth scroll with progress indication
     */
    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (!target) return;

        // Calculate scroll distance and duration
        const startPos = window.pageYOffset;
        const targetPos = target.getBoundingClientRect().top + startPos - 100;
        const distance = Math.abs(targetPos - startPos);
        const duration = Math.min(Math.max(distance / 3, 300), 1000);

        // Smooth scroll with easing
        this.smoothScrollTo(targetPos, duration);
    }

    /**
     * Custom smooth scroll implementation with easing
     */
    smoothScrollTo(targetY, duration) {
        const startY = window.pageYOffset;
        const difference = targetY - startY;
        const startTime = performance.now();

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const scroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startY + difference * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(scroll);
            }
        };

        requestAnimationFrame(scroll);
    }

    /**
     * Setup keyboard navigation and accessibility
     */
    setupKeyboardNavigation() {
        // Escape key to close color picker
        this.addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape' && this.elements.colorPicker.classList.contains('show')) {
                this.elements.colorPicker.classList.remove('show');
                this.elements.colorToggle.setAttribute('aria-expanded', 'false');
                this.elements.colorToggle.focus();
            }
        });

        // Tab navigation improvements
        this.elements.focusableElements.forEach(element => {
            this.addEventListener(element, 'focus', () => {
                element.classList.add('keyboard-focused');
            });
            
            this.addEventListener(element, 'blur', () => {
                element.classList.remove('keyboard-focused');
            });
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibilityFeatures() {
        // ARIA labels and states
        this.elements.themeToggle.setAttribute('aria-label', 'Toggle dark/light theme');
        this.elements.colorToggle.setAttribute('aria-label', 'Choose title color');
        this.elements.colorToggle.setAttribute('aria-expanded', 'false');
        this.elements.colorPicker.setAttribute('role', 'menu');

        // Color buttons
        this.elements.colorButtons.forEach(button => {
            const color = button.dataset.color;
            button.setAttribute('role', 'menuitem');
            button.setAttribute('aria-label', `Set title color to ${color}`);
        });

        // Logo cards accessibility
        this.elements.logoCards.forEach((card, index) => {
            if (card.tagName !== 'A' && card.tagName !== 'BUTTON') {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'img');
                card.setAttribute('aria-label', `Institution logo ${index + 1}`);
            }
        });

        // Announce theme changes to screen readers
        this.addEventListener(document, 'themeChanged', (e) => {
            this.announceToScreenReader(
                `Theme changed to ${e.detail.isDark ? 'dark' : 'light'} mode`
            );
        });
    }

    /**
     * Setup performance optimizations - MIGLIORATO
     */
    setupPerformanceOptimizations() {
        // Page visibility handling
        this.addEventListener(document, 'visibilitychange', this.handleVisibilityChange);
        
        // Resize handling
        this.addEventListener(window, 'resize', this.handleResize);
        
        // Prefetch critical resources
        this.prefetchResources();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        // Setup RAF-based animation loop
        this.setupAnimationLoop();
    }

    /**
     * Setup animation loop ottimizzato
     */
    setupAnimationLoop() {
        let lastTime = 0;
        
        const animationLoop = (currentTime) => {
            // Limita a 60fps
            if (currentTime - lastTime >= 16) {
                this.updateAnimations(currentTime);
                lastTime = currentTime;
            }
            
            if (this.isPageVisible && this.isInitialized) {
                requestAnimationFrame(animationLoop);
            }
        };
        
        if (this.isPageVisible) {
            requestAnimationFrame(animationLoop);
        }
    }

    /**
     * Update animations in batch
     */
    updateAnimations(currentTime) {
        // Update floating animations
        this.updateFloatingAnimations(currentTime);
        
        // Update parallax only if scrolling
        if (this.ticking) {
            this.updateParallaxElements();
            this.ticking = false;
        }
    }


    /**
     * Handle visibility change to pause/resume animations - MIGLIORATO
     */
    handleVisibilityChange() {
        this.isPageVisible = !document.hidden;
        
        if (document.hidden) {
            // Pause expensive operations
            this.pauseAnimations();
        } else {
            // Resume operations
            this.resumeAnimations();
            this.setupAnimationLoop(); // Riavvia il loop
        }
    }

    /**
     * Handle window resize - MIGLIORATO
     */
    handleResize() {
        // Recalculate positions and update layouts
        this.updateLayoutCalculations();
        
        // Reset parallax calculations
        this.resetParallaxCalculations();
        
        // Trigger custom event
        this.dispatchCustomEvent('layoutUpdate');
    }

    /**
     * Handle scroll events with performance optimization - MIGLIORATO
     */
    handleScroll() {
        this.lastScrollTime = performance.now();
        
        if (!this.ticking) {
            this.ticking = true;
        }
    }

    /**
     * Update parallax elements based on scroll position - OTTIMIZZATO
     */
    updateParallaxElements() {
        if (this.prefersReducedMotion.matches || !this.isPageVisible) return;

        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Solo elementi visibili con parallax
        const parallaxElements = Array.from(this.elements.logoCards).filter(card => 
            card.classList.contains('parallax-element')
        );
        
        parallaxElements.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const isVisible = rect.top < windowHeight && rect.bottom > 0;
            
            if (isVisible) {
                const speed = 0.05 + (index * 0.02); // Ridotto per essere più sottile
                const yPos = -(scrollY * speed);
                card.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
    }

    /**
     * Reset parallax calculations
     */
    resetParallaxCalculations() {
        this.elements.logoCards.forEach(card => {
            if (card.classList.contains('parallax-element')) {
                card.style.transform = 'translate3d(0, 0, 0)';
            }
        });
    }

    /**
     * Update layout calculations
     */
    updateLayoutCalculations() {
        // Recalculate element positions and sizes
        this.elements.logoCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const state = this.animationStates.get(card);
            if (state) {
                state.rect = rect;
            }
        });
    }

    /**
     * Pause animations for performance
     */
    pauseAnimations() {
        this.elements.logoCards.forEach(card => {
            const state = this.animationStates.get(card);
            if (state && state.isFloating) {
                card.classList.remove('floating');
                card.style.animationPlayState = 'paused';
            }
        });
    }

    /**
     * Resume animations
     */
    resumeAnimations() {
        this.elements.logoCards.forEach(card => {
            const state = this.animationStates.get(card);
            if (state && state.isFloating && !state.isHovered) {
                card.classList.add('floating');
                card.style.animationPlayState = 'running';
            }
        });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor FPS
        let frames = 0;
        let lastTime = performance.now();
        
        const monitor = (currentTime) => {
            frames++;
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                
                // Log low FPS warnings
                if (fps < 30) {
                    this.logWarning(`Low FPS detected: ${fps}fps`);
                    this.optimizeForPerformance();
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            if (this.isPageVisible) {
                requestAnimationFrame(monitor);
            }
        };
        
        if (this.isPageVisible) {
            requestAnimationFrame(monitor);
        }
    }

    /**
     * Optimize for performance when needed
     */
    optimizeForPerformance() {
        // Reduce animation complexity
        this.elements.logoCards.forEach(card => {
            card.classList.remove('floating', 'pulse-glow');
            card.classList.add('simple-hover');
        });
        
        // Disable parallax
        document.querySelectorAll('.parallax-element').forEach(el => {
            el.classList.remove('parallax-element');
        });
        
        this.logInfo('Performance optimizations applied');
    }

    /**
     * Prefetch critical resources
     */
    prefetchResources() {
        // Prefetch images that might be needed
        const imagesToPreload = [
            // Add any critical images here
        ];
        
        imagesToPreload.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    /**
     * Get random elements from array
     */
    getRandomElements(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    /**
     * Announce to screen readers
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    /**
     * Dispatch custom events
     */
    dispatchCustomEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }

    /**
     * Add event listener with cleanup tracking
     */
    addEventListener(element, event, handler, options = {}) {
        if (!element || !event || !handler) return;
        
        const key = `${element.tagName || 'document'}_${event}_${Date.now()}`;
        element.addEventListener(event, handler, options);
        
        this.eventListeners.set(key, {
            element,
            event,
            handler,
            options
        });
    }

    /**
     * Remove all event listeners
     */
    removeAllEventListeners() {
        this.eventListeners.forEach(({ element, event, handler, options }) => {
            try {
                element.removeEventListener(event, handler, options);
            } catch (error) {
                this.logError('Failed to remove event listener:', error);
            }
        });
        this.eventListeners.clear();
    }

    /**
     * Cleanup all observers
     */
    cleanupObservers() {
        this.observers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (error) {
                this.logError('Failed to disconnect observer:', error);
            }
        });
        this.observers.clear();
    }

    /**
     * Debounce utility function
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    /**
     * Throttle utility function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Logging utilities
     */
    logInfo(message, ...args) {
        if (this.isDevelopment()) {
            console.log(`[WebsiteController] ${message}`, ...args);
        }
    }

    logWarning(message, ...args) {
        if (this.isDevelopment()) {
            console.warn(`[WebsiteController] ${message}`, ...args);
        }
    }

    logError(message, ...args) {
        console.error(`[WebsiteController] ${message}`, ...args);
    }

    /**
     * Check if in development mode
     */
    isDevelopment() {
        return location.hostname === 'localhost' || 
               location.hostname === '127.0.0.1' || 
               location.hostname.includes('dev');
    }

    /**
     * Get element center position
     */
    getElementCenter(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    /**
     * Check if element is in viewport
     */
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= windowHeight + threshold &&
            rect.right <= windowWidth + threshold
        );
    }

    /**
     * Cleanup method for destroying the controller
     */
    destroy() {
        try {
            this.isInitialized = false;
            this.isPageVisible = false;
            
            // Clear animation states
            this.animationStates.clear();
            
            // Remove all event listeners
            this.removeAllEventListeners();
            
            // Cleanup observers
            this.cleanupObservers();
            
            // Clear animation queue
            this.animationQueue = [];
            
            this.logInfo('Website controller destroyed successfully');
        } catch (error) {
            this.logError('Failed to destroy website controller:', error);
        }
    }

    /**
     * Reinitialize if needed
     */
    reinit() {
        this.destroy();
        setTimeout(() => {
            this.init();
        }, 100);
    }

    /**
     * Public API methods
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            visible: this.isPageVisible,
            animatedElements: this.elements?.animatedElements?.length || 0,
            logoCards: this.elements?.logoCards?.length || 0,
            eventListeners: this.eventListeners.size,
            observers: this.observers.size
        };
    }

    /**
     * Force refresh animations
     */
    refreshAnimations() {
        if (!this.isInitialized) return;
        
        this.elements.logoCards.forEach(card => {
            const state = this.animationStates.get(card);
            if (state) {
                // Reset and reapply animations
                card.classList.remove('visible', 'floating', 'pulse-glow');
                
                requestAnimationFrame(() => {
                    card.classList.add('visible');
                    if (state.isFloating) {
                        card.classList.add('floating');
                    }
                });
            }
        });
    }

    /**
     * Update theme programmatically
     */
    setTheme(isDark) {
        this.applyTheme(isDark);
        try {
            localStorage.setItem('website-theme', isDark ? 'dark' : 'light');
        } catch (error) {
            this.logError('Failed to save theme preference:', error);
        }
    }

    /**
     * Update color programmatically
     */
    setColor(color) {
        document.documentElement.style.setProperty('--title-color', color);
        try {
            localStorage.setItem('website-title-color', color);
        } catch (error) {
            this.logError('Failed to save color preference:', error);
        }
    }
}

// Auto-initialize when DOM is ready
let websiteController;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        websiteController = new WebsiteController();
    });
} else {
    websiteController = new WebsiteController();
}

// Global error handling
window.addEventListener('error', (event) => {
    console.error('[WebsiteController] Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('[WebsiteController] Unhandled promise rejection:', event.reason);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebsiteController;
} else if (typeof window !== 'undefined') {
    window.WebsiteController = WebsiteController;
}

// Add additional CSS for simple hover effect
const additionalStyles = `
    .simple-hover {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .simple-hover:hover {
        opacity: 0.8;
        transform: translateY(-2px);
    }
    
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    /* Enhanced loading states */
    .loading-state {
        pointer-events: none;
        opacity: 0.6;
    }
    
    .loading-state::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #74b9ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

// Inject additional styles
const additionalStyleSheet = document.createElement('style');
additionalStyleSheet.textContent = additionalStyles;
document.head.appendChild(additionalStyleSheet);