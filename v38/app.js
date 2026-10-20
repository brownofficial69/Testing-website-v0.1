(() => {
'use strict';
const $ = id => document.getElementById(id);
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SUBKEY = 'QWERTYUIOPASDFGHJKLZXCVBNM';   /* plain A..Z -> cipher letter */
const ENGLISH = 'ETAOINSHRDLUCMFWYPVBGKQJXZ';
const ENG_FREQ = [12.0, 9.1, 8.2, 7.5, 7.0, 6.7, 6.3, 6.1, 6.0, 4.3, 4.0, 2.8, 2.8, 2.4, 2.4, 2.2, 2.0, 2.0, 1.9, 1.5, 1.0, 0.8, 0.15, 0.15, 0.1, 0.07];
const isL = c => c >= 'A' && c <= 'Z';

const LEVELS = [
  { name: 'Level 1 · Caesar shift', type: 'caesar', shift: 11,
    plain: 'THE RULE FIRED AT MIDNIGHT BUT THE ATTACKER WAS ALREADY INSIDE',
    learn: '<p><b>How it works.</b> Every letter moves the same number of places along the alphabet. There are only 25 possible shifts, so you can simply try them all.</p><p>This is brute force: cheap when the key space is tiny, hopeless when it is not. Keep that idea for the next two levels.</p>',
    won: 'Brute force works when there are only 25 keys. Julius Caesar reportedly used a shift of three; a modern key has more possibilities than there are atoms in the Earth.' },
  { name: 'Level 2 · Substitution cipher', type: 'sub',
    plain: 'A GOOD DETECTION IS NOT THE ONE THAT NEVER FIRES BUT THE ONE THAT FIRES ON THE RIGHT EVENT AT THE RIGHT TIME SO TUNE YOUR THRESHOLDS AGAINST REAL NOISE BEFORE THE ATTACKER TEACHES YOU WHAT NORMAL LOOKS LIKE',
    learn: '<p><b>How it works.</b> Each plaintext letter is swapped for a different letter, the same way every time. There are 26! (about 4 × 10<sup>26</sup>) keys, far too many to try.</p><p><b>The crack.</b> Language leaves a fingerprint. In English, E is the most common letter, then T, A, O, I, N. Count the cipher letters and match the tallest bars to the common letters, then use word shapes such as THE and A to confirm.</p>',
    won: 'The Arab polymath Al-Kindi described exactly this method in the ninth century, in what is usually cited as the earliest known account of frequency analysis. A huge key space did not help, because the cipher kept the shape of the language.' },
  { name: 'Level 3 · Vigenère cipher', type: 'vig', key: 'SIGMA',
    plain: 'THE ARAB POLYMATH AL KINDI DESCRIBED FREQUENCY ANALYSIS OVER A THOUSAND YEARS AGO AND IT STILL BREAKS ANY CIPHER THAT LEAVES THE SHAPE OF THE LANGUAGE SHOWING WHICH IS WHY THE VIGENERE SQUARE WAS CALLED UNBREAKABLE FOR THREE CENTURIES',
    learn: '<p><b>How it works.</b> A keyword shifts each letter by a different amount, repeating the keyword along the message. One letter can now encrypt to several different letters, so simple frequency counts are flattened.</p><p><b>The crack.</b> If you guess the key length right, each column is just a Caesar cipher again. The <b>index of coincidence</b> measures how English-like a set of letters is (about 0.066 for English, 0.038 for random). It peaks at the true key length and its multiples.</p>',
    won: 'Vigenère was called le chiffre indéchiffrable for about three centuries. Friedrich Kasiski published a general attack in 1863, and William Friedman introduced the index of coincidence in the 1920s.' },
  { name: 'Level 4 · One-time pad', type: 'otp',
    plain: 'MEET AT THE OLD BRIDGE',
    learn: '<p><b>How it works.</b> The key is as long as the message, truly random and used once. Each letter is shifted by its own random amount, so no letter pattern survives.</p><p><b>The catch.</b> There is nothing to crack. Any message of the same length decrypts from this ciphertext with <i>some</i> key, and every key is equally likely. Try a few messages and see.</p>',
    won: 'Claude Shannon proved in 1949 that a one-time pad gives perfect secrecy: the ciphertext tells an attacker nothing. The weakness is the key. When Soviet operators reused pages of pads, the US Venona project was able to read some of that traffic.' },
];
LEVELS[3].key = Array.from({ length: 18 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]);

/* ───────── state ───────── */
let lv = 0, hints = 0, startedAt = null, ended = false;
const store = { get() { try { return JSON.parse(localStorage.getItem('cipherlab') || '[]'); } catch (e) { return []; } }, set(v) { try { localStorage.setItem('cipherlab', JSON.stringify(v)); } catch (e) { /* storage off */ } } };
let solved = new Set(store.get());
const guess = LEVELS.map(() => ({ shift: 0, map: {}, key: '', sel: null, text: '', tried: [] }));

/* ───────── cipher maths ───────── */
const shiftCh = (c, n) => A[(A.indexOf(c) + n + 26) % 26];
function encrypt(L) {
  let k = 0;
  return [...L.plain].map(c => {
    if (!isL(c)) return c;
    if (L.type === 'caesar') return shiftCh(c, L.shift);
    if (L.type === 'sub') return SUBKEY[A.indexOf(c)];
    const out = shiftCh(c, A.indexOf(L.key[L.type === 'otp' ? k : k % L.key.length])); k++; return out;
  }).join('');
}
LEVELS.forEach(L => { L.cipher = encrypt(L); });
function decrypt(i) {
  const L = LEVELS[i], g = guess[i]; let k = 0;
  return [...L.cipher].map(c => {
    if (!isL(c)) return c;
    if (L.type === 'caesar') return shiftCh(c, -g.shift);
    if (L.type === 'sub') return g.map[c] || '·';
    if (L.type === 'otp') { const ch = g.text[k++]; return ch || '·'; }
    if (!g.key) { k++; return '·'; }
    const out = shiftCh(c, -A.indexOf(g.key[k % g.key.length])); k++; return out;
  }).join('');
}
const letters = s => [...s].filter(isL);
function counts(s) { const n = Array(26).fill(0); letters(s).forEach(c => n[A.indexOf(c)]++); return n; }
function ic(arr) { const n = arr.length; if (n < 2) return 0; const c = Array(26).fill(0); arr.forEach(x => c[A.indexOf(x)]++); return c.reduce((s, v) => s + v * (v - 1), 0) / (n * (n - 1)); }
function icByLength(cipher, max) { const L = letters(cipher); const out = []; for (let m = 1; m <= max; m++) { const cols = Array.from({ length: m }, () => []); L.forEach((c, i) => cols[i % m].push(c)); out.push(cols.reduce((s, col) => s + ic(col), 0) / m); } return out; }

/* ───────── render ───────── */
function renderTabs() {
  const t = $('tabs'); t.innerHTML = '';
  LEVELS.forEach((L, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(i === lv));
    const open = i === 0 || solved.has(i - 1) || solved.has(i); b.disabled = !open; b.style.opacity = open ? 1 : .4;
    b.innerHTML = `<i>${solved.has(i) ? '✓' : i + 1}</i><span>${['Caesar', 'Substitution', 'Vigenère', 'One-time pad'][i]}</span>`; b.addEventListener('click', () => { lv = i; render(); }); t.appendChild(b); });
  $('sSolved').textContent = solved.size + '/' + LEVELS.length;
}
function renderText() {
  const L = LEVELS[lv], g = guess[lv], plain = decrypt(lv); const host = $('cipher'); host.innerHTML = ''; $('plain').hidden = true;
  [...L.cipher].forEach((c, i) => {
    const w = document.createElement('span'); w.className = 'ch' + (c === ' ' ? ' sp' : '') + (!isL(c) ? ' punct' : '');
    if (L.type === 'sub' && c === g.sel) w.classList.add('sel');
    const top = document.createElement(L.type === 'sub' && isL(c) ? 'button' : 'span'); top.className = 'c'; top.textContent = c === ' ' ? ' ' : c;
    if (top.tagName === 'BUTTON') { top.type = 'button'; top.setAttribute('aria-label', `Cipher letter ${c}`); top.addEventListener('click', () => { g.sel = g.sel === c ? null : c; render(); }); }
    const bot = document.createElement('span'); bot.className = 'p' + (plain[i] === '·' ? ' unk' : ''); bot.textContent = plain[i] === ' ' ? ' ' : plain[i];
    w.append(top, bot); host.appendChild(w);
  });
}
function renderTool() {
  const L = LEVELS[lv], g = guess[lv], t = $('tool'); t.innerHTML = '';
  if (L.type === 'caesar') {
    t.innerHTML = `<h2>TOOL · SHIFT</h2><div class="shift"><label for="sh">Shift each letter back by <output id="shOut">${g.shift}</output></label><input id="sh" type="range" min="0" max="25" value="${g.shift}"><p class="learn">Try every position. When English words appear, you have the key.</p></div>`;
    $('sh').addEventListener('input', e => { g.shift = +e.target.value; begin(); renderText(); $('shOut').textContent = g.shift; check(); });
  } else if (L.type === 'sub') {
    const n = counts(L.cipher), max = Math.max(...n);
    t.innerHTML = `<h2>TOOL · FREQUENCY ANALYSIS</h2><p class="eng">English, most to least common: <b>${ENGLISH}</b></p><div class="chart" id="chart" role="group" aria-label="Cipher letter frequencies"></div>
      <div class="map"><span class="mono" id="selLbl"></span><input id="mapIn" maxlength="1" aria-label="Plaintext letter for the selected cipher letter" placeholder="?"><button class="btn" id="hint" type="button">Hint</button><button class="btn" id="clr" type="button">Clear all</button></div>`;
    const chart = $('chart');
    [...A].map((c, i) => ({ c, v: n[i] })).sort((a, b) => b.v - a.v).forEach(({ c, v }, rank) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', `${c}, ${v} occurrences`); if (g.sel === c) b.className = 'sel';
      b.innerHTML = `<div class="bar" style="height:${(v / max) * 100}%"></div><span>${c}</span><i class="ghost" style="bottom:calc(${ENG_FREQ[rank] / ENG_FREQ[0] * 100}% * .92 + 16px)" title="English: ${ENGLISH[rank]} is the ${rank + 1}${['st', 'nd', 'rd'][rank] || 'th'} most common letter"></i>`; b.addEventListener('click', () => { g.sel = g.sel === c ? null : c; render(); }); chart.appendChild(b); });
    $('selLbl').textContent = g.sel ? `Cipher ${g.sel} is…` : 'Pick a cipher letter';
    const inp = $('mapIn'); inp.disabled = !g.sel; inp.value = g.sel ? (g.map[g.sel] || '') : '';
    inp.addEventListener('input', e => { const v = e.target.value.toUpperCase(); if (v && !isL(v)) { e.target.value = ''; return; } setMap(g.sel, v); });
    $('clr').addEventListener('click', () => { g.map = {}; render(); });
    $('hint').addEventListener('click', () => { hints++; $('sHints').textContent = hints; const order = [...A].map((c, i) => ({ c, v: n[i] })).filter(x => x.v).sort((a, b) => b.v - a.v);
      const next = order.find(x => g.map[x.c] !== A[SUBKEY.indexOf(x.c)]); if (!next) return; g.map[next.c] = A[SUBKEY.indexOf(next.c)]; g.sel = next.c; toast(`Hint: cipher ${next.c} stands for ${g.map[next.c]}. It is the ${order.indexOf(next) + 1}${['st', 'nd', 'rd'][order.indexOf(next)] || 'th'} most common cipher letter.`); begin(); render(); });
    if (g.sel) inp.focus();
  } else if (L.type === 'otp') {
    const n = letters(L.plain).length;
    t.innerHTML = `<h2>TOOL · TRY A MESSAGE</h2><p class="learn">The ciphertext has ${n} letters. Type any ${n}-letter message and see the key that would make it correct.</p>
      <div class="row" style="margin:10px 0"><label class="sr" for="otpIn">Your guess</label><input id="otpIn" class="keyin" style="width:100%;letter-spacing:.2em" maxlength="${n}" value="${g.text}" autocomplete="off" spellcheck="false" placeholder="${'X'.repeat(n)}"></div>
      <p class="mono" id="otpKey" style="font-size:.85rem;color:var(--a);min-height:1.4em;letter-spacing:.2em"></p>
      <p class="learn" id="otpMsg" style="margin-top:8px"></p><div id="otpReveal" style="margin-top:10px"></div>`;
    const showKey = () => { const cl = letters(L.cipher); const gt = g.text; $('otpKey').textContent = gt ? 'Key needed: ' + [...gt].map((ch, i) => shiftCh(cl[i], -A.indexOf(ch))).join('') : '';
      $('otpMsg').textContent = g.tried.length ? `${g.tried.length} different message${g.tried.length > 1 ? 's' : ''} tried, and every one has a valid key. ${g.tried.length < 3 ? 'Try ' + (3 - g.tried.length) + ' more.' : ''}` : ''; };
    $('otpIn').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); g.text = e.target.value; begin(); renderText();
      if (g.text.length === n && !g.tried.includes(g.text)) { g.tried.push(g.text); if (g.tried.length >= 3 && !solved.has(lv)) { solved.add(lv); store.set([...solved]); toast(L.won, 12000); renderTabs(); ended = solved.size === LEVELS.length; const rv = $('otpReveal'); rv.innerHTML = '<button class="btn" type="button">Reveal the real message</button>'; rv.firstChild.addEventListener('click', () => { rv.textContent = 'The real message was: ' + L.plain + '. You could not have known.'; }); } }
      showKey(); });
    showKey(); if (solved.has(lv)) { const rv = $('otpReveal'); rv.innerHTML = '<button class="btn" type="button">Reveal the real message</button>'; rv.firstChild.addEventListener('click', () => { rv.textContent = 'The real message was: ' + L.plain + '. You could not have known.'; }); }
  } else {
    const vals = icByLength(L.cipher, 12), peak = Math.max(...vals);
    t.innerHTML = `<h2>TOOL · INDEX OF COINCIDENCE BY KEY LENGTH</h2><div class="ic" id="icc" role="img" aria-label="Index of coincidence for key lengths 1 to 12"></div>
      <p class="learn">Higher bars look more like English. Look for the tallest bar, then for a repeat of it at double the length.</p>
      <div class="row" style="margin-top:12px"><label class="mono" for="key" style="font-size:.78rem;color:var(--mute)">Key</label><input id="key" class="keyin" maxlength="12" value="${g.key}" autocomplete="off" spellcheck="false"><button class="btn" id="hint" type="button">Hint</button></div>`;
    vals.forEach((v, i) => { const d = document.createElement('div'); if (v > peak * 0.85) d.className = 'hi'; d.innerHTML = `<i style="height:${Math.max(4, (v - 0.035) / (peak - 0.035) * 100)}%"></i>${i + 1}`; d.title = `Key length ${i + 1}: ${v.toFixed(3)}`; $('icc').appendChild(d); });
    $('key').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); g.key = e.target.value; begin(); renderText(); check(); });
    $('hint').addEventListener('click', () => { hints++; $('sHints').textContent = hints; const correct = L.key; const k = g.key.length;
      if (k < 1 || g.key !== correct.slice(0, k)) { g.key = correct.slice(0, 1); toast(`Hint: the key is ${correct.length} letters long, and the first is ${correct[0]}. Each column is a Caesar cipher, so try the next letter by watching for English.`); }
      else if (k < correct.length) { g.key = correct.slice(0, k + 1); toast(`Hint: the next key letter is ${correct[k]}.`); }
      begin(); render(); });
  }
}
function setMap(c, v) { const g = guess[lv]; if (!c) return; if (v) { Object.keys(g.map).forEach(k => { if (g.map[k] === v && k !== c) delete g.map[k]; }); g.map[c] = v; } else delete g.map[c]; begin(); renderText(); check(); }
addEventListener('keydown', e => { const L = LEVELS[lv], g = guess[lv]; if (L.type !== 'sub' || !g.sel || e.target.tagName === 'INPUT' || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === 'Backspace' || e.key === 'Delete') { setMap(g.sel, ''); renderTool(); }
  else if (/^[a-zA-Z]$/.test(e.key)) { setMap(g.sel, e.key.toUpperCase()); renderTool(); } });

