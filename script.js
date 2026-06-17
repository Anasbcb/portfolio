/* =============================================
   PORTFOLIO JAVASCRIPT — Anas Bouchareb
   ============================================= */

// ---- CURSOR GLOW ----
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ---- CANVAS PARTICLES ----
(function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Grid lines
    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0, 255, 170, 0.03)';
        ctx.lineWidth = 1;

        const spacing = 60;
        for (let x = 0; x < canvas.width; x += spacing) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += spacing) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }
    }

    // Particles
    const particles = [];
    const NUM = 60;
    for (let i = 0; i < NUM; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.1,
        });
    }

    function animate() {
        drawGrid();
        particles.forEach(p => {
            p.x += p.dx; p.y += p.dy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 170, ${p.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
})();

// ---- NAV SCROLL ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNav();
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});

// ---- ACTIVE NAV LINK ----
const sections = ['home', 'about', 'skills', 'projects', 'contact'];
function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.offsetTop, bot = top + el.offsetHeight;
        const navLink = document.getElementById('nl-' + id);
        if (navLink) navLink.classList.toggle('active', scrollY >= top && scrollY < bot);
    });
}

// ---- ROLE TYPE ANIMATION ----
const roles = [
    'Full-Stack Developer',
    'Cybersecurity Engineer',
    'Mobile App Developer',
    'Blockchain Developer',
    'Network Engineer'
];
let roleIdx = 0, charIdx = 0, deleting = false;
const roleEl = document.getElementById('role-text');

function typeRole() {
    const current = roles[roleIdx];
    if (!deleting) {
        roleEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
            deleting = true;
            setTimeout(typeRole, 2000);
            return;
        }
    } else {
        roleEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
        }
    }
    setTimeout(typeRole, deleting ? 50 : 80);
}
typeRole();

// ---- STATS COUNTER ----
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
        else { el.textContent = Math.floor(current); }
    }, 25);
}

// ---- INTERSECTION OBSERVER ----
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Counter animation
            const counters = entry.target.querySelectorAll('.stat-num');
            counters.forEach(c => animateCounter(c));
        }
    });
}, { threshold: 0.15 });

// Make sections reveal
document.querySelectorAll('.section, .hero-content, .hero-visual').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Also observe individual cards
document.querySelectorAll('.skill-card, .project-card, .contact-item, .highlight').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 3 * 0.1) + 's';
    observer.observe(el);
});

// Hero stats specific
const heroSection = document.getElementById('home');
if (heroSection) {
    heroSection.classList.add('reveal');
    observer.observe(heroSection);
}
document.querySelectorAll('.stat-num').forEach(c => {
    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { animateCounter(c); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(c);
});

// ---- PROJECT FILTER ----
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
            const cat = card.dataset.category;
            const show = filter === 'all' || cat === filter;
            card.classList.toggle('hidden', !show);
        });
    });
});

// ---- CONTACT FORM ----
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('form-submit-btn');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
        contactForm.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 4000);
    }, 1500);
});

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- PAGE LOAD ANIMATION ----
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
