/* ═══════════════════════════════════════════════
   TontineClair – Script vitrine
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll ── */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── Menu mobile ── */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
    spans[1].style.opacity   = navLinks.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
  }));

  /* ── Particules héro ── */
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top  = Math.random() * 100 + '%';
      p.style.animationDelay = (Math.random() * 6) + 's';
      p.style.animationDuration = (5 + Math.random() * 6) + 's';
      p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
      particleContainer.appendChild(p);
    }
  }

  /* ── Intersection Observer – animations d'entrée ── */
  const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); }
    });
  }, observerOpts);

  document.querySelectorAll('.fade-up, .phone-mockup, .testi-card, .step, .feature-card').forEach(el => {
    fadeObserver.observe(el);
  });

  /* ── Feature cards délai en cascade ── */
  document.querySelectorAll('.feature-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.07) + 's';
  });
  document.querySelectorAll('.testi-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.12) + 's';
  });
  document.querySelectorAll('.phone-mockup').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.1) + 's';
    card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s, box-shadow 0.35s ease`;
  });
  document.querySelectorAll('.step').forEach((step, i) => {
    step.style.transitionDelay = (i * 0.18) + 's';
  });

  /* ── FAQ accordéon ── */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // fermer tous
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      // ouvrir si était fermé
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Compteurs animés (stats héro) ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString('fr') + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-target]').forEach(animateCounter);
        statsObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) statsObserver.observe(statsSection);

  /* ── Scroll doux vers sections ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Téléphone carousel – swipe mobile ── */
  const showcase = document.querySelector('.phones-showcase');
  if (showcase) {
    let startX, isDragging = false;
    showcase.addEventListener('mousedown', e => { startX = e.pageX - showcase.offsetLeft; isDragging = true; });
    showcase.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const x = e.pageX - showcase.offsetLeft;
      showcase.scrollLeft -= (x - startX) * 0.8;
      startX = x;
    });
    showcase.addEventListener('mouseup', () => isDragging = false);
    showcase.addEventListener('mouseleave', () => isDragging = false);
  }

  /* ── Animation titre héro – typewriter effect sur le slogan ── */
  const heroDesc = document.querySelector('.hero-desc');
  if (heroDesc) {
    heroDesc.style.opacity = '0';
    heroDesc.style.transform = 'translateY(20px)';
    setTimeout(() => {
      heroDesc.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroDesc.style.opacity = '1';
      heroDesc.style.transform = 'translateY(0)';
    }, 600);
  }

  /* ── Glow au survol des téléphones ── */
  document.querySelectorAll('.phone-mockup').forEach(phone => {
    phone.addEventListener('mousemove', e => {
      const rect = phone.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 20;
      phone.style.transform = `translateY(-10px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.03)`;
    });
    phone.addEventListener('mouseleave', () => {
      phone.style.transform = '';
    });
  });

  /* ── Year footer ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
