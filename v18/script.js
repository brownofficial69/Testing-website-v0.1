/* ============================================================
   v18: Swiss Minimalist — Subtle scroll animations
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Intersection observer for fade-in
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  // Animate elements
  const animTargets = document.querySelectorAll(
    '.hero h1, .hero-label, .hero-meta, .work-item, .about-left h2, .about-right p, .about-certs, .contact h2, .contact-grid a'
  );

  animTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.02}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.02}s`;
    observer.observe(el);
  });

  // Add style for in-view
  const s = document.createElement('style');
  s.textContent = '.in-view{opacity:1!important;transform:translateY(0)!important}';
  document.head.appendChild(s);

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Nav background on scroll
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 50 ? '' : 'transparent';
  });
});
