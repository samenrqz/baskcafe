/* ================================================================
   BASK CAFÉ — Shared JavaScript
   scripts/main.js
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. Scroll Reveal ──────────────────────────────────────── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('revealed');
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    /* ── 2. Back to Top ────────────────────────────────────────── */
    const btt = document.getElementById('backToTop');
    if (btt) {
        window.addEventListener('scroll', () => {
            btt.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ── 3. Active Nav Link ────────────────────────────────────── */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.bask-nav .nav-link, .navbar-bask .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    /* ── 4. Navbar Scroll Effect ───────────────────────────────── */
    /* handles both .bask-nav (home.html) and .navbar-bask (index.html) */
    const nav = document.querySelector('.bask-nav, .navbar-bask');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    /* ── 5. Smooth Anchor Scroll ───────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ── 6. Review Carousel ────────────────────────────────────── */
    const reviews = [
        { text: "Bask Café is my absolute go-to spot in the city. The Vienna Latte here is unlike anything I've ever tasted — smooth, perfectly layered, and made with so much care. The space feels like a warm hug.", name: "Maria Santos", stars: 5, num: "01" },
        { text: "I discovered the Matcha Series here and I've been coming back every weekend since. The Berry Matcha especially is divine. The staff are genuinely warm and the vibes are immaculate.", name: "Juan dela Cruz", stars: 5, num: "02" },
        { text: "The Bask Signature latte is exactly that — a signature. Rich, creamy, with a twist I still can't fully identify. This café has become my second office and I couldn't be happier about it.", name: "Anika Reyes", stars: 5, num: "03" },
        { text: "Came for a quick coffee and ended up staying three hours. The Carbonara is fantastic and the Biscoff Frappuccino is dangerously good. Highly recommend to anyone in the area.", name: "David Lim", stars: 5, num: "04" },
    ];
    let currentReview = 0;

    const reviewText = document.getElementById('reviewText');
    const reviewName = document.getElementById('reviewName');
    const reviewNum = document.getElementById('reviewNum');
    const reviewStars = document.getElementById('reviewStars');

    function setReview(idx) {
        const card = document.querySelector('.review-card');
        if (!card || !reviewText) return;
        card.style.transition = 'opacity .2s ease, transform .2s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
            const r = reviews[idx];
            reviewText.textContent = `"${r.text}"`;
            reviewName.textContent = `— ${r.name}`;
            reviewNum.textContent = r.num;
            if (reviewStars) reviewStars.textContent = '★'.repeat(r.stars);
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200);
    }

    window.changeReview = (dir) => {
        currentReview = (currentReview + dir + reviews.length) % reviews.length;
        setReview(currentReview);
    };

    /* Wire data-review-dir buttons (home.html & index.html) */
    document.querySelectorAll('[data-review-dir]').forEach(btn => {
        btn.addEventListener('click', () => {
            const dir = Number(btn.getAttribute('data-review-dir'));
            if (!Number.isNaN(dir)) window.changeReview(dir);
        });
    });

    if (reviewText) {
        setReview(0);
        setInterval(() => window.changeReview(1), 6000);
    }

    /* ── 7. Lightbox ───────────────────────────────────────────── */
    /* gallery.html uses onclick="openLightbox(this)" — keep window.openLightbox */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    window.openLightbox = (el) => {
        if (!lightbox) return;
        const img = el.querySelector ? el.querySelector('img') : el;
        if (img) lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (lightbox) {
        lightbox.addEventListener('click', e => { if (e.target === lightbox) window.closeLightbox(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeLightbox(); });
    }

    /* ── 8. Contact Form Validation ────────────────────────────── */
    /* contact.html uses .form-input + .form-error markup */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            let valid = true;

            contactForm.querySelectorAll('[required]').forEach(field => {
                const errEl = field.parentElement.querySelector('.form-error');
                if (!field.value.trim()) {
                    field.style.borderColor = '#d64a2e';
                    if (errEl) errEl.classList.add('show');
                    valid = false;
                } else {
                    field.style.borderColor = '';
                    if (errEl) errEl.classList.remove('show');
                }
            });

            const emailField = contactForm.querySelector('[type="email"]');
            if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
                emailField.style.borderColor = '#d64a2e';
                const errEl = emailField.parentElement.querySelector('.form-error');
                if (errEl) { errEl.textContent = 'Please enter a valid email address.';
                    errEl.classList.add('show'); }
                valid = false;
            }

            if (valid) {
                contactForm.style.display = 'none';
                const successEl = document.getElementById('formSuccess');
                if (successEl) successEl.classList.add('show');
            }
        });

        contactForm.querySelectorAll('.form-input, .form-textarea, .form-inp').forEach(field => {
            field.addEventListener('input', () => {
                field.style.borderColor = '';
                const errEl = field.parentElement.querySelector('.form-error');
                if (errEl) errEl.classList.remove('show');
            });
        });
    }

    /* ── 9. Careers Form Validation ────────────────────────────── */
    const careerForm = document.getElementById('careerForm');
    if (careerForm) {
        careerForm.addEventListener('submit', e => {
            e.preventDefault();
            let valid = true;
            careerForm.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#d64a2e';
                    valid = false;
                } else {
                    field.style.borderColor = '';
                }
            });
            if (valid) {
                careerForm.style.display = 'none';
                const s = document.getElementById('careerSuccess');
                if (s) { s.style.display = 'flex';
                    s.classList.add('show'); }
            }
        });
        careerForm.querySelectorAll('.form-inp, .form-input, .form-textarea').forEach(f => {
            f.addEventListener('input', () => { f.style.borderColor = ''; });
        });
    }

    /* ── 10. Menu Sticky Nav Active State ─────────────────────── */
    const menuPills = document.querySelectorAll('.menu-pill');
    if (menuPills.length) {
        const sections = [...menuPills]
            .map(p => document.querySelector(p.getAttribute('href')))
            .filter(Boolean);
        const pillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    menuPills.forEach(p => p.classList.remove('active'));
                    const active = [...menuPills].find(p => p.getAttribute('href') === '#' + entry.target.id);
                    if (active) active.classList.add('active');
                }
            });
        }, { threshold: 0.3 });
        sections.forEach(s => pillObserver.observe(s));
    }

    /* ── 11. Progress Bars (environment.html) ──────────────────── */
    const progObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.progress-bar-fill[data-width]').forEach(bar => {
                    setTimeout(() => { bar.style.width = bar.getAttribute('data-width') + '%'; }, 200);
                });
                progObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.25 });
    document.querySelectorAll('.progress-item').forEach(el => progObserver.observe(el));

});