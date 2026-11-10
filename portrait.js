/* portrait.js: the About photo as live pixel art.
   - assets/profile-pixel.png is a 96×120 pixel portrait made from assets/profile.jpg.
   - Each of its 11,520 pixels is a particle. They assemble when the portrait first scrolls into view,
     scatter away from the pointer and spring back home.
   - Tap the portrait (or the button under it) to sweep a scan line across and reveal the real photo; tap again to go back.
   - At rest it is drawn as one crisp image, so it costs nothing while you read.
   - Reduced motion: no assembly or scattering, and the switch is instant.
   If anything fails (no canvas, image blocked) the plain pixel <img> stays in place. */
(function () {
  'use strict';
  var wrap = document.querySelector('.about-photo-wrapper');
  var img = document.getElementById('profile-img');
  if (!wrap || !img || !document.createElement('canvas').getContext) return;

  var GW = 96, GH = 120;                       // grid of the pixel portrait
  var CROP = [196, 360, 496, 620];             // the same region of profile.jpg, for the photo reveal
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  function whenLoaded(im, cb) {
    if (im.complete && im.naturalWidth) cb(); else im.addEventListener('load', cb, { once: true });
  }

  whenLoaded(img, function () {
    var src = document.createElement('canvas'); src.width = GW; src.height = GH;
    var sctx = src.getContext('2d');
    sctx.drawImage(img, 0, 0, GW, GH);
    var data;
    try { data = sctx.getImageData(0, 0, GW, GH).data; } catch (e) { return; }  // tainted (file://): keep the <img>
    build(src, data);
  });

  function build(src, data) {
    var N = GW * GH;
    var hx = new Float32Array(N), hy = new Float32Array(N), x = new Float32Array(N), y = new Float32Array(N);
    var vx = new Float32Array(N), vy = new Float32Array(N), wait = new Float32Array(N);

    /* group pixels by colour so each frame sets fillStyle once per colour, not once per pixel */
    var buckets = {}, order = [];
    for (var i = 0; i < N; i++) {
      var gx = i % GW, gy = (i / GW) | 0, o = i * 4;
      hx[i] = x[i] = gx; hy[i] = y[i] = gy;
      var key = 'rgb(' + data[o] + ',' + data[o + 1] + ',' + data[o + 2] + ')';
      if (!buckets[key]) { buckets[key] = []; order.push(key); }
      buckets[key].push(i);
    }
    var groups = order.map(function (k) { return { c: k, ids: Uint32Array.from(buckets[k]) }; });

    var cv = document.createElement('canvas');
    cv.className = 'pixel-portrait';
    cv.setAttribute('role', 'img');
    cv.setAttribute('aria-label', 'Shadman Hossain, as pixel art');
    var ctx = cv.getContext('2d');
    wrap.appendChild(cv);
    wrap.classList.add('has-pixel');

    var photo = new Image(); photo.src = 'assets/profile.jpg';

    var W = 0, H = 0, dpr = 1, cell = 1;
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      var r = wrap.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
      cv.width = W; cv.height = H; cell = W / GW;
      ctx.imageSmoothingEnabled = false;
      draw();
    }

    var accent = '0,255,136';
    function readAccent() {
      var v = getComputedStyle(root).getPropertyValue('--g-rgb').trim();
      if (v) accent = v;
    }
    readAccent();
    new MutationObserver(function () { readAccent(); draw(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    /* ───── state ───── */
    var moving = false, raf = 0, last = 0;
    var ptr = { in: false, x: -99, y: -99 };
    var reveal = 0, revealTo = 0;              // 0 = pixel art, 1 = photo
    var R = 12, R2 = R * R, K = 0.07, DAMP = 0.8, PUSH = 1.9;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      if (reveal < 1) {
        if (moving) {
          var s = cell + 0.6;
          for (var g = 0; g < groups.length; g++) {
            ctx.fillStyle = groups[g].c;
            var ids = groups[g].ids;
            for (var k = 0; k < ids.length; k++) { var i = ids[k]; ctx.fillRect(x[i] * cell, y[i] * cell, s, s); }
          }
        } else {
          ctx.drawImage(src, 0, 0, W, H);      // at rest: one crisp image
        }
      }
      if (reveal > 0 && photo.complete && photo.naturalWidth) {
        var line = Math.round(reveal * H);
        ctx.save();
        ctx.beginPath(); ctx.rect(0, 0, W, line); ctx.clip();
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(photo, CROP[0], CROP[1], CROP[2], CROP[3], 0, 0, W, H);
        ctx.restore();
        ctx.imageSmoothingEnabled = false;
        if (reveal < 1) {                      // the scan line, with a soft glow trailing it
          var gr = ctx.createLinearGradient(0, line - 26 * dpr, 0, line);
          gr.addColorStop(0, 'rgba(' + accent + ',0)'); gr.addColorStop(1, 'rgba(' + accent + ',.45)');
          ctx.fillStyle = gr; ctx.fillRect(0, line - 26 * dpr, W, 26 * dpr);
          ctx.fillStyle = 'rgba(' + accent + ',1)'; ctx.fillRect(0, line - dpr, W, 2 * dpr);
        }
      }
    }

    function step(now) {
      var dt = Math.min(2.5, (now - (last || now)) / 16.67 || 1); last = now;
      var maxd = 0;
      if (moving) {
        for (var i = 0; i < N; i++) {
          if (wait[i] > 0) { wait[i] -= dt; maxd = 1; continue; }   // still queued to fly home: not settled
          var ax = (hx[i] - x[i]) * K, ay = (hy[i] - y[i]) * K;
          if (ptr.in) {
            var dx = x[i] - ptr.x, dy = y[i] - ptr.y, d2 = dx * dx + dy * dy;
            if (d2 < R2) { var d = Math.sqrt(d2) + 0.001, f = (1 - d2 / R2) * PUSH; ax += dx / d * f; ay += dy / d * f; }
          }
          vx[i] = (vx[i] + ax * dt) * Math.pow(DAMP, dt); vy[i] = (vy[i] + ay * dt) * Math.pow(DAMP, dt);
          x[i] += vx[i] * dt; y[i] += vy[i] * dt;
          var m = Math.abs(hx[i] - x[i]) + Math.abs(hy[i] - y[i]) + Math.abs(vx[i]) + Math.abs(vy[i]);
          if (m > maxd) maxd = m;
        }
        if (!ptr.in && maxd < 0.03) {          // settled: snap home and stop drawing particles
          x.set(hx); y.set(hy); vx.fill(0); vy.fill(0); moving = false;
        }
      }
      if (reveal !== revealTo) {
        var sp = 0.035 * dt;
        reveal = revealTo > reveal ? Math.min(revealTo, reveal + sp) : Math.max(revealTo, reveal - sp);
      }
      draw();
      if (moving || reveal !== revealTo) raf = requestAnimationFrame(step); else { raf = 0; last = 0; }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(step); }

    /* ───── assemble on first view ───── */
    var assembled = false;
    function assemble() {
      if (assembled) return; assembled = true;
      if (reduced) { draw(); return; }
      for (var i = 0; i < N; i++) {
        var a = Math.random() * Math.PI * 2, r = 40 + Math.random() * 90;
        x[i] = hx[i] + Math.cos(a) * r; y[i] = hy[i] + Math.sin(a) * r * 0.8;
        vx[i] = vy[i] = 0;
        wait[i] = hy[i] * 0.35 + Math.random() * 10;   // rows arrive top to bottom
      }
      moving = true; kick();
    }
    if ('IntersectionObserver' in window && !reduced) {
      var io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { assemble(); io.disconnect(); }
      }, { threshold: 0.35 });
      io.observe(wrap);
    } else { assembled = true; }

    /* ───── pointer: scatter and spring back ───── */
    function toGrid(e) {
      var r = cv.getBoundingClientRect();
      ptr.x = (e.clientX - r.left) / r.width * GW; ptr.y = (e.clientY - r.top) / r.height * GH;
    }
    cv.addEventListener('pointermove', function (e) {
      if (reduced || reveal > 0 || !assembled) return;
      toGrid(e); ptr.in = true; moving = true; kick();
    });
    cv.addEventListener('pointerleave', function () { ptr.in = false; ptr.x = ptr.y = -99; });

    /* ───── switch between pixel art and the photo ───── */
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'portrait-toggle';
    btn.setAttribute('aria-pressed', 'false');
    var side = wrap.parentNode;
    side.insertBefore(btn, wrap.nextSibling);
    function label() {
      var on = revealTo === 1;
      btn.setAttribute('aria-pressed', String(on));
      btn.innerHTML = on
        ? '<i class="fas fa-border-all" aria-hidden="true"></i> Back to pixel art'
        : '<i class="fas fa-wand-magic-sparkles" aria-hidden="true"></i> Decrypt to photo';
      cv.setAttribute('aria-label', on ? 'Shadman Hossain, photo' : 'Shadman Hossain, as pixel art');
    }
    function toggle() {
      revealTo = revealTo === 1 ? 0 : 1;
      ptr.in = false;
      if (reduced) reveal = revealTo;
      if (typeof SoundEngine !== 'undefined') SoundEngine.play(revealTo ? 'success' : 'click');
      label(); kick(); draw();
    }
    label();
    btn.addEventListener('click', toggle);
    cv.addEventListener('click', toggle);
    photo.addEventListener('load', draw);

    if ('ResizeObserver' in window) new ResizeObserver(size).observe(wrap); else addEventListener('resize', size);
    size();
  }
})();
