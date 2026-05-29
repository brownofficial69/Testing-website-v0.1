/* v28: Metro Map — station hover tooltips */
document.addEventListener('DOMContentLoaded', () => {
  const stations = document.querySelectorAll('#metro-svg circle');
  stations.forEach(s => {
    s.style.cursor = 'pointer';
    s.addEventListener('mouseenter', () => { s.style.filter = 'brightness(1.4) drop-shadow(0 0 8px currentColor)'; });
    s.addEventListener('mouseleave', () => { s.style.filter = ''; });
  });
  // Animate lines drawing in
  document.querySelectorAll('#metro-svg path').forEach((path, i) => {
    const len = path.getTotalLength ? path.getTotalLength() : 500;
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.style.transition = `stroke-dashoffset 1.5s ${i * 0.15}s ease`;
    setTimeout(() => { path.style.strokeDashoffset = 0; }, 100);
  });
});
