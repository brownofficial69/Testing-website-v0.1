(function () {
'use strict';
var USERS = [
  { username: 'admin', password: 'Tr0ub4dor&3', role: 'administrator' },
  { username: 'alice', password: 'pa55word', role: 'customer' },
  { username: 'bob', password: 'hunter2', role: 'customer' },
];
var $ = function (id) { return document.getElementById(id); };
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function toast(t) { var el = $('toast'); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, 5200); }

/* A tiny SQL WHERE evaluator: strings, numbers, columns, = , AND/OR (and && / ||), parentheses, comments. */
function tokenize(q) {
  var t = [], i = 0, n = q.length;
  while (i < n) {
    var c = q[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '#' || (c === '-' && q[i + 1] === '-')) break;
    if (c === '/' && q[i + 1] === '*') { var e = q.indexOf('*/', i + 2); if (e < 0) throw new Error('unterminated comment'); i = e + 2; continue; }
    if (c === "'") { var s = '', j = i + 1, closed = false; while (j < n) { if (q[j] === "'") { if (q[j + 1] === "'") { s += "'"; j += 2; continue; } closed = true; break; } s += q[j++]; } if (!closed) throw new Error('unterminated string near ' + q.slice(i, i + 12)); t.push({ k: 's', v: s }); i = j + 1; continue; }
    if (/[0-9]/.test(c)) { var m = /^[0-9]+/.exec(q.slice(i))[0]; t.push({ k: 'n', v: +m }); i += m.length; continue; }
    if (/[A-Za-z_]/.test(c)) { var w = /^[A-Za-z_][A-Za-z_0-9]*/.exec(q.slice(i))[0]; var up = w.toUpperCase(); t.push(up === 'AND' || up === 'OR' ? { k: 'op', v: up } : { k: 'id', v: w.toLowerCase() }); i += w.length; continue; }
    if (c === '|' && q[i + 1] === '|') { t.push({ k: 'op', v: 'OR' }); i += 2; continue; }
    if (c === '&' && q[i + 1] === '&') { t.push({ k: 'op', v: 'AND' }); i += 2; continue; }
    if (c === '=' || c === '(' || c === ')') { t.push({ k: c, v: c }); i++; continue; }
    throw new Error('unexpected "' + c + '"');
  }
  return t;
}
function evalWhere(tokens, row) {
  var p = 0;
  function peek() { return tokens[p]; }
  function val() {
    var t = tokens[p++]; if (!t) throw new Error('unexpected end of query');
    if (t.k === '(') { var v = or(); if (!tokens[p] || tokens[p].k !== ')') throw new Error('missing )'); p++; return v; }
    if (t.k === 's' || t.k === 'n') return t.v;
    if (t.k === 'id') { if (!(t.v in row)) throw new Error('unknown column ' + t.v); return row[t.v]; }
    throw new Error('unexpected ' + t.v);
  }
  function cmp() { var a = val(); if (peek() && peek().k === '=') { p++; var b = val(); return a == b ? 1 : 0; } return a; }
  function and() { var v = cmp(); while (peek() && peek().k === 'op' && peek().v === 'AND') { p++; var r = cmp(); v = (v && r) ? 1 : 0; } return v; }
  function or() { var v = and(); while (peek() && peek().k === 'op' && peek().v === 'OR') { p++; var r = and(); v = (v || r) ? 1 : 0; } return v; }
  var res = or(); if (p < tokens.length) throw new Error('unexpected ' + tokens[p].v);
  return !!res;
}
function run(u, p) {
  var rows, q = "username = '" + u + "' AND password = '" + p + "'";
  try { var tk = tokenize(q); rows = USERS.filter(function (r) { return evalWhere(tk, r); }); } catch (e) { return { err: e.message }; }
  return { rows: rows };
}

var LEVELS = [
  { name: 'Level 1: raw string', goal: 'Log in as admin without knowing the password. The server glues what you type straight into the query.', mode: 'concat',
    hints: ['Your input goes between single quotes. What happens if you type a quote yourself?', 'The query needs the whole WHERE clause to be true. Can you add a condition that is always true?', 'Try the password: \' OR \'1\'=\'1'], sol: { u: 'admin', p: "' OR '1'='1" },
    learn: '<p><b>What is happening.</b> The server builds the query by pasting your text in. A quote you type closes the string early, and everything after it is read as SQL.</p><p>The pattern is old (it features in the OWASP Top 10 under Injection) and still turns up.</p>' },
  { name: 'Level 2: weak filter', goal: 'Same login, but now the developer rejects the words OR and AND and the comment markers -- and #. Get in as admin anyway.', mode: 'filter',
    hints: ['A filter that looks for a list of bad words only knows the words on its list.', 'Databases often accept symbol forms of the same operators.', "Try the password: ' || '1'='1"], sol: { u: 'admin', p: "' || '1'='1" },
    learn: '<p><b>Why filters fail.</b> A blacklist guesses which attacks will be tried. SQL has many ways to say the same thing, so there is nearly always one the list missed.</p>' },
  { name: 'Level 3: parameterised', goal: 'The query now uses parameters: your input is sent as data, separate from the SQL. Try to get in as admin. (You will not manage it, and that is the point.)', mode: 'param',
    hints: ['Try the payloads that worked before.', 'The database never parses your text as SQL, only compares it to the stored value.', 'The fix is not a better filter. It is keeping code and data apart.'], sol: { u: 'admin', p: "' OR '1'='1" },
    learn: '<p><b>The fix.</b> With a parameterised query the statement is fixed first and your values are bound afterwards, so a quote is just a character. Pair it with hashed passwords and least-privilege database accounts.</p>' },
];
var cur = 0, hintN = 0, tries = [0, 0, 0], done = [false, false, false];
function tabs() {
  $('tabs').innerHTML = LEVELS.map(function (l, i) { return '<button class="tab" role="tab" aria-selected="' + (i === cur) + '" data-i="' + i + '">' + l.name.split(':')[0] + (done[i] ? ' ✓' : '') + '</button>'; }).join('');
}
function level() {
  var l = LEVELS[cur]; $('goal').textContent = l.goal; $('learn').innerHTML = l.learn; $('hintTxt').textContent = 'Stuck? Hints get more specific each time.'; hintN = 0;
  $('out').className = 'out'; $('out').textContent = 'Try logging in.'; $('p').value = ''; $('u').value = 'admin'; tabs(); preview();
}
function sqlHtml(u, p, mode) {
  if (mode === 'param') return '<span class="kw">SELECT</span> * <span class="kw">FROM</span> users <span class="kw">WHERE</span> username = <span class="inj">?</span> <span class="kw">AND</span> password = <span class="inj">?</span>\n<span class="kw">bound as data:</span> [<span class="inj">' + esc(JSON.stringify(u)) + '</span>, <span class="inj">' + esc(JSON.stringify(p)) + '</span>]';
  var tail = (mode === 'filter' ? '' : '');
  return '<span class="kw">SELECT</span> * <span class="kw">FROM</span> users <span class="kw">WHERE</span> username = \'<span class="inj">' + esc(u) + '</span>\' <span class="kw">AND</span> password = \'<span class="inj">' + esc(p) + '</span>\'' + tail;
}
function preview() { $('sql').innerHTML = sqlHtml($('u').value, $('p').value, LEVELS[cur].mode); }
$('u').addEventListener('input', preview); $('p').addEventListener('input', preview);
$('tabs').addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (!b) return; cur = +b.dataset.i; level(); });
$('form').addEventListener('submit', function (e) {
  e.preventDefault();
  var u = $('u').value, p = $('p').value, l = LEVELS[cur], out = $('out'); tries[cur]++;
  if (l.mode === 'filter' && /\b(or|and)\b|--|#/i.test(u + ' ' + p)) { out.className = 'out bad'; out.textContent = 'Blocked by the filter: suspicious input.'; return; }
  var r;
  if (l.mode === 'param') {
    var hit = USERS.filter(function (x) { return x.username === u && x.password === p; });
    r = { rows: hit };
  } else r = run(u, p);
  if (r.err) { out.className = 'out bad'; out.textContent = 'The database returned an error: ' + r.err + '. An error like this tells an attacker the input reached the query.'; return; }
  if (!r.rows.length) { out.className = 'out bad'; out.textContent = 'Wrong username or password.'; return; }
  var row = r.rows[0], real = u === 'admin' && p === USERS[0].password;
  out.className = 'out ok'; out.textContent = 'Logged in as ' + row.username + ' (' + row.role + ').' + (real ? ' That was the real password.' : (row.username === 'admin' ? ' You are admin without the password.' : ' You got in as a different user.'));
  if (!real && l.mode !== 'param' && !done[cur]) { done[cur] = true; tabs(); toast(cur === 0 ? 'In. The input changed the meaning of the query. Level 2 adds a filter.' : 'Past the filter. A blacklist cannot list every way of writing the same thing. Level 3 shows the fix.'); }
});
$('hint').addEventListener('click', function () { var l = LEVELS[cur]; $('hintTxt').textContent = l.hints[Math.min(hintN, l.hints.length - 1)]; hintN++; });
$('solve').addEventListener('click', function () {
  var l = LEVELS[cur];
  if (l.mode === 'param') { $('hintTxt').textContent = 'There is no payload for this level: the values are bound as data. That is why parameterised queries are the fix. Level 3 is marked complete once you have tried a few payloads.'; return; }
  $('u').value = l.sol.u; $('p').value = l.sol.p; preview(); $('hintTxt').textContent = 'Filled in a working input. Press Log in, then read the query on the left of the highlight.';
});
var orig = $('form').onsubmit;
$('form').addEventListener('submit', function () { if (cur === 2 && tries[2] >= 3 && !done[2]) { done[2] = true; tabs(); toast('Three attempts and none worked. The fix is architectural: keep the code and the data apart.'); } });
level();
})();
