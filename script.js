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

  document.querySelectorAll('.fade-up, .testi-card, .step, .feature-card').forEach(el => {
    fadeObserver.observe(el);
  });

  /* ── Feature cards délai en cascade ── */
  document.querySelectorAll('.feature-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.07) + 's';
  });
  document.querySelectorAll('.testi-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.12) + 's';
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

  /* ══════════════════════════════════════════
     COVERFLOW PREMIUM
  ══════════════════════════════════════════ */
  (function initCoverflow() {
    const scene   = document.getElementById('coverflowScene');
    const stage   = document.getElementById('cfStage');
    const caption = document.getElementById('cfCaption');
    const dotsEl  = document.getElementById('cfDots');
    if (!scene || !stage) return;

    const slides = Array.from(stage.querySelectorAll('.cf-slide'));
    const dots   = dotsEl ? Array.from(dotsEl.querySelectorAll('.cf-dot')) : [];
    const total  = slides.length;

    const CAPTIONS = [
      'Gérez vos tontines simplement',
      'Visualisez toutes vos tontines',
      'Suivez toutes les cotisations',
      'Membres & scores de confiance',
      'Caisse commune en temps réel',
      'Journal d\'audit horodaté',
    ];

    let current  = 0;
    let autoTimer = null;
    let paused   = false;

    /* ── Rend la disposition coverflow ── */
    function render(index) {
      slides.forEach((slide, i) => {
        const pos = ((i - index) % total + total) % total;
        // On convertit pos en valeur signée de –⌊total/2⌋ à +⌊total/2⌋
        let rel = i - index;
        // normalise dans [−(total/2), total/2]
        while (rel >  Math.floor(total / 2)) rel -= total;
        while (rel < -Math.floor(total / 2)) rel += total;
        // Clamp à –2 / +2 pour CSS
        const clamp = Math.max(-2, Math.min(2, rel));
        slide.setAttribute('data-pos', String(clamp));
      });

      // Caption
      if (caption) {
        caption.classList.remove('visible');
        setTimeout(() => {
          caption.textContent = CAPTIONS[index] || '';
          caption.classList.add('visible');
        }, 180);
      }

      // Dots
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    /* ── Naviguer ── */
    function goTo(n) {
      current = ((n % total) + total) % total;
      render(current);
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    /* ── Auto-play ── */
    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => { if (!paused) next(); }, 4500);
    }
    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    /* ── Pause au survol ── */
    scene.addEventListener('mouseenter', () => { paused = true; });
    scene.addEventListener('mouseleave', () => { paused = false; });

    /* ── Flèches ── */
    document.getElementById('cfPrev')?.addEventListener('click', () => { prev(); startAuto(); });
    document.getElementById('cfNext')?.addEventListener('click', () => { next(); startAuto(); });

    /* ── Dots ── */
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const n = parseInt(dot.dataset.goto, 10);
        goTo(n);
        startAuto();
      });
    });

    /* ── Swipe tactile ── */
    let touchStartX = 0;
    scene.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    scene.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        dx < 0 ? next() : prev();
        startAuto();
      }
    }, { passive: true });

    /* ── Clavier ── */
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { prev(); startAuto(); }
      if (e.key === 'ArrowRight') { next(); startAuto(); }
    });

    /* ── Init ── */
    render(0);
    startAuto();
  })();

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

  /* ── Glow 3D au survol du slide central ── */
  document.getElementById('cfStage')?.addEventListener('mousemove', e => {
    const center = document.querySelector('.cf-slide[data-pos="0"] .cf-phone');
    if (!center) return;
    const rect = center.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
    center.style.transform = `rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  document.getElementById('cfStage')?.addEventListener('mouseleave', () => {
    const center = document.querySelector('.cf-slide[data-pos="0"] .cf-phone');
    if (center) center.style.transform = '';
  });

  /* ── Year footer ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
