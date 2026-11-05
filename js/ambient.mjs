// Quiet, decorative sea life: small breaking waves on open water and a few gulls.
// Islands are skipped using their land ellipses, so nothing draws over the art.
const canvas = document.getElementById('ambient');
const ctx = canvas.getContext('2d');
let enabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
try { const saved = localStorage.getItem('ela-motion-enabled'); if (saved !== null) enabled = saved === 'true'; } catch {}
let width = 0, height = 0, frameId = 0, last = 0, clock = 0, provider = null;
const listeners = new Set();

function resize() {
  const ratio = Math.min(devicePixelRatio || 1, 1.5);
  width = innerWidth; height = innerHeight;
  canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
  canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
function random(seed) { let x = seed; return () => { x = (1664525 * x + 1013904223) >>> 0; return x / 4294967296; }; }
const seeds = (() => { const r = random(92173); return Array.from({ length: 260 }, () => ({ x: r(), y: r(), w: 24 + r() * 26, p: r(), d: 5 + r() * 3 })); })();

function wave(x, y, w, phase, alpha) {
  const crest = Math.sin(phase * Math.PI * 2) * 1.6;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.bezierCurveTo(x - w * .28, y - 2.8 + crest, x - w * .16, y + 2, x, y);
  ctx.bezierCurveTo(x + w * .17, y - 2.6 - crest, x + w * .3, y + 1.6, x + w / 2, y - .2);
  ctx.globalAlpha = alpha * .25; ctx.strokeStyle = '#145d80'; ctx.lineWidth = 3.3; ctx.stroke();
  ctx.globalAlpha = alpha; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.45; ctx.stroke();
}
function birds(t) {
  for (let g = 0; g < 2; g++) {
    const cycle = g ? 64 : 52, ph = (t / cycle + (g ? .61 : .16)) % 1, tr = g ? 1 - ph : ph;
    const bx = -70 + tr * (width + 140), by = height * (g ? .62 : .3) + Math.sin(ph * Math.PI * 2) * height * .05;
    for (let b = 0; b < (g ? 2 : 3); b++) {
      const x = bx - b * 27, y = by + b * 13, wing = Math.sin(t * 3.8 - b * .85) * 5;
      ctx.save(); ctx.translate(x, y); ctx.rotate(g ? -.1 : .07); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-10, -wing * .7); ctx.quadraticCurveTo(-5, -4, 0, 1); ctx.quadraticCurveTo(5, -4, 10, -wing * .7);
      ctx.globalAlpha = .28; ctx.strokeStyle = '#315772'; ctx.lineWidth = 4.1; ctx.stroke();
      ctx.globalAlpha = .96; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.6; ctx.stroke(); ctx.restore();
    }
  }
}
function frame(now) {
  frameId = requestAnimationFrame(frame);
  if (now - last < 40) return;
  clock += Math.min(.2, (now - last) / 1000); last = now;
  ctx.clearRect(0, 0, width, height);
  const land = provider ? provider() : [];
  const onLand = (x, y) => land.some(e => ((x - e.cx) / e.rx) ** 2 + ((y - e.cy) / e.ry) ** 2 < 1.08);
  for (const s of seeds) {
    const ph = (clock / s.d + s.p) % 1, x = s.x * width + ph * 27, y = s.y * height + ph * 5;
    if (onLand(x, y)) continue;
    wave(x, y, s.w, ph, Math.sin(ph * Math.PI) ** 2 * .5);
  }
  ctx.globalAlpha = 1;
  birds(clock);
}
function manage() {
  cancelAnimationFrame(frameId);
  canvas.hidden = !enabled;
  if (document.hidden || !enabled) { ctx.clearRect(0, 0, width, height); return; }
  last = performance.now(); frameId = requestAnimationFrame(frame);
}
export function initAmbient(landProvider) {
  provider = landProvider;
  resize(); addEventListener('resize', resize);
  document.addEventListener('visibilitychange', manage);
  manage();
}
export const motionEnabled = () => enabled;
export function setMotion(on) {
  enabled = on;
  try { localStorage.setItem('ela-motion-enabled', String(on)); } catch {}
  manage(); listeners.forEach(f => f(on));
}
export const onMotion = f => listeners.add(f);
