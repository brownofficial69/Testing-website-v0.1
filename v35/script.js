/* v35: Blueprint — subtle hover reveals */
document.addEventListener('DOMContentLoaded', () => {
  // Animate blueprint sections drawing in
  const boxes = document.querySelectorAll('.bp-box, .title-block');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  boxes.forEach((b, i) => {
    b.style.cssText += `opacity:0;transform:translateY(10px);transition:opacity 0.5s ${i*0.08}s ease,transform 0.5s ${i*0.08}s ease`;
    io.observe(b);
  });
  // Animate spec table rows
  document.querySelectorAll('.spec-table tr').forEach((r, i) => {
    r.style.cssText += `opacity:0;transition:opacity 0.4s ${i*0.05}s ease`;
    setTimeout(() => { r.style.opacity = '1'; }, 300 + i * 60);
  });
});
