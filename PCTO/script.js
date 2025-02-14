document.addEventListener('DOMContentLoaded', function () {
    // Cache DOM elements
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    const colorPickerToggle = document.querySelector('.color-picker-toggle');
    const themeToggle = document.querySelector('.theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const html = document.documentElement;
    let lastScrollTop = 0;

    // Creazione color picker menu ottimizzato per mobile
    function createColorPicker() {
        const colorPickerMenu = document.createElement('div');
        colorPickerMenu.className = 'color-picker-menu';
        
        // Determine if device is mobile
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            colorPickerMenu.classList.add('active'); // Always visible on mobile
            colorPickerMenu.style.position = 'static'; // Remove fixed positioning
            colorPickerMenu.style.width = '100%';
            colorPickerMenu.style.maxWidth = 'none';
            colorPickerMenu.style.right = '0';
            colorPickerMenu.style.boxShadow = 'none';
            // Insert after nav
            nav.parentNode.insertBefore(colorPickerMenu, nav.nextSibling);
        } else {
            document.body.appendChild(colorPickerMenu);
        }

        colorPickerMenu.innerHTML = `
            <div class="color-option">
                <h4>Colore Primario</h4>
                <div class="color-buttons primary-colors">
                    <button class="color-button" style="background: #2c3e50" data-color="#2c3e50" data-variable="--primary-color"></button>
                    <button class="color-button" style="background: #3498db" data-color="#3498db" data-variable="--primary-color"></button>
                    <button class="color-button" style="background: #e74c3c" data-color="#e74c3c" data-variable="--primary-color"></button>
                    <button class="color-button" style="background: #2ecc71" data-color="#2ecc71" data-variable="--primary-color"></button>
                </div>
            </div>
            <div class="color-option">
                <h4>Colore Accento</h4>
                <div class="color-buttons accent-colors">
                    <button class="color-button" style="background: #3498db" data-color="#3498db" data-variable="--accent-color"></button>
                    <button class="color-button" style="background: #e74c3c" data-color="#e74c3c" data-variable="--accent-color"></button>
                    <button class="color-button" style="background: #f1c40f" data-color="#f1c40f" data-variable="--accent-color"></button>
                    <button class="color-button" style="background: #9b59b6" data-color="#9b59b6" data-variable="--accent-color"></button>
                </div>
            </div>
        `;

        // Add click handlers for color buttons
        colorPickerMenu.querySelectorAll('.color-button').forEach(button => {
            button.addEventListener('click', function() {
                const color = this.dataset.color;
                const variable = this.dataset.variable;
                document.documentElement.style.setProperty(variable, color);
                localStorage.setItem(variable, color);
            });
        });

        // Toggle visibility only on desktop
        if (!isMobile) {
            colorPickerToggle.addEventListener('click', () => {
                colorPickerMenu.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!colorPickerMenu.contains(e.target) && !colorPickerToggle.contains(e.target)) {
                    colorPickerMenu.classList.remove('active');
                }
            });
        } else {
            // Hide the toggle button on mobile since menu is always visible
            colorPickerToggle.style.display = 'none';
        }

        return colorPickerMenu;
    }

    // Initialize theme
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme === 'dark');

        themeToggle.addEventListener('click', () => {
            const isDark = html.getAttribute('data-theme') === 'dark';
            setTheme(!isDark);
        });
    }

    function setTheme(isDark) {
        html.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        sunIcon.style.display = isDark ? 'none' : 'block';
        moonIcon.style.display = isDark ? 'block' : 'none';
        
        // Update chart if exists
        if (window.currentChart) {
            updateChartColors();
        }
    }

    // Optimized scroll handling
    function handleScroll() {
        const currentScrollTop = window.scrollY;
        
        // Show/hide navigation
        if (currentScrollTop > lastScrollTop && currentScrollTop > nav.offsetHeight) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = currentScrollTop;

        // Update active section
        const scrollPosition = currentScrollTop + nav.offsetHeight + 50;
        document.querySelectorAll('.section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                updateActiveSection(section.id);
            }
        });
    }

    function updateActiveSection(sectionId) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Initialize
    createColorPicker();
    initializeTheme();
    
    // Event Listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
        // Recreate color picker on resize for proper mobile/desktop layout
        const oldPicker = document.querySelector('.color-picker-menu');
        if (oldPicker) oldPicker.remove();
        createColorPicker();
    });

    // Navigation click handling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const navHeight = nav.offsetHeight;
                window.scrollTo({
                    top: targetSection.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
});