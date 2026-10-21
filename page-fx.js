/* Adds the theme background to a page (Aqua water, or a free-library technology scene) and keeps the theme in sync with the homepage. */
(function () {
  'use strict';
  var KEY = 'sh-theme', IDS = ['aqua', 'neural', 'orbital', 'reactor', 'holo'];
  function saved() { try { var t = localStorage.getItem(KEY); return IDS.indexOf(t) >= 0 ? t : 'aqua'; } catch (e) { return 'aqua'; } }
  var root = document.documentElement, theme = saved(); root.setAttribute('data-theme', theme);
  var me = document.currentScript, base = me && me.src ? me.src.replace(/page-fx\.js.*$/, '') : '';
  var c = document.createElement('canvas'); c.id = 'fx'; c.setAttribute('aria-hidden', 'true'); document.body.insertBefore(c, document.body.firstChild);
  var bg = null;
  function apply(t, announce) {
    theme = t; root.setAttribute('data-theme', t);
    if (bg) { bg.set(t); if (announce) bg.drop(innerWidth / 2, innerHeight / 2, 1.6); }
  }
  var s = document.createElement('script'); s.src = base + 'bg.js?v=20261023';
  s.onload = function () {
    bg = window.BG.create({ canvas: c, z: -1, earth: base + 'assets/earth-night.jpg', interactive: false });
    window.PAGEFX = bg; bg.set(theme);
  };
  s.onerror = function () { c.remove(); };
  document.head.appendChild(s);
  addEventListener('storage', function (e) { if (e.key === KEY && IDS.indexOf(e.newValue) >= 0) apply(e.newValue); });
  addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase(); if (['input', 'textarea', 'select'].indexOf(tag) >= 0 || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.toLowerCase() === 't') { var n = IDS[(IDS.indexOf(theme) + 1) % IDS.length]; apply(n, true); try { localStorage.setItem(KEY, n); } catch (x) { /* storage off */ } }
  });
})();
