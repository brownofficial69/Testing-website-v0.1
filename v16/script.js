/* ============================================================
   v16: Bento Grid — Entrance Animations
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Staggered card entrance
  const cards = document.querySelectorAll('.card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i * 0.05) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    observer.observe(card);
  });

  // Add visible class handler
  const style = document.createElement('style');
  style.textContent = '.card.visible{opacity:1!important;transform:translateY(0)!important}';
  document.head.appendChild(style);

  // Animate skill bars on scroll
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sfill, .bar-fill').forEach(bar => {
          const w = bar.style.width;
          bar.style.width = '0%';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => { bar.style.width = w; });
          });
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.card-skills, .card-project').forEach(el => {
    skillObserver.observe(el);
  });

  // Card tilt on hover
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-3px) perspective(800px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) perspective(800px) rotateX(0) rotateY(0)';
    });
  });
});