function renderLearn() { $('learn').innerHTML = `<h2>THE SCIENCE</h2>${LEVELS[lv].learn}`; $('lvlName').textContent = LEVELS[lv].name; }
function render() { renderTabs(); renderLearn(); renderText(); renderTool(); }

/* ───────── win and timer ───────── */
function begin() { if (!startedAt && !ended) startedAt = Date.now(); }
function check() {
  const L = LEVELS[lv]; if (decrypt(lv) !== L.plain || solved.has(lv)) return;
  solved.add(lv); store.set([...solved]); toast(L.won, 9000); renderTabs();
  const r = document.createElement('div'); r.className = 'result'; r.textContent = lv < LEVELS.length - 1 ? 'Solved. The next level is unlocked.' : 'All broken.'; $('tool').appendChild(r);
  if (solved.size === LEVELS.length) ended = true; else if (lv < LEVELS.length - 1) { const b = document.createElement('button'); b.className = 'btn go'; b.type = 'button'; b.style.marginTop = '10px'; b.textContent = 'Next level'; b.addEventListener('click', () => { lv++; render(); }); r.appendChild(document.createElement('br')); r.appendChild(b); }
}
let toastT; function toast(msg, ms = 6000) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, ms); }
setInterval(() => { if (!startedAt || ended) return; const s = Math.floor((Date.now() - startedAt) / 1000); $('sTime').textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }, 500);

render();
window.__cipher = { LEVELS, guess, decrypt, render, check, setLevel(i) { lv = i; render(); }, get lv() { return lv; } };
})();
