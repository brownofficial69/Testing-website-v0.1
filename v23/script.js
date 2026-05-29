/* v23: Editorial — subtle scroll reveals */
document.addEventListener('DOMContentLoaded', () => {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });

  const targets = document.querySelectorAll('.article, .skills-col, .cert-feature, .cert-minor, .cover-quote, .cover-toc');
  targets.forEach((el, i) => {
    el.style.cssText += `opacity:0;transform:translateY(20px);transition:opacity 0.7s ${i*0.04}s ease,transform 0.7s ${i*0.04}s ease`;
    io.observe(el);
  });

  const s = document.createElement('style');
  s.textContent = '.vis{opacity:1!important;transform:none!important}';
  document.head.appendChild(s);
});
