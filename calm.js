/* Calm helpers for the homepage, modelled on features people praise in tools they return to:
   - a command palette (Linear, Raycast, Vercel): press Ctrl/⌘ K or / to go anywhere
   - "pick up where you left off" (Kindle, Medium): a small, dismissible chip on a return visit
   - copy email with a quiet confirmation (Stripe, GitHub)
   Nothing here talks to a server; the only thing stored is the last section you read, in this browser. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var EMAIL = 'sm.shadman.hossain@gmail.com';
  var LAST = 'sh-last-section';

  /* ───── toast ───── */
  var toastEl = document.createElement('div'); toastEl.className = 'calm-toast'; toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite'); document.body.appendChild(toastEl);
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(function () { toastEl.classList.remove('show'); }, 2200); }
  function copyEmail() {
    var done = function () { toast('Email copied: ' + EMAIL); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(EMAIL).then(done, function () { location.href = 'mailto:' + EMAIL; });
    else location.href = 'mailto:' + EMAIL;
  }

  /* ───── sections ───── */
  var SECTIONS = [];
  document.querySelectorAll('section[id]').forEach(function (s) {
    if (s.id === 'hero') return;
    var t = $('.section-title', s); if (!t) return;
    SECTIONS.push({ id: s.id, name: t.textContent.trim().replace(/\s+/g, ' ') });
  });
  function go(id) { var el = document.getElementById(id); if (!el) return; el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); history.replaceState(null, '', '#' + id); }

  /* ───── command palette ───── */
  function items() {
    var list = [];
    SECTIONS.forEach(function (s) { list.push({ g: 'Go to', icon: 'fa-arrow-right', label: s.name, run: function () { go(s.id); } }); });
    [['Play: ADAM / EVE / Mizan arena', 'v42/index.html'], ['Play: Prompt Injection Range', 'v43/index.html'], ['Play: Break the Login', 'v45/index.html'],
     ['Play: Incident Desk', 'v44/index.html'], ['Play: Intrusion Replay', 'v37/index.html'], ['Play: Chess', 'v41/index.html'], ['Gallery of everything', 'versions.html'], ['Project demos', 'demos/index.html']]
      .forEach(function (p) { list.push({ g: 'Explore', icon: 'fa-gamepad', label: p[0], run: function () { location.href = p[1]; } }); });
    list.push({ g: 'Actions', icon: 'fa-envelope', label: 'Copy email address', hint: EMAIL, run: copyEmail });
    list.push({ g: 'Actions', icon: 'fa-file-arrow-down', label: 'Download CV (PDF)', run: function () { var a = document.createElement('a'); a.href = 'assets/cv.pdf'; a.download = ''; document.body.appendChild(a); a.click(); a.remove(); } });
    list.push({ g: 'Actions', icon: 'fa-brands fa-github', label: 'Open GitHub', run: function () { window.open('https://github.com/shaddiegit', '_blank', 'noopener'); } });
    list.push({ g: 'Actions', icon: 'fa-brands fa-linkedin-in', label: 'Open LinkedIn', run: function () { window.open('https://www.linkedin.com/in/shadman-hossain1206', '_blank', 'noopener'); } });
    if (window.SH_THEMES) window.SH_THEMES.list.forEach(function (t) { list.push({ g: 'Theme', icon: 'fa-palette', label: 'Theme: ' + t.name, hint: t.quiet ? 'quiet' : 'expressive', run: function () { window.SH_THEMES.apply(t.id); } }); });
    return list;
  }
  var wrap = document.createElement('div'); wrap.className = 'cmdk'; wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = '<div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="Command menu">' +
    '<input class="cmdk-input" type="text" placeholder="Search sections, games and actions" aria-label="Search" role="combobox" aria-expanded="true" aria-controls="cmdk-list" autocomplete="off" spellcheck="false" />' +
    '<ul class="cmdk-list" id="cmdk-list" role="listbox"></ul>' +
    '<div class="cmdk-foot"><span>↑↓ move</span><span>↵ open</span><span>esc close</span></div></div>';
  document.body.appendChild(wrap);
  var input = $('.cmdk-input', wrap), listEl = $('.cmdk-list', wrap), all = [], shown = [], sel = 0, lastFocus = null;
  function render() {
    var q = input.value.trim().toLowerCase();
    shown = all.filter(function (it) { return !q || (it.label + ' ' + it.g + ' ' + (it.hint || '')).toLowerCase().indexOf(q) >= 0; });
    if (sel >= shown.length) sel = Math.max(0, shown.length - 1);
    if (!shown.length) { listEl.innerHTML = '<li class="cmdk-empty">Nothing matches. Try "projects", "chess" or "email".</li>'; input.removeAttribute('aria-activedescendant'); return; }
    var html = '', g = '';
    shown.forEach(function (it, i) {
      if (it.g !== g) { g = it.g; html += '<li class="cmdk-group" role="presentation">' + g + '</li>'; }
      html += '<li class="cmdk-item" role="option" id="cmdk-' + i + '" data-i="' + i + '" aria-selected="' + (i === sel) + '"><i class="fas ' + it.icon + '" aria-hidden="true"></i><span>' + it.label + '</span>' + (it.hint ? '<small>' + it.hint + '</small>' : '') + '</li>';
    });
    listEl.innerHTML = html; input.setAttribute('aria-activedescendant', 'cmdk-' + sel);
    var cur = listEl.querySelector('[aria-selected="true"]'); if (cur) cur.scrollIntoView({ block: 'nearest' });
  }
  function open() { all = items(); sel = 0; input.value = ''; lastFocus = document.activeElement; wrap.classList.add('open'); wrap.setAttribute('aria-hidden', 'false'); render(); setTimeout(function () { input.focus(); }, 30); }
  function close() { wrap.classList.remove('open'); wrap.setAttribute('aria-hidden', 'true'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function runSel() { var it = shown[sel]; if (!it) return; close(); setTimeout(it.run, 60); }
  input.addEventListener('input', function () { sel = 0; render(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(shown.length - 1, sel + 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); runSel(); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  });
  listEl.addEventListener('mousemove', function (e) { var li = e.target.closest('.cmdk-item'); if (li && +li.dataset.i !== sel) { sel = +li.dataset.i; render(); } });
  listEl.addEventListener('click', function (e) { var li = e.target.closest('.cmdk-item'); if (!li) return; sel = +li.dataset.i; runSel(); });
  wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase(), typing = ['input', 'textarea', 'select'].indexOf(tag) >= 0 || e.target.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); wrap.classList.contains('open') ? close() : open(); }
    else if (e.key === '/' && !typing && !wrap.classList.contains('open')) { e.preventDefault(); open(); }
  });
  /* a visible button in the nav, so the palette is discoverable without knowing the shortcut */
  var right = $('.nav-right');
  if (right) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'cmdk-btn'; b.setAttribute('aria-label', 'Open the command menu');
    b.innerHTML = '<i class="fas fa-magnifying-glass" aria-hidden="true"></i><span>Search</span><kbd>' + (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl') + ' K</kbd>';
    b.addEventListener('click', open); right.insertBefore(b, right.firstChild);
  }

  /* ───── email: copy on click, with mailto as a fallback ───── */
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
    a.addEventListener('click', function (e) { if (!navigator.clipboard) return; e.preventDefault(); copyEmail(); });
    a.setAttribute('title', 'Click to copy ' + EMAIL);
  });

  /* ───── pick up where you left off ───── */
  var saved = null; try { saved = localStorage.getItem(LAST); } catch (e) { /* storage off */ }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { try { localStorage.setItem(LAST, en.target.id); } catch (e) { /* storage off */ } } });
    }, { rootMargin: '-45% 0px -50% 0px' });
    SECTIONS.forEach(function (s) { io.observe(document.getElementById(s.id)); });
  }
  var target = SECTIONS.filter(function (s) { return s.id === saved; })[0];
  if (target && !location.hash && target.id !== SECTIONS[0].id) {
    var chip = document.createElement('div'); chip.className = 'resume'; chip.setAttribute('role', 'region'); chip.setAttribute('aria-label', 'Continue reading');
    chip.innerHTML = '<span>Welcome back. Continue at <b>' + target.name + '</b>?</span><button type="button" class="go">Continue</button><button type="button" class="x" aria-label="Dismiss">Not now</button>';
    document.body.appendChild(chip);
    var hide = function () { chip.classList.remove('show'); setTimeout(function () { chip.remove(); }, 400); };
    $('.go', chip).addEventListener('click', function () { hide(); go(target.id); });
    $('.x', chip).addEventListener('click', hide);
    setTimeout(function () { chip.classList.add('show'); }, 1200);
    setTimeout(function () { if (document.body.contains(chip)) hide(); }, 12000);
    addEventListener('scroll', function once() { if (scrollY > innerHeight * 0.6) { hide(); removeEventListener('scroll', once); } }, { passive: true });
  }
})();
