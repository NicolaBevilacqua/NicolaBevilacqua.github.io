// Utility functions
const debounce = (func, wait = 10) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit = 16) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Animation utilities
const animateElement = (element, keyframes, options = {}) => {
  if (element && element.animate) {
    return element.animate(keyframes, {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards',
      ...options
    });
  }
};

// Navigation management
class NavigationManager {
  constructor() {
    this.sections = document.querySelectorAll('.section');
    this.navLinks = document.querySelectorAll('nav ul li a');
    this.activeSection = null;
    this.isScrolling = false;
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateActiveSection(); // Set initial active section
  }

  bindEvents() {
    // Navigation link clicks
    this.navLinks.forEach(link => {
      if (link.getAttribute('href')?.startsWith('#')) {
        link.addEventListener('click', (e) => this.handleNavigation(e, link));
      }
    });

    // Scroll spy with improved performance
    window.addEventListener('scroll', throttle(() => this.updateActiveSection()), { passive: true });
    window.addEventListener('resize', debounce(() => this.updateActiveSection()));
  }

  handleNavigation(e, link) {
    e.preventDefault();
    
    const href = link.getAttribute('href');
    const targetId = href.substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (!targetSection) return;

    // Prevent scroll spy conflicts during manual navigation
    this.isScrolling = true;
    
    // Update active states immediately for better UX
    this.setActiveLink(link);
    this.setActiveSection(targetSection);
    
    // Smooth scroll with callback
    this.smoothScrollTo(targetSection, () => {
      setTimeout(() => {
        this.isScrolling = false;
      }, 100);
    });
  }

  smoothScrollTo(element, callback) {
    const targetPosition = element.offsetTop - 100; // Account for fixed nav
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) / 2, 800); // Dynamic duration
    let start = null;

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function
      const ease = this.easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition + (distance * ease));
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else if (callback) {
        callback();
      }
    };

    requestAnimationFrame(animation);
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  updateActiveSection() {
    if (this.isScrolling) return;

    let currentSection = null;
    const scrollPosition = window.pageYOffset + 150; // Offset for better detection

    // Find the current section
    this.sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.pageYOffset;
      const sectionBottom = sectionTop + rect.height;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = section;
      }
    });

    // If no section found, default to first visible section
    if (!currentSection) {
      this.sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200 && !currentSection) {
          currentSection = section;
        }
      });
    }

    if (currentSection && currentSection !== this.activeSection) {
      this.setActiveSection(currentSection);
      
      // Update corresponding nav link
      const targetId = currentSection.getAttribute('id');
      const correspondingLink = document.querySelector(`nav a[href="#${targetId}"]`);
      if (correspondingLink) {
        this.setActiveLink(correspondingLink);
      }
    }
  }

  setActiveSection(section) {
    this.sections.forEach(s => s.classList.remove('active'));
    section.classList.add('active');
    this.activeSection = section;
  }

  setActiveLink(link) {
    this.navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  }
}

// Image effects manager
class ImageEffectsManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupImageHoverEffects();
    this.setupLazyLoading();
  }

  setupImageHoverEffects() {
    const images = document.querySelectorAll('.god-container .image img');
    
    images.forEach(image => {
      // Preload hover styles
      image.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
      
      image.addEventListener('mouseenter', () => this.handleImageHover(image, true));
      image.addEventListener('mouseleave', () => this.handleImageHover(image, false));
      
      // Add touch support for mobile
      image.addEventListener('touchstart', () => this.handleImageHover(image, true), { passive: true });
      image.addEventListener('touchend', () => {
        setTimeout(() => this.handleImageHover(image, false), 2000);
      }, { passive: true });
    });
  }

  handleImageHover(image, isHovering) {
    if (isHovering) {
      image.style.transform = 'scale(1.05) rotate(1deg)';
      image.style.boxShadow = '0 15px 30px rgba(0,0,0,0.25), 0 8px 8px rgba(0,0,0,0.2)';
      image.style.filter = 'brightness(1.1) contrast(1.05)';
    } else {
      image.style.transform = 'scale(1) rotate(0)';
      image.style.boxShadow = 'none';
      image.style.filter = 'none';
    }
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, { rootMargin: '50px' });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
}

// Performance monitor
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollPerformance();
    this.setupReducedMotion();
  }

  setupScrollPerformance() {
    let ticking = false;
    
    const updateScrollEffects = () => {
      // Add parallax or other scroll effects here if needed
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    }, { passive: true });
  }

  setupReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--transition-speed', '0s');
      document.documentElement.style.setProperty('scroll-behavior', 'auto');
    }

    prefersReducedMotion.addEventListener('change', (e) => {
      const speed = e.matches ? '0s' : '0.4s';
      const scrollBehavior = e.matches ? 'auto' : 'smooth';
      
      document.documentElement.style.setProperty('--transition-speed', speed);
      document.documentElement.style.setProperty('scroll-behavior', scrollBehavior);
    });
  }
}

// Main application class
class MythologyWebsite {
  constructor() {
    this.navigationManager = null;
    this.imageEffectsManager = null;
    this.performanceMonitor = null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize remaining managers
      this.navigationManager = new NavigationManager();
      this.imageEffectsManager = new ImageEffectsManager();
      this.performanceMonitor = new PerformanceMonitor();
      
      console.log('Mythology website initialized successfully');
    } catch (error) {
      console.error('Error initializing website:', error);
    }
  }
}

// Initialize the website
new MythologyWebsite();