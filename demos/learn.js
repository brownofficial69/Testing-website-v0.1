/* learn.js: the educational layer for the project demos, in plain JavaScript with no third-party code.
   - Guided tour: a spotlight walks through the demo one control at a time (Esc to leave, arrow keys to move)
   - Quick check: three questions with an explanation for every answer; the best score is kept in this browser
   - Glossary: the terms the demo uses, in plain words
   - Live visuals: a risk radar for the supply-chain demo, a correlation graph for ThreatWeave */
(function () {
  'use strict';
  var file = location.pathname.split('/').pop().replace('.html', '');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var D = {
    'soc-lab': {
      tour: [['#y1', 'A Sigma rule', 'Sigma is an open, vendor-neutral format for detection rules, written in YAML. This one matches encoded PowerShell, a common way to hide commands (ATT&CK T1059.001).'],
        ['#n2', 'Thresholds', 'Brute force is only suspicious in bulk. Too low and normal typos alert; too high and a slow attacker slips under it.'],
        ['#w3', 'Correlation window', 'A multi-stage rule links events that happen close together, here an Office app spawning a shell and then talking out. A wider window catches more and costs more false positives.'],
        ['#run', 'Run the rules', 'Runs every enabled rule over the 30 sample events.'],
        ['#find', 'Findings', 'Each finding names the rule, the ATT&CK technique and the events that triggered it.'],
        ['#log', 'The raw log', 'The same events an analyst would see. Matched rows are highlighted.']],
      quiz: [['Why use Sigma rather than writing rules in one SIEM\'s own language?', ['It runs faster', 'One rule can be converted to many SIEMs', 'It needs no log data'], 1, 'Sigma is a common format that converters translate into Splunk, Elastic, Wazuh and others, so detections are portable.'],
        ['Lowering the brute-force threshold from 5 to 2 failures will most likely…', ['Catch more attacks and raise more false positives', 'Catch fewer attacks', 'Change nothing'], 0, 'Lower thresholds are more sensitive: real attacks are caught sooner, and so are users who mistype twice.'],
        ['What does a time-window correlation rule add over single-event rules?', ['It encrypts the logs', 'It links separate events into one attack story', 'It deletes duplicates'], 1, 'On their own each event can look harmless; in sequence and close in time they describe an intrusion.']],
      gloss: [['Sigma', 'An open YAML format for describing log detections, converted into each SIEM\'s query language.'], ['SIEM', 'Security information and event management: collects logs and runs detections over them.'], ['MITRE ATT&CK', 'A public catalogue of attacker techniques, each with an ID such as T1110 (brute force).'], ['False positive', 'An alert that fires on harmless activity.'], ['Wazuh', 'An open-source security platform the real lab deploys these rules to.']] },
    'ioc-hunter': {
      tour: [['#in', 'Paste anything', 'Indicators arrive in messy text: emails, chat, reports. Paste them here, mixed with ordinary words.'],
        ['#sample', 'A messy sample', 'Loads a realistic paste with defanged indicators such as hxxp:// and example[.]com.'],
        ['#go', 'Analyse', 'Extracts, refangs, classifies and validates every indicator, and flags anything that looks like an injection attempt.'],
        ['#res', 'Results', 'One row per indicator with its type and any warnings.'],
        ['#csv', 'Safe export', 'Exports are escaped so a value cannot become a spreadsheet formula (CSV injection).']],
      quiz: [['Why are indicators "defanged" (hxxp, [.]) in reports?', ['To hide them from attackers', 'So nobody clicks or auto-links a live malicious URL', 'To make them shorter'], 1, 'Defanging stops mail clients and chat apps turning a malicious address into a clickable link.'],
        ['A cell in an exported CSV starts with =. Why is that a risk?', ['Spreadsheets may run it as a formula', 'It breaks the CSV format', 'It is not a risk'], 0, 'CSV or formula injection: a crafted value can run a formula when someone opens the file. Prefixing or escaping prevents it.'],
        ['What does "refang" mean?', ['Delete the indicator', 'Turn hxxp://site[.]com back into http://site.com for tools', 'Encrypt it'], 1, 'Tools need the real value to look it up; refanging restores it inside the tool only.']],
      gloss: [['IOC', 'Indicator of compromise: an IP, domain, URL or file hash linked to malicious activity.'], ['Defang', 'Rewrite an indicator so it cannot be clicked, e.g. hxxp://evil[.]com.'], ['CSV injection', 'A spreadsheet value beginning with = + - or @ that runs as a formula.'], ['Hash', 'A fingerprint of a file (MD5, SHA-1, SHA-256) used to recognise known malware.']] },
    'threatweave': {
      tour: [['#feeds', 'Four feeds', 'Each sample feed reports indicators with an ASN and the ATT&CK techniques seen.'],
        ['#run', 'Collect in parallel', 'All four are fetched at once, so the total time is the slowest feed, not the sum. The real tool does this with Go goroutines.'],
        ['#filter', 'Filter', 'Narrow to an indicator, ASN or technique before correlating.'],
        ['#lg-graph', 'Correlation graph', 'Networks (ASNs) on the left, indicators in the middle, techniques on the right. Hover an indicator to trace its links.'],
        ['#out', 'Dossiers', 'Clusters are scored by size, how many feeds agree and how many techniques they share.']],
      quiz: [['Four feeds take 400, 700, 900 and 1100 ms. Fetched in parallel, the total is about…', ['3100 ms', '1100 ms', '400 ms'], 1, 'In parallel you wait for the slowest one. That is why concurrency matters for intelligence collection.'],
        ['Why does it help when two different feeds report the same indicator?', ['It is corroborated, so confidence goes up', 'It means the feeds are broken', 'It lowers the score'], 0, 'Independent sources agreeing is stronger evidence than one source alone.'],
        ['What is an ASN?', ['A malware family', 'A network operator\'s routing identity on the internet', 'A type of hash'], 1, 'An Autonomous System Number identifies a network. Many bad indicators in one ASN can point at the same infrastructure.']],
      gloss: [['ASN', 'Autonomous System Number: identifies a network that routes its own IP ranges.'], ['Correlation', 'Linking separate observations that share something, such as a network or technique.'], ['Corroboration', 'Several independent sources reporting the same thing.'], ['Goroutine', 'Go\'s lightweight concurrent task; the real ThreatWeave pulls feeds with them.']] },
    'secureview': {
      tour: [['#filters', 'Filters', 'Narrow the queue by severity or status.'],
        ['#q', 'The queue', 'Highest priority first, so the analyst\'s next action is always at the top.'],
        ['#detail', 'Triage', 'The selected alert with context and remediation guidance. Escalate, close or mark as a false positive.'],
        ['#cEsc', 'Counters', 'Open, escalated and closed counts update as you triage.']],
      quiz: [['Why sort the queue by priority instead of by time?', ['It looks nicer', 'Analysts handle the most dangerous alerts first', 'Older alerts are always wrong'], 1, 'Analyst time is the scarce resource; priority ordering spends it where the risk is highest.'],
        ['Marking an alert as a false positive should also…', ['Delete the log', 'Feed back into tuning the rule', 'Close every other alert'], 1, 'False positives are data: they tell you which rule needs tuning.'],
        ['When should an analyst escalate?', ['When the alert needs authority or skills beyond theirs', 'Never', 'For every alert'], 0, 'Escalation moves an incident to someone who can contain it, such as incident response.']],
      gloss: [['SOC', 'Security operations centre: the team that watches and responds to alerts.'], ['Triage', 'Deciding quickly how serious an alert is and what happens next.'], ['Escalation', 'Handing an incident to a higher tier or the response team.']] },
    'adam-eve-mizan': {
      tour: [['#pre', 'Scenarios', 'Preset requests, from routine reads to injected instructions and irreversible actions.'],
        ['#tool', 'The tool', 'What ADAM wants to call. Each tool has its own scope in the policy.'],
        ['#why', 'ADAM\'s rationale', 'The agent explains itself here. Mizan never reads this field, so a persuasive explanation cannot change the decision.'],
        ['#appr', 'Human approval', 'Irreversible actions need an operator token. Without it they are escalated, not run.'],
        ['#run', 'Evaluate', 'Runs the request through EVE\'s critique and Mizan\'s policy.'],
        ['#out', 'Pipeline', 'Every step and the final verdict: allow, deny or escalate.'],
        ['#tamper', 'Tamper', 'Edits a past ledger entry, as an attacker covering their tracks would.'],
        ['#verify', 'Verify', 'Recomputes the SHA-256 chain and shows exactly where it breaks.']],
      quiz: [['Why does Mizan ignore ADAM\'s stated rationale?', ['To save time', 'So prompt injection cannot argue its way past policy', 'Because it is always wrong'], 1, 'Decisions based on the model\'s own explanation inherit its weaknesses. A fixed policy over the action itself does not.'],
        ['An instruction arrives inside a web page ADAM was asked to summarise. It should be treated as…', ['An instruction from the operator', 'Untrusted data', 'A system update'], 1, 'Content the agent reads is data. Only the operator issues instructions.'],
        ['Editing one ledger entry is detected because…', ['Its hash, and every later hash, no longer match', 'The file gets bigger', 'The agent remembers'], 0, 'Each entry includes the previous hash, so one change breaks the chain from that point on.']],
      gloss: [['Prompt injection', 'Instructions hidden in content an AI reads, aimed at changing what it does.'], ['Least privilege', 'Giving a component only the access its current task needs.'], ['Mediator', 'An independent component that checks every action against policy before it runs.'], ['Hash chain', 'Records where each entry includes the hash of the one before, so edits are evident.']] },
    'supply-chain-risk': {
      tour: [['#preset', 'Vendor presets', 'Typical vendor profiles to start from.'],
        ['#crits', 'Fifteen criteria', 'Each slider is one risk area, weighted by how much it matters. 1 is low risk, 5 is high.'],
        ['#sc-radar', 'Risk radar', 'The vendor\'s shape at a glance. Spikes are where to ask for evidence.'],
        ['#score', 'Overall score', 'The weighted average, from 0 to 100, with a rating band and advice.'],
        ['#contrib', 'Largest contributors', 'Where the score comes from, so remediation can be targeted.']],
      quiz: [['Why are criteria weighted instead of averaged equally?', ['To make maths harder', 'Some risks, like privileged access, matter far more than others', 'Weights are random'], 1, 'A vendor with admin access to your network can do more damage than one with weak financial reporting.'],
        ['What is "fourth-party" risk?', ['Risk from your vendor\'s own suppliers', 'A fourth audit', 'Risk from your customers'], 0, 'Your vendor relies on others; a breach there can reach you indirectly.'],
        ['NIST SP 800-161 is guidance on…', ['Password length', 'Cybersecurity supply chain risk management', 'Cloud pricing'], 1, 'It describes how organisations identify, assess and mitigate risks across their supply chain.']],
      gloss: [['C-SCRM', 'Cybersecurity supply chain risk management.'], ['SBOM', 'Software bill of materials: a list of the components in a piece of software.'], ['Right to audit', 'A contract clause that lets you inspect a vendor\'s controls.'], ['NIST SP 800-161', 'US guidance on supply chain risk management practices.']] },
  };
  var data = D[file]; if (!data) return;

  /* ───────── panel with the three learning tools ───────── */
  var main = $('main'); if (!main) return;
  var KEY = 'sh-quiz-' + file, best = 0; try { best = +localStorage.getItem(KEY) || 0; } catch (e) { /* storage off */ }
  var panel = document.createElement('section'); panel.className = 'card learn-panel';
  panel.innerHTML = '<div class="lp-head"><div><h2>Learn with this demo</h2><p class="muted">A guided tour, a quick check and the key terms.</p></div>' +
    '<div class="row"><button type="button" class="btn" id="lp-tour"><span aria-hidden="true">◎</span> Take the tour</button><button type="button" class="btn ghost" id="lp-quiz-btn">Quick check' + (best ? ' · best ' + best + '/3' : '') + '</button></div></div>' +
    '<div class="lp-quiz" id="lp-quiz" hidden></div>' +
    '<details class="lp-gloss"><summary>Glossary (' + data.gloss.length + ' terms)</summary><dl>' + data.gloss.map(function (g) { return '<dt>' + esc(g[0]) + '</dt><dd>' + esc(g[1]) + '</dd>'; }).join('') + '</dl></details>';
  main.insertBefore(panel, main.firstChild);

  /* ───────── quiz ───────── */
  var qEl = $('#lp-quiz'), qi = 0, score = 0;
  function renderQ() {
    if (qi >= data.quiz.length) {
      if (score > best) { best = score; try { localStorage.setItem(KEY, String(best)); } catch (e) { /* storage off */ } }
      qEl.innerHTML = '<p class="lp-done"><b>' + score + ' of ' + data.quiz.length + '.</b> ' + (score === data.quiz.length ? 'All correct.' : 'Read the explanations above and try again any time.') + '</p><button type="button" class="btn ghost" id="lp-again">Try again</button>';
      $('#lp-again').onclick = function () { qi = 0; score = 0; renderQ(); };
      $('#lp-quiz-btn').textContent = 'Quick check · best ' + best + '/3'; return;
    }
    var q = data.quiz[qi];
    qEl.innerHTML = '<p class="lp-q"><span class="mono">' + (qi + 1) + '/' + data.quiz.length + '</span> ' + esc(q[0]) + '</p><div class="lp-opts" role="group" aria-label="Answers">' +
      q[1].map(function (o, i) { return '<button type="button" class="lp-opt" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div><p class="lp-why" aria-live="polite"></p>';
    qEl.querySelectorAll('.lp-opt').forEach(function (b) {
      b.onclick = function () {
        var i = +b.dataset.i, ok = i === q[2]; if (ok) score++;
        qEl.querySelectorAll('.lp-opt').forEach(function (x) { x.disabled = true; if (+x.dataset.i === q[2]) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        var why = $('.lp-why', qEl); why.innerHTML = '<b>' + (ok ? 'Correct.' : 'Not quite.') + '</b> ' + esc(q[3]) + ' <button type="button" class="btn go lp-next">' + (qi + 1 < data.quiz.length ? 'Next question' : 'See score') + '</button>';
        $('.lp-next', why).onclick = function () { qi++; renderQ(); var f = qEl.querySelector('button'); if (f) f.focus(); };
        $('.lp-next', why).focus();
      };
    });
  }
  $('#lp-quiz-btn').onclick = function () { var open = qEl.hidden; qEl.hidden = !open; if (open) { qi = 0; score = 0; renderQ(); var f = qEl.querySelector('button'); if (f) f.focus(); } };

  /* ───────── guided tour: a spotlight and a small card, keyboard friendly ───────── */
  var spot = document.createElement('div'); spot.className = 'tour-spot'; spot.hidden = true;
  var card = document.createElement('div'); card.className = 'tour-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-modal', 'false'); card.setAttribute('aria-live', 'polite'); card.hidden = true;
  document.body.appendChild(spot); document.body.appendChild(card);
  var steps = [], si = 0, lastFocus = null;
  function place() {
    var el = $(steps[si][0]); if (!el) return;
    var r = el.getBoundingClientRect(), pad = 8;
    spot.style.left = (r.left - pad) + 'px'; spot.style.top = (r.top - pad) + 'px'; spot.style.width = (r.width + pad * 2) + 'px'; spot.style.height = (r.height + pad * 2) + 'px';
    var cw = Math.min(360, innerWidth - 32), ch = card.offsetHeight || 190;
    card.style.width = cw + 'px';
    if (innerHeight - r.bottom >= ch + 32) { card.style.top = (r.bottom + 16) + 'px'; card.style.left = Math.max(16, Math.min(innerWidth - cw - 16, r.left)) + 'px'; }
    else if (r.top >= ch + 32) { card.style.top = (r.top - 16 - ch) + 'px'; card.style.left = Math.max(16, Math.min(innerWidth - cw - 16, r.left)) + 'px'; }
    /* a tall element fills the screen: dock the card in the bottom corner over it */
    else { card.style.top = (innerHeight - ch - 16) + 'px'; card.style.left = (innerWidth - cw - 16) + 'px'; }
  }
  function show() {
    var s = steps[si], el = $(s[0]);
    if (!el) { if (si < steps.length - 1) { si++; show(); } else end(); return; }
    el.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    card.innerHTML = '<p class="tc-step mono">Step ' + (si + 1) + ' of ' + steps.length + '</p><h3>' + esc(s[1]) + '</h3><p>' + esc(s[2]) + '</p><div class="row"><button type="button" class="btn ghost" data-a="prev"' + (si ? '' : ' disabled') + '>Back</button><button type="button" class="btn" data-a="next">' + (si < steps.length - 1 ? 'Next' : 'Finish') + '</button><button type="button" class="btn ghost tc-x" data-a="end" aria-label="End the tour">Esc</button></div>';
    card.setAttribute('aria-label', 'Tour step ' + (si + 1) + ': ' + s[1]);
    setTimeout(place, reduced ? 0 : 320); place();
    var nb = card.querySelector('[data-a="next"]'); nb.focus({ preventScroll: true });
  }
  function start() { steps = data.tour.filter(function (s) { return $(s[0]); }); if (!steps.length) return; lastFocus = document.activeElement; si = 0; spot.hidden = false; card.hidden = false; document.documentElement.classList.add('touring'); show(); }
  function end() { spot.hidden = true; card.hidden = true; document.documentElement.classList.remove('touring'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  card.addEventListener('click', function (e) { var a = e.target.closest('[data-a]'); if (!a) return; if (a.dataset.a === 'next') { if (si < steps.length - 1) { si++; show(); } else end(); } else if (a.dataset.a === 'prev') { si = Math.max(0, si - 1); show(); } else end(); });
  document.addEventListener('keydown', function (e) { if (card.hidden) return; if (e.key === 'Escape') end(); else if (e.key === 'ArrowRight') { if (si < steps.length - 1) { si++; show(); } } else if (e.key === 'ArrowLeft') { si = Math.max(0, si - 1); show(); } });
  addEventListener('resize', function () { if (!card.hidden) place(); }); addEventListener('scroll', function () { if (!card.hidden) place(); }, { passive: true });
  $('#lp-tour').onclick = start;

  /* ───────── live visuals, drawn as plain SVG ───────── */
  var NS = 'http://www.w3.org/2000/svg';
  if (file === 'supply-chain-risk' && typeof C !== 'undefined') {
    var crits = C, scoreCard = $('#score') && $('#score').closest('.card');
    var box = document.createElement('div'); box.className = 'card radar-card'; box.id = 'sc-radar';
    box.innerHTML = '<h2>Risk radar</h2><p class="muted">Each spoke is a criterion. Further out is riskier; the dashed ring is "moderate" (3).</p><svg viewBox="-210 -190 420 380" role="img" aria-label="Radar chart of the fifteen risk criteria"></svg><p class="muted" id="sc-whatif"></p>';
    if (scoreCard && scoreCard.parentNode) scoreCard.parentNode.insertBefore(box, scoreCard.nextSibling); else main.appendChild(box);
    var svg = box.querySelector('svg'), n = crits.length, R = 150;
    var pt = function (i, v) { var a = -Math.PI / 2 + i * 2 * Math.PI / n, r = R * v / 5; return [Math.cos(a) * r, Math.sin(a) * r]; };
    var grid = ''; for (var lv = 1; lv <= 5; lv++) { grid += '<polygon class="rg' + (lv === 3 ? ' mid' : '') + '" points="' + crits.map(function (_, i) { return pt(i, lv).join(','); }).join(' ') + '"/>'; }
    crits.forEach(function (c, i) { var p = pt(i, 5.6); grid += '<line class="rs" x1="0" y1="0" x2="' + pt(i, 5)[0] + '" y2="' + pt(i, 5)[1] + '"/><text class="rl" x="' + p[0] + '" y="' + p[1] + '" text-anchor="middle" dominant-baseline="middle">' + (i + 1) + '</text>'; });
    svg.innerHTML = grid + '<polygon class="rp" id="rp"/><g id="rdots"></g>';
    var draw = function () {
      var vals = crits.map(function (_, i) { var el = document.getElementById('r' + i); return el ? +el.value : 3; });
      document.getElementById('rp').setAttribute('points', vals.map(function (v, i) { return pt(i, v).join(','); }).join(' '));
      document.getElementById('rdots').innerHTML = vals.map(function (v, i) { var p = pt(i, v); return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (v >= 4 ? 5 : 3.5) + '" class="' + (v >= 4 ? 'hot' : '') + '"><title>' + (i + 1) + '. ' + esc(crits[i][0]) + ': ' + v + '</title></circle>'; }).join('');
      /* what-if: which single one-step improvement lowers the score most? (weight / total weight / 4 * 100 per step) */
      var tw = crits.reduce(function (s, c) { return s + c[2]; }, 0), bestI = -1, bestGain = 0;
      vals.forEach(function (v, i) { if (v > 1) { var g = crits[i][2] / tw / 4 * 100; if (g > bestGain) { bestGain = g; bestI = i; } } });
      document.getElementById('sc-whatif').innerHTML = bestI < 0 ? 'Every criterion is already at its lowest risk.' : '<b>Biggest single win:</b> lowering "' + esc(crits[bestI][0]) + '" by one step cuts the score by about ' + bestGain.toFixed(1) + ' points.';
    };
    document.addEventListener('input', function (e) { if (e.target.id && /^r\d+$/.test(e.target.id)) draw(); });
    document.addEventListener('change', function (e) { if (e.target.id === 'preset') setTimeout(draw, 0); });
    document.addEventListener('click', function (e) { if (e.target.id === 'reset') setTimeout(draw, 0); });
    draw();
  }
  if (file === 'threatweave' && typeof window.correlate === 'function') {
    var gbox = document.createElement('div'); gbox.className = 'card graph-card'; gbox.id = 'lg-graph';
    gbox.innerHTML = '<h2>Correlation graph</h2><p class="muted">Run the collection to draw it. Networks (ASN) on the left, indicators in the middle, ATT&amp;CK techniques on the right. Hover an indicator to trace it.</p><div class="gwrap"><svg role="img" aria-label="Graph linking networks, indicators and techniques"></svg></div>';
    var outCard = $('#out') && $('#out').closest('.card'); if (outCard) outCard.parentNode.insertBefore(gbox, outCard); else main.appendChild(gbox);
    var orig = window.correlate;
    window.correlate = function (rows) {
      orig(rows);
      var asns = [], iocs = {}, techs = [];
      rows.forEach(function (r) { if (asns.indexOf(r.asn) < 0) asns.push(r.asn); var o = iocs[r.ioc] || (iocs[r.ioc] = { asn: r.asn, tech: [], feeds: [] }); r.tech.forEach(function (t) { if (o.tech.indexOf(t) < 0) o.tech.push(t); if (techs.indexOf(t) < 0) techs.push(t); }); if (o.feeds.indexOf(r.feed) < 0) o.feeds.push(r.feed); });
      var ids = Object.keys(iocs).sort(function (a, b) { return asns.indexOf(iocs[a].asn) - asns.indexOf(iocs[b].asn); }); techs.sort();
      var Wd = 760, rowH = 34, Hh = Math.max(ids.length, techs.length, asns.length) * rowH + 40, col = [90, 380, 650];
      var y = function (i, len) { return 20 + (i + 0.5) * (Hh - 40) / len; };
      var s = '';
      ids.forEach(function (id, i) { var o = iocs[id], yi = y(i, ids.length); s += '<path class="ge" data-i="' + i + '" d="M' + col[0] + ' ' + y(asns.indexOf(o.asn), asns.length) + ' C ' + (col[0] + 140) + ' ' + y(asns.indexOf(o.asn), asns.length) + ' ' + (col[1] - 140) + ' ' + yi + ' ' + col[1] + ' ' + yi + '"/>';
        o.tech.forEach(function (t) { var yt = y(techs.indexOf(t), techs.length); s += '<path class="ge" data-i="' + i + '" d="M' + col[1] + ' ' + yi + ' C ' + (col[1] + 130) + ' ' + yi + ' ' + (col[2] - 130) + ' ' + yt + ' ' + col[2] + ' ' + yt + '"/>'; }); });
      asns.forEach(function (a, i) { s += '<g class="gn asn"><circle cx="' + col[0] + '" cy="' + y(i, asns.length) + '" r="10"/><text x="' + (col[0] - 16) + '" y="' + y(i, asns.length) + '" text-anchor="end" dominant-baseline="middle">' + esc(a) + '</text></g>'; });
      ids.forEach(function (id, i) { var o = iocs[id]; s += '<g class="gn ioc" data-i="' + i + '" tabindex="0"><circle cx="' + col[1] + '" cy="' + y(i, ids.length) + '" r="' + (4 + o.feeds.length * 2) + '"/><text x="' + col[1] + '" y="' + (y(i, ids.length) - 12) + '" text-anchor="middle">' + esc(id) + '</text><title>' + esc(id) + ': reported by ' + o.feeds.length + ' feed(s)</title></g>'; });
      techs.forEach(function (t, i) { s += '<g class="gn tech"><rect x="' + col[2] + '" y="' + (y(i, techs.length) - 10) + '" width="12" height="20" rx="3"/><text x="' + (col[2] + 20) + '" y="' + y(i, techs.length) + '" dominant-baseline="middle">' + esc(t) + ' ' + esc((typeof TECH !== 'undefined' && TECH[t]) || '') + '</text></g>'; });
      var g = gbox.querySelector('svg'); g.setAttribute('viewBox', '0 0 ' + (Wd + 200) + ' ' + Hh); g.innerHTML = s;
      var hl = function (i) { g.classList.toggle('focus', i !== null); g.querySelectorAll('.ge, .gn.ioc').forEach(function (el) { el.classList.toggle('on', i !== null && el.dataset.i === String(i)); }); };
      g.querySelectorAll('.gn.ioc').forEach(function (el) { el.addEventListener('mouseenter', function () { hl(el.dataset.i); }); el.addEventListener('focus', function () { hl(el.dataset.i); }); el.addEventListener('mouseleave', function () { hl(null); }); el.addEventListener('blur', function () { hl(null); }); });
      $('.muted', gbox).textContent = ids.length + ' indicators across ' + asns.length + ' networks and ' + techs.length + ' techniques. Bigger dots were reported by more feeds. Hover or tab to an indicator to trace it.';
    };
  }
})();
