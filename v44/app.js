(function () {
'use strict';
var GROUPS = ['Network', 'Identity', 'Endpoint', 'Security'];
/* g = resolver group, i = impact, u = urgency (1 high, 3 low) */
var T = [
  { t: 'Sign-in to every cloud app fails for the whole company since 09:02. No workaround.', g: 1, i: 1, u: 1 },
  { t: 'Head-office VPN drops every few minutes. 300 people are working from home today.', g: 0, i: 1, u: 2 },
  { t: 'Finance server is sending large outbound transfers to an unknown address at 3am.', g: 3, i: 1, u: 1 },
  { t: 'One user cannot connect to the guest Wi-Fi. They can use the wired port.', g: 0, i: 3, u: 3 },
  { t: 'The CFO is locked out after changing their password. Board pack is due in an hour.', g: 1, i: 2, u: 1 },
  { t: 'Laptop battery drains in two hours. User works from the office with a charger.', g: 2, i: 3, u: 3 },
  { t: 'Phishing email reported by 12 staff. Three admit they clicked the link.', g: 3, i: 1, u: 1 },
  { t: 'New starter needs a laptop and accounts by Monday. It is Thursday.', g: 2, i: 3, u: 2 },
  { t: 'A device shows "not compliant" in Intune after a Windows update. It still works.', g: 2, i: 3, u: 2 },
  { t: 'Antivirus alert on one finance PC: a known adware family. Quarantined automatically.', g: 3, i: 3, u: 2 },
  { t: 'Branch office switch is offline. 40 people cannot reach the network.', g: 0, i: 2, u: 1 },
  { t: 'Multi-factor prompts are not arriving for the sales team. Calls today are at risk.', g: 1, i: 2, u: 1 },
  { t: 'One user wants a second monitor. No deadline.', g: 2, i: 3, u: 3 },
  { t: 'Printer on floor 3 shows "offline". Another printer is next to it.', g: 0, i: 3, u: 3 },
  { t: 'A contractor account is still active two weeks after the contract ended.', g: 1, i: 3, u: 2 },
  { t: 'A staff member lost an unencrypted USB stick holding customer lists.', g: 3, i: 2, u: 1 },
];
var SLA = [0, 22, 32, 45, 60, 75]; /* seconds by priority 1..5 */
var $ = function (id) { return document.getElementById(id); };
var open = [], sel = null, running = false, left = 75, score = 0, breach = 0, nid = 0, spawnT = 0, tick = null, pool = [];
function pri(i, u) { return Math.min(5, i + u - 1); }
function toast(t) { var el = $('toast'); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, 4600); }
function draw() {
  var q = $('queue');
  if (!open.length) { q.innerHTML = '<p class="empty">' + (running ? 'Queue clear. Next ticket soon.' : 'Press Start shift. Tickets arrive every few seconds.') + '</p>'; return; }
  q.innerHTML = open.map(function (k) {
    var f = Math.max(0, k.sla / k.max);
    return '<button class="tk' + (k === sel ? ' sel' : '') + (f < .25 ? ' late' : f < .5 ? ' warn' : '') + '" data-id="' + k.id + '"><span class="id">INC' + String(1000 + k.id) + '</span><span class="tx">' + k.d.t + '</span><span class="sla"><i style="transform:scaleX(' + f.toFixed(3) + ')"></i></span></button>';
  }).join('');
}
function showWork() {
  $('work').hidden = !sel;
  if (!sel) return;
  $('wTicket').textContent = 'INC' + (1000 + sel.id) + ': route it';
  $('groups').innerHTML = GROUPS.map(function (g, n) { return '<button class="btn go" data-g="' + n + '">Send to ' + g + '</button>'; }).join('');
  upPri();
}
function upPri() { var p = pri(+$('wImp').value, +$('wUrg').value); $('wPri').textContent = 'Priority: P' + p + '  (SLA ' + SLA[p] + ' s)'; }
$('wImp').addEventListener('change', upPri); $('wUrg').addEventListener('change', upPri);
$('queue').addEventListener('click', function (e) { var b = e.target.closest('.tk'); if (!b) return; sel = open.filter(function (k) { return k.id === +b.dataset.id; })[0] || null; draw(); showWork(); });
$('groups').addEventListener('click', function (e) {
  var b = e.target.closest('[data-g]'); if (!b || !sel || !running) return;
  var d = sel.d, p = pri(+$('wImp').value, +$('wUrg').value), truth = pri(d.i, d.u), pts = 0, msg;
  var gOK = +b.dataset.g === d.g;
  if (gOK) pts += 10;
  var diff = Math.abs(p - truth);
  if (diff === 0) pts += 10; else if (diff === 1) pts += 5;
  score += pts;
  msg = (gOK ? 'Right team (' + GROUPS[d.g] + ').' : 'Wrong team: it belonged to ' + GROUPS[d.g] + '.') + ' Priority P' + p + (diff ? ', should be P' + truth + '.' : ' is right.') + ' +' + pts;
  toast(msg);
  open = open.filter(function (k) { return k !== sel; }); sel = null; $('wImp').value = 2; $('wUrg').value = 2;
  $('sScore').textContent = score; draw(); showWork();
});
function spawn() {
  if (!pool.length) pool = T.slice().sort(function () { return Math.random() - .5; });
  var d = pool.pop();
  open.push({ id: ++nid, d: d, max: SLA[pri(d.i, d.u)], sla: SLA[pri(d.i, d.u)] });
  if (open.length > 6) { end('The queue overflowed. Six tickets waiting is too many.'); return; }
  draw();
}
function end(why) {
  running = false; clearInterval(tick); sel = null; $('work').hidden = true; $('start').textContent = 'Play again'; $('start').disabled = false;
  toast((why ? why + ' ' : 'Shift over. ') + 'Score ' + score + ', ' + breach + ' SLA breach' + (breach === 1 ? '' : 'es') + '.');
}
$('start').addEventListener('click', function () {
  open = []; sel = null; score = 0; breach = 0; left = 75; nid = 0; spawnT = 0; pool = []; running = true;
  $('sScore').textContent = 0; $('sBreach').textContent = 0; $('sTime').textContent = 75; $('start').disabled = true; $('start').textContent = 'Shift running';
  draw(); spawn();
  var last = performance.now();
  tick = setInterval(function () {
    var now = performance.now(), dt = (now - last) / 1000; last = now;
    left -= dt; spawnT += dt; $('sTime').textContent = Math.max(0, Math.ceil(left));
    open.forEach(function (k) { k.sla -= dt; });
    var late = open.filter(function (k) { return k.sla <= 0; });
    if (late.length) { late.forEach(function () { breach++; score = Math.max(0, score - 10); }); open = open.filter(function (k) { return k.sla > 0; }); if (late.indexOf(sel) >= 0) sel = null; $('sBreach').textContent = breach; $('sScore').textContent = score; showWork(); }
    if (spawnT > 3.6) { spawnT = 0; spawn(); if (!running) return; }
    if (left <= 0) { end(''); return; }
    if ($('queue').querySelectorAll('.tk').length !== open.length) draw();
    else open.forEach(function (k) {
      var el = $('queue').querySelector('[data-id="' + k.id + '"]'); if (!el) return; var f = Math.max(0, k.sla / k.max);
      el.querySelector('i').style.transform = 'scaleX(' + f.toFixed(3) + ')'; el.classList.toggle('late', f < .25); el.classList.toggle('warn', f >= .25 && f < .5);
    });
  }, 250);
});
})();
