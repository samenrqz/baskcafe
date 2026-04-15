/* ================================================================
   BASK CAFÉ — Shared JavaScript
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll Reveal ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ── Back to Top ── */
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Active Nav Link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.bask-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Navbar Scroll Effect ── */
  const nav = document.querySelector('.bask-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 60
        ? 'rgba(15,35,24,1)'
        : 'rgba(15,35,24,.97)';
    });
  }

  /* ── Hero Parallax ── */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }, { passive: true });
  }

  /* ── Smooth scroll for anchor links ── */
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

  /* ── Review Carousel ── */
  const reviews = [
    { text: "Bask Café is my absolute go-to spot in the city. The Vienna Latte here is unlike anything I've ever tasted — smooth, perfectly layered, and made with so much care. The space feels like a warm hug.", name: "Maria Santos", stars: 5, num: "01" },
    { text: "I discovered the Matcha Series here and I've been coming back every weekend since. The Berry Matcha especially is divine. The staff are genuinely warm and the vibes are immaculate.", name: "Juan dela Cruz", stars: 5, num: "02" },
    { text: "The Bask Signature latte is exactly that — a signature. Rich, creamy, with a twist I still can't fully identify. This café has become my second office and I couldn't be happier about it.", name: "Anika Reyes", stars: 5, num: "03" },
    { text: "Came for a quick coffee and ended up staying three hours. The Carbonara is fantastic and the Biscoff Frappuccino is dangerously good. Highly recommend to anyone in the area.", name: "David Lim", stars: 5, num: "04" },
  ];
  let currentReview = 0;
  const reviewText = document.getElementById('reviewText');
  const reviewName = document.getElementById('reviewName');
  const reviewNum  = document.getElementById('reviewNum');
  const reviewStars = document.getElementById('reviewStars');

  function setReview(idx) {
    const card = document.querySelector('.review-card');
    if (!card || !reviewText) return;
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    setTimeout(() => {
      const r = reviews[idx];
      reviewText.textContent  = `"${r.text}"`;
      reviewName.textContent  = `— ${r.name}`;
      reviewNum.textContent   = r.num;
      if (reviewStars) reviewStars.textContent = '★'.repeat(r.stars);
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 200);
    card.style.transition = 'opacity .2s ease, transform .2s ease';
  }

  window.changeReview = (dir) => {
    currentReview = (currentReview + dir + reviews.length) % reviews.length;
    setReview(currentReview);
  };

  /* Auto-advance reviews */
  if (reviewText) setInterval(() => window.changeReview(1), 6000);

  /* ── Lightbox ── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  window.openLightbox = (src) => {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  if (lightbox) {
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ── Contact Form Validation ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      contactForm.querySelectorAll('[required]').forEach(field => {
        const errEl = document.getElementById(field.id + 'Error');
        if (!field.value.trim()) {
          field.classList.add('error');
          if (errEl) errEl.classList.add('visible');
          valid = false;
        } else {
          field.classList.remove('error');
          if (errEl) errEl.classList.remove('visible');
        }
      });

      // Email check
      const emailField = document.getElementById('contactEmail');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('error');
        const e2 = document.getElementById('contactEmailError');
        if (e2) { e2.textContent = 'Please enter a valid email address.'; e2.classList.add('visible'); }
        valid = false;
      }

      if (valid) {
        contactForm.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'flex';
      }
    });

    // Live clear errors
    contactForm.querySelectorAll('.form-inp').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const e = document.getElementById(field.id + 'Error');
        if (e) e.classList.remove('visible');
      });
    });
  }

  /* ── Careers Form ── */
  const careerForm = document.getElementById('careerForm');
  if (careerForm) {
    careerForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      careerForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        } else {
          field.classList.remove('error');
        }
      });
      if (valid) {
        careerForm.style.display = 'none';
        const success = document.getElementById('careerSuccess');
        if (success) success.style.display = 'flex';
      }
    });
    careerForm.querySelectorAll('.form-inp').forEach(f => {
      f.addEventListener('input', () => f.classList.remove('error'));
    });
  }

  /* ── Progress Bars (environment.html) ── */
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

  /* ── Menu sticky nav active state ── */
  const menuPills = document.querySelectorAll('.menu-pill');
  if (menuPills.length) {
    const sections = [...menuPills].map(p => document.querySelector(p.getAttribute('href'))).filter(Boolean);
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

});