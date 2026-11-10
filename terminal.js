/* terminal.js: a working shell for the portfolio. Press ` (backtick) or pick "Open terminal" in the
   command menu. It reads the page itself (sections, skills, projects, themes), so it never goes stale.
   Tab completes, ↑/↓ walks history, Esc or `exit` closes. Nothing leaves the browser. */
(function () {
  'use strict';
  var EMAIL = 'sm.shadman.hossain@gmail.com';
  var GITHUB = 'https://github.com/shaddiegit';
  var LINKEDIN = 'https://www.linkedin.com/in/shadman-hossain1206';
  var GAMES = [
    ['arena', 'ADAM / EVE / Mizan agent-authorization arena', 'v42/index.html'],
    ['injection', 'Prompt Injection Range', 'v43/index.html'],
    ['login', 'Break the Login', 'v45/index.html'],
    ['incident', 'Incident Desk', 'v44/index.html'],
    ['replay', 'Intrusion Replay', 'v37/index.html'],
    ['graph', '3D graph of this CV', 'v36/index.html'],
    ['city', 'Neon city', 'v19/index.html'],
    ['chess', 'Chess', 'v41/index.html']
  ];
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var projects = function () { return typeof PROJECTS !== 'undefined' ? PROJECTS : {}; };
  var themes = function () { return window.SH_THEMES ? window.SH_THEMES.list : []; };
  var sections = function () {
    var out = [];
    document.querySelectorAll('section[id]').forEach(function (s) {
      var t = $('.section-title', s); if (t) out.push({ id: s.id, name: t.textContent.trim().replace(/\s+/g, ' ') });
    });
    return out;
  };
  var skills = function () {
    return Array.prototype.map.call(document.querySelectorAll('.skill-row'), function (r) {
      var h = $('.skill-row-header', r);
      return { name: h ? h.textContent.trim() : '', tags: Array.prototype.map.call(r.querySelectorAll('.skill-tag'), function (t) { return t.textContent.trim(); }) };
    });
  };
  var sound = function (n) { if (typeof SoundEngine !== 'undefined') SoundEngine.play(n); };

  /* ───── panel ───── */
  var el = document.createElement('div');
  el.className = 'term'; el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<div class="term-panel" role="dialog" aria-modal="true" aria-label="Terminal">' +
      '<div class="term-bar"><span class="term-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '<span class="term-title">guest@shadman: ~</span>' +
      '<button type="button" class="term-x" aria-label="Close terminal"><i class="fas fa-xmark" aria-hidden="true"></i></button></div>' +
      '<div class="term-out" role="log" aria-live="polite"></div>' +
      '<form class="term-line" autocomplete="off"><label class="term-ps1" for="term-in">guest@shadman:~$</label>' +
      '<input id="term-in" class="term-in" type="text" spellcheck="false" autocapitalize="off" aria-label="Command" /></form>' +
    '</div>';
  document.body.appendChild(el);
  var out = $('.term-out', el), input = $('.term-in', el), form = $('.term-line', el);
  var hist = [], hi = 0, lastFocus = null, greeted = false;
  try { hist = JSON.parse(sessionStorage.getItem('sh-term-hist') || '[]'); } catch (e) { hist = []; }

  function print(html, cls) {
    var d = document.createElement('div'); d.className = 'term-row' + (cls ? ' ' + cls : ''); d.innerHTML = html;
    out.appendChild(d); out.scrollTop = out.scrollHeight; return d;
  }
  /* type a few lines out one after another, the way a real tool streams its output */
  var busyUntil = 0;                           // while output streams, the next command waits its turn
  function stream(lines, gap) {
    if (reduced) { lines.forEach(function (l) { print(l); }); return; }
    gap = gap || 70;
    busyUntil = performance.now() + lines.length * gap;
    lines.forEach(function (l, i) { setTimeout(function () { print(l); sound('type'); }, i * gap); });
  }
  var link = function (href, text, ext) { return '<a href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + esc(text) + '</a>'; };
  var cmd = function (c) { return '<button type="button" class="term-cmd" data-run="' + esc(c) + '">' + esc(c) + '</button>'; };
  var pad = function (s, n) { s = String(s); return s + new Array(Math.max(1, n - s.length + 1)).join(' '); };

  function greet() {
    if (greeted) return; greeted = true;
    print('<span class="t-g">shadman-os</span> 1.0 · portfolio shell. Everything here runs in your browser.');
    print('Type ' + cmd('help') + ' to see commands, or try ' + cmd('whoami') + ', ' + cmd('nmap shadman') + ', ' + cmd('ls projects') + '.');
  }

  /* ───── commands ───── */
  var C = {};
  C.help = function () {
    var rows = [
      ['whoami', 'who I am, in one breath'], ['ls [projects|games]', 'list what is here'], ['cat <project>', 'read a project summary'],
      ['open <project|section>', 'open a project or jump to a section'], ['skills', 'skills, grouped'], ['nmap shadman', 'scan me for open skills'],
      ['theme [name]', 'list or switch themes'], ['play [game]', 'list or launch a playable demo'], ['pixel', 'switch my portrait between pixel art and photo'],
      ['cv', 'download my CV'], ['contact', 'copy my email address'], ['github · linkedin', 'open my profiles'],
      ['history · clear · exit', 'the usual']
    ];
    print('<div class="term-grid">' + rows.map(function (r) { return '<span class="t-g">' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span>'; }).join('') + '</div>');
  };
  C.whoami = function () {
    stream([
      '<span class="t-g">Shadman Hossain</span> · First-Class BSc Ethical Hacking &amp; Cyber Security, Coventry University (2026)',
      'Focus: AI-agent authorization and safety · detection engineering · security automation',
      'Now: FDM consultant on a Deutsche Bank assignment · Birmingham, UK · full UK right to work',
      'Looking for: junior security-engineering or AI-evaluation roles. Try ' + cmd('contact') + '.'
    ]);
  };
  C.ls = function (a) {
    var what = (a[0] || '').replace(/\/$/, '');
    if (what === 'projects') {
      var p = projects();
      print('<pre>' + Object.keys(p).map(function (k) { return '<span class="t-c">' + esc(pad(k, 18)) + '</span>' + esc(p[k].title); }).join('\n') + '</pre>');
      print('<span class="t-m">Read one with</span> ' + cmd('cat ' + Object.keys(p)[0]) + ' <span class="t-m">or open it with</span> ' + cmd('open ' + Object.keys(p)[0]));
    } else if (what === 'games') { C.play([]); }
    else if (!what) {
      print('<pre><span class="t-c">projects/</span>  <span class="t-c">games/</span>  about.txt  skills.txt  cv.pdf  contact.txt</pre>');
    } else print('ls: cannot access \'' + esc(what) + '\': No such file or directory', 't-err');
  };
  C.cat = function (a) {
    var f = (a[0] || '').toLowerCase();
    if (!f) { print('cat: missing file. Try ' + cmd('cat about.txt'), 't-err'); return; }
    if (f === 'about.txt') return C.whoami();
    if (f === 'skills.txt') return C.skills();
    if (f === 'contact.txt') { print('email    ' + link('mailto:' + EMAIL, EMAIL) + '\ngithub   ' + link(GITHUB, GITHUB, 1) + '\nlinkedin ' + link(LINKEDIN, LINKEDIN, 1)); return; }
    if (f === 'cv.pdf') { print('cv.pdf is binary. Use ' + cmd('cv') + ' to download it.'); return; }
    var p = projects()[f.replace(/^projects\//, '')];
    if (!p) { print('cat: ' + esc(f) + ': No such file. Try ' + cmd('ls projects'), 't-err'); return; }
    print('<span class="t-g">' + esc(p.title) + '</span> <span class="t-m">· ' + esc(p.category || '') + '</span>');
    var tmp = document.createElement('div'); tmp.innerHTML = p.description || '';
    print(esc(tmp.textContent));
    if (p.tech) print('<span class="t-m">stack:</span> ' + p.tech.map(esc).join(' · '));
    if (p.mitre && p.mitre.length) print('<span class="t-m">att&amp;ck:</span> ' + p.mitre.map(function (m) { return esc(m.id); }).join(' '));
    print((p.github ? link(p.github, 'source on GitHub', 1) + ' · ' : '') + cmd('open ' + f));
  };
  C.open = function (a) {
    var t = (a[0] || '').toLowerCase().replace(/^projects\//, '');
    if (!t) { print('open: what? Try ' + cmd('open projects') + ' or ' + cmd('ls projects'), 't-err'); return; }
    var card = document.querySelector('.project-card[data-project="' + CSS.escape(t) + '"]');
    if (card) { close(); setTimeout(function () { card.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }); card.click(); }, 120); return; }
    var s = sections().filter(function (x) { return x.id === t || x.name.toLowerCase().indexOf(t) === 0; })[0];
    if (s) { close(); setTimeout(function () { document.getElementById(s.id).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }, 120); return; }
    print('open: ' + esc(t) + ': not a project or section. Try ' + cmd('ls projects'), 't-err');
  };
  C.cd = C.goto = C.open;
  C.skills = function () {
    skills().forEach(function (g) { print('<span class="t-g">' + esc(g.name) + '</span>  ' + g.tags.map(esc).join(' · ')); });
  };
  C.nmap = function (a) {
    if ((a[0] || '').toLowerCase() !== 'shadman') { print('nmap: you only have permission to scan <span class="t-g">shadman</span>. Authorization first, always.', 't-err'); return; }
    var all = []; skills().forEach(function (g) { g.tags.forEach(function (t) { all.push(t); }); });
    var lines = ['Starting Nmap 7.95 ( https://nmap.org ) against shadman (127.0.0.1)', 'Host is up (0.0002s latency). Very motivated.',
      '<span class="t-m">' + esc(pad('PORT', 10) + pad('STATE', 8)) + 'SERVICE</span>'];
    all.slice(0, 18).forEach(function (t, i) { lines.push(esc(pad((1000 + i * 37) + '/tcp', 10)) + '<span class="t-g">' + esc(pad('open', 8)) + '</span>' + esc(t)); });
    if (all.length > 18) lines.push('<span class="t-m">… ' + (all.length - 18) + ' more. See them all with</span> ' + cmd('skills'));
    lines.push('<span class="t-m">' + all.length + ' services detected. 0 filtered. Recommended action:</span> ' + cmd('contact'));
    stream(lines, 55);
  };
  C.theme = function (a) {
    var list = themes(), t = (a[0] || '').toLowerCase();
    if (!list.length) { print('theme: themes are not available here.', 't-err'); return; }
    if (!t) {
      var cur = document.documentElement.getAttribute('data-theme');
      print('<pre>' + list.map(function (x) { return (x.id === cur ? '<span class="t-g">* ' : '  ') + esc(pad(x.id, 10)) + (x.id === cur ? '</span>' : '') + '<span class="t-m">' + esc(x.style) + '</span>'; }).join('\n') + '</pre>');
      print('<span class="t-m">Switch with</span> ' + cmd('theme ' + list[(list.findIndex(function (x) { return x.id === cur; }) + 1) % list.length].id));
      return;
    }
    var th = list.filter(function (x) { return x.id === t || x.name.toLowerCase() === t; })[0];
    if (!th) { print('theme: unknown theme \'' + esc(t) + '\'. Try ' + cmd('theme'), 't-err'); return; }
    window.SH_THEMES.apply(th.id); print('theme set to <span class="t-g">' + esc(th.name) + '</span>');
  };
  C.play = function (a) {
    var g = (a[0] || '').toLowerCase();
    if (!g) { print('<pre>' + GAMES.map(function (x) { return '<span class="t-c">' + esc(pad(x[0], 11)) + '</span>' + esc(x[1]); }).join('\n') + '</pre>'); print('<span class="t-m">Launch one with</span> ' + cmd('play arena')); return; }
    var m = GAMES.filter(function (x) { return x[0] === g; })[0];
    if (!m) { print('play: no game called \'' + esc(g) + '\'. Try ' + cmd('play'), 't-err'); return; }
    print('launching ' + esc(m[1]) + '…'); setTimeout(function () { location.href = m[2]; }, 350);
  };
  C.pixel = C.photo = function () {
    var b = $('.portrait-toggle');
    if (!b) { print('pixel: the portrait is not available.', 't-err'); return; }
    close(); setTimeout(function () { b.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }); setTimeout(function () { b.click(); }, reduced ? 0 : 600); }, 120);
  };
  C.cv = function () {
    var a = document.createElement('a'); a.href = 'assets/cv.pdf'; a.download = ''; document.body.appendChild(a); a.click(); a.remove();
    print('downloading <span class="t-g">cv.pdf</span>…');
  };
  C.contact = C.email = function () {
    var ok = function () { print('copied <span class="t-g">' + EMAIL + '</span> to your clipboard.'); sound('success'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(EMAIL).then(ok, function () { print('email: ' + link('mailto:' + EMAIL, EMAIL)); });
    else print('email: ' + link('mailto:' + EMAIL, EMAIL));
  };
  C.github = function () { window.open(GITHUB, '_blank', 'noopener'); print('opening ' + link(GITHUB, 'github.com/shaddiegit', 1)); };
  C.linkedin = function () { window.open(LINKEDIN, '_blank', 'noopener'); print('opening ' + link(LINKEDIN, 'linkedin.com/in/shadman-hossain1206', 1)); };
  C.history = function () { print('<pre>' + hist.map(function (h, i) { return esc(pad(i + 1, 4)) + esc(h); }).join('\n') + '</pre>'); };
  C.clear = function () { out.innerHTML = ''; };
  C.exit = function () { close(); };
  C.echo = function (a) { print(esc(a.join(' '))); };
  C.date = function () { print(esc(new Date().toString())); };
  C.pwd = function () { print('/home/guest'); };
  C.sudo = function (a) {
    if (a.join(' ').toLowerCase() === 'hire shadman') {
      stream(['[sudo] password for guest: ********', '<span class="t-g">Access granted.</span> Excellent judgement.', 'Next step: ' + cmd('contact') + ' or ' + cmd('cv')], 260);
      sound('success'); return;
    }
    print('guest is not in the sudoers file. This incident will be reported. (Try <span class="t-g">sudo hire shadman</span>.)', 't-err');
  };
  C['rm'] = function () { print('rm: permission denied. Nice try.', 't-err'); };

  var NAMES = Object.keys(C);
  function complete(v) {
    var parts = v.replace(/^\s+/, '').split(/\s+/);
    var pool;
    if (parts.length <= 1) pool = NAMES;
    else {
      var c = parts[0];
      pool = c === 'theme' ? themes().map(function (t) { return t.id; })
        : c === 'play' ? GAMES.map(function (g) { return g[0]; })
        : c === 'ls' ? ['projects', 'games']
        : c === 'nmap' || c === 'sudo' ? [c === 'nmap' ? 'shadman' : 'hire shadman']
        : (c === 'open' || c === 'cd' || c === 'goto') ? Object.keys(projects()).concat(sections().map(function (s) { return s.id; }))
        : c === 'cat' ? Object.keys(projects()).concat(['about.txt', 'skills.txt', 'contact.txt', 'cv.pdf']) : [];
    }
    var word = parts.length <= 1 ? parts[0] : parts.slice(1).join(' ');
    var hits = pool.filter(function (p) { return p.indexOf(word.toLowerCase()) === 0; });
    if (hits.length === 1) return (parts.length <= 1 ? '' : parts[0] + ' ') + hits[0] + ' ';
    if (hits.length > 1) print(hits.map(esc).join('   '), 't-m');
    return v;
  }

  function run(line) {
    var wait = busyUntil - performance.now();
    if (wait > 0) { setTimeout(function () { run(line); }, wait + 20); return; }
    line = line.trim();
    print('<span class="t-ps1">guest@shadman:~$</span> ' + esc(line), 't-echo');
    if (!line) return;
    if (hist[hist.length - 1] !== line) hist.push(line);
    hist = hist.slice(-50); hi = hist.length;
    try { sessionStorage.setItem('sh-term-hist', JSON.stringify(hist)); } catch (e) { /* storage off */ }
    var parts = line.split(/\s+/), name = parts[0].toLowerCase();
    if (C[name]) { sound('click'); C[name](parts.slice(1)); }
    else print(esc(name) + ': command not found. Type ' + cmd('help') + '.', 't-err');
  }

  /* ───── open / close ───── */
  function open() {
    if (el.classList.contains('open')) { input.focus(); return; }
    lastFocus = document.activeElement;
    el.classList.add('open'); el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('term-open');
    greet(); hi = hist.length; sound('menuOpen');
    setTimeout(function () { input.focus(); }, reduced ? 0 : 180);
  }
  function close() {
    if (!el.classList.contains('open')) return;
    el.classList.remove('open'); el.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('term-open'); sound('menuClose');
    if (lastFocus && lastFocus.focus && document.body.contains(lastFocus)) lastFocus.focus();
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; run(v); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') { e.preventDefault(); input.value = complete(input.value); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) input.value = hist[--hi] || ''; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); C.clear(); }
    else if (e.key === '`') { e.preventDefault(); close(); }
  });
  out.addEventListener('click', function (e) {
    var b = e.target.closest('.term-cmd'); if (!b) return;
    run(b.dataset.run); input.focus();
  });
  $('.term-x', el).addEventListener('click', close);
  el.addEventListener('click', function (e) { if (e.target === el) close(); });
  $('.term-panel', el).addEventListener('click', function (e) { if (!e.target.closest('a, button, .term-out pre, .term-row') && !getSelection().toString()) input.focus(); });

  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (['input', 'textarea', 'select'].indexOf(tag) >= 0 || e.target.isContentEditable) return;
    if (e.key === '`' && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); open(); }
  });
  document.querySelectorAll('[data-open-terminal]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });

  window.SH_TERMINAL = { open: open, close: close, run: function (c) { open(); run(c); } };
})();
