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