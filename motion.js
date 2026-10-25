/* motion.js: quiet graphics and motion for the homepage, in plain JavaScript.
   - Signal field: slow, layered contour lines behind the hero in the quiet themes (Calm, Night).
     They lean gently toward the pointer, pause off-screen or in a background tab, and are drawn once,
     still, when the device asks for reduced motion.
   - Staggered reveals: cards that enter together arrive a beat apart instead of all at once.
   - A single nav indicator that glides to the active section.
   - The experience timeline rail grows with your scroll position. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var quiet = function () { var t = root.getAttribute('data-theme'); return t === 'calm' || t === 'night'; };

  /* ───────── signal field ───────── */
  var hero = document.getElementById('hero');
  if (hero) {
    var cv = document.createElement('canvas'); cv.className = 'signal-field'; cv.setAttribute('aria-hidden', 'true');
    hero.insertBefore(cv, hero.firstChild);
    var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = 1, col = '15,110,106', running = false, onScreen = true, t0 = performance.now();
    var px = 0.5, py = 0.5, tx = 0.5, ty = 0.5;
    var size = function () { dpr = Math.min(devicePixelRatio || 1, 2); var r = cv.getBoundingClientRect(); W = Math.round(r.width * dpr); H = Math.round(r.height * dpr); cv.width = W; cv.height = H; draw(performance.now()); };
    var readCol = function () { col = getComputedStyle(root).getPropertyValue('--g-rgb').trim().replace(/\s+/g, '') || col; };
    var LINES = 22;
    function draw(now) {
      if (!W || !H) return;
      var t = reduced ? 0 : (now - t0) / 1000;
      px += (tx - px) * 0.04; py += (ty - py) * 0.04;
      ctx.clearRect(0, 0, W, H);
      var light = root.getAttribute('data-theme') === 'calm';
      /* on tall, narrow screens keep the waves flat and sparse so the copy stays easy to read */
      var narrow = Math.min(1, W / H), lines = narrow < 0.8 ? 14 : LINES, soft = narrow < 0.8 ? 0.7 : 1;
      for (var i = 0; i < lines; i++) {
        var k = i / (lines - 1), base = H * (0.12 + k * 0.8), amp = H * narrow * (0.018 + 0.03 * Math.sin(k * 3.1 + 0.6) ** 2);
        var a = soft * ((light ? 0.07 : 0.09) + (light ? 0.10 : 0.12) * Math.pow(Math.sin(k * Math.PI), 2));
        ctx.strokeStyle = 'rgba(' + col + ',' + a.toFixed(3) + ')'; ctx.lineWidth = (i % 4 === 0 ? 1.4 : 1) * dpr;
        ctx.beginPath();
        for (var x = 0; x <= W; x += 6 * dpr) {
          var u = x / W, d = Math.hypot(u - px, (base / H) - py), pull = Math.exp(-d * d * 18) * H * 0.05;
          var y = base + amp * Math.sin(u * 6.2 + t * 0.22 + i * 0.42) + amp * 0.55 * Math.sin(u * 13.7 - t * 0.17 + i * 0.9) - pull;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    function frame(now) { if (!running) return; draw(now); requestAnimationFrame(frame); }
    function sync() {
      var want = quiet() && !reduced && onScreen && !document.hidden;
      cv.style.display = quiet() ? 'block' : 'none';
      if (want && !running) { running = true; requestAnimationFrame(frame); } else if (!want) running = false;
      if (quiet() && reduced) draw(0);
    }
    hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; }, { passive: true });
    hero.addEventListener('pointerleave', function () { tx = 0.5; ty = 0.5; });
    new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; sync(); }).observe(hero);
    document.addEventListener('visibilitychange', sync);
    new MutationObserver(function () { readCol(); sync(); draw(performance.now()); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    new ResizeObserver(size).observe(cv);
    readCol(); size(); sync();
  }

  /* ───────── staggered reveals: siblings arrive 60 ms apart (capped) ───────── */
  if (!reduced) {
    var groups = new Map();
    document.querySelectorAll('.reveal').forEach(function (el) { var p = el.parentElement; if (!groups.has(p)) groups.set(p, []); groups.get(p).push(el); });
    groups.forEach(function (list) { if (list.length < 2) return; list.forEach(function (el, i) { el.style.transitionDelay = Math.min(i, 6) * 60 + 'ms'; }); });
    /* the delay is only for the entrance; clear it so hover feedback stays instant */
    document.addEventListener('transitionend', function (e) { if (e.target.classList && e.target.classList.contains('reveal') && e.propertyName === 'opacity') e.target.style.transitionDelay = ''; });
  }

  /* ───────── nav indicator ───────── */
  var list = document.querySelector('.nav-links');
  if (list) {
    var ind = document.createElement('span'); ind.className = 'nav-ind'; ind.setAttribute('aria-hidden', 'true'); list.appendChild(ind);
    var place = function () {
      var a = list.querySelector('.nav-link.active');
      if (!a || !a.offsetWidth) { ind.style.opacity = 0; return; }
      var lr = list.getBoundingClientRect(), r = a.getBoundingClientRect();
      ind.style.opacity = 1; ind.style.width = r.width + 'px'; ind.style.transform = 'translateX(' + (r.left - lr.left) + 'px)';
    };
    new MutationObserver(place).observe(list, { subtree: true, attributes: true, attributeFilter: ['class'] });
    addEventListener('resize', place); place();
  }

  /* ───────── timeline rail follows scroll ───────── */
  var tl = document.querySelector('.timeline');
  if (tl && !reduced) {
    tl.classList.add('tl-scroll');
    var tick = false;
    var upd = function () { tick = false; var r = tl.getBoundingClientRect(), p = (innerHeight * 0.7 - r.top) / r.height; tl.style.setProperty('--tl', Math.max(0, Math.min(1, p)).toFixed(3)); };
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true }); upd();
  }
})();
