/* fx.js: the Aqua theme, a living water surface drawn in WebGL.
   - Flow: caustic light is advected through a curl-noise current using two blended phases
     (the "flow map" technique), so the water keeps moving instead of just scrolling.
   - Colour: the hue drifts slowly between emerald, teal, ocean blue and violet-blue, and the
     page's accent colours follow it through onHue.
   - Depth: a far and a near layer shift with scroll and pointer, with light shafts from above
     and plankton carried along the current.
   - Touch: ripples (a height field turned into normals) refract the scene and add a Fresnel
     highlight, a nod to the Galaxy S III Nature UX ripple.
   It renders at the display's native pixel density with adaptive resolution (up to 4K). */
(function () {
'use strict';

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
const FRAG = `
precision highp float;
#define NR 14
uniform vec2 uRes; uniform float uAspect; uniform float uTime; uniform float uScroll; uniform vec2 uMouse; uniform float uHue;
uniform vec4 uRip[NR];

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }
vec3 hsl(float h, float s, float l){ vec3 r = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0); return l + s * (r - 0.5) * (1.0 - abs(2.0 * l - 1.0)); }

/* ripples */
float height(vec2 p){
  float h = 0.0;
  for (int i = 0; i < NR; i++) {
    vec4 r = uRip[i]; if (r.w <= 0.0) continue;
    float age = r.z, d = length(p - r.xy), front = age * 0.36;
    float x1 = d - front, x2 = d - front * 0.72, x3 = d - front * 0.48;
    float env = exp(-age * 0.85) * r.w / (1.0 + d * 2.6);
    h += (sin(x1 * 74.0) * exp(-x1 * x1 * 95.0) + 0.55 * sin(x2 * 56.0) * exp(-x2 * x2 * 150.0) + 0.3 * sin(x3 * 40.0) * exp(-x3 * x3 * 220.0)) * env;
  }
  return h;
}

/* the current: a divergence-free swirl from the curl of a smooth noise field */
vec2 current(vec2 p, float t){
  float e = 0.06;
  float a = noise(p * 0.9 + vec2(0.0, e) + t * 0.05) - noise(p * 0.9 - vec2(0.0, e) + t * 0.05);
  float b = noise(p * 0.9 + vec2(e, 0.0) - t * 0.04) - noise(p * 0.9 - vec2(e, 0.0) - t * 0.04);
  float a2 = noise(p * 2.1 + vec2(0.0, e) - t * 0.09) - noise(p * 2.1 - vec2(0.0, e) - t * 0.09);
  float b2 = noise(p * 2.1 + vec2(e, 0.0) + t * 0.07) - noise(p * 2.1 - vec2(e, 0.0) + t * 0.07);
  return vec2(a, -b) * 1.5 + vec2(a2, -b2) * 0.6;
}
float ridge(vec2 q){ float r = 1.0 - abs(2.0 * noise(q) - 1.0); return pow(r, 5.0); }
float caustic(vec2 p){
  vec2 q = p * 3.2; q += 1.4 * vec2(noise(q * 0.7 + uTime * 0.05), noise(q * 0.7 - uTime * 0.04 + 5.0));
  return ridge(q) + 0.65 * ridge(q * 1.85 + 7.3);
}

vec3 scene(vec2 uv){
  float t = uTime;
  vec2 par = (uMouse - 0.5) * vec2(0.05, 0.035);
  vec2 pFar = vec2(uv.x * uAspect, uv.y) + par * 0.5 + vec2(0.0, uScroll * 0.05);
  vec2 pNear = vec2(uv.x * uAspect, uv.y) * 1.25 + par * 1.6 + vec2(0.0, uScroll * 0.22);

  /* colours follow the drifting hue */
  float h = uHue;
  vec3 deep = hsl(h + 0.02, 0.85, 0.055), mid = hsl(h + 0.0, 0.88, 0.20), lite = hsl(h - 0.03, 0.9, 0.58), glow = hsl(h - 0.09, 0.75, 0.80), accent = hsl(h + 0.14, 0.8, 0.62);
  vec3 col = mix(deep, mid, pow(clamp(uv.y * 0.95 + 0.04 * sin(uv.x * 3.0 + t * 0.2), 0.0, 1.0), 1.5));
  col += accent * 0.10 * smoothstep(0.9, 0.0, length(uv - vec2(0.15, 0.2)));

  /* two-phase flow map: caustics advected along the current without stretching */
  float ph = fract(t * 0.22), ph2 = fract(t * 0.22 + 0.5), wA = abs(1.0 - 2.0 * ph);
  vec2 vF = current(pFar, t) * 0.22, vN = current(pNear * 1.1, t + 9.0) * 0.30;
  float cFar = mix(caustic(pFar - vF * ph2 + 3.0), caustic(pFar - vF * ph + 3.0), wA);
  float cNear = mix(caustic(pNear * 1.4 - vN * ph2), caustic(pNear * 1.4 - vN * ph), wA);
  col += lite * cFar * 0.18 * (0.35 + uv.y * 0.65);
  col += glow * cNear * 0.14 * (0.5 + uv.y * 0.5);

  /* light shafts from above */
  float shaft = fbm(vec2(pFar.x * 2.6 + pFar.y * 1.3 - t * 0.05, t * 0.04)); shaft = pow(max(shaft - 0.38, 0.0) * 2.4, 2.0);
  col += glow * shaft * 0.20 * pow(uv.y, 1.6);

  /* soft surface sheen where the current converges */
  float sh = fbm(pNear * 1.4 + vN * 0.6 + t * 0.03); col += glow * pow(smoothstep(0.52, 0.86, sh), 3.0) * 0.12;

  /* plankton carried by the current */
  vec2 cur = current(pNear, t) * 0.12;
  for (int k = 0; k < 9; k++) {
    float fk = float(k); vec2 c = vec2(hash(vec2(fk, 1.3)) * uAspect, fract(hash(vec2(fk, 7.1)) + t * (0.010 + 0.012 * hash(vec2(fk, 3.3)))));
    c += cur * (0.6 + hash(vec2(fk, 9.0))); float d = length(vec2(uv.x * uAspect, uv.y) - c);
    float pulse = 0.55 + 0.45 * sin(t * (0.8 + hash(vec2(fk, 5.0))) + fk * 3.0);
    col += glow * smoothstep(0.05, 0.0, d) * 0.10 * pulse + accent * smoothstep(0.012, 0.0, d) * 0.5 * pulse;
  }
  return col;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes; vec2 p = vec2(uv.x * uAspect, uv.y);
  float e = 0.002; float h = height(p), hx = height(p + vec2(e, 0.0)), hy = height(p + vec2(0.0, e));
  vec2 g = vec2(hx - h, hy - h) / e;
  vec3 col = scene(clamp(uv + g * 0.014, 0.001, 0.999));              /* refraction */
  vec3 n = normalize(vec3(-g * 0.035, 1.0));
  vec3 L = normalize(vec3(-0.35, 0.55, 0.75)), V = vec3(0.0, 0.0, 1.0), H = normalize(L + V);
  float spec = pow(max(dot(n, H), 0.0), 90.0), fres = pow(1.0 - n.z, 1.6);
  float amt = smoothstep(0.0, 0.05, length(g) * 0.035);
  col += hsl(uHue - 0.06, 0.6, 0.88) * (spec * 0.9 + fres * 0.55) * amt;
  col *= 1.0 - clamp(-h * 0.7, 0.0, 0.3) * amt;                       /* trough shadow */
  float vig = smoothstep(1.25, 0.35, length(uv - 0.5) * 1.15); col *= mix(0.55, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}`;

function hslToRgb(h, s, l) {
  h = ((h % 1) + 1) % 1; const f = n => { const k = (n + h * 12) % 12, a = s * Math.min(l, 1 - l); return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}
const hex = c => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');

function create(canvas, opts) {
  opts = opts || {};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' }) || canvas.getContext('experimental-webgl');
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG); if (!vs || !fs) return null;
  const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(prog, n);
  const u = { res: U('uRes'), aspect: U('uAspect'), time: U('uTime'), scroll: U('uScroll'), mouse: U('uMouse'), hue: U('uHue'), rip: U('uRip[0]') };

  const state = { scale: 1, scroll: 0, ripples: [], hidden: false, paused: false, t0: performance.now(), onDrop: opts.onDrop || null, onHue: opts.onHue || null, raf: 0, last: 0, acc: 0, frames: 0, mx: 0.5, my: 0.5, tmx: 0.5, tmy: 0.5, hue: 0.55, lastHue: 0 };
  const rip = new Float32Array(14 * 4), maxPixels = opts.maxPixels || 8.3e6;
  const hueAt = t => 0.54 + 0.115 * Math.sin(t * 0.042) + 0.04 * Math.sin(t * 0.13 + 1.3);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 3), w = canvas.clientWidth, h = canvas.clientHeight;
    let sw = Math.round(w * dpr * state.scale), shh = Math.round(h * dpr * state.scale);
    const px = sw * shh; if (px > maxPixels) { const k = Math.sqrt(maxPixels / px); sw = Math.round(sw * k); shh = Math.round(shh * k); }
    if (canvas.width !== sw || canvas.height !== shh) { canvas.width = sw; canvas.height = shh; gl.viewport(0, 0, sw, shh); }
  }
  { const dpr = Math.min(window.devicePixelRatio || 1, 3); const px = canvas.clientWidth * canvas.clientHeight * dpr * dpr; if (px > 5e6) state.scale = 0.7; }

  function draw(now) {
    const t = (now - state.t0) / 1000; resize();
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1, asp = w / h;
    state.mx += (state.tmx - state.mx) * 0.06; state.my += (state.tmy - state.my) * 0.06;
    rip.fill(0); let n = 0;
    state.ripples = state.ripples.filter(r => (now - r.t0) / 1000 < 5.5);
    for (const r of state.ripples.slice(-14)) { rip[n * 4] = r.x * asp; rip[n * 4 + 1] = 1 - r.y; rip[n * 4 + 2] = (now - r.t0) / 1000; rip[n * 4 + 3] = r.amp; n++; }
    state.hue = reduced ? 0.54 : hueAt(t);
    if (state.onHue && now - state.lastHue > 700) { state.lastHue = now; state.onHue(state.hue, hslToRgb, hex); }
    gl.uniform2f(u.res, canvas.width, canvas.height); gl.uniform1f(u.aspect, asp); gl.uniform1f(u.time, reduced ? 6.0 : t); gl.uniform1f(u.scroll, state.scroll);
    gl.uniform2f(u.mouse, state.mx, 1 - state.my); gl.uniform1f(u.hue, state.hue); gl.uniform4fv(u.rip, rip); gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function loop(now) {
    state.raf = requestAnimationFrame(loop);
    if (state.hidden || state.paused) return;
    const dt = now - state.last; state.last = now;
    if (dt < 250) { state.acc += dt; state.frames++; if (state.frames >= 40) { const avg = state.acc / state.frames; state.acc = 0; state.frames = 0;
      if (avg > 22 && state.scale > 0.45) state.scale *= 0.86; else if (avg < 13 && state.scale < 1) state.scale = Math.min(1, state.scale * 1.08); } }
    draw(now);
  }
  function drop(x, y, amp) {
    if (state.paused) return;
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    state.ripples.push({ x: x / w, y: y / h, t0: performance.now(), amp: amp == null ? 1 : amp });
    if ((amp == null || amp > 0.5) && state.onDrop) state.onDrop(x / w, y / h, amp == null ? 1 : amp);
    if (reduced) draw(performance.now());
  }
  let lastMove = 0, lx = -999, ly = -999, lastScroll = 0, lastRain = 0;
  addEventListener('pointermove', e => { state.tmx = e.clientX / innerWidth; state.tmy = e.clientY / innerHeight; const now = performance.now(); if (now - lastMove < 90) return; if (Math.hypot(e.clientX - lx, e.clientY - ly) < 36) return; lastMove = now; lx = e.clientX; ly = e.clientY; if (!reduced) drop(e.clientX, e.clientY, 0.22); }, { passive: true });
  addEventListener('pointerdown', e => { drop(e.clientX, e.clientY, 1.0); }, { passive: true });
  addEventListener('scroll', () => { const y = scrollY, now = performance.now(); state.scroll = y / Math.max(1, innerHeight); if (reduced) return; if (Math.abs(y - lastScroll) > 90 && now - lastRain > 260) { lastRain = now; lastScroll = y; const k = 2 + ((Math.random() * 2) | 0); for (let i = 0; i < k; i++) drop(Math.random() * innerWidth, Math.random() * innerHeight, 0.4); } }, { passive: true });
  const idle = () => { if (!state.hidden && !state.paused && !reduced) drop(canvas.clientWidth * (0.12 + Math.random() * 0.76), canvas.clientHeight * (0.12 + Math.random() * 0.76), 0.5); setTimeout(idle, 2600 + Math.random() * 3400); };
  setTimeout(idle, 3200);
  document.addEventListener('visibilitychange', () => { state.hidden = document.hidden; });
  addEventListener('resize', () => { if (reduced) draw(performance.now()); });

  state.raf = requestAnimationFrame(loop); if (reduced) draw(performance.now());
  return {
    drop, get scale() { return state.scale; }, get hue() { return state.hue; },
    pause() { state.paused = true; }, resume() { state.paused = false; state.last = performance.now(); if (reduced) draw(performance.now()); },
    setDropHook(fn) { state.onDrop = fn; }, setHueHook(fn) { state.onHue = fn; },
    destroy() { cancelAnimationFrame(state.raf); },
  };
}
window.FX = { create, hslToRgb, hex };
})();
