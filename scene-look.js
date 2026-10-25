/* scene-look.js: the 3D scenes (CyberCity, DNA Helix, Threat Graph) always stay at night,
   so they take only the chosen theme's type and shapes from theme-styles.css, never its colours. */
(function () {
  'use strict';
  var LOOK = { calm: 'editorial', night: 'editorial', aqua: 'liquid', neural: 'pixel', orbital: 'hud', reactor: 'industrial', holo: 'iridescent' };
  var root = document.documentElement;
  function set(t) { root.setAttribute('data-look', LOOK[t] || 'editorial'); }
  try { set(localStorage.getItem('sh-theme')); } catch (e) { set(); }
  var me = document.currentScript, base = me && me.src ? me.src.replace(/scene-look\.js.*$/, '') : '';
  var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = base + 'theme-styles.css?v=20261030'; document.head.appendChild(css);
  addEventListener('storage', function (e) { if (e.key === 'sh-theme') set(e.newValue); });
})();
