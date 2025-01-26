document.addEventListener('DOMContentLoaded', function () {
  // Navigation and Section Management
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('nav ul li a');
  const wrapper = document.querySelector('.wrapper');

  // Enhanced navigation handler
  function handleNavigation(e) {
    const href = this.getAttribute('href');

    if (href.startsWith('#')) {
      e.preventDefault();
      
      // Remove active class from all sections and links
      sections.forEach(section => section.classList.remove('active'));
      navLinks.forEach(link => link.classList.remove('active'));

      // Add active class to target section and link
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      targetSection.classList.add('active');
      this.classList.add('active');

      // Smooth scroll to section
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Attach navigation event listeners
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
