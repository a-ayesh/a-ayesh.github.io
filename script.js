// Website scripts
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarRight = document.querySelector('.navbar-right');

    if (menuToggle && navbarRight) {
        menuToggle.addEventListener('click', () => {
            const isActive = navbarRight.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!menuToggle.contains(event.target) && !navbarRight.contains(event.target)) {
                navbarRight.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when clicking a link
        const navLinks = navbarRight.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbarRight.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Lazy load Calendly scripts
    const calendlyLinks = document.querySelectorAll('.calendly-link');
    calendlyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadCalendly(() => {
                if (window.Calendly) {
                    window.Calendly.initPopupWidget({url: 'https://calendly.com/ayesh-cvision/30min'});
                }
            });
        });
    });
});

// Load Calendly scripts dynamically
function loadCalendly(callback) {
    if (window.Calendly) {
        callback();
        return;
    }

    // Check if script is already loading
    const existingScript = document.querySelector('script[src*="calendly.com"]');
    if (existingScript) {
        // Wait for Calendly to be available
        const checkCalendly = setInterval(() => {
            if (window.Calendly) {
                clearInterval(checkCalendly);
                callback();
            }
        }, 50);
        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(checkCalendly);
            if (window.Calendly) {
                callback();
            }
        }, 5000);
        return;
    }

    // Load CSS
    if (!document.querySelector('link[href*="calendly.com"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://assets.calendly.com/assets/external/widget.css';
        document.head.appendChild(link);
    }

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
        // Wait for Calendly to be available
        const checkCalendly = setInterval(() => {
            if (window.Calendly) {
                clearInterval(checkCalendly);
                callback();
            }
        }, 50);
        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(checkCalendly);
            if (window.Calendly) {
                callback();
            }
        }, 5000);
    };
    document.head.appendChild(script);
}
