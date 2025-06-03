document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const exploreButton = document.getElementById('exploreButton');
    const buttonText = document.getElementById('buttonText');
    const mainTitle = document.querySelector('.main-title');
    const body = document.querySelector('body');
    const footerLogo = document.querySelector('.footer-logo');
    
    // Blood drop effect
    function createBloodDrop() {
        const drop = document.createElement('div');
        drop.className = 'blood-drop';
        drop.style.position = 'absolute';
        drop.style.width = Math.random() * 20 + 5 + 'px';
        drop.style.height = Math.random() * 50 + 20 + 'px';
        drop.style.backgroundColor = `rgba(${Math.floor(Math.random() * 100) + 155}, 0, 0, ${Math.random() * 0.5 + 0.5})`;
        drop.style.borderRadius = '50% 50% 50% 50% / 40% 40% 60% 60%';
        drop.style.left = Math.random() * window.innerWidth + 'px';
        drop.style.top = '0';
        drop.style.zIndex = '-1';
        drop.style.filter = 'blur(2px)';
        drop.style.opacity = '0';
        drop.style.animation = 'bloodDrip ' + (Math.random() * 5 + 2) + 's ease-in';
        
        body.appendChild(drop);
        
        setTimeout(() => {
            body.removeChild(drop);
        }, 7000);
    }
    
    // Add blood drop animations occasionally
    setInterval(createBloodDrop, 10000);
    
    // Interactive button effects
    if (exploreButton) {
        exploreButton.addEventListener('mouseenter', function() {
            buttonText.style.textShadow = '0px 0px 10px rgba(255, 50, 50, 0.8)';
        });
        
        exploreButton.addEventListener('mouseleave', function() {
            buttonText.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        });
        
        exploreButton.addEventListener('click', function() {
            // Add a quick "blood splash" effect before navigation
            for (let i = 0; i < 5; i++) {
                setTimeout(createBloodDrop, i * 100);
            }
        });
    }
    
    // Title effects
    if (mainTitle) {
        mainTitle.addEventListener('mouseover', function() {
            this.style.filter = 'drop-shadow(0 0 15px rgba(255, 0, 0, 0.8))';
        });
        
        mainTitle.addEventListener('mouseout', function() {
            this.style.filter = 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.5))';
        });
    }
    
    // Logo rotation on hover effect already implemented in CSS
    
    // Language selection
    const languageItems = document.querySelectorAll('.language-item');
    
    languageItems.forEach(item => {
        item.addEventListener('click', function() {
            languageItems.forEach(li => li.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Detect user language and show appropriate message
    function detectUserLanguage() {
        const userLang = navigator.language || navigator.userLanguage;
        const isItalian = userLang.startsWith('it');
        
        if (window.location.pathname.includes('index-it.html')) {
            // Already on Italian page
            if (!isItalian) {
                showLanguageHint('en');
            }
        } else if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
            // On English page
            if (isItalian) {
                showLanguageHint('it');
            }
        }
    }
    
    function showLanguageHint(lang) {
        const hint = document.createElement('div');
        hint.className = 'language-hint';
        hint.style.position = 'fixed';
        hint.style.top = '10px';
        hint.style.right = '10px';
        hint.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        hint.style.color = 'white';
        hint.style.padding = '10px';
        hint.style.borderRadius = '5px';
        hint.style.zIndex = '1000';
        hint.style.border = '1px solid #aa0000';
        hint.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
        hint.style.cursor = 'pointer';
        
        if (lang === 'it') {
            hint.innerHTML = 'Contenuto disponibile in Italiano. <a href="index-it.html" style="color:#ff3333;text-decoration:underline;">Cambia lingua</a>';
        } else {
            hint.innerHTML = 'Content available in English. <a href="index.html" style="color:#ff3333;text-decoration:underline;">Change language</a>';
        }
        
        hint.addEventListener('click', function() {
            document.body.removeChild(hint);
        });
        
        setTimeout(() => {
            if (document.body.contains(hint)) {
                document.body.removeChild(hint);
            }
        }, 10000);
        
        document.body.appendChild(hint);
    }
    
    // Call language detection
    setTimeout(detectUserLanguage, 2000);
    
    // Create initial blood drops for dramatic effect
    for (let i = 0; i < 3; i++) {
        setTimeout(createBloodDrop, 1000 + i * 500);
    }
});