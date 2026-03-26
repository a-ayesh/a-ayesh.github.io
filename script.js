// Website scripts
const GOOGLE_SCHEDULE_URL =
    'https://calendar.google.com/calendar/appointments/schedules/AcZssZ19ZJWDYK0ox017f77JEFQxscLZG8oVLniFVQ0KszTwfNerwIJPGVdob6O_ShWV3VXe2SSoxltX?gv=true';

function initGoogleScheduleButtons() {
    const calendar = window.calendar;
    if (!calendar || !calendar.schedulingButton) {
        return;
    }
    document.querySelectorAll('.schedule-fab .schedule-call-target').forEach((target) => {
        if (target.dataset.googleScheduleInitialized === '1') {
            return;
        }
        target.dataset.googleScheduleInitialized = '1';
        calendar.schedulingButton.load({
            url: GOOGLE_SCHEDULE_URL,
            color: '#52adc8',
            label: 'Schedule a Call',
            target,
        });
    });
}

function runWhenCalendarReady() {
    if (window.calendar && window.calendar.schedulingButton) {
        initGoogleScheduleButtons();
        return;
    }
    let attempts = 0;
    const id = setInterval(() => {
        attempts += 1;
        if (window.calendar && window.calendar.schedulingButton) {
            clearInterval(id);
            initGoogleScheduleButtons();
        } else if (attempts >= 100) {
            clearInterval(id);
        }
    }, 50);
}

function queueGoogleScheduleInit() {
    if (document.readyState === 'complete') {
        runWhenCalendarReady();
    } else {
        window.addEventListener('load', runWhenCalendarReady);
    }
}

function loadGoogleSchedulingAssets() {
    if (!document.querySelector('link[href*="calendar/scheduling-button-script.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
        document.head.appendChild(link);
    }

    if (document.querySelector('script[src*="scheduling-button-script.js"]')) {
        queueGoogleScheduleInit();
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
    script.async = true;
    script.onload = () => queueGoogleScheduleInit();
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarRight = document.querySelector('.navbar-right');

    if (menuToggle && navbarRight) {
        menuToggle.addEventListener('click', () => {
            const isActive = navbarRight.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
        });

        document.addEventListener('click', (event) => {
            if (!menuToggle.contains(event.target) && !navbarRight.contains(event.target)) {
                navbarRight.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        const navLinks = navbarRight.querySelectorAll('.nav-link');
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navbarRight.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    loadGoogleSchedulingAssets();
});
