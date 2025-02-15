let isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
let currentTitleColor = localStorage.getItem('titleColor') || '#333';
document.addEventListener('DOMContentLoaded', function () {
  // Navigation and Section Management
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('nav ul li a');
  const wrapper = document.querySelector('.wrapper');
  
  // Theme toggle button
  const themeToggle = document.createElement('button');
  themeToggle.id = 'theme-toggle';
  themeToggle.innerHTML = '🌙';
  themeToggle.className = 'theme-toggle';
  document.body.appendChild(themeToggle);

  // Color menu
  const colorMenu = document.createElement('div');
  colorMenu.className = 'color-menu';
  colorMenu.innerHTML = `
    <button class="color-toggle">🎨</button>
    <div class="color-options">
      <button style="background: #ec1839" data-color="#ec1839"></button>
      <button style="background: #fa5b0f" data-color="#fa5b0f"></button>
      <button style="background: #37b182" data-color="#37b182"></button>
      <button style="background: #1854b4" data-color="#1854b4"></button>
      <button style="background: #f021b2" data-color="#f021b2"></button>
    </div>
  `;
  document.body.appendChild(colorMenu);

  // Theme toggle functionality
  themeToggle.addEventListener('click', function() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme', isDarkTheme);
    themeToggle.innerHTML = isDarkTheme ? '☀️' : '🌙';
    localStorage.setItem('isDarkTheme', isDarkTheme);
  });

  // Color menu functionality
  const colorToggle = document.querySelector('.color-toggle');
  const colorOptions = document.querySelector('.color-options');

  colorToggle.addEventListener('click', function() {
    colorOptions.classList.toggle('show');
  });

  document.querySelectorAll('.color-options button').forEach(button => {
    button.addEventListener('click', function() {
      const color = this.getAttribute('data-color');
      document.querySelectorAll('h2, h3, nav .logo').forEach(element => {
        element.style.color = color;
      });
      currentTitleColor = color;
      localStorage.setItem('titleColor', color);
      colorOptions.classList.remove('show');
    });
  });

  // Close color menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!colorMenu.contains(e.target)) {
      colorOptions.classList.remove('show');
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Applica tema salvato
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
      themeToggle.innerHTML = '☀️';
    }
    
    // Applica colore titoli salvato
    if (currentTitleColor) {
      document.querySelectorAll('h2, h3, nav .logo').forEach(element => {
        element.style.color = currentTitleColor;
      });
    }
  });


  // Enhanced navigation handler
  function handleNavigation(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      sections.forEach(section => section.classList.remove('active'));
      navLinks.forEach(link => link.classList.remove('active'));
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      targetSection.classList.add('active');
      this.classList.add('active');
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
  });

  // Scrollspy with improved performance
  function debounce(func, wait = 10) {
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

  function updateActiveSection() {
    let currentSection = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(currentSection)) {
        link.classList.add('active');
      }
    });
  }

  // Add scroll and resize event listeners with debounce
  window.addEventListener('scroll', debounce(updateActiveSection));
  window.addEventListener('resize', debounce(updateActiveSection));

  // Enhanced image hover effects with more subtle animation
  const godImages = document.querySelectorAll('.god-container .image img');
  godImages.forEach(image => {
    image.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.05) rotate(1deg)';
      this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)';
      this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
    });

    image.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1) rotate(0)';
      this.style.boxShadow = 'none';
    });
  });
});
