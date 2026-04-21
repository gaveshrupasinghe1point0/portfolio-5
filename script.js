/* ═══════════════════════════════════════════
   Gavesh Rupasinghe Portfolio — Script
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Mobile Navigation ──────────────────
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ── Page Load Animation ────────────────
  // Small delay to ensure CSS is parsed, then stagger hero elements in
  window.addEventListener('load', () => {
    const heroReveals = document.querySelectorAll('.hero .reveal');
    heroReveals.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 300 + i * 180);
    });

    // Start observing non-hero reveals after hero finishes
    setTimeout(() => {
      initScrollReveal();
    }, 600);
  });

  // ── Scroll Reveal (IntersectionObserver) ──
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal:not(.visible)');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Find siblings that are also reveal elements for stagger
            const parent = entry.target.parentElement;
            const siblings = parent ? parent.querySelectorAll('.reveal:not(.visible)') : [];
            let delay = 0;

            siblings.forEach((sib, i) => {
              if (sib === entry.target) {
                delay = i * 120;
              }
            });

            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);

            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ── Typing Effect for Hero Title ───────
  const heroName = document.querySelector('.hero__name');
  if (heroName) {
    const fullText = heroName.textContent;
    heroName.textContent = '';
    heroName.style.visibility = 'visible';

    let charIndex = 0;
    function typeChar() {
      if (charIndex < fullText.length) {
        heroName.textContent += fullText[charIndex];
        charIndex++;
        setTimeout(typeChar, 60);
      } else {
        heroName.classList.add('typed');
      }
    }
    // Start typing after greeting fades in
    setTimeout(typeChar, 800);
  }

  // ── Mouse-tracking glow on cards ───────
  const glowCards = document.querySelectorAll('.project-card, .stat-card, .contact-card');

  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  // ── Floating Particles ─────────────────
  function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('span');
      particle.className = 'particle';

      // Random positioning and animation
      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (Math.random() * 12 + 8) + 's';
      particle.style.opacity = Math.random() * 0.5 + 0.1;

      container.appendChild(particle);
    }
  }
  createParticles();

  // ── Smooth counter for stat values ─────
  function animateCounters() {
    const statValues = document.querySelectorAll('.stat-card__value');
    statValues.forEach(el => {
      const text = el.textContent;
      // If it contains a number like "3+", animate it
      const match = text.match(/^(\d+)(.*)$/);
      if (match) {
        const target = parseInt(match[1]);
        const suffix = match[2];
        let current = 0;
        el.textContent = '0' + suffix;

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const interval = setInterval(() => {
                current++;
                el.textContent = current + suffix;
                if (current >= target) clearInterval(interval);
              }, 100);
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.5 });

        observer.observe(el);
      }
    });
  }
  animateCounters();

  // ── Web3Forms Contact Submission ───────
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitBtn.classList.contains('btn--loading')) return;

    submitBtn.classList.add('btn--loading');
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        formStatus.classList.add('form-status--success');
        form.reset();
      } else {
        throw new Error(result.message || 'Something went wrong.');
      }
    } catch (err) {
      formStatus.textContent = '✗ ' + (err.message || 'Failed to send. Please try again.');
      formStatus.classList.add('form-status--error');
    } finally {
      submitBtn.classList.remove('btn--loading');
    }
  });

  // ── Navbar background on scroll ────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      navbar.style.background = 'rgba(10, 10, 15, .92)';
    } else {
      navbar.style.background = 'rgba(10, 10, 15, .7)';
    }
  }, { passive: true });

  // ── Active nav link highlighting ───────
  const sections = document.querySelectorAll('section[id]');
  const navLinksList = document.querySelectorAll('.navbar__link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinksList.forEach(link => {
      link.classList.remove('navbar__link--active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('navbar__link--active');
      }
    });
  }, { passive: true });

})();
