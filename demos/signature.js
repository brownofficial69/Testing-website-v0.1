/* signature.js: each demo's own header and one signature visual, in plain JavaScript and SVG.
   It reads the demo's existing data and hooks its existing functions; it never changes the demo's logic.
     soc-lab            event timeline: every event on a time axis, coloured by the rule that caught it
     ioc-hunter         type breakdown of what was found, and a scan pass over the input
     threatweave        parallel-fetch chart: when each feed started and finished
     secureview         severity mix of the queue, and a severity rail on every row
     adam-eve-mizan     agent lanes that light up in order, and a verdict stamp
     supply-chain-risk  a risk gauge in place of the bare number */
(function () {
  'use strict';
  var file = location.pathname.split('/').pop().replace('.html', '');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ICON = {
    console: '<path d="M4 6l5 5-5 5M11 17h9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    scan: '<path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M4 12h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    map: '<circle cx="6" cy="7" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="6" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="18" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 8l3 8M16 8l-3 8M8.5 7h7" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    dash: '<rect x="4" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13" y="4" width="7" height="4" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13" y="10" width="7" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="4" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/>',
    pipe: '<circle cx="5" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="19" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7.5 12h2M14.5 12h2" stroke="currentColor" stroke-width="2"/>',
    report: '<path d="M7 3h7l4 4v14H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 12h5M10 16h5M14 3v4h4" fill="none" stroke="currentColor" stroke-width="2"/>',
  };
  var HERO = {
    'soc-lab': ['console', 'Detection engineering · console', 'SOC Detection Lab', 'Four Sigma-style rules over a 30-event log from one simulated intrusion. Tune thresholds and windows, then watch what gets caught and when.', ['Sigma', 'MITRE ATT&CK', 'Wazuh', 'Python']],
    'ioc-hunter': ['scan', 'Threat intelligence · scanner', 'IOC Hunter', 'Paste messy text and pull out clean indicators: refanged, typed, validated and safe to export.', ['Python', 'Input hardening', 'CSV injection', 'IOCs']],
    'threatweave': ['map', 'Threat intelligence · correlation', 'ThreatWeave', 'Four feeds collected in parallel, then correlated by network and ATT&CK technique into scored dossiers.', ['Go', 'Concurrency', 'ASN', 'MITRE ATT&CK']],
    'secureview': ['dash', 'Security operations · dashboard', 'SecureView', 'A triage queue ranked by severity, asset criticality and confidence, with remediation steps for each alert.', ['TypeScript', 'React', 'Triage', 'MITRE ATT&CK']],
    'adam-eve-mizan': ['pipe', 'AI agent safety · pipeline', 'ADAM / EVE / Mizan', 'An agent proposes, a critic objects, and a mediator decides from policy alone. Every memory write is chained with SHA-256.', ['Python', 'Least privilege', 'Prompt injection', 'Hash chain']],
    'supply-chain-risk': ['report', 'Governance and risk · report', 'Supply Chain Risk', 'Fifteen weighted criteria informed by NIST SP 800-161 turn a vendor profile into a rating and a short list of where to act.', ['NIST SP 800-161', 'Vendor risk', 'VBA', 'Dissertation']],
  };
  var h = HERO[file]; if (!h) return;

  /* ───────── header ───────── */
  var hero = document.createElement('header'); hero.className = 'demo-hero';
  hero.innerHTML = '<div class="dh-ico" aria-hidden="true"><svg viewBox="0 0 24 24">' + ICON[h[0]] + '</svg></div><div class="dh-eye">' + esc(h[1]) + '</div><h2 class="dh-title">' + esc(h[2]) + '</h2><p>' + esc(h[3]) + '</p><div class="dh-meta">' + h[4].map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</div>';
  var top = $('.top'); if (top) top.insertAdjacentElement('afterend', hero);

  var card = function (title, cls, after) { var c = document.createElement('div'); c.className = 'card sig ' + cls; c.innerHTML = '<h2>' + title + '</h2><div class="sig-body"></div>'; if (after) after.insertAdjacentElement('afterend', c); return c; };
  var wrap = function (name, after) { var orig = window[name]; if (typeof orig !== 'function') return false; window[name] = function () { var r = orig.apply(this, arguments); try { after.apply(this, arguments); } catch (e) { console.warn(e); } return r; }; return true; };

  /* ───────── SOC Detection Lab: event timeline ───────── */
  if (file === 'soc-lab' && typeof E !== 'undefined' && typeof rows !== 'undefined') {
    var logCard = $('#log') && $('#log').closest('.card');
    var tc = card('Event timeline', 'sig-timeline'); if (logCard) logCard.parentNode.insertBefore(tc, logCard); else $('main').appendChild(tc);
    var drawTL = function () {
      var maxT = Math.max.apply(null, E.map(function (e) { return e.t; })) || 1, Wd = 1000, x = function (t) { return 30 + (t / maxT) * (Wd - 60); };
      var s = '<line x1="30" y1="60" x2="' + (Wd - 30) + '" y2="60" stroke="currentColor" opacity=".15"/>';
      E.forEach(function (e) { var r = rows[e.id] || [], c = r.indexOf('R2') >= 0 ? 'h2' : r.indexOf('R3') >= 0 ? 'h3' : r.length ? 'h1' : ''; s += '<line class="tk ' + c + '" x1="' + x(e.t) + '" y1="' + (c ? 30 : 44) + '" x2="' + x(e.t) + '" y2="' + (c ? 76 : 70) + '"><title>Event ' + e.id + ' at +' + e.t + 's: ' + esc(e.type) + ' on ' + esc(e.host) + (r.length ? ' (' + r.join(', ') + ')' : '') + '</title></line>'; });
      [0, 0.25, 0.5, 0.75, 1].forEach(function (k) { s += '<text x="' + x(maxT * k) + '" y="98" text-anchor="middle">+' + Math.round(maxT * k) + 's</text>'; });
      $('.sig-body', tc).innerHTML = '<svg viewBox="0 0 ' + Wd + ' 106" role="img" aria-label="Timeline of the 30 events, with detected events highlighted">' + s + '</svg><div class="sig-legend"><span><i style="background:#d6485a"></i>Brute force (R2)</span><span><i style="background:#4884d6"></i>Office to shell to network (R3)</span><span><i style="background:rgb(var(--g-rgb))"></i>Other rules</span><span><i style="background:var(--ln2)"></i>Not detected</span></div>';
    };
    wrap('draw', drawTL); drawTL();
  }

  /* ───────── IOC Hunter: type breakdown and a scan pass ───────── */
  if (file === 'ioc-hunter') {
    var COL = { ipv4: '#4884d6', ipv6: '#2a9bb0', domain: '#2f9e6e', url: '#7a5bd0', email: '#c96a9a', md5: '#c98a16', sha1: '#b0721a', sha256: '#8f5d16', cve: '#5a6b80', rejected: '#d0485a' };
    var sumCard = $('#n1') && $('#n1').closest('.card');
    var ic = card('What was found', 'sig-types', sumCard); if (!sumCard) $('main').appendChild(ic);
    $('.sig-body', ic).innerHTML = '<p class="muted">Press Analyse to see the mix of indicator types.</p>';
    $('#go').addEventListener('click', function () {
      var ta = $('#in'); if (ta && !reduced) { ta.classList.remove('scanning'); void ta.offsetWidth; ta.classList.add('scanning'); setTimeout(function () { ta.classList.remove('scanning'); }, 800); }
      if (typeof OUT === 'undefined' || !OUT.length) return;
      var cnt = {}; OUT.forEach(function (r) { cnt[r.type] = (cnt[r.type] || 0) + 1; });
      var keys = Object.keys(cnt).sort(function (a, b) { return (a === 'rejected') - (b === 'rejected') || cnt[b] - cnt[a]; }), tot = OUT.length;
      $('.sig-body', ic).innerHTML = '<div class="bar2" role="img" aria-label="Indicator types">' + keys.map(function (k) { return '<i style="width:0;background:' + (COL[k] || '#888') + '" data-w="' + (cnt[k] / tot * 100) + '" title="' + k + ': ' + cnt[k] + '"></i>'; }).join('') + '</div><div class="keys">' + keys.map(function (k) { return '<span><i style="background:' + (COL[k] || '#888') + '"></i>' + k + ' <b>' + cnt[k] + '</b></span>'; }).join('') + '</div>';
      requestAnimationFrame(function () { ic.querySelectorAll('.bar2 i').forEach(function (i) { i.style.width = i.dataset.w + '%'; }); });
      /* the same colours on each result's type chip */
      document.querySelectorAll('#res .tag').forEach(function (t) { var c = COL[t.textContent.trim()]; if (c) { t.style.borderColor = c; t.style.color = c; t.style.boxShadow = 'inset 3px 0 0 ' + c; } });
    });
  }

  /* ───────── ThreatWeave: when each feed ran ───────── */
  if (file === 'threatweave' && typeof window.pull === 'function') {
    var feedCard = $('#feeds') && $('#feeds').closest('.card');
    var gc = card('Parallel fetch', 'sig-gantt', feedCard); if (!feedCard) $('main').appendChild(gc);
    $('.sig-body', gc).innerHTML = '<p class="muted">Run the collection to see each feed on a shared clock. In parallel, the total is the slowest feed, not the sum.</p>';
    var T = {}, t0 = 0, origPull = window.pull;
    var drawG = function () {
      var names = Object.keys(T); if (!names.length) return;
      var end = Math.max.apply(null, names.map(function (n) { return T[n].e || performance.now(); })) - t0, sum = names.reduce(function (s, n) { return s + ((T[n].e || performance.now()) - T[n].s); }, 0);
      var scale = Math.max(end, sum, 1), Wd = 760, L = 200, row = 30, s = '';
      names.forEach(function (n, i) { var a = (T[n].s - t0) / scale * (Wd - L - 20), w = ((T[n].e || performance.now()) - T[n].s) / scale * (Wd - L - 20), y = 10 + i * row;
        s += '<text x="0" y="' + (y + 15) + '">' + esc(n.split(' (')[0]) + '</text><rect class="bg" x="' + L + '" y="' + y + '" width="' + (Wd - L - 20) + '" height="20" rx="5"/><rect class="run" x="' + (L + a) + '" y="' + y + '" width="' + Math.max(2, w) + '" height="20" rx="5"/>' + (T[n].e ? '<text x="' + (L + a + w + 6) + '" y="' + (y + 15) + '">' + Math.round(T[n].e - T[n].s) + ' ms</text>' : ''); });
      var yb = 10 + names.length * row + 10, xe = L + end / scale * (Wd - L - 20), xs = L + sum / scale * (Wd - L - 20);
      s += '<line class="total" x1="' + xe + '" y1="4" x2="' + xe + '" y2="' + yb + '"/><text x="' + Math.min(xe + 6, Wd - 150) + '" y="' + (yb + 14) + '">parallel: ' + Math.round(end) + ' ms</text>';
      s += '<text x="' + Math.min(xs, Wd - 140) + '" y="' + (yb + 32) + '" opacity=".7">one by one: ~' + Math.round(sum) + ' ms</text>';
      $('.sig-body', gc).innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + (yb + 40) + '" role="img" aria-label="Chart of when each feed started and finished">' + s + '</svg>';
    };
    window.pull = function (f, i) {
      if (i === 0) { T = {}; t0 = performance.now(); }
      T[f.name] = { s: performance.now() }; drawG();
      var tick = setInterval(drawG, 100);
      return origPull(f, i).then(function (r) { T[f.name].e = performance.now(); clearInterval(tick); drawG(); return r; });
    };
  }

  /* ───────── SecureView: severity mix and severity rails ───────── */
  if (file === 'secureview' && typeof A !== 'undefined') {
    var SEV = { critical: '#b8323f', high: '#d6485a', medium: '#c98a16', low: '#4884d6' };
    var statRow = $('#cOpen') && $('#cOpen').closest('.grid3');
    var sc = document.createElement('div'); sc.className = 'card sig sig-sevmix'; sc.innerHTML = '<h2>Severity mix of open work</h2><div class="sig-body"></div>';
    if (statRow) statRow.insertAdjacentElement('afterend', sc); else $('main').appendChild(sc);
    var drawS = function () {
      var open = A.filter(function (a) { return a.status === 'open' || a.status === 'escalated'; }), cnt = {}; open.forEach(function (a) { cnt[a.sev] = (cnt[a.sev] || 0) + 1; });
      var keys = ['critical', 'high', 'medium', 'low'].filter(function (k) { return cnt[k]; }), tot = open.length || 1;
      $('.sig-body', sc).innerHTML = open.length ? '<div class="bar2">' + keys.map(function (k) { return '<i style="width:' + (cnt[k] / tot * 100) + '%;background:' + SEV[k] + '" title="' + k + ': ' + cnt[k] + '"></i>'; }).join('') + '</div><div class="keys">' + keys.map(function (k) { return '<span><i style="background:' + SEV[k] + '"></i>' + k + ' ' + cnt[k] + '</span>'; }).join('') + '</div>' : '<p class="muted">Queue clear.</p>';
      document.querySelectorAll('#q tr').forEach(function (tr) { var s = tr.querySelector('.sev'); if (!s) return; var k = ['critical', 'high', 'medium', 'low'].filter(function (c) { return s.classList.contains(c); })[0]; if (k) tr.style.setProperty('--sv-sev', SEV[k]); });
    };
    wrap('render', drawS); drawS();
  }

  /* ───────── ADAM / EVE / Mizan: lanes and a verdict stamp ───────── */
  if (file === 'adam-eve-mizan') {
    var out = $('#out'); if (out) {
      var lanes = document.createElement('div'); lanes.className = 'sig-lanes';
      lanes.innerHTML = '<div class="lane" data-l="0"><b>ADAM</b><span>proposes the action</span></div><div class="lane" data-l="1"><b>EVE</b><span>argues against it</span></div><div class="lane" data-l="2"><b>Mizan</b><span>decides from policy</span></div>';
      out.parentNode.insertBefore(lanes, out);
      var busy = false;
      new MutationObserver(function () {
        var dec = out.querySelector('.dec'); if (!dec || dec.dataset.stamped || busy) return; busy = true; dec.dataset.stamped = '1';
        var v = dec.textContent.trim(), ls = lanes.querySelectorAll('.lane');
        ls.forEach(function (l) { l.classList.remove('on'); });
        var step = reduced ? 0 : 220;
        [0, 1, 2].forEach(function (k) { setTimeout(function () { ls.forEach(function (l) { l.classList.toggle('on', +l.dataset.l === k); }); }, k * step); });
        setTimeout(function () { var st = document.createElement('div'); st.className = 'stamp ' + v.toLowerCase(); st.textContent = v; dec.insertAdjacentElement('beforebegin', st); dec.style.display = 'none'; busy = false; }, 3 * step);
      }).observe(out, { childList: true, subtree: true });
    }
  }

  /* ───────── Supply chain: a gauge for the score ───────── */
  if (file === 'supply-chain-risk') {
    var scEl = $('#score'); if (scEl) {
      var g = document.createElement('div'); g.className = 'sig-gauge';
      var R = 100, len = Math.PI * R;
      g.innerHTML = '<svg viewBox="-120 -112 240 132" role="img" aria-label="Risk gauge"><path class="track" d="M-100 0 A100 100 0 0 1 100 0" fill="none" stroke-width="18" stroke-linecap="round"/><path class="val" d="M-100 0 A100 100 0 0 1 100 0" fill="none" stroke-width="18" stroke-linecap="round" stroke-dasharray="' + len + '" stroke-dashoffset="' + len + '"/><text class="n" x="0" y="-10" text-anchor="middle">0</text><text class="s" x="-100" y="18" text-anchor="middle">0</text><text class="s" x="100" y="18" text-anchor="middle">100</text></svg>';
      scEl.insertAdjacentElement('afterend', g);
      var upd = function () { var v = Math.max(0, Math.min(100, +scEl.textContent || 0)), col = v < 30 ? '#2f9e6e' : v < 55 ? '#c98a16' : v < 75 ? '#d6485a' : '#9b2335', p = g.querySelector('.val');
        p.style.strokeDashoffset = len * (1 - v / 100); p.style.stroke = col; g.querySelector('.n').textContent = v; };
      new MutationObserver(upd).observe(scEl, { childList: true, characterData: true, subtree: true }); upd();
    }
  }
})();
