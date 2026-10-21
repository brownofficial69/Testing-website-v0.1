/* Adds the water-drop background to a page and keeps the theme in sync with the homepage. */
(function () {
  'use strict';
  var KEY = 'sh-theme', IDS = ['aqua', 'neural', 'holo', 'plasma', 'aurora'];
  function saved() { try { var t = localStorage.getItem(KEY); return IDS.indexOf(t) >= 0 ? t : 'aqua'; } catch (e) { return 'aqua'; } }
  var root = document.documentElement, theme = saved(); root.setAttribute('data-theme', theme);
  if (!window.FX) return;
  var c = document.createElement('canvas'); c.id = 'fx'; c.setAttribute('aria-hidden', 'true'); document.body.insertBefore(c, document.body.firstChild);
  var fx = window.FX.create(c, { theme: theme }); if (!fx) { c.remove(); return; }
  function apply(t) { theme = t; root.setAttribute('data-theme', t); fx.setTheme(t); try { localStorage.setItem(KEY, t); } catch (e) { /* storage off */ } }
  addEventListener('storage', function (e) { if (e.key === KEY && IDS.indexOf(e.newValue) >= 0) { theme = e.newValue; root.setAttribute('data-theme', theme); fx.setTheme(theme); } });
  addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase(); if (['input', 'textarea', 'select'].indexOf(tag) >= 0 || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.toLowerCase() === 't') { apply(IDS[(IDS.indexOf(theme) + 1) % IDS.length]); fx.drop(innerWidth / 2, innerHeight / 2, 1.6); }
  });
  window.PAGEFX = fx;
})();
