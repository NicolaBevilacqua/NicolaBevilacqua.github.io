document.addEventListener('DOMContentLoaded', function () {
    // Cache DOM elements
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const nav = document.querySelector('nav');
    const colorPickerToggle = document.querySelector('.color-picker-toggle');
    let lastScrollTop = 0;

    // Create color picker menu if it doesn't exist
    if (!document.querySelector('.color-picker-menu')) {
        const colorPickerMenu = document.createElement('div');
        colorPickerMenu.className = 'color-picker-menu';
        colorPickerMenu.innerHTML = `
            <div class="color-option">
                <h4>Colore Primario</h4>
                <div class="color-buttons primary-colors">
                    <button class="color-button" style="background: #1854b4" data-color="#1854b4" data-variable="--primary-color"></button>
                    <button class="color-button" style="background: #ec1839" data-color="#ec1839" data-variable="--primary-color"></button>
                    <button class="color-button" style="background: #fa5b0f" data-color="#fa5b0f" data-variable="--primary-color"></button>
                    <button class="color-button" style="background: #37b182" data-color="#37b182" data-variable="--primary-color"></button>
                </div>
            </div>
            <div class="color-option">
                <h4>Colore Accento</h4>
                <div class="color-buttons accent-colors">
                    <button class="color-button" style="background: #1854b4" data-color="#1854b4" data-variable="--accent-color"></button>
                    <button class="color-button" style="background: #ec1839" data-color="#ec1839" data-variable="--accent-color"></button>
                    <button class="color-button" style="background: #fa5b0f" data-color="#fa5b0f" data-variable="--accent-color"></button>
                    <button class="color-button" style="background: #37b182" data-color="#37b182" data-variable="--accent-color"></button>
                </div>
            </div>
        `;
        document.body.appendChild(colorPickerMenu);

        // Add click handlers for color buttons
        const colorButtons = colorPickerMenu.querySelectorAll('.color-button');
        colorButtons.forEach(button => {
            button.addEventListener('click', function() {
                const color = this.dataset.color;
                const variable = this.dataset.variable;
                document.documentElement.style.setProperty(variable, color);
                localStorage.setItem(variable, color);
            });
        });

        // Toggle color picker menu
        colorPickerToggle.addEventListener('click', () => {
            colorPickerMenu.classList.toggle('active');
        });

        // Close color picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!colorPickerMenu.contains(e.target) && !colorPickerToggle.contains(e.target)) {
                colorPickerMenu.classList.remove('active');
            }
        });
    }

    // Load saved colors
    const savedPrimaryColor = localStorage.getItem('--primary-color');
    const savedAccentColor = localStorage.getItem('--accent-color');
    if (savedPrimaryColor) document.documentElement.style.setProperty('--primary-color', savedPrimaryColor);
    if (savedAccentColor) document.documentElement.style.setProperty('--accent-color', savedAccentColor);

    // Navigation handling with smooth transitions
    function handleNavigation(e) {
        const href = this.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            
            // Remove active classes
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            // Smooth scroll with offset for fixed header
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = nav.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update section visibility after scroll
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetId) {
                        section.classList.add('active');
                    }
                });
            }
        }
    }
    
    // Attach click handlers to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Improved debounce function
    function debounce(func, wait = 20) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    // Enhanced scrollspy with better accuracy
    function updateActiveSection() {
        const scrollPosition = window.scrollY + nav.offsetHeight + 50;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Update navigation
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
                
                // Update section visibility
                sections.forEach(s => s.classList.remove('active'));
                section.classList.add('active');
            }
        });
    }
    
    // Show/hide navigation on scroll
    function handleNavVisibility() {
        const currentScrollTop = window.scrollY;
        
        if (currentScrollTop > lastScrollTop && currentScrollTop > nav.offsetHeight) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = currentScrollTop;
    }
    
    // Initialize skill bars animation
    function initializeSkillBars() {
        const skillLevels = document.querySelectorAll('.skill-level');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0%';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillLevels.forEach(skillLevel => {
            observer.observe(skillLevel);
        });
    }
    
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const html = document.documentElement;

    function setTheme(isDark) {
        html.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        sunIcon.style.display = isDark ? 'none' : 'block';
        moonIcon.style.display = isDark ? 'block' : 'none';
    }

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme === 'dark');

    themeToggle.addEventListener('click', () => {
        const isDark = html.getAttribute('data-theme') === 'dark';
        setTheme(!isDark);
    });

    // Initialize Charts with theme-aware colors
    function initializeCharts() {
        const ctx = document.getElementById('distributionChart');
        if (!ctx) return;
        
        // Definiamo i colori espliciti per il grafico
        const chartColors = {
            light: ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f'],
            dark: ['#4aa3df', '#40d47e', '#ec7063', '#f4d03f']
        };
    
        function getChartColors() {
            const theme = document.documentElement.getAttribute('data-theme');
            return theme === 'dark' ? chartColors.dark : chartColors.light;
        }
        
        const chart = new Chart(ctx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Sviluppo Web', 'Marketing Digitale', 'Design', 'Project Management'],
                datasets: [{
                    data: [40, 30, 15, 15],
                    backgroundColor: getChartColors(),
                    borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#2c2c2c' : '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#2c2c2c' : '#ffffff',
                        titleColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#ffffff' : '#2c3e50',
                        bodyColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#ffffff' : '#2c3e50',
                        borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#404040' : '#e0e0e0',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    
        // Aggiorna il grafico quando cambia il tema
        const themeToggle = document.querySelector('.theme-toggle');
        themeToggle.addEventListener('click', () => {
            const colors = getChartColors();
            chart.data.datasets[0].backgroundColor = colors;
            chart.data.datasets[0].borderColor = document.documentElement.getAttribute('data-theme') === 'dark' ? '#2c2c2c' : '#ffffff';
            chart.options.plugins.tooltip.backgroundColor = document.documentElement.getAttribute('data-theme') === 'dark' ? '#2c2c2c' : '#ffffff';
            chart.options.plugins.tooltip.titleColor = document.documentElement.getAttribute('data-theme') === 'dark' ? '#ffffff' : '#2c3e50';
            chart.options.plugins.tooltip.bodyColor = document.documentElement.getAttribute('data-theme') === 'dark' ? '#ffffff' : '#2c3e50';
            chart.options.plugins.tooltip.borderColor = document.documentElement.getAttribute('data-theme') === 'dark' ? '#404040' : '#e0e0e0';
            chart.update();
        });

        // Update chart colors when theme changes
        themeToggle.addEventListener('click', () => {
            chart.update();
        });
    }

    // Event listeners
    window.addEventListener('scroll', debounce(() => {
        updateActiveSection();
        handleNavVisibility();
    }));
    
    window.addEventListener('resize', debounce(updateActiveSection));
    
    // Initialize all features
    initializeSkillBars();
    initializeCharts();
    updateActiveSection();

    
    // Funzione per gestire il cambio di sezione
    function handleSectionChange(targetId) {
        // Rimuove la classe active da tutte le sezioni e link
        sections.forEach(section => section.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Aggiunge la classe active alla sezione target e al link corrispondente
        const targetSection = document.getElementById(targetId);
        const targetLink = document.querySelector(`nav ul li a[href="#${targetId}"]`);
        
        if (targetSection && targetLink) {
            targetSection.classList.add('active');
            targetLink.classList.add('active');
            
            // Scroll smooth alla sezione
            const navHeight = nav.offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Centro il link attivo nella navbar su mobile
            if (window.innerWidth <= 768) {
                const navList = document.querySelector('nav ul');
                const linkRect = targetLink.getBoundingClientRect();
                const listRect = navList.getBoundingClientRect();
                
                navList.scrollTo({
                    left: linkRect.left - listRect.left - (listRect.width - linkRect.width) / 2,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    // Event listener per i link della navigazione
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            handleSectionChange(targetId);
        });
    });
    
    // Gestione dello scroll e dell'intersezione delle sezioni
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px',
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${targetId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => sectionObserver.observe(section));
    
    // Gestione dello scroll iniziale se c'è un hash nell'URL
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        handleSectionChange(targetId);
    } else {
        // Attiva la prima sezione di default
        handleSectionChange(sections[0].id);
    }
    
    // Gestione del resize della finestra
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const activeSection = document.querySelector('.section.active');
            if (activeSection) {
                handleSectionChange(activeSection.id);
            }
        }, 250);
    });
});