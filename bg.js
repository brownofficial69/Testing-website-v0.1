/* bg.js: one background per theme.
   Aqua is the only water theme: it uses the WebGL engine in fx.js (flowing currents, drifting colour, ripples).
   The other four are technology themes built on free, open-licence resources, loaded only when chosen:
     Neural   - tsParticles (MIT): an interactive particle network
     Orbital  - Vanta.js GLOBE (MIT) over NASA's Black Marble night-lights image (public domain, NASA Earth Observatory)
     Reactor  - Vanta.js RINGS (MIT)
     Hologram - Vanta.js DOTS (MIT) on light glass
   Vanta runs on three.js r134 (MIT). All are pinned versions published in 2021-2023 and served from vendor/. */
(function () {
'use strict';
/* pinned copies served from this repository (vendor/), checked with Subresource Integrity:
   no third-party CDN is contacted at runtime */
var BASE = ((document.currentScript && document.currentScript.src) || '').replace(/bg\.js.*$/, '') + 'vendor/';
var CDN = {
  three: ['three-r134/three.min.js', 'sha384-9EQoUIJYrv09/oYhSxnw1VpLcfPw3BM9dE7+D/3wGUPeLLa7F9Z6OAoD+i/M6FK9'],
  globe: ['vanta-0.5.24/vanta.globe.min.js', 'sha384-HiLexGd74hcQ6g/RxA2NsDBwbmX+PmKsMBVLRsUWFwFJth+ybhAQ6N90hz80HeSD'],
  rings: ['vanta-0.5.24/vanta.rings.min.js', 'sha384-TVjj/sxw6r6Oa7iM1794GqL9YKqjTHEX/K2EVmAICdaP8EXqVCwzl0YIwqUGwdWf'],
  dots: ['vanta-0.5.24/vanta.dots.min.js', 'sha384-kQQ7o4yeMrOeO8DpJKvO+tKx/MxnHFOQwuTvmFwh7bNHCnyBRfmIuXwwzHLD8XuM'],
  particles: ['tsparticles-slim-2.12.0/tsparticles.slim.bundle.min.js', 'sha384-xICYS6rIsARSX3k0YKfjEX+OFPqH6c1BHFyDy/Qu4MKRcQT39ngsWhuBOhoRcQl/'],
};
var IDS = ['calm', 'night', 'aqua', 'neural', 'orbital', 'reactor', 'holo'];
var QUIET = ['calm', 'night']; /* the quiet themes draw no background */
var HUE_VARS = ['--g-rgb', '--c-rgb', '--p-rgb', '--accent-green', '--accent-cyan', '--accent-purple'];
var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
var loaded = {};
function loadScript(lib) {
  var url = BASE + lib[0];
  if (loaded[url]) return loaded[url];
  loaded[url] = new Promise(function (res, rej) { var s = document.createElement('script'); s.src = url; s.integrity = lib[1]; s.onload = res; s.onerror = function () { delete loaded[url]; rej(new Error('failed ' + url)); }; document.head.appendChild(s); });
  return loaded[url];
}
function seq(urls) { return urls.reduce(function (p, u) { return p.then(function () { return loadScript(u); }); }, Promise.resolve()); }

function create(opts) {
  var root = document.documentElement, fxCanvas = opts.canvas, fx = null, effect = null, current = null, token = 0;
  var host = document.getElementById('bg');
  if (!host) { host = document.createElement('div'); host.id = 'bg'; host.setAttribute('aria-hidden', 'true'); host.style.cssText = 'position:fixed;inset:0;z-index:' + (opts.z == null ? 0 : opts.z) + ';display:none;pointer-events:' + (opts.interactive === false ? 'none' : 'auto'); document.body.insertBefore(host, document.body.firstChild); }
  var earth = document.createElement('div'); earth.className = 'bg-earth'; earth.style.cssText = 'position:absolute;inset:-6%;background:url(' + (opts.earth || 'assets/earth-night.jpg') + ') center/cover no-repeat;opacity:0;transition:opacity 1.4s ease;filter:saturate(1.2) contrast(1.15) brightness(1.4);animation:earthDrift 90s linear infinite alternate';
  host.appendChild(earth);
  if (!document.getElementById('bg-style')) { var st = document.createElement('style'); st.id = 'bg-style'; st.textContent = '@keyframes earthDrift{from{transform:translate3d(-2%,0,0) scale(1.06)}to{transform:translate3d(2%,-1%,0) scale(1.12)}}#bg canvas{position:absolute!important;inset:0}'; document.head.appendChild(st); }

  if (fxCanvas && window.FX) {
    fx = window.FX.create(fxCanvas, { onDrop: opts.onDrop, onHue: function (h, toRgb, hex) {
      if (current !== 'aqua' || root.hasAttribute('data-demo')) return; /* demos keep their own accent */ var g = toRgb(h, 0.82, 0.56), c = toRgb(h - 0.05, 0.9, 0.78), p = toRgb(h + 0.13, 0.8, 0.74), st = root.style;
      st.setProperty('--g-rgb', g.join(', ')); st.setProperty('--c-rgb', c.join(', ')); st.setProperty('--p-rgb', p.join(', '));
      st.setProperty('--accent-green', hex(g)); st.setProperty('--accent-cyan', hex(c)); st.setProperty('--accent-purple', hex(p)); } });
    if (!fx) fxCanvas.style.display = 'none';
  }

  function stop() { token++; if (effect) { try { effect.destroy(); } catch (e) { /* ignore */ } effect = null; } host.querySelectorAll('canvas, .tsp').forEach(function (n) { n.remove(); }); earth.style.opacity = 0; }
  function clearHue() { HUE_VARS.forEach(function (v) { root.style.removeProperty(v); }); }
  function poster(id) { host.style.background = ({ neural: 'radial-gradient(120% 90% at 50% 0%,#1d1248,#09051a)', orbital: 'radial-gradient(120% 90% at 50% 100%,#0a1a3a,#02050d)', reactor: 'radial-gradient(120% 90% at 50% 50%,#3a0d08,#0b0204)', holo: 'radial-gradient(120% 90% at 30% 0%,#ffffff,#dbe7fb)' })[id] || ''; }

  function set(id) {
    if (IDS.indexOf(id) < 0) id = 'calm';
    if (id === current) return; current = id; stop();
    if (id === 'aqua') { clearHue(); host.style.display = 'none'; if (fxCanvas && fx) { fxCanvas.style.display = 'block'; fx.resume(); } return; }
    clearHue(); if (fx) { fx.pause(); fxCanvas.style.display = 'none'; }
    if (QUIET.indexOf(id) >= 0) { host.style.display = 'none'; return; }
    host.style.display = 'block'; poster(id); host.style.opacity = id === 'reactor' ? 0.45 : 1;
    if (reduced) return;
    var my = token;
    var run = {
      neural: function () { return loadScript(CDN.particles).then(function () { if (my !== token || !window.tsParticles) return; var el = document.createElement('div'); el.className = 'tsp'; el.id = 'tsp-' + my; el.style.cssText = 'position:absolute;inset:0'; host.appendChild(el);
        return window.tsParticles.load(el.id, { fpsLimit: 60, detectRetina: true, background: { color: 'transparent' }, fullScreen: { enable: false },
          particles: { number: { value: 95, density: { enable: true, area: 900 } }, color: { value: ['#a58bff', '#5af0d8', '#ff7ad9'] }, size: { value: { min: 1.2, max: 3.2 } }, opacity: { value: { min: 0.4, max: 0.9 } },
            links: { enable: true, distance: 150, color: '#a58bff', opacity: 0.32, width: 1 }, move: { enable: true, speed: 0.7, outModes: { default: 'bounce' } } },
          interactivity: { events: { onHover: { enable: true, mode: ['grab', 'repulse'] }, onClick: { enable: true, mode: 'push' } }, modes: { grab: { distance: 190, links: { opacity: 0.7 } }, repulse: { distance: 90 }, push: { quantity: 3 } } } }).then(function (c) { if (my !== token) c.destroy(); else effect = c; }); }); },
      orbital: function () { earth.style.opacity = 0.42; return seq([CDN.three, CDN.globe]).then(function () { if (my !== token || !window.VANTA) return; effect = window.VANTA.GLOBE({ el: host, THREE: window.THREE, mouseControls: true, touchControls: true, gyroControls: false, minHeight: 200, minWidth: 200, scale: 1, scaleMobile: 1, color: 0xf2c15a, color2: 0x6db7ff, backgroundColor: 0x02050d, size: 1.15 }); host.style.background = 'transparent'; }); },
      reactor: function () { return seq([CDN.three, CDN.rings]).then(function () { if (my !== token || !window.VANTA) return; effect = window.VANTA.RINGS({ el: host, THREE: window.THREE, mouseControls: true, touchControls: true, gyroControls: false, minHeight: 200, minWidth: 200, scale: 1, scaleMobile: 1, backgroundColor: 0x0b0204, color: 0xff5a1f }); }); },
      holo: function () { return seq([CDN.three, CDN.dots]).then(function () { if (my !== token || !window.VANTA) return; effect = window.VANTA.DOTS({ el: host, THREE: window.THREE, mouseControls: true, touchControls: true, gyroControls: false, minHeight: 200, minWidth: 200, scale: 1, scaleMobile: 1, backgroundColor: 0xeaf1fc, color: 0x2b57d8, color2: 0x7a3ff0, size: 3.2, spacing: 30, showLines: false }); }); },
    }[id];
    if (run) run().catch(function (e) { console.warn(e); });
  }
  return { set: set, ids: IDS, get theme() { return current; }, drop: function (x, y, a) { if (current === 'aqua' && fx) fx.drop(x, y, a); }, fx: fx };
}
window.BG = { create: create, IDS: IDS };
})();
