/* ============================================================
   v15: Cinematic Scroll — GSAP Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  /* — Cursor glow — */
  const glow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  (function followCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    requestAnimationFrame(followCursor);
  })();

  /* — Scroll progress — */
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / h) * 100;
    document.getElementById('scroll-bar').style.width = pct + '%';
  });

  /* — Hero entrance — */
  const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  heroTl
    .from('.hero-title .line', {
      y: 80, opacity: 0, stagger: 0.15, duration: 1.2
    })
    .to('.hero-eyebrow',  { y: 0, opacity: 1, duration: 0.8 }, '-=0.8')
    .to('.hero-subtitle',  { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
    .to('.hero-cta',       { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
    .to('.scroll-indicator', { opacity: 1, duration: 0.6 }, '-=0.3');

  /* — Nav shrink on scroll — */
  ScrollTrigger.create({
    start: 100,
    onUpdate: self => {
      document.getElementById('nav')
        .style.padding = self.direction === 1 ? '12px 48px' : '20px 48px';
    }
  });

  /* — Section reveals — */
  const sections = ['.about', '.projects', '.skills', '.certs', '.contact'];
  sections.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;

    // Eyebrow + title
    gsap.from(el.querySelectorAll('.section-eyebrow, .section-title'), {
      scrollTrigger: { trigger: el, start: 'top 80%' },
      y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'expo.out'
    });
  });

  /* — Stat cards — */
  gsap.from('.stat-card', {
    scrollTrigger: { trigger: '.about-stats', start: 'top 85%' },
    y: 40, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'expo.out'
  });

  /* — Project cards — */
  gsap.from('.project-card', {
    scrollTrigger: { trigger: '.project-list', start: 'top 80%' },
    y: 50, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'expo.out'
  });

  /* — Skill categories — */
  gsap.from('.skill-category', {
    scrollTrigger: { trigger: '.skills-grid', start: 'top 80%' },
    y: 40, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'expo.out'
  });

  /* — Cert cards — */
  gsap.from('.cert-card', {
    scrollTrigger: { trigger: '.cert-row', start: 'top 85%' },
    y: 30, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'expo.out'
  });

  /* — Contact links — */
  gsap.from('.contact-link', {
    scrollTrigger: { trigger: '.contact-links', start: 'top 85%' },
    x: -30, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'expo.out'
  });

  /* — About text — */
  gsap.from('.about-body', {
    scrollTrigger: { trigger: '.about-text', start: 'top 80%' },
    y: 30, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'expo.out'
  });

  /* — Contact title — */
  gsap.from('.contact-title', {
    scrollTrigger: { trigger: '.contact', start: 'top 75%' },
    y: 50, opacity: 0, duration: 0.9, ease: 'expo.out'
  });

  /* — Smooth anchor links — */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});
