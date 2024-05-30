document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM completamente caricato e analizzato');

  // Funzione per gestire la navigazione tra sezioni
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('nav ul li a');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Controlla se l'href inizia con '#', indicando un link interno alla pagina
      if (href.startsWith('#')) {
        e.preventDefault();
        
        // Rimuovi la classe 'active' da tutte le sezioni
        sections.forEach(section => {
          section.classList.remove('active');
        });

        // Aggiungi la classe 'active' alla sezione corrispondente
        const targetId = href.substring(1);
        document.getElementById(targetId).classList.add('active');

        // Aggiorna la classe 'active' nei link di navigazione
        navLinks.forEach(navLink => {
          navLink.classList.remove('active');
        });
        this.classList.add('active');
      }
    });
  });


  // Funzione per lo scrollspy
  function handleScroll() {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 50 && pageYOffset < sectionTop + sectionHeight - 50) {
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

  window.addEventListener('scroll', handleScroll);

  // Effetti hover sulle immagini
  const godImages = document.querySelectorAll('.god-container .image');
  godImages.forEach(image => {
    image.addEventListener('mouseover', function () {
      this.style.transform = 'scale(1.1)';
      this.style.transition = 'transform 0.3s';
    });

    image.addEventListener('mouseout', function () {
      this.style.transform = 'scale(1)';
      this.style.transition = 'transform 0.3s';
    });
  });
});
