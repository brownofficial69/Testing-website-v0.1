/* Shared by every page: a water ripple where you touch, and a circular wipe between pages.
   The homepage draws its own (much larger) WebGL ripples, so the touch rings are skipped there. */
(function () {
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  var KEY = 'sfx-wipe';

  /* touch ripple */
  addEventListener('pointerdown', function (e) {
    if (document.getElementById('fx')) return;
    if (e.target.closest && e.target.closest('canvas, input, select, textarea')) { /* still ripple on canvases, but not on form fields */ if (e.target.closest('input, select, textarea')) return; }
    ['', 'r2', 'r3'].forEach(function (c) {
      var r = document.createElement('div'); r.className = 'sfx-ring ' + c; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.body.appendChild(r);
      setTimeout(function () { r.remove(); }, 1500);
    });
  }, { passive: true });

  /* page wipe: the old page floods from the click, the new page drains back to it */
  function wipeEl(x, y) { var w = document.createElement('div'); w.className = 'sfx-wipe'; w.style.setProperty('--x', x + 'px'); w.style.setProperty('--y', y + 'px'); document.body.appendChild(w); return w; }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self' || a.hasAttribute('download')) return;
    var u; try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (u.origin !== location.origin) return;
    if (u.pathname === location.pathname && u.search === location.search) return;       /* same-page anchors scroll normally */
    e.preventDefault();
    var x = e.clientX || innerWidth / 2, y = e.clientY || innerHeight / 2;
    try { sessionStorage.setItem(KEY, JSON.stringify({ x: x, y: y, t: Date.now() })); } catch (err) { /* storage off */ }
    var w = wipeEl(x, y); void w.offsetWidth; w.classList.add('in');
    setTimeout(function () { location.href = a.href; }, 560);
  });

  function reveal() {
    var d = null; try { d = JSON.parse(sessionStorage.getItem(KEY) || 'null'); sessionStorage.removeItem(KEY); } catch (err) { /* ignore */ }
    if (!d || Date.now() - d.t > 6000) return;
    var w = wipeEl(d.x, d.y); w.classList.add('cover'); void w.offsetWidth;
    requestAnimationFrame(function () { w.classList.remove('cover'); w.classList.add('out'); setTimeout(function () { w.remove(); }, 1000); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reveal); else reveal();
  addEventListener('pageshow', function (e) { if (e.persisted) document.querySelectorAll('.sfx-wipe').forEach(function (w) { w.remove(); }); });
})();
