/* ui.js: shared interface polish for the homepage and the project demos.
   - Cursor halo: the system cursor is always visible; an accent ring trails it so it is easy to find
     on any background, grows over things you can click and pulses when you press.
   - Demos: a switcher bar to move between the six demos (also [ and ] keys), cards that rise into
     view, and index cards that light up under the pointer and open wherever you click them.
   - Homepage: the phone menu arrives link by link and gains Demos and Terminal entries; the nav
     comes back whenever keyboard focus moves into it.
   Everything animated is skipped when the device asks for reduced motion. */
(function () {
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var root = document.documentElement;
  var file = location.pathname.split('/').pop().replace('.html', '') || 'index';
  var inDemos = /\/demos\//.test(location.pathname);

  /* ───────── cursor halo ───────── */
  if (fine && !reduced) {
    var halo = document.createElement('div'); halo.className = 'ui-halo'; halo.setAttribute('aria-hidden', 'true');
    document.body.appendChild(halo);
    var CLICKABLE = 'a, button, [role="button"], [role="radio"], [role="option"], summary, label, select, input[type="checkbox"], input[type="radio"], input[type="range"], .project-card, .card.proj, .pixel-portrait, tr.click';
    var TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]';
    var hx = -100, hy = -100, tx = -100, ty = -100, raf = 0, seen = false;
    var tick = function () {
      hx += (tx - hx) * 0.22; hy += (ty - hy) * 0.22;
      halo.style.transform = 'translate3d(' + hx.toFixed(1) + 'px,' + hy.toFixed(1) + 'px,0)';
      raf = Math.abs(tx - hx) + Math.abs(ty - hy) > 0.2 ? requestAnimationFrame(tick) : 0;
    };
    addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') { halo.classList.remove('show'); return; }
      tx = e.clientX; ty = e.clientY;
      if (!seen) { seen = true; hx = tx; hy = ty; }
      halo.classList.add('show');
      var t = e.target, isEl = t && t.closest;
      halo.classList.toggle('on-text', !!(isEl && t.closest(TEXT)));
      halo.classList.toggle('on-link', !!(isEl && !t.closest(TEXT) && t.closest(CLICKABLE)));
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    addEventListener('pointerdown', function () { halo.classList.add('down'); }, { passive: true });
    addEventListener('pointerup', function () { halo.classList.remove('down'); }, { passive: true });
    document.addEventListener('mouseleave', function () { halo.classList.remove('show'); });
    addEventListener('blur', function () { halo.classList.remove('show'); });
  }

  /* ───────── demos ───────── */
  var DEMOS = [
    ['threatweave', 'ThreatWeave', '36,88,160', '132,176,236'],
    ['secureview', 'SecureView', '172,52,58', '240,134,128'],
    ['soc-lab', 'SOC Detection Lab', '160,86,16', '232,164,92'],
    ['ioc-hunter', 'IOC Hunter', '106,66,168', '182,152,240'],
    ['adam-eve-mizan', 'ADAM / EVE / Mizan', '15,110,106', '111,194,184'],
    ['supply-chain-risk', 'Supply Chain Risk', '134,96,26', '222,182,112']
  ];
  var here = -1; DEMOS.forEach(function (d, i) { if (d[0] === file) here = i; });

  if (inDemos) {
    root.classList.add('ui-demos');
    var top = document.querySelector('.top');

    /* switcher bar */
    if (top && (here >= 0 || file === 'index')) {
      var rail = document.createElement('nav'); rail.className = 'demo-rail'; rail.setAttribute('aria-label', 'Project demos');
      var prev = here >= 0 ? DEMOS[(here + DEMOS.length - 1) % DEMOS.length] : null, next = here >= 0 ? DEMOS[(here + 1) % DEMOS.length] : null;
      var html = '<a class="rail-home" href="../index.html"><span aria-hidden="true">←</span> Home</a><div class="rail-list" role="list">';
      html += '<a role="listitem" class="rail-pill rail-all" href="index.html"' + (file === 'index' ? ' aria-current="page"' : '') + '>All demos</a>';
      DEMOS.forEach(function (d, i) {
        html += '<a role="listitem" class="rail-pill" href="' + d[0] + '.html" style="--pl:' + d[2] + ';--pd:' + d[3] + '"' + (i === here ? ' aria-current="page"' : '') + '><i aria-hidden="true"></i>' + d[1] + '</a>';
      });
      html += '</div>';
      if (prev) html += '<div class="rail-step"><a href="' + prev[0] + '.html" aria-label="Previous demo: ' + prev[1] + '" title="Previous: ' + prev[1] + '  ( [ )">‹</a>' +
        '<span>' + (here + 1) + ' / ' + DEMOS.length + '</span>' +
        '<a href="' + next[0] + '.html" aria-label="Next demo: ' + next[1] + '" title="Next: ' + next[1] + '  ( ] )">›</a></div>';
      rail.innerHTML = html;
      top.parentNode.insertBefore(rail, top.nextSibling);
      var cur = rail.querySelector('.rail-list [aria-current]');
      if (cur) { var list = rail.querySelector('.rail-list'); list.scrollLeft = cur.offsetLeft - list.offsetLeft - 16; }
      if (prev) document.addEventListener('keydown', function (e) {
        var tag = (e.target.tagName || '').toLowerCase();
        if (['input', 'textarea', 'select'].indexOf(tag) >= 0 || e.target.isContentEditable || e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.key === '[') location.href = prev[0] + '.html';
        else if (e.key === ']') location.href = next[0] + '.html';
      });
    }

    /* index cards: light under the pointer, open wherever they are clicked */
    document.querySelectorAll('.card.proj').forEach(function (c) {
      var a = c.querySelector('a.go'); if (!a) return;
      c.addEventListener('click', function (e) { if (!e.target.closest('a') && !getSelection().toString()) a.click(); });
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, { passive: true });
    });

    /* cards rise into view, a beat apart when several arrive together */
    if (!reduced && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        var n = 0;
        entries.forEach(function (en) {
          if (!en.isIntersecting) {                 // already scrolled past (a jump or an anchor link): just show it
            if (en.boundingClientRect.bottom < 0) { en.target.classList.remove('ui-rise'); io.unobserve(en.target); }
            return;
          }
          en.target.style.transitionDelay = (n++ * 70) + 'ms';
          en.target.classList.add('in'); io.unobserve(en.target);
          setTimeout(function () { en.target.classList.remove('ui-rise', 'in'); en.target.style.transitionDelay = ''; }, 900 + n * 70);
        });
      }, { rootMargin: '0px 0px -6% 0px' });
      document.querySelectorAll('main .card, .tips .tip, main .hero').forEach(function (el) { el.classList.add('ui-rise'); io.observe(el); });
    }
  }

  /* ───────── homepage nav ───────── */
  var navbar = document.getElementById('navbar'), menu = document.getElementById('mobile-menu');
  if (navbar) navbar.addEventListener('focusin', function () { navbar.classList.remove('hidden'); });
  if (menu) {
    var mnav = menu.querySelector('.mobile-nav');
    if (mnav && !mnav.querySelector('[data-ui]')) {
      var close = function () { var x = document.getElementById('mobile-close'); if (x) x.click(); };
      var demos = document.createElement('a'); demos.className = 'mobile-nav-link'; demos.href = 'demos/index.html'; demos.dataset.index = '◆'; demos.dataset.ui = '1'; demos.textContent = 'Live demos';
      mnav.appendChild(demos);
      if (window.SH_TERMINAL) {
        var term = document.createElement('a'); term.className = 'mobile-nav-link'; term.href = '#'; term.dataset.index = '>_'; term.dataset.ui = '1'; term.textContent = 'Terminal';
        term.addEventListener('click', function (e) { e.preventDefault(); close(); setTimeout(window.SH_TERMINAL.open, 200); });
        mnav.appendChild(term);
      }
    }
    menu.querySelectorAll('.mobile-nav-link, .mobile-socials').forEach(function (el, i) { el.style.setProperty('--i', i); });
  }
})();
