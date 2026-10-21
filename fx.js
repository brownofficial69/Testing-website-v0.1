/* fx.js: a full-screen WebGL "water drop" engine with five futuristic scenes.
   Inspired by the Galaxy S III era Nature UX ripple: a touch makes concentric rings that bend
   the light behind them. Here the rings are a height field turned into normals, which offset the
   background (refraction) and add a Fresnel-weighted highlight and a soft trough shadow.
   The canvas renders at the display's native pixel density with adaptive resolution, so on a 4K
   screen it draws at 4K when the GPU can keep up and scales down smoothly when it cannot. */
(function () {
'use strict';

const THEMES = {
  aqua:   { id: 0, light: 0, base: [0.012, 0.075, 0.125], c1: [0.03, 0.48, 0.66], c2: [0.10, 0.83, 0.92], c3: [0.75, 0.97, 1.0] },
  neural: { id: 1, light: 0, base: [0.035, 0.022, 0.09],  c1: [0.35, 0.22, 0.85], c2: [0.62, 0.45, 1.0],  c3: [0.35, 0.95, 0.85] },
  holo:   { id: 2, light: 1, base: [0.90, 0.94, 0.99],    c1: [0.35, 0.50, 0.85], c2: [0.30, 0.65, 0.90], c3: [1.0, 1.0, 1.0] },
  plasma: { id: 3, light: 0, base: [0.045, 0.012, 0.02],  c1: [0.60, 0.07, 0.10], c2: [1.0, 0.40, 0.10],  c3: [1.0, 0.75, 0.45] },
  aurora: { id: 4, light: 0, base: [0.012, 0.03, 0.07],   c1: [0.10, 0.85, 0.55], c2: [0.15, 0.70, 0.95], c3: [0.85, 0.40, 0.95] },
};

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
const FRAG = `
precision highp float;
#define NR 14
uniform vec2 uRes; uniform float uAspect; uniform float uTime; uniform float uScroll;
uniform int uTheme; uniform float uLight;
uniform vec3 uBase, uC1, uC2, uC3;
uniform vec4 uRip[NR];

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }

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

/* ───── scenes ───── */
vec3 grid(vec2 q, vec3 col, float a){
  vec2 g = abs(fract(q) - 0.5); float l = smoothstep(0.495, 0.5, max(g.x, g.y)); return col * l * a;
}
vec3 sceneAqua(vec2 uv){
  float t = uTime * 0.06; vec2 q = vec2(uv.x * uAspect, uv.y) * 3.0;
  vec3 col = mix(uBase * 0.55, uC1 * 0.55, pow(uv.y, 1.4));
  float w = fbm(q + vec2(t, t * 0.6));
  float cau = pow(abs(sin((q.x + w * 2.2) * 3.0)) * abs(sin((q.y - w * 2.2) * 3.0)), 3.0);
  col += uC2 * cau * 0.22 * (0.4 + uv.y);
  col += grid(q * 1.7 + vec2(0.0, uScroll * 0.4), uC2, 0.07);
  for (int k = 0; k < 7; k++) {
    float fk = float(k); vec2 c = vec2(hash(vec2(fk, 1.3)) * uAspect, fract(hash(vec2(fk, 7.1)) + uTime * (0.012 + 0.01 * hash(vec2(fk, 3.3)))));
    float d = length(vec2(uv.x * uAspect, uv.y) - c); col += uC3 * smoothstep(0.045, 0.0, d) * 0.05;
  }
  col += uC1 * 0.35 * smoothstep(1.0, 0.0, length(uv - vec2(0.5, 1.1)));
  return col;
}
vec3 sceneNeural(vec2 uv){
  float t = uTime * 0.05; vec2 q = vec2(uv.x * uAspect, uv.y) * 2.2;
  float n = fbm(q + vec2(t, -t)), n2 = fbm(q * 2.0 + n * 2.0 + t * 2.0);
  float iso = abs(fract(n2 * 9.0) - 0.5);
  float line = smoothstep(0.05, 0.0, iso), glow = smoothstep(0.22, 0.0, iso);
  vec3 col = uBase + uC1 * glow * 0.10 + uC2 * line * 0.55 * (0.3 + 0.7 * n);
  vec2 qq = q * 7.0, g = floor(qq), f = fract(qq) - 0.5; float h = hash(g);
  vec2 off = (vec2(hash(g + 3.1), hash(g + 7.7)) - 0.5) * 0.6;
  col += uC3 * smoothstep(0.07, 0.0, length(f - off)) * step(0.84, h) * (0.5 + 0.5 * sin(uTime * 2.0 + h * 30.0)) * 0.9;
  return col;
}
vec3 sceneHolo(vec2 uv){
  float t = uTime * 0.04; vec2 q = vec2(uv.x * uAspect, uv.y) * 1.6;
  float a = fbm(q + vec2(t, -t * 0.7));
  vec3 irid = 0.5 + 0.5 * cos(6.2831 * (a * 1.3 + uv.x * 0.25 + uv.y * 0.15 + vec3(0.0, 0.33, 0.67)));
  vec3 col = mix(uBase, irid, 0.32);
  col += grid(q * 3.0, uC1, 0.10);
  col += uC3 * smoothstep(0.6, 0.0, abs(uv.y - 0.78 - 0.08 * sin(uv.x * 3.0 + uTime * 0.2))) * 0.18;
  return col;
}
vec3 scenePlasma(vec2 uv){
  float t = uTime * 0.07; vec2 q = vec2(uv.x * uAspect, uv.y) * 1.8;
  vec2 w = vec2(fbm(q + vec2(t, 0.0)), fbm(q + vec2(5.2, 1.3) - vec2(0.0, t)));
  float f = fbm(q + 3.0 * w + t);
  vec3 col = mix(uBase, uC1, smoothstep(0.25, 0.72, f));
  col = mix(col, uC2, smoothstep(0.55, 0.95, f * f * 1.7) * 0.85);
  col += uC3 * pow(f, 5.0) * 0.9;
  return col * 0.75 + grid(q * 2.0, uC2, 0.04);
}
vec3 sceneAurora(vec2 uv){
  float t = uTime * 0.08; float x = uv.x * uAspect; vec3 col = uBase + uC2 * 0.05 * (1.0 - uv.y);
  float st = hash(floor(vec2(uv.x * uAspect, uv.y) * 220.0)); col += vec3(1.0) * step(0.9985, st) * (0.4 + 0.6 * sin(uTime + st * 90.0)) * 0.7 * smoothstep(0.3, 0.9, uv.y);
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float wave = sin(x * (1.3 + fi * 0.4) + t * (1.0 + fi * 0.3) + fbm(vec2(x * 0.7 + fi * 3.0, t)) * 3.2) * 0.14;
    float band = smoothstep(0.26 + fi * 0.04, 0.0, abs(uv.y - (0.62 - fi * 0.06 + wave)));
    float streak = 0.55 + 0.45 * fbm(vec2(x * 8.0 + fi * 11.0, t * 0.6));
    vec3 c = fi < 0.5 ? uC1 : (fi < 1.5 ? uC2 : uC3);
    col += c * band * streak * (0.55 - fi * 0.1);
  }
  return col;
}
vec3 scene(vec2 uv){
  if (uTheme == 0) return sceneAqua(uv);
  if (uTheme == 1) return sceneNeural(uv);
  if (uTheme == 2) return sceneHolo(uv);
  if (uTheme == 3) return scenePlasma(uv);
  return sceneAurora(uv);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes; vec2 p = vec2(uv.x * uAspect, uv.y);
  float e = 0.002; float h = height(p), hx = height(p + vec2(e, 0.0)), hy = height(p + vec2(0.0, e));
  vec2 g = vec2(hx - h, hy - h) / e;
  vec3 col = scene(clamp(uv + g * 0.014, 0.001, 0.999));  /* refraction */
  vec3 n = normalize(vec3(-g * 0.035, 1.0));
  vec3 L = normalize(vec3(-0.35, 0.55, 0.75)), V = vec3(0.0, 0.0, 1.0), H = normalize(L + V);
  float spec = pow(max(dot(n, H), 0.0), 90.0);
  float fres = pow(1.0 - n.z, 1.6);
  float amt = smoothstep(0.0, 0.05, length(g) * 0.035);
  col += mix(uC3, vec3(1.0), 0.6) * (spec * 0.9 + fres * 0.55) * amt * (uLight > 0.5 ? 0.5 : 1.0);
  col *= 1.0 - clamp(-h * 0.7, 0.0, 0.3) * amt;           /* trough shadow */
  float vig = smoothstep(1.25, 0.35, length(uv - 0.5) * 1.15);
  col *= mix(uLight > 0.5 ? 0.9 : 0.55, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}`;

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
  const u = { res: U('uRes'), aspect: U('uAspect'), time: U('uTime'), scroll: U('uScroll'), theme: U('uTheme'), light: U('uLight'), base: U('uBase'), c1: U('uC1'), c2: U('uC2'), c3: U('uC3'), rip: U('uRip[0]') };

  const state = { theme: THEMES[opts.theme] || THEMES.aqua, scale: 1, scroll: 0, ripples: [], hidden: false, t0: performance.now(), onDrop: opts.onDrop || null, raf: 0, last: 0, acc: 0, frames: 0 };
  const rip = new Float32Array(14 * 4);
  const maxPixels = opts.maxPixels || 8.3e6;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 3), w = canvas.clientWidth, h = canvas.clientHeight;
    let sw = Math.round(w * dpr * state.scale), shh = Math.round(h * dpr * state.scale);
    const px = sw * shh; if (px > maxPixels) { const k = Math.sqrt(maxPixels / px); sw = Math.round(sw * k); shh = Math.round(shh * k); }
    if (canvas.width !== sw || canvas.height !== shh) { canvas.width = sw; canvas.height = shh; gl.viewport(0, 0, sw, shh); }
  }
  /* start lower on very large canvases so the first frames are smooth */
  { const dpr = Math.min(window.devicePixelRatio || 1, 3); const px = canvas.clientWidth * canvas.clientHeight * dpr * dpr; if (px > 5e6) state.scale = 0.7; }

  function draw(now) {
    const t = (now - state.t0) / 1000; resize();
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1, asp = w / h;
    rip.fill(0); let n = 0;
    state.ripples = state.ripples.filter(r => (now - r.t0) / 1000 < 5.5);
    for (const r of state.ripples.slice(-14)) { rip[n * 4] = r.x * asp; rip[n * 4 + 1] = 1 - r.y; rip[n * 4 + 2] = (now - r.t0) / 1000; rip[n * 4 + 3] = r.amp; n++; }
    const th = state.theme;
    gl.uniform2f(u.res, canvas.width, canvas.height); gl.uniform1f(u.aspect, asp); gl.uniform1f(u.time, reduced ? 4.0 : t); gl.uniform1f(u.scroll, state.scroll);
    gl.uniform1i(u.theme, th.id); gl.uniform1f(u.light, th.light); gl.uniform3fv(u.base, th.base); gl.uniform3fv(u.c1, th.c1); gl.uniform3fv(u.c2, th.c2); gl.uniform3fv(u.c3, th.c3);
    gl.uniform4fv(u.rip, rip); gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function loop(now) {
    state.raf = requestAnimationFrame(loop);
    if (state.hidden) return;
    const dt = now - state.last; state.last = now;
    /* adaptive resolution: step the render scale toward what the GPU can hold at ~50 fps */
    if (dt < 250) { state.acc += dt; state.frames++; if (state.frames >= 40) { const avg = state.acc / state.frames; state.acc = 0; state.frames = 0;
      if (avg > 22 && state.scale > 0.45) state.scale *= 0.86; else if (avg < 13 && state.scale < 1) state.scale = Math.min(1, state.scale * 1.08); } }
    draw(now);
  }
  function drop(x, y, amp) {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    state.ripples.push({ x: x / w, y: y / h, t0: performance.now(), amp: amp == null ? 1 : amp });
    if (amp == null || amp > 0.5) { if (state.onDrop) state.onDrop(x / w, y / h, amp == null ? 1 : amp); }
    if (reduced) draw(performance.now());
  }
  /* interaction */
  let lastMove = 0, lx = -999, ly = -999, lastScroll = 0, lastRain = 0;
  addEventListener('pointermove', e => { const now = performance.now(); if (now - lastMove < 90) return; if (Math.hypot(e.clientX - lx, e.clientY - ly) < 36) return; lastMove = now; lx = e.clientX; ly = e.clientY; if (!reduced) drop(e.clientX, e.clientY, 0.22); }, { passive: true });
  addEventListener('pointerdown', e => { drop(e.clientX, e.clientY, 1.0); }, { passive: true });
  addEventListener('scroll', () => { const y = scrollY, now = performance.now(); state.scroll = y / Math.max(1, innerHeight); if (reduced) return; if (Math.abs(y - lastScroll) > 90 && now - lastRain > 260) { lastRain = now; lastScroll = y; const k = 2 + ((Math.random() * 2) | 0); for (let i = 0; i < k; i++) drop(Math.random() * innerWidth, Math.random() * innerHeight, 0.4); } }, { passive: true });
  const idle = () => { if (!state.hidden && !reduced) drop(canvas.clientWidth * (0.12 + Math.random() * 0.76), canvas.clientHeight * (0.12 + Math.random() * 0.76), 0.5); setTimeout(idle, 2600 + Math.random() * 3400); };
  setTimeout(idle, 3200);
  document.addEventListener('visibilitychange', () => { state.hidden = document.hidden; });
  addEventListener('resize', () => { if (reduced) draw(performance.now()); });

  state.raf = requestAnimationFrame(loop); if (reduced) draw(performance.now());
  return {
    drop, THEMES, get scale() { return state.scale; },
    setTheme(id) { state.theme = THEMES[id] || THEMES.aqua; if (reduced) draw(performance.now()); },
    setDropHook(fn) { state.onDrop = fn; },
    destroy() { cancelAnimationFrame(state.raf); },
  };
}
window.FX = { create, THEMES };
})();
