// ELA Experiential Learning Universe · v38
// One continuous sea: the seven island artworks sit at their places in the
// universe, under one camera. Admission rules and content come unchanged from
// the domain modules; this file is the presentation layer.
import { academicContinuation, communityContinuation, specialistContinuations, freireEntryPresentation } from './continuation.mjs';
import { createCameraFlight } from './camera-flight.mjs';
import { certificateDisplayPage, startArchitecture } from './certificate-presentation.mjs';
import { certificateFocus, paintCertificateFocus, certificateCameraBounds } from './certificate-focus.mjs';
import { TRAINER_STOPS, TRAINER_EVIDENCE, MASTER_EVIDENCE, hasTrainer, hasMaster, trainerPrerequisites, qualificationReady, setQualificationEvidence, submitQualificationInGame, approveQualificationInGame, advanceTrainer, revisitTrainer } from './trainers.mjs';
import { hasMembership, membershipReady, submitMembershipInGame, approveMembershipInGame, submitFreireInGame, approveFreireInGame } from './pathways.mjs';
import { FREIRE_STEPS, hasFinishedFreire, advanceFreire, revisitFreire, freireReadyToFinish, finishFreire } from './freire.mjs';
import { hasSpecialist, hasTrainingSpecialist, canCompleteSpecialist, completeSpecialistInGame } from './milestones.mjs';
import { signsFor } from './signs.mjs';
import { PRACTICE_AREAS, startFieldPractice, setFieldEvidence, fieldEvidenceComplete, PRACTITIONER_GATE_BOUNDS, PRACTITIONER_CIRCLE_BOUNDS, choosePracticeArea, chooseTrainingScenario, practiceReady, needsTot, acceptPracticeInGame, returnForTrainingReview, TOT_STOPS, advanceTot, revisitTot } from './practitioner.mjs';
import { COMMUNITY_STOPS, COMMUNITY_OVERVIEW_BOUNDS, advanceCommunity, revisitCommunity } from './community.mjs';
import { ORIENTATION_STEPS, COMMUNITY_BOUNDS, advanceOrientation, revisitOrientation, orientationComplete, hasCommunityMembership, submitCommunityInGame, approveCommunityInGame } from './orientation.mjs';
import { journeySnapshot, foundationExitOptions, mayVisitVolunteerGate, hasCompletedIsland, JOURNEY_ISLANDS } from './journey.mjs';
import { FOUNDATION_STEPS, foundationPage, revisitFoundation, completeFoundation } from './foundations.mjs';
import { COLORS, STORAGE_KEY, freshState, restoreState, canEnter, visit } from './model.mjs';
import { clampView, zoomAt, fitBounds } from './viewport.mjs';
import { COURSE_PAGES, coursePage, routeProgress, advanceCourse, revisitCourse, visiblePaths, journalReady, submitJournalInGame, approveJournalInGame } from './course.mjs';
import { renderStructure } from './structure.mjs';
import { initAmbient, motionEnabled, setMotion, onMotion } from './ambient.mjs';

const $ = id => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ------------------------------------------------------------------ world */
const W = 6700, H = 3500;
// Image top-left in world pixels, scale, dock and land ellipse in image pixels.
const ISLES = {
  freire:       { x: 2280, y: 0,    s: 1,  dock: [1430, 925], land: [768, 470, 740, 470], short: 'Freirean Praxis' },
  trainers:     { x: 0,    y: 1060, s: 1,  dock: [1470, 215], land: [760, 455, 740, 455], short: 'Trainers' },
  community:    { x: 1720, y: 1260, s: 1,  dock: [800, 985],  land: [768, 480, 745, 480], short: 'Community' },
  practitioner: { x: 3440, y: 1220, s: 1,  dock: [780, 965],  land: [768, 480, 740, 470], short: 'Practitioner' },
  tot:          { x: 5160, y: 1080, s: 1,  dock: [760, 960],  land: [768, 480, 740, 480], short: 'ToT' },
  foundations:  { x: 820,  y: 2400, s: .8, dock: [790, 770],  land: [790, 470, 520, 330], short: 'Foundations' },
  certificate:  { x: 4140, y: 2420, s: 1,  dock: [775, 1000], land: [768, 500, 760, 500], short: 'Certificate' }
};
const START = [3010, 3010];
const toWorld = (id, [x, y]) => { const i = ISLES[id]; return [i.x + x * i.s, i.y + y * i.s]; };
const boundsToWorld = (id, [l, t, r, b]) => { const i = ISLES[id]; return [i.x + l * i.s, i.y + t * i.s, i.x + r * i.s, i.y + b * i.s]; };
const landBounds = id => { const [cx, cy, rx, ry] = ISLES[id].land; return boundsToWorld(id, [cx - rx, cy - ry, cx + rx, cy + ry]); };
const dockOf = id => toWorld(id, ISLES[id].dock);
const isleOf = current => ({ 'volunteer-gate': 'community', orientation: 'community', agora: 'community', 'membership-gate': 'community', 'trainer-gate': 'trainers' })[current] || (ISLES[current] ? current : null);
const ISLAND_MODES = ['certificate', 'foundations', 'volunteer-gate', 'orientation', 'community', 'practitioner', 'tot', 'agora', 'freire', 'trainers'];

const islands = {
  trainers: { name: 'Experiential Learning Trainers', kind: 'Yeterlilik ve uygulama alanı', description: 'Deneyimsel öğrenmeyi başkalarına öğretme, ortak uygulama ve mentorluk alanı. Master Trainer gelişimi de bu adada sürer.', format: 'Yeterlilik değerlendirmesi', requirements: ['Resmî dernek üyeliği', 'Training Practice üzerinden uzmanlık', 'Freirean Praxis deneyimi', 'Ek yeterlilik kanıtları'], next: ['freire'] },
  community: { name: 'Community Island', kind: 'Topluluk ve gönüllülük', description: 'Birlikte öğrenen ve gönüllü katkı sunan topluluğun ortak alanı. Topluluk katılımı ve gönüllülük akademik seviyelerden ayrı ilerler.', format: 'Topluluk katılımı', requirements: ['Experiential Learning Foundations veya Certificate üzerinden giriş', 'Volunteer Gate ve öz hızında Volunteer Orientation'], next: ['foundations', 'certificate'] },
  practitioner: { name: 'Practitioner Program', kind: 'Uygulayıcı programı', description: 'Training, Research veya Technology Practice alanında deneyimsel öğrenmeyi uygulama programı. Kabul edilen saha kanıtlarıyla Deneyimsel Öğrenme Uzmanı yeterliliğine ilerlenir.', format: '4 gün yüz yüze + saha uygulaması', requirements: ['Certificate mezuniyeti', 'Seçilen dalda mevcut practitioner olduğunun gösterilmesi'], next: ['certificate', 'community'] },
  tot: { name: 'Training of Trainers (ToT)', kind: 'Tamamlayıcı öğrenme programı', description: 'Temel eğitimcilik altyapısını ve yöntem kullanımını geliştiren yüz yüze program. ToT mezuniyeti ayrı bir mesleki unvan vermez; Practitioner Gate koşullarını otomatik karşılamaz.', format: '6 gün yüz yüze', requirements: ['Certificate programının tamamlanması'], next: ['certificate'] },
  freire: { name: 'Freirean Praxis', kind: 'Deneyim ve badge', description: 'Diyalog, yansıtma ve eylemi bir araya getiren deneyim. Training Practice tamamlamış Uzmanlara açıktır; girişte dernek üyeliği aranmaz.', format: 'Praxis deneyimi', requirements: ['Training Practice tamamlamış Deneyimsel Öğrenme Uzmanı olmak'], next: ['practitioner'] },
  foundations: { name: 'Experiential Learning Foundations', kind: 'Mikro e-öğrenme programı', description: 'Deneyimsel öğrenmenin yaklaşımını, öğrenme döngüsünü ve öğrenme stillerini tanıtan kısa bir başlangıç. Bu adadan topluluk ve gönüllülük yoluna açılabilirsiniz.', format: 'Öz hızında mikro e-öğrenme', price: 'Ücretsiz / isteğe bağlı bağış', requirements: [], next: [] },
  certificate: { name: 'Certificate Program', kind: 'Bağımsız çevrimiçi program', description: 'Farklı mesleklerden kişilere deneyimsel öğrenme okuryazarlığı sağlayan, kendi hızınızda ilerlediğiniz program. Kendi uygulamanızı My Practice Journey / Journal boyunca geliştirirsiniz.', format: 'Öz hızında çevrimiçi', price: 'Ücretli doğrudan katılım', requirements: [], next: [] }
};
const nameOf = id => id === 'agora' ? 'Agora · Genel Kurul' : islands[isleOf(id)]?.name || id;

/* ------------------------------------------------------------------ state */
let state;
try { state = restoreState(localStorage.getItem(STORAGE_KEY)); } catch { state = freshState(); }
let certificateScene = 'welcome', communityDetail = null, signDetail = null;
let selected = null, sailing = false, colorEditing = false, logbookOpen = false, logbookTab = 'journey';
let gesture = 0;

function save() {
  renderJourney();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { toast('Bu tarayıcıda ilerleme kaydı kullanılamıyor.'); }
}
function toast(msg) {
  $('toast').textContent = msg; $('toast').hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').hidden = true, 3500);
}

/* ---------------------------------------------------------------- markup */
const ICON = {
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>',
  dot: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 2.2 5.2 5.6.5-4.3 3.7 1.3 5.5L12 16l-4.8 2.9 1.3-5.5-4.3-3.7 5.6-.5Z"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
  ext: '<svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" style="fill:none;stroke:currentColor;stroke-width:2"><path d="M14 5h5v5M19 5l-8 8M18 14v5H5V6h5"/></svg>',
  membership: '<path d="m4 9 8-5 8 5M5 10h14M6 11v7m6-7v7m6-7v7M4 20h16"/>',
  freire: '<path d="M20 11a7 7 0 0 1-7 7H9l-5 3 1-6a7 7 0 0 1 1-11"/><path d="M9 4h8a4 4 0 0 1 0 8h-4l-4 3V4Z"/>',
  practice: '<circle cx="12" cy="12" r="8"/><path d="m9 12 2 2 4-5"/>',
  community: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3m1-15a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5"/>'
};
const ui = {
  head: ({ kicker, title, sub, status }) => `<header class="p-head">${kicker ? `<p class="p-kicker">${kicker}</p>` : ''}<h2 class="p-title" id="panel-title" tabindex="-1">${title}</h2>${sub ? `<p class="p-sub">${sub}</p>` : ''}${status || ''}</header>`,
  status: (kind, text) => `<p class="p-status ${kind}">${kind === 'locked' ? ICON.lock : kind === 'done' ? ICON.check : kind === 'title' ? ICON.star : ICON.dot}${text}</p>`,
  q: t => t ? `<p class="p-question">${t}</p>` : '',
  p: t => t ? `<p class="p-text">${t}</p>` : '',
  reflect: (t, label) => t ? `<div class="p-reflect">${label ? `<strong>${label}</strong>` : ''}${t}</div>` : '',
  bullets: a => a?.length ? `<ul class="bullets">${a.map(t => `<li>${t}</li>`).join('')}</ul>` : '',
  req: items => `<ul class="req">${items.map(r => `<li class="${r.met ? 'met' : ''}">${r.text}${r.met ? '<span class="sr-only"> (karşılandı)</span>' : ''}</li>`).join('')}</ul>`,
  section: (title, html) => `<section class="p-section"><h3>${title}</h3>${html}</section>`,
  open: t => `<p class="note note-open"><b>Netleşecek</b>${t}</p>`,
  source: t => `<p class="note note-source">Kaynak: ${t}</p>`,
  notes: (...n) => n.filter(Boolean).length ? `<div class="notes">${n.filter(Boolean).join('')}</div>` : '',
  segments: (count, total, current, label) => `<ol class="segments" role="progressbar" aria-label="${esc(label)}" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${count}">${Array.from({ length: total }, (_, i) => `<li class="${i === current ? 'current' : i < count || i < current ? 'done' : ''}"></li>`).join('')}</ol>`,
  segLabel: (left, right) => `<p class="seg-label"><span>${left}</span><span>${right}</span></p>`,
  facts: rows => `<dl class="facts">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`,
  examples: page => page.examples ? `<ul class="examples">${page.examples.map(e => `<li><strong>${e.name}</strong>${e.text}</li>`).join('')}</ul>` : '',
  timeline: status => `<ol class="timeline" aria-label="Başvuru aşamaları"><li class="done">Başvuru</li><li class="${status !== 'draft' ? 'done' : ''}">Değerlendirme</li><li class="${status === 'approved' ? 'done' : ''}">Kabul</li></ol>`
};
const btn = (id, label, kind = 'primary', extra = '') => `<button id="${id}" type="button" class="button ${kind}" ${extra}>${label}</button>`;
const back = (id, label = 'Geri') => btn(id, label, 'secondary', 'data-nav="back"');
const next = (id, label, extra = '') => btn(id, label, 'primary', `data-nav="next" ${extra}`);
const position = (name, small) => `<div class="position" aria-live="polite"><b>${name}</b><span>${small || ''}</span></div>`;

/* ------------------------------------------------------------ build world */
const stage = $('stage'), world = $('world'), panel = $('panel');
function svg(tag, attrs = {}) { const n = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); return n; }
const imgState = {};
function isleSrc(id, small) {
  const locked = !canEnter(id, state) && isleOf(state.current) !== id;
  return `assets/isle-${id}${locked ? '-locked' : ''}${small ? '-s' : ''}.webp`;
}
function buildWorld() {
  world.style.width = W + 'px'; world.style.height = H + 'px';
  const host = $('isles');
  for (const [id, i] of Object.entries(ISLES)) {
    const el = document.createElement('div');
    el.className = 'isle'; el.id = 'isle-' + id; el.dataset.island = id;
    el.style.cssText = `left:${i.x}px;top:${i.y}px;transform:scale(${i.s})`;
    el.innerHTML = `<img id="isle-img-${id}" class="isle-img" width="1536" height="1024" alt="" draggable="false" decoding="async">${id === 'certificate' ? '<canvas id="focus-layer" class="isle-layer" width="1536" height="1024" aria-hidden="true" hidden></canvas><svg id="route-overlay" class="isle-layer" viewBox="0 0 1536 1024" aria-hidden="true" hidden></svg>' : ''}<svg id="signs-${id}" class="isle-layer isle-signs" viewBox="0 0 1536 1024" role="group" hidden></svg>`;
    host.append(el);
    const img = el.querySelector('img');
    img.alt = islands[id].name + ' adasının görseli';
    img.src = isleSrc(id, true);
    imgState[id] = { src: img.src };
    img.addEventListener('load', () => { if (id === 'certificate') drawCoursePaths(); });
  }
  // Hit ellipses and the Agora area on Community Island.
  const hits = $('hit-layer');
  for (const [id, i] of Object.entries(ISLES)) {
    const [cx, cy] = toWorld(id, [i.land[0], i.land[1]]);
    const e = svg('ellipse', { class: 'isle-hit', 'data-island': id, cx, cy, rx: i.land[2] * i.s, ry: i.land[3] * i.s });
    e.addEventListener('click', () => { if (gesture <= 7) tapIsland(id); });
    hits.append(e);
  }
  const [ax, ay, ax2, ay2] = boundsToWorld('community', [555, 0, 1075, 250]);
  const agora = svg('rect', { class: 'isle-hit agora-hit', x: ax, y: ay, width: ax2 - ax, height: ay2 - ay, rx: 40 });
  agora.addEventListener('click', () => { if (gesture <= 7) goAgora(); });
  hits.append(agora);
  // Labels: constant-size, keyboard-reachable island buttons.
  const labels = $('labels');
  for (const id of Object.keys(ISLES)) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'isle-label'; b.dataset.island = id;
    b.addEventListener('click', () => tapIsland(id));
    b.addEventListener('focus', () => { const r = b.getBoundingClientRect(); if (r.right < 0 || r.left > innerWidth || r.bottom < 0 || r.top > innerHeight) fly(fitTarget(landBounds(id), .5), { speed: .6 }); });
    labels.append(b);
  }
  const ag = document.createElement('button');
  ag.type = 'button'; ag.className = 'isle-label agora-label'; ag.dataset.island = 'agora';
  ag.addEventListener('click', goAgora);
  labels.append(ag);
}
// Load the full-resolution artwork in the background, current island first.
function upgradeImages() {
  const order = Object.keys(ISLES).sort((a, b) => (isleOf(state.current) === b) - (isleOf(state.current) === a));
  let chain = Promise.resolve();
  for (const id of order) chain = chain.then(() => setIsleImage(id));
}
function setIsleImage(id) {
  const img = $('isle-img-' + id), want = new URL(isleSrc(id, false), location.href).href;
  if (imgState[id].src === want) return Promise.resolve();
  imgState[id].src = want;
  const pre = new Image(); pre.src = want;
  return (pre.decode ? pre.decode() : new Promise(r => pre.onload = r)).catch(() => {}).then(() => { if (imgState[id].src === want) img.src = want; });
}
function refreshIsleVariants() {
  for (const id of Object.keys(ISLES)) {
    const want = new URL(isleSrc(id, false), location.href).href;
    if (imgState[id].src !== want && !imgState[id].src.includes('-s.webp')) setIsleImage(id);
    else if (imgState[id].src.includes('-s.webp')) { const small = isleSrc(id, true); if (!imgState[id].src.endsWith(small)) { $('isle-img-' + id).src = small; imgState[id].src = new URL(small, location.href).href; } }
  }
}

/* ----------------------------------------------------------------- camera */
let view = { scale: .2, x: 0, y: 0, minScale: .05, maxScale: 1.7 }, flight = null;
const desktop = () => innerWidth >= 900;
const dims = () => ({ width: stage.clientWidth, height: stage.clientHeight });
function limits() { const d = dims(); const contain = Math.min(d.width / W, d.height / H); return { minScale: contain * .8, maxScale: 1.7 }; }
function topInset() { return (document.querySelector('.topbar').getBoundingClientRect().bottom || 60) + 4; }
function sheetHeight(st) {
  if (st === 'closed') return 0;
  if (st === 'mini' || st === 'open') return panel.offsetHeight || Math.min(innerHeight * .56, 560);
  if (st === 'full') return innerHeight - topInset();
  return panel.offsetHeight;
}
function cameraArea() {
  const d = dims(), st = panel.dataset.state;
  let left = 14, top = topInset() + 6, right = d.width - 14, bottom = d.height - 14;
  if (desktop()) {
    if (st !== 'closed') right = d.width - Math.min(440, innerWidth * .4) - 32;
    if (logbookOpen) left = Math.min(400, innerWidth - 32) + 32;
  } else if (st !== 'closed') bottom = d.height - sheetHeight(st) - 6;
  return { left, top, width: Math.max(140, right - left), height: Math.max(120, bottom - top) };
}
const toScreen = (wx, wy) => { const d = dims(); return [d.width / 2 + view.x + (wx - W / 2) * view.scale, d.height / 2 + view.y + (wy - H / 2) * view.scale]; };
function applyView() {
  const d = dims();
  view = clampView({ ...view, ...limits() }, d.width, d.height, W, H);
  world.style.transform = `translate(-50%,-50%) translate(${view.x}px,${view.y}px) scale(${view.scale})`;
  const [ox, oy] = toScreen(0, 0), tw = 1536 * view.scale, th = 1024 * view.scale;
  stage.style.backgroundSize = `${tw}px ${th}px`;
  stage.style.backgroundPosition = `${ox % tw}px ${oy % th}px`;
  placeLabels(); placeBoat();
  $('zoom-in').disabled = view.scale >= view.maxScale - 1e-4;
  $('zoom-out').disabled = view.scale <= view.minScale + 1e-4;
}
function fitTarget(bounds, max = 1.35) {
  const d = dims(), l = limits();
  return fitBounds(bounds, d.width, d.height, W, H, cameraArea(), l.minScale, Math.min(l.maxScale, max));
}
function cancelCamera() { if (flight) { cancelAnimationFrame(flight.raf); flight = null; } }
function fly(target, { speed = 1, instant = false } = {}) {
  cancelCamera();
  const d = dims(), f = createCameraFlight({ ...view }, { ...view, ...target }, { width: d.width, height: d.height, imageWidth: W, imageHeight: H, area: cameraArea() });
  const duration = instant || !motionEnabled() ? 0 : Math.min(2200, f.duration * .8) * speed;
  if (!duration) { view = { ...view, ...target }; applyView(); return Promise.resolve(); }
  return new Promise(resolve => {
    const start = performance.now(), me = { raf: 0 };
    flight = me;
    const step = now => {
      if (flight !== me) return resolve();
      const t = Math.min(1, (now - start) / duration), at = f.at(t);
      view = { ...view, x: at.x, y: at.y, scale: at.scale }; applyView();
      if (t < 1) me.raf = requestAnimationFrame(step); else { flight = null; view = { ...view, ...target }; applyView(); resolve(); }
    };
    me.raf = requestAnimationFrame(step);
  });
}
function overviewTarget() {
  const a = cameraArea();
  if (a.width / a.height < .95) {
    const bw = Math.min(W, Math.max(3800, a.width / a.height * H)), bx = state.position[0];
    const cx = Math.max(bw / 2, Math.min(W - bw / 2, bx));
    return fitTarget([cx - bw / 2, 0, cx + bw / 2, H], 1);
  }
  return fitTarget([0, 0, W, H], 1);
}
const flyOverview = opts => fly(overviewTarget(), opts);
function zoom(factor, point = { x: 0, y: 0 }) { cancelCamera(); const d = dims(); view = zoomAt({ ...view, ...limits() }, factor, point, d.width, d.height, W, H); applyView(); }
function localPoint(x, y) { const r = stage.getBoundingClientRect(); return { x: x - r.left - r.width / 2, y: y - r.top - r.height / 2 }; }
function initGestures() {
  const pointers = new Map();
  stage.addEventListener('wheel', e => { e.preventDefault(); zoom(Math.exp(-Math.max(-150, Math.min(150, e.deltaY)) * .0028), localPoint(e.clientX, e.clientY)); }, { passive: false });
  stage.addEventListener('dblclick', e => { e.preventDefault(); zoom(1.6, localPoint(e.clientX, e.clientY)); });
  stage.addEventListener('pointerdown', e => {
    gesture = 0;
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    cancelCamera();
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    stage.classList.add('dragging');
  });
  addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    const old = [...pointers.values()], before = pointers.get(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      gesture += Math.hypot(e.clientX - before.x, e.clientY - before.y);
      if (gesture > 3) { view.x += e.clientX - before.x; view.y += e.clientY - before.y; applyView(); }
    } else if (pointers.size === 2) {
      gesture = 100;
      const now = [...pointers.values()];
      const oc = { x: (old[0].x + old[1].x) / 2, y: (old[0].y + old[1].y) / 2 }, nc = { x: (now[0].x + now[1].x) / 2, y: (now[0].y + now[1].y) / 2 };
      const od = Math.hypot(old[0].x - old[1].x, old[0].y - old[1].y), nd = Math.hypot(now[0].x - now[1].x, now[0].y - now[1].y);
      if (od > 0) zoom(nd / od, localPoint(oc.x, oc.y));
      view.x += nc.x - oc.x; view.y += nc.y - oc.y; applyView();
    }
  });
  const release = e => { pointers.delete(e.pointerId); if (!pointers.size) stage.classList.remove('dragging'); };
  addEventListener('pointerup', release); addEventListener('pointercancel', release);
  stage.addEventListener('keydown', e => {
    const k = e.key;
    if (!['+', '=', '-', '0', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(k)) return;
    e.preventDefault(); e.stopPropagation(); cancelCamera();
    if (k === '+' || k === '=') zoom(1.25); else if (k === '-') zoom(1 / 1.25); else if (k === '0') flyOverview();
    else { view.x += k === 'ArrowLeft' ? 80 : k === 'ArrowRight' ? -80 : 0; view.y += k === 'ArrowUp' ? 80 : k === 'ArrowDown' ? -80 : 0; applyView(); }
  });
  $('zoom-in').onclick = () => zoom(1.3);
  $('zoom-out').onclick = () => zoom(1 / 1.3);
  $('zoom-fit').onclick = () => isIslandMode() ? fly(fitTarget(landBounds(isleOf(state.current)), 1)) : flyOverview();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { applyView(); refocus(true); }, 120); });
}
function refocus(instant) { if (isIslandMode()) focusCourseStep(null, { instant }); else if (selected && ISLES[selected]) fly(fitTarget(landBounds(selected)), { instant }); else flyOverview({ instant }); }

/* --------------------------------------------------------- labels & boat */
const isIslandMode = () => ISLAND_MODES.includes(state.current) && !sailing;
function islandStatus(id) {
  if (isIslandMode() && isleOf(state.current) === id) return 'here';
  if (hasCompletedIsland(id, state)) return 'done';
  return canEnter(id, state) ? 'open' : 'locked';
}
const STATUS_TEXT = { here: 'Buradasınız', done: 'Tamamlandı', open: 'Açık', locked: 'Kilitli' };
function renderLabels() {
  for (const b of $('labels').children) {
    const id = b.dataset.island;
    if (id === 'agora') {
      const member = hasMembership(state);
      b.className = 'isle-label agora-label ' + (member ? 'open' : 'locked');
      b.innerHTML = `<span class="ic">${member ? ICON.dot : ICON.lock}</span><span class="nm">Agora</span>`;
      b.setAttribute('aria-label', 'Agora · ' + (member ? 'Genel Kurula git' : 'Üyelik koşullarını gör'));
      b.hidden = isIslandMode() && isleOf(state.current) === 'community';
      continue;
    }
    const st = islandStatus(id);
    b.className = `isle-label ${st}${selected === id ? ' selected' : ''}`;
    b.innerHTML = `<span class="ic">${st === 'locked' ? ICON.lock : st === 'done' ? ICON.check : ICON.dot}</span><span class="nm"><span class="long">${islands[id].name}</span><span class="short">${ISLES[id].short}</span></span>`;
    b.setAttribute('aria-label', `${islands[id].name} · ${STATUS_TEXT[st]}${st === 'locked' ? '. Koşulları gör.' : '. Tanıtımı gör.'}`);
    b.hidden = st === 'here';
  }
  // Keyboard order: open islands before locked ones.
  const host = $('labels');
  [...host.children].sort((a, b) => (a.classList.contains('locked') - b.classList.contains('locked'))).forEach(n => host.append(n));
  for (const b of host.children) { b.classList.remove('compact'); b._w = b.offsetWidth; b._h = b.offsetHeight; }
  for (const e of document.querySelectorAll('.isle-hit[data-island]')) e.classList.toggle('inactive', isIslandMode() && isleOf(state.current) === e.dataset.island);
  document.querySelector('.agora-hit')?.classList.toggle('inactive', isIslandMode() && isleOf(state.current) === 'community');
}
function placeLabels() {
  const d = dims(), placed = [];
  const rank = b => b.classList.contains('selected') ? 0 : b.dataset.island === 'agora' ? 3 : b.classList.contains('locked') ? 2 : 1;
  for (const b of [...$('labels').children].sort((a, c) => rank(a) - rank(c))) {
    const id = b.dataset.island;
    let wx, wy;
    if (id === 'agora') { [wx, wy] = toWorld('community', [815, 130]); }
    else { const [cx, cy, , ry] = ISLES[id].land; [wx, wy] = toWorld(id, [cx, cy - ry * .92]); }
    const [sx, sy] = toScreen(wx, wy);
    const off = sx < -200 || sx > d.width + 200 || sy < -80 || sy > d.height + 80;
    const own = id !== 'agora' && ISLES[id].land[2] * 2 * ISLES[id].s * view.scale > 300 && (selected === id || isleOf(state.current) === id);
    b.classList.toggle('own', own);
    if (!b.hidden && !off && !own) {
      const fw = b._w || 120, h = b._h || 34, hit = r => placed.some(p => r[0] < p[2] && r[2] > p[0] && r[1] < p[3] && r[3] > p[1]);
      let r = [sx - fw / 2 - 4, sy - h / 2 - 2, sx + fw / 2 + 4, sy + h / 2 + 2], compact = hit(r);
      if (compact) r = [sx - h / 2 - 3, sy - h / 2 - 2, sx + h / 2 + 3, sy + h / 2 + 2];
      b.classList.toggle('compact', compact); placed.push(r);
    }
    b.style.transform = `translate(${Math.round(sx)}px,${Math.round(sy)}px) translate(-50%,-50%)`;
    if (id === 'agora') { const show = view.scale > .3; b.style.opacity = show ? 1 : 0; b.style.pointerEvents = show ? '' : 'none'; b.tabIndex = show ? 0 : -1; }
  }
}
function placeBoat(pos = state.position) {
  const k = Math.max(1.9, .85 / view.scale);
  $('boat').setAttribute('transform', `translate(${pos[0]} ${pos[1]}) scale(${k})`);
}
function paintBoat() {
  document.documentElement.style.setProperty('--boat', state.color);
  $('boat').style.color = state.color;
  const mini = `<svg viewBox="0 0 88 92" style="color:${state.color}"><use href="#boat-symbol" width="88" height="92"/></svg>`;
  $('boat-preview').innerHTML = mini; $('menu-boat-icon').innerHTML = mini;
}
function curve(from, to) {
  const mx = (from[0] + to[0]) / 2, my = (from[1] + to[1]) / 2, dx = to[0] - from[0], dy = to[1] - from[1], len = Math.hypot(dx, dy) || 1;
  const bend = Math.min(420, len * .18);
  return [from, [mx - dy / len * bend, my + dx / len * bend], to];
}
const qpath = ([a, c, b]) => `M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`;
function renderRoutes() {
  const layer = $('route-layer'); layer.replaceChildren();
  if (isIslandMode() || sailing || !state.started) return;
  for (const id of Object.keys(ISLES)) {
    if (!canEnter(id, state) || hasCompletedIsland(id, state)) continue;
    const to = dockOf(id);
    if (Math.hypot(to[0] - state.position[0], to[1] - state.position[1]) < 60) continue;
    const d = qpath(curve(state.position, to));
    layer.append(svg('path', { d, class: 'route-dash under' }), svg('path', { d, class: 'route-dash' }));
  }
}
function renderMap() {
  renderLabels(); renderRoutes(); placeLabels(); placeBoat(); paintBoat(); refreshIsleVariants();
  document.querySelectorAll('.isle-hit[data-island]').forEach(e => e.classList.toggle('selected', selected === e.dataset.island));
  const hint = $('hint');
  if (!state.started || isIslandMode() || sailing || panel.dataset.state !== 'closed') hint.innerHTML = '';
  else if (!state.visited.length) hint.innerHTML = '<b>İlk durağınızı seçin.</b> Renkli iki adadan başlayabilirsiniz.';
  else if (orientationComplete(state)) hint.innerHTML = '<b>Topluluk yolu açıldı.</b> Sarı rotalar açılabileceğiniz adaları gösterir.';
  else hint.innerHTML = 'Sarı rotalar açılabileceğiniz adaları gösterir. Gri adaların koşullarını görmek için dokunun.';
  $('app').classList.toggle('mode-island', isIslandMode());
  $('map-return').hidden = !(isIslandMode() || ['membership-gate', 'trainer-gate'].includes(state.current));
}

/* ------------------------------------------------------------------ panel */
let panelReturnFocus = null;
function setPanelState(st) {
  if (!desktop() && st === 'open' && panel.dataset.state === 'full') st = 'full';
  panel.dataset.state = st;
  $('panel-close').setAttribute('aria-label', st === 'mini' ? 'Paneli aç' : isIslandMode() ? 'Paneli küçült' : 'Kartı kapat');
  $('panel-grip').setAttribute('aria-label', st === 'full' ? 'Paneli küçült' : 'Paneli büyüt');
  renderMap();
}
function showPanel({ label, body, actions = '', focus = false }) {
  $('panel-body').innerHTML = body;
  $('panel-actions').innerHTML = actions;
  panel.setAttribute('aria-label', label || 'Bilgi paneli');
  if (panel.dataset.state === 'closed' || panel.dataset.state === 'mini') setPanelState('open'); else renderMap();
  $('panel-scroll').scrollTop = 0;
  if (focus) requestAnimationFrame(() => $('panel-title')?.focus({ preventScroll: true }));
}
function setInfo(open) {
  if (panel.dataset.state === 'closed' && !$('panel-body').innerHTML) return;
  setPanelState(open ? 'open' : 'mini');
  if (isIslandMode()) focusCourseStep();
}
function closeCard() {
  const wasIntro = !selected && !isIslandMode() && panel.dataset.state !== 'closed' && !!$('intro-foundations');
  if (['volunteer-gate', 'membership-gate', 'trainer-gate'].includes(state.current)) { state.current = 'map'; save(); }
  selected = null;
  $('panel-body').innerHTML = ''; $('panel-actions').innerHTML = '';
  setPanelState('closed');
  if (wasIntro) flyOverview();
}
$('panel-close').onclick = () => {
  const st = panel.dataset.state;
  if (st === 'mini') setInfo(true);
  else if (isIslandMode()) setInfo(false);
  else closeCard();
};
$('panel-grip').onclick = () => { const st = panel.dataset.state; setPanelState(st === 'full' ? 'open' : st === 'mini' ? 'open' : 'full'); if (isIslandMode()) focusCourseStep(); };
(() => { // Drag the sheet handle on phones.
  let y0 = null, h0 = 0, moved = false;
  $('panel-grip').addEventListener('pointerdown', e => { y0 = e.clientY; h0 = panel.offsetHeight; moved = false; $('panel-grip').setPointerCapture(e.pointerId); panel.style.transition = 'none'; });
  $('panel-grip').addEventListener('pointermove', e => { if (y0 === null) return; const dy = e.clientY - y0; if (Math.abs(dy) > 6) moved = true; if (moved) panel.style.height = Math.max(120, h0 - dy) + 'px'; });
  $('panel-grip').addEventListener('pointerup', e => {
    if (y0 === null) return; const h = panel.offsetHeight; y0 = null; panel.style.transition = ''; panel.style.height = '';
    if (!moved) return;
    const target = h > innerHeight * .72 ? 'full' : h < innerHeight * .3 ? 'mini' : 'open';
    setPanelState(target); if (isIslandMode()) focusCourseStep();
    $('panel-grip').addEventListener('click', ev => ev.stopImmediatePropagation(), { once: true, capture: true });
  });
})();

/* ------------------------------------------------------------ navigation */
function tapIsland(id) {
  if (sailing || !state.started) return;
  if (isIslandMode() && isleOf(state.current) === id) { setInfo(true); return; }
  if (isIslandMode()) leaveIsland();
  openCard(id);
}
function goAgora() {
  if (sailing || !state.started) return;
  if (isIslandMode()) leaveIsland();
  if (hasMembership(state)) sail('agora'); else openMembershipGate();
}
function leaveIsland() {
  signDetail = null; communityDetail = null;
  hideIslandLayers();
  state.current = 'map'; save();
}
function hideIslandLayers() {
  for (const id of Object.keys(ISLES)) $('signs-' + id).setAttribute('hidden', '');
  $('route-overlay').setAttribute('hidden', ''); $('focus-layer').hidden = true;
}
function showMap({ overview = false } = {}) {
  if (sailing) return;
  leaveIsland();
  closeCard();
  if (overview) flyOverview();
}
function focusIsland(id, bounds) { fly(fitTarget(bounds || landBounds(id), 1)); }

function requirementSatisfied(id, i) {
  if (id === 'practitioner') return i === 0 && hasCompletedIsland('certificate', state);
  if (id === 'trainers') return [hasMembership(state), hasTrainingSpecialist(state), hasCompletedIsland('freire', state), state.completed.includes('trainer-evidence')][i];
  return false;
}
function openCard(id) {
  if (sailing || !state.started) return;
  if (id === 'trainers') { openTrainerGate(); return; }
  if (id === 'freire') { openSpecialistDestination('freire'); return; }
  if (id === 'practitioner' && canEnter(id, state)) { openPractitionerInfo(); return; }
  if (['volunteer-gate', 'membership-gate', 'trainer-gate'].includes(state.current)) { state.current = 'map'; save(); }
  selected = id;
  const d = islands[id], locked = !canEnter(id, state), done = hasCompletedIsland(id, state);
  const status = locked ? ui.status('locked', 'Erişim koşulları var') : done ? ui.status('done', 'Tamamlandı') : ui.status('open', id === 'community' ? 'Oryantasyon tamamlandı' : id === 'tot' ? 'Certificate tamamlandı' : 'Başlangıç için açık');
  let body = ui.head({ kicker: d.kind, title: d.name, status }) + ui.p(d.description) + ui.facts([['Deneyim biçimi', d.format], ...(d.price ? [['Katılım', d.price]] : [])]);
  let actions = '';
  if (locked) {
    body += ui.section('Bu adaya ulaşmak için', ui.req(d.requirements.map((r, i) => ({ text: r, met: requirementSatisfied(id, i) }))));
    if (id === 'community' && mayVisitVolunteerGate(state)) actions = next('card-volunteer', 'Volunteer Gate’e git');
    else if (d.next.length) body += ui.section('Önce şu adımı keşfedin', `<div class="destinations">${d.next.map(dest => `<button type="button" class="destination" data-dest="${dest}"><span><b>${islands[dest].name}</b><small>${canEnter(dest, state) ? 'Başlangıç için açık' : 'Ön koşullarını inceleyin'}</small></span>${ICON.chevron}</button>`).join('')}</div>`);
    body += ui.notes('<p class="note">Program, unvan ve üyelik koşulları ayrı değerlendirilir.</p>', ui.open('Ayrıntılı değerlendirme ölçütleri çalışma çerçevesinde geliştiriliyor.'));
  } else {
    if (id === 'community') body += ui.req([{ text: 'Volunteer Orientation tamamlandı.', met: true }, { text: 'Topluluk yolu açık.', met: true }]);
    else if (id === 'tot') body += ui.req([{ text: 'Certificate Program tamamlandı.', met: true }]);
    else body += ui.req([{ text: 'Önceki bir programı tamamlama koşulu yok.', met: true }]);
    body += ui.notes(`<p class="note">${id === 'certificate' ? 'Experiential Learning Foundations, gönüllülük veya eğitmenlik ön koşulu yoktur. Program mezuniyeti mesleki unvan vermez.' : id === 'tot' ? 'ToT sonrası Training Practice için yeniden giriş değerlendirmesine dönülür.' : id === 'community' ? 'Topluluk üyeliği, resmî dernek üyeliğinden ayrıdır.' : 'Mikro kursun ardından Volunteer Gate ve Volunteer Orientation üzerinden topluluğa ilerlenir.'}</p>`);
    actions = next('card-go', 'Adaya git');
  }
  showPanel({ label: d.name + ' · Ada tanıtımı', body, actions, focus: true });
  if ($('card-go')) $('card-go').onclick = () => sail(id);
  if ($('card-volunteer')) $('card-volunteer').onclick = openVolunteerGate;
  for (const b of panel.querySelectorAll('[data-dest]')) b.onclick = () => openCard(b.dataset.dest);
  focusIsland(id);
}
function openUniverseIntroduction() {
  selected = null;
  showPanel({ label: 'Evrene iki giriş', body: ui.head({ kicker: 'İki giriş · Kendi hızınızda öğrenme', title: 'İlk adanız hangisi?' }) +
    `<div class="entries"><button type="button" class="entry" id="intro-foundations"><b>Experiential Learning Foundations</b><span>Ücretsiz · İsteğe bağlı bağış</span><small>Deneyimsel öğrenmenin temellerini aktaran mikro e-öğrenme programı.</small></button><button type="button" class="entry" id="intro-certificate"><b>Certificate Program</b><span>Ücretli · Kapsamlı e-öğrenme</span><small>Deneyimsel öğrenmede derinleştiğiniz, kendi hızınızda tamamladığınız program.</small></button></div>` +
    ui.reflect('Her iki programdan sonra topluluk yoluna katılabilirsiniz. Ücretsiz Foundations yeterlidir; Certificate zorunlu değildir.') });
  $('intro-foundations').onclick = () => openCard('foundations');
  $('intro-certificate').onclick = () => openCard('certificate');
  flyOverview();
}

/* ----------------------------------------------------------- sailing */
async function sail(id) {
  if (sailing || !canEnter(id, state) || (id === 'volunteer-gate' && !mayVisitVolunteerGate(state))) return;
  if (id === 'freire' && !hasFinishedFreire(state) && state.freireApplication.status !== 'approved') { openFreireApplication(); return; }
  const isle = isleOf(id), from = [...state.position], to = dockOf(isle);
  closeCard(); hideIslandLayers();
  sailing = true; state.current = 'map';
  const pre = setIsleImage(isle);
  renderMap();
  const travel = $('travel');
  travel.textContent = nameOf(id) + ' yönüne açılıyorsunuz…'; travel.hidden = false;
  const dist = Math.hypot(to[0] - from[0], to[1] - from[1]);
  if (dist > 40) {
    const c = curve(from, to), xs = [from[0], to[0], c[1][0]], ys = [from[1], to[1], c[1][1]];
    await fly(fitTarget([Math.min(...xs) - 300, Math.min(...ys) - 300, Math.max(...xs) + 300, Math.max(...ys) + 300], .5), { speed: .7 });
    const trail = svg('path', { d: qpath(c), class: 'route-trail' }); $('route-layer').append(trail);
    const duration = motionEnabled() ? Math.max(1400, Math.min(3200, dist * .55)) : 0, start = performance.now();
    await new Promise(resolve => {
      const frame = now => {
        const t = duration ? Math.min(1, (now - start) / duration) : 1, e = t * t * (3 - 2 * t), u = 1 - e;
        const p = [u * u * c[0][0] + 2 * u * e * c[1][0] + e * e * c[2][0], u * u * c[0][1] + 2 * u * e * c[1][1] + e * e * c[2][1]];
        placeBoat(p);
        if (t < 1) requestAnimationFrame(frame); else resolve();
      };
      requestAnimationFrame(frame);
    });
    trail.remove();
  }
  await pre;
  state = visit(state, id, to);
  sailing = false; travel.hidden = true;
  save();
  showArrival(id);
}
function showArrival(id) {
  if (id === 'certificate') certificateScene = 'welcome';
  signDetail = null; communityDetail = null; selected = null;
  const isle = isleOf(id);
  state.position = dockOf(isle);
  setIsleImage(isle);
  renderCourse();
  renderMap();
  requestAnimationFrame(() => focusCourseStep());
}

/* ------------------------------------------------------------ course views */
function renderCourse() {
  signDetail = null;
  hideIslandLayers();
  const c = state.current;
  if (c === 'volunteer-gate') return renderVolunteerGate();
  if (c === 'trainers') return renderTrainers();
  if (c === 'agora') return renderAgora();
  if (c === 'freire') return renderFreire();
  if (c === 'practitioner') return renderPractitioner();
  if (c === 'tot') return renderTot();
  if (c === 'orientation') return renderOrientation();
  if (c === 'community') return renderCommunity();
  if (c === 'foundations') return renderFoundations();
  if (c !== 'certificate') return;
  if (certificateScene === 'welcome') return renderCertificateWelcome();
  const p = state.certificateProgress;
  if (coursePage(p).type === 'journal-review' && certificateScene === 'course') return renderCertificateCompletion();
  const page = certificateDisplayPage(p, certificateScene), intro = page.type === 'intro', entry = page.type === 'journal', review = page.type === 'journal-review', journal = entry || review;
  const progress = routeProgress(p), last = !entry && p.step === COURSE_PAGES.length - 1;
  const routeNo = String(page.route.displayNumber || page.route.number).padStart(2, '0');
  const caption = entry ? 'Başlangıç' : review ? 'Journal’a dönüş' : page.journeyIntro ? `Yolculuk ${String(page.route.journeyIndex || 2).padStart(2, '0')} · Giriş` : page.route.caption || `Rota ${routeNo}${intro ? ' · Giriş' : ''}`;
  const journeyName = journal || page.journeyIntro || page.route.journey === page.route.name ? '' : (page.route.journey || 'Architecture of Experiential Learning');
  const kicker = `Certificate Program${journeyName ? `<span class="sep">/</span>${journeyName}` : ''}`;
  let body;
  if (intro || journal) {
    body = ui.head({ kicker, title: page.route.name, sub: caption }) + (page.route.number === 6 ? '<p class="p-sub">Paulo Freire</p>' : '') + ui.q(page.question) + ui.p(page.text) + ui.bullets(page.topics) +
      ui.reflect(journal ? page.connection : `${page.introNote || `Bu rotada: ${page.thinkers}`}${page.connection ? `<br><br>${page.connection}` : ''}`);
  } else {
    const routeStops = COURSE_PAGES.filter(s => s.type === 'stop' && s.route.number === page.route.number);
    body = ui.head({ kicker, title: page.examples ? page.route.name : page.name, sub: page.examples ? caption : `${caption} · ${page.route.name}` }) +
      ui.segments(progress.count, progress.total, progress.index - 1, page.route.name + ' ilerlemesi') + ui.segLabel(`${progress.count} / ${progress.total} durak tamamlandı`, `Durak ${progress.index}`) +
      (page.examples ? '' : ui.q(page.question)) + ui.p(page.text) + ui.examples(page) + ui.reflect(page.connection, 'Kendi pratiğiniz için') +
      (routeStops.length > 1 ? `<details class="stops"><summary>Bu rotadaki duraklar</summary><ol>${routeStops.map(s => { const idx = COURSE_PAGES.indexOf(s), done = p.completedSteps.includes(s.id), cur = s.id === page.id; return `<li class="${cur ? 'current' : done ? 'done' : ''}"><button type="button" data-step="${idx}" ${idx > p.highestSeen ? 'disabled' : ''}><i aria-hidden="true"></i>${s.name}${done ? '<span class="sr-only"> (tamamlandı)</span>' : ''}</button></li>`; }).join('')}</ol></details>` : '');
  }
  const nextLabel = entry ? 'Architecture of Experiential Learning’e geç' : intro ? (certificateScene === 'philosophy-intro' ? 'William James’e geç' : page.journeyIntro ? 'İlk kursa geç' : (COURSE_PAGES[p.step + 1]?.name || 'İlk durak') + ' durağına geç') : review ? 'Evrene dön' : 'Devam et';
  const pos = entry ? 'Yolculuğun başlangıcı' : review ? 'Journal’a dönüş' : page.journeyIntro ? caption : intro ? `Rota ${routeNo} · Giriş` : `${progress.index} / ${progress.total}${p.completedSteps.includes(page.id) ? ' · Tamamlandı' : ''}`;
  showPanel({ label: page.route.name, body, actions: position(page.name, pos) + back('course-back') + next('course-next', nextLabel, last && !review ? 'disabled title="Sonraki durak henüz açık değil"' : '') + (review ? btn('certificate-volunteer', 'Volunteer Gate’e git', 'secondary') : '') });
  $('course-back').onclick = () => {
    if (entry || certificateScene === 'philosophy-intro') { certificateScene = 'welcome'; renderCourse(); focusCourseStep(); return; }
    if (p.step === 0) { certificateScene = 'philosophy-intro'; renderCourse(); focusCourseStep(); } else changeCourse(p.step - 1);
  };
  $('course-next').onclick = () => {
    if (entry) { state.certificateProgress = startArchitecture(p); certificateScene = 'philosophy-intro'; }
    else if (certificateScene === 'philosophy-intro') certificateScene = 'course';
    else if (review) { showMap({ overview: true }); return; }
    else state.certificateProgress = advanceCourse(state.certificateProgress);
    save(); renderCourse(); focusCourseStep();
  };
  if ($('certificate-volunteer')) $('certificate-volunteer').onclick = openVolunteerGate;
  for (const b of panel.querySelectorAll('[data-step]')) b.onclick = () => changeCourse(+b.dataset.step);
  drawCoursePaths(); renderMapSigns();
}
function renderCertificateWelcome() {
  const p = state.certificateProgress;
  const body = ui.head({ kicker: 'Kendi hızınızda · Çevrimiçi', title: 'Certificate Program’a hoş geldiniz' }) +
    ui.p('Farklı mesleklerden katılımcılar için hazırlanan bu programda deneyimsel öğrenmeyi üç yolculuk üzerinden keşfedeceksiniz.') +
    `<ol class="stops-static">${[['Architecture of Experiential Learning', 'Felsefi temeller, öğrenmenin işleyişi, farklı öğrenme yolları, öğrenen kimliği, ilişkiler ve dönüşüm.'], ['Methods & Modalities', 'Beş yöntem ailesi ve kendi pratiğinizle bağlantıları.'], ['Evidence, Quality & Ethics', 'Kanıtları, uygulama kalitesini ve etik soruları birlikte değerlendirme.']].map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join('')}</ol>` +
    ui.reflect('Kendi alanınızdan seçtiğiniz bir çalışma bütün yolculuklara eşlik eder. Notlarınızı ve geliştirdiğiniz uygulamayı Journal’da biriktirirsiniz.<br><button id="welcome-journal" type="button" class="button ghost">My Practice Journal’ı tanıyın</button>', 'My Practice Journey / Journal');
  showPanel({ label: 'Certificate Program · Hoş geldiniz', body, actions: back('certificate-welcome-back') + (p.started ? btn('certificate-resume', 'Kaldığım yerden devam et', 'secondary') : '') + next('certificate-begin', 'Architecture of Experiential Learning’e geç') });
  $('certificate-welcome-back').onclick = () => { showMap(); openCard('certificate'); };
  $('certificate-begin').onclick = () => { state.certificateProgress = startArchitecture(p); certificateScene = 'philosophy-intro'; save(); renderCourse(); focusCourseStep(); };
  $('welcome-journal').onclick = () => { state.certificateProgress = { ...p, journalOpen: true }; certificateScene = 'course'; save(); renderCourse(); focusCourseStep(); };
  if ($('certificate-resume')) $('certificate-resume').onclick = () => { certificateScene = 'course'; renderCourse(); focusCourseStep(); };
  drawCoursePaths(); renderMapSigns();
}
function renderCertificateCompletion() {
  const p = state.certificateProgress, approved = p.journalStatus === 'approved', submitted = p.journalStatus === 'submitted', page = coursePage(p);
  let body = ui.head({ kicker: 'Certificate Program · Tamamlama', title: 'My Practice Journal', status: approved ? ui.status('done', 'Program tamamlandı') : submitted ? ui.status('open', 'Değerlendirmede') : '' }) +
    ui.q(approved ? 'Certificate Program’ı tamamladınız.' : submitted ? 'Journal’ınız değerlendirmeye ulaştı.' : page.question) +
    ui.p(approved ? 'Journal değerlendirmesi onaylandı. Deneyimsel Öğrenme Sertifika Programı katılım belgeniz yolculuğunuza kaydedildi.' : submitted ? 'Çalışmanız, programdaki öğrenmelerle ve kendi pratiğinizle kurduğunuz bağlantılar üzerinden değerlendirilir. Olumlu değerlendirme sonrasında katılım belgenizi alırsınız.' : page.text);
  if (!submitted && !approved) body += ui.bullets(page.topics) + ui.reflect(page.connection);
  const actions = back('journal-back') + (approved ? btn('certificate-community', hasCommunityMembership(state) ? 'Topluluğa dön' : 'Volunteer Gate’e git', 'secondary') + next('certificate-practitioner', academicContinuation(state).label) : next('journal-action', submitted ? 'Journal’ım onaylandı' : 'Journal’ı tamamladım, gönder', !journalReady(p) ? 'disabled' : ''));
  showPanel({ label: 'My Practice Journal', body, actions });
  $('journal-back').onclick = () => changeCourse(p.step - 1);
  if (approved) { $('certificate-community').onclick = goToCommunity; $('certificate-practitioner').onclick = () => continueJourney(academicContinuation(state)); }
  else $('journal-action').onclick = () => {
    state.certificateProgress = submitted ? approveJournalInGame(p) : submitJournalInGame(p);
    save(); renderCertificateCompletion();
    if (state.certificateProgress.journalStatus === 'approved') { renderMap(); showAchievement('certificate'); }
  };
  drawCoursePaths(); renderMapSigns();
}
function changeCourse(step) { state.certificateProgress = revisitCourse(state.certificateProgress, step); save(); renderCourse(); focusCourseStep(); }

function renderFoundations() {
  const p = state.foundationsProgress, last = p.step >= FOUNDATION_STEPS.length, exit = foundationExitOptions(state);
  let body = ui.head({ kicker: 'Mikro e-öğrenme programı', title: 'Experiential Learning Foundations', status: last ? ui.status('done', 'Mikro kurs tamamlandı') : '' });
  if (last) body += ui.q('Yolculuğunuza nereden devam edersiniz?') + ui.p(hasCompletedIsland('certificate', state) ? 'Certificate Program’ı da tamamladınız. Topluluk yoluna devam edebilirsiniz.' : 'Certificate Program ile deneyimsel öğrenmede derinleşebilir veya Volunteer Gate üzerinden topluluk yoluna ilerleyebilirsiniz. Gönüllülük yolunda, derneği ve gönüllülük çerçevesini tanıtan Volunteer Orientation yer alır.') +
    ui.notes('<p class="note">Topluluk katılımı, Türkiye gönüllülüğü ve akademik seviyeler ayrı süreçlerdir. Resmî dernek üyeliği ayrı bir başvuru sürecidir.</p>');
  else body += ui.p('Kendi hızınızda tamamlayacağınız ücretsiz mikro e-öğrenme programı. İsterseniz derneğe bağışta bulunabilirsiniz.') +
    `<div class="topics">${FOUNDATION_STEPS.map((s, i) => `<details ${i === 0 ? 'open' : ''}><summary><b>${s.name}</b><small>${['Deneyimsel öğrenme yaklaşımı', 'Deneyimsel öğrenme döngüsü', 'Öğrenme stilleri'][i]}</small></summary><div class="topic-body"><p class="p-question">${s.question}</p><p>${s.text}</p><p class="p-reflect">${s.connection}</p></div></details>`).join('')}</div>`;
  const actions = back('course-back') + (last ? (exit.includes('certificate') ? btn('foundation-certificate', 'Certificate’a git', 'secondary') : '') + next('foundation-volunteer', hasCommunityMembership(state) ? 'Topluluğa dön' : 'Volunteer Gate’e git') : next('course-next', 'Kursu tamamladım'));
  showPanel({ label: 'Experiential Learning Foundations', body, actions });
  $('course-back').onclick = () => { if (!last) { showMap(); openCard('foundations'); return; } state.foundationsProgress = revisitFoundation(p, 0); save(); renderFoundations(); };
  if (last) { if ($('foundation-certificate')) $('foundation-certificate').onclick = () => { showMap(); sail('certificate'); }; $('foundation-volunteer').onclick = goToCommunity; }
  else $('course-next').onclick = () => { state.foundationsProgress = completeFoundation(p); save(); renderFoundations(); renderMap(); };
}
function renderOrientation() {
  const p = state.orientationProgress, page = ORIENTATION_STEPS[p.step], last = p.step === 2, submitted = p.membershipStatus === 'submitted' && last;
  const body = ui.head({ kicker: 'Volunteer Orientation · Mikro e-öğrenme', title: submitted ? 'Topluluğa hoş geldiniz' : page.name, sub: submitted ? 'Oryantasyon tamamlandı' : `Adım ${p.step + 1} / 3` }) +
    (submitted ? '' : ui.segments(p.step, 3, p.step, 'Oryantasyon ilerlemesi')) +
    ui.q(submitted ? 'Oryantasyonu tamamladınız. Başvurunuz kabul edildi.' : page.question) + ui.p(submitted ? 'Topluluk üyeliğinizi yolculuğunuza kaydedip adayı keşfetmeye başlayabilirsiniz.' : page.text);
  showPanel({ label: 'Volunteer Orientation', body, actions: position('Volunteer Orientation', `${p.step + 1} / 3`) + back('orientation-back') + next('orientation-next', submitted ? 'Başvurum kabul edildi' : last ? (hasCommunityMembership(state) ? 'Topluluğa dön' : 'Topluluk üyesi ol') : 'Devam et') });
  $('orientation-back').onclick = () => { if (p.step === 0) { state.current = 'volunteer-gate'; save(); renderCourse(); return; } state.orientationProgress = revisitOrientation(p, p.step - 1); save(); renderOrientation(); };
  $('orientation-next').onclick = () => {
    if (submitted) { state.orientationProgress = approveCommunityInGame(p); state.current = 'community'; save(); showArrival('community'); showAchievement('community'); return; }
    if (last && hasCommunityMembership(state)) { state.current = 'community'; save(); showArrival('community'); return; }
    state.orientationProgress = advanceOrientation(p);
    if (last) state.orientationProgress = submitCommunityInGame(state.orientationProgress);
    save(); renderOrientation();
  };
}
function renderCommunity() {
  if (state.communityProgress.freeExplore) return renderCommunityFree();
  const p = state.communityProgress, page = COMMUNITY_STOPS[p.step], last = p.step === COMMUNITY_STOPS.length - 1;
  const body = ui.head({ kicker: 'Topluluk ve gönüllülük · Adayı keşfet', title: page.name, sub: 'Community Island' }) +
    ui.segments(p.completedSteps.length, COMMUNITY_STOPS.length, p.step, 'Topluluk Adası keşif ilerlemesi') + ui.segLabel(`${p.completedSteps.length} / ${COMMUNITY_STOPS.length} durak tamamlandı`, `Durak ${p.step + 1}`) +
    ui.q(page.question) + ui.p(page.text) + (page.id === 'community-agora' ? ui.reflect(page.connection) : '') + (page.link ? `<a class="p-link" href="${page.link.href}" target="_blank" rel="noopener noreferrer">${page.link.label.replace(' ↗', '')} ${ICON.ext}</a>` : '');
  showPanel({ label: 'Community Island', body, actions: position(page.name, `${p.step + 1} / ${COMMUNITY_STOPS.length}${p.completedSteps.includes(page.id) ? ' · Tamamlandı' : ''}`) + back('community-back') + next('community-next', last ? 'Serbestçe gez' : 'Devam et') });
  $('community-back').onclick = () => { if (p.step === 0) { showMap({ overview: true }); return; } state.communityProgress = revisitCommunity(p, p.step - 1); save(); renderCommunity(); focusCourseStep(); };
  $('community-next').onclick = () => {
    state.communityProgress = advanceCommunity(p); save();
    if (last) { state.communityProgress.freeExplore = true; communityDetail = null; save(); renderCommunity(); setInfo(false); fly(fitTarget(landBounds('community'), 1)); }
    else { renderCommunity(); focusCourseStep(); }
  };
}
function renderCommunityFree() {
  const page = COMMUNITY_STOPS.find(s => s.id === communityDetail) || COMMUNITY_STOPS[0], nextStep = communityContinuation(state);
  const body = ui.head({ kicker: 'Topluluk Adası · Serbest keşif', title: communityDetail ? page.name : 'Adada kalın, keşfedin' }) +
    (communityDetail ? ui.q(page.question) + ui.p(page.text) + (page.id === 'community-agora' ? ui.reflect(page.connection) : '') + (page.link ? `<a class="p-link" href="${page.link.href}" target="_blank" rel="noopener noreferrer">${page.link.label.replace(' ↗', '')} ${ICON.ext}</a>` : '')
      : ui.p('Adadaki sarı işaretli mekânlara dokunarak bilgilerini yeniden açabilirsiniz. Haritayı sürükleyerek komşu adalara da geçebilirsiniz.'));
  const keep = panel.dataset.state;
  showPanel({ label: page.name, body, actions: btn('community-stay', 'Toplulukta kal', 'secondary') + next('community-continue', nextStep.label) });
  if (!communityDetail && keep === 'mini') setPanelState('mini');
  $('community-stay').onclick = () => { communityDetail = null; renderCommunityFree(); setPanelState('mini'); fly(fitTarget(landBounds('community'), 1)); toast('Topluluk Adası’ndasınız. İşaretli mekânlara dokunabilirsiniz.'); };
  $('community-continue').onclick = () => continueJourney(nextStep);
  renderMapSigns();
}
function signsAvailable() {
  return (state.current === 'certificate' && certificateScene !== 'welcome') || ['practitioner', 'freire', 'trainers'].includes(state.current) || (state.current === 'community' && state.communityProgress.freeExplore);
}
function renderMapSigns() {
  for (const id of Object.keys(ISLES)) $('signs-' + id).setAttribute('hidden', '');
  if (!signsAvailable()) return;
  const layer = $('signs-' + state.current); layer.replaceChildren(); layer.removeAttribute('hidden');
  layer.setAttribute('aria-label', islands[state.current].name + ' · Tabelalar');
  const focus = state.current === 'certificate' ? certificateFocus(certificateDisplayPage(state.certificateProgress, certificateScene)) : null;
  for (const sign of signsFor(state.current)) {
    const [x, y, x2, y2] = sign.rect, [cx, cy] = sign.dot, sel = signDetail === sign.id || (state.current === 'community' && communityDetail === sign.id);
    const g = svg('g', { role: 'button', tabindex: 0, 'aria-label': sign.name + ' bilgisini aç', class: 'map-sign' + (sel ? ' selected' : '') + (focus && !focus.ids.includes(sign.id) ? ' unrelated' : '') });
    const title = svg('title'); title.textContent = sign.name;
    g.append(title, svg('rect', { x, y, width: x2 - x, height: y2 - y, fill: 'transparent' }), svg('circle', { cx, cy, r: 17, class: 'sign-halo' }), svg('circle', { cx, cy, r: 8, class: 'sign-dot' }));
    g.addEventListener('click', e => { e.stopPropagation(); if (gesture <= 7) openSignDetail(sign); });
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSignDetail(sign); } });
    layer.append(g);
  }
}
function openSignDetail(sign) {
  if (!signsAvailable()) return;
  if (state.current === 'community') {
    if (sign.id === 'community-agora' && hasMembership(state)) { leaveIsland(); sail('agora'); return; }
    communityDetail = sign.id; setPanelState('open'); renderCommunityFree(); focusCourseStep(); return;
  }
  signDetail = sign.id;
  const page = sign.page;
  const ret = state.current === 'certificate' ? 'Kurs akışına dön' : state.current === 'freire' ? 'Praxis akışına dön' : state.current === 'trainers' ? 'Ada yolculuğuna dön' : 'Program bilgisine dön';
  showPanel({ label: sign.name + ' · Mekân bilgisi', body: ui.head({ kicker: islands[state.current].name + ' · Tabela', title: sign.name }) + ui.q(page.question) + ui.p(page.text) + ui.examples(page) + ui.reflect(page.connection), actions: next('sign-return', ret) });
  setPanelState('open');
  $('sign-return').onclick = () => { renderCourse(); focusCourseStep(); };
  if (state.current === 'certificate' && sign.id === 'journal') { drawCoursePaths(); focusCourseStep(sign.page.bounds); }
  renderMapSigns();
}

function openPractitionerInfo() {
  if (hasSpecialist(state) || state.practitionerProgress.stage !== 'application') { showMap(); sail('practitioner'); return; }
  if (isIslandMode()) leaveIsland();
  selected = 'practitioner';
  showPanel({ label: 'Practitioner Program başvuru bilgisi', focus: true, body: ui.head({ kicker: 'Practitioner Program', title: 'Uygulayıcı programı', status: ui.status('open', 'Başvuru yolu açık') }) +
    ui.p('Certificate Program’ı tamamladınız. Uygulama dalınızı seçip o alandaki geçmişinizi göstereceğiniz başvuru aşamasına ilerleyebilirsiniz.') + ui.req([{ text: 'Certificate Program tamamlandı', met: true }]) +
    ui.section('İskeledeki başvuru ve değerlendirme', ui.p('Training Practice, Research Practice veya Technology Practice alanı seçilir. Seçilen daldaki arka plan ve kanıtlar incelenir. Training Practice için hazırlığı eksik olanlar ToT’ye yönlendirilebilir.')) +
    ui.notes('<p class="note">Başvuru yolunun açılması programa otomatik kabul anlamına gelmez. Alan değerlendirmesi, 4 günlük yüz yüze çalışma ve saha uygulaması aşamaları ayrı ilerler.</p>'),
    actions: next('practitioner-enter', 'Başvuru iskelesine git') });
  $('practitioner-enter').onclick = () => sail('practitioner');
  focusIsland('practitioner');
}
function renderPractitioner() {
  signDetail = null;
  if (['field', 'completed'].includes(state.practitionerProgress.stage)) return renderFieldPractice();
  const p = state.practitionerProgress, practice = p.stage === 'practice', training = p.branches.includes('training'), toTot = needsTot(p), ready = practiceReady(p);
  const names = PRACTICE_AREAS.filter(a => (practice ? p.approvedBranches : p.branches).includes(a.id)).map(a => a.name);
  let body, actions;
  if (practice) {
    body = ui.head({ kicker: 'Practitioner Program · Uygulama aşaması', title: 'Birlikte uygulamaya geçin', sub: names.join(' + ') }) + ui.facts([['Biçim', '4 gün yüz yüze + saha uygulaması']]) +
      ui.p('Örnek başvurunuz seçtiğiniz alanlar için kabul edildi. Kendi alanınızın yöntemlerini deneyimsel öğrenme tasarımına yansıtacağınız ortak uygulama alanına ulaştınız.') + ui.p('Birden fazla ana dal seçtiyseniz saha uygulaması ve raporlama her seçilen dal için ayrıca yapılır.') +
      ui.reflect('Buraya giriş uzmanlık unvanı vermez. Deneyimsel Öğrenme Uzmanı yolundaki yüz yüze çalışma, saha uygulaması ve rapor değerlendirmesi sonraki aşamalardır.');
    actions = position('Practitioner Program', 'Uygulama aşamasındasınız') + back('practice-back', 'Başvuruya dön') + btn('practice-overview', 'Tüm adayı gör', 'secondary') + next('practice-field', 'Saha uygulamasına geç');
  } else {
    body = ui.head({ kicker: 'Practitioner Program · İskele', title: 'Uygulama alanınızı seçin', sub: 'Başvuru ve değerlendirme' }) +
      (p.returnedFromTot ? ui.reflect('ToT tamamlandı. Şimdi yeniden giriş değerlendirmesindesiniz; Training Practice uygunluğu henüz otomatik verilmedi.') : '') +
      ui.p('Bir veya birden fazla ana dal seçebilirsiniz. Seçilen alandaki geçmiş ve kanıtlar girişte ele alınır.') +
      `<fieldset class="choices"><legend>Uygulama alanları</legend>${PRACTICE_AREAS.map(a => `<label class="choice"><input type="checkbox" data-practice="${a.id}" ${p.branches.includes(a.id) ? 'checked' : ''}><span>${a.name}</span></label>`).join('')}</fieldset>` +
      (training ? `<fieldset class="choices"><legend>Training Practice · örnek portfolyo sonucu</legend><label class="choice"><input type="radio" name="training-scenario" value="suitable" ${p.trainingScenario === 'suitable' ? 'checked' : ''}><span><strong>Eğitmenlik altyapısı uygun</strong><small>Portfolyodaki hazırlık uygun bulundu; Training Practice’e ilerleyin.</small></span></label><label class="choice"><input type="radio" name="training-scenario" value="preparation" ${p.trainingScenario === 'preparation' ? 'checked' : ''}><span><strong>Hazırlık gerekiyor</strong><small>ToT’ye gidin; ardından tekrar giriş değerlendirmesine dönün.</small></span></label></fieldset>` : '') +
      ui.notes(ui.open('Gerçek portfolyo ölçütleri. Buradaki sonuçlar örnek değerlendirme senaryosudur.'));
    actions = position(toTot ? 'Tamamlayıcı hazırlık' : names.length ? names.join(' + ') : 'Ana dal seçin', toTot ? 'ToT → yeniden değerlendirme' : training && !p.trainingScenario ? 'Portfolyo senaryosu seçin' : 'Başvuru iskelesi') + back('practice-community', 'Topluluk Adası') + next('practice-continue', toTot ? 'ToT’ye git' : training ? 'Training Practice’e ilerle' : 'Uygulamaya ilerle', !toTot && !ready ? 'disabled' : '');
  }
  showPanel({ label: practice ? 'Practitioner Program uygulama alanı' : 'Practitioner giriş değerlendirmesi', body, actions });
  if (practice) {
    $('practice-back').onclick = () => { state.practitionerProgress = { ...p, stage: 'application' }; save(); renderPractitioner(); focusCourseStep(); };
    $('practice-overview').onclick = () => fly(fitTarget(landBounds('practitioner'), 1));
    $('practice-field').onclick = () => { state.practitionerProgress = startFieldPractice(state.practitionerProgress); save(); renderPractitioner(); };
  } else {
    for (const input of panel.querySelectorAll('[data-practice]')) input.onchange = () => { state.practitionerProgress = choosePracticeArea(state.practitionerProgress, input.dataset.practice, input.checked); save(); renderPractitioner(); };
    for (const input of panel.querySelectorAll('[name="training-scenario"]')) input.onchange = () => { state.practitionerProgress = chooseTrainingScenario(state.practitionerProgress, input.value); save(); renderPractitioner(); };
    $('practice-community').onclick = goToCommunity;
    $('practice-continue').onclick = () => {
      if (needsTot(state.practitionerProgress)) { showMap(); sail('tot'); return; }
      if (!practiceReady(state.practitionerProgress)) return;
      state.practitionerProgress = acceptPracticeInGame(state.practitionerProgress); save(); renderPractitioner(); focusCourseStep();
    };
  }
  renderMapSigns();
}
function renderFieldPractice() {
  const p = state.practitionerProgress, done = p.stage === 'completed', nexts = specialistContinuations(state);
  const areas = PRACTICE_AREAS.filter(a => (done ? p.completedBranches : p.approvedBranches).includes(a.id));
  let body, actions;
  if (done) {
    body = ui.head({ kicker: 'Practitioner Program', title: 'Deneyimsel Öğrenme Uzmanı', status: ui.status('title', 'Uzmanlık aşaması tamamlandı') }) +
      ui.p('Yüz yüze pratik, saha uygulaması ve rapor değerlendirmesi aşamalarını oyun yolculuğunda tamamladınız.') + ui.req(areas.map(a => ({ text: a.name, met: true }))) +
      ui.q('Yolculuğunuzun devamı size bağlı.') + ui.p(`Burada kalabilirsiniz. ${nexts.map(a => a.text).join(' ')}`) +
      ui.reflect(hasFinishedFreire(state) ? 'Freirean Praxis tamamlandı; yeniden yapılması gerekmiyor.' : hasTrainingSpecialist(state) ? 'Training Practice üzerinden uzmanlık tamamlandı. Freirean Praxis için dernek üyeliği ön koşul değildir.' : 'Freirean Praxis için Training Practice üzerinden uzmanlık gerekir. Bu dala ilerlemek isterseniz eğitmenlik altyapınız ayrıca değerlendirilir; gerektiğinde ToT ile hazırlık yapılır.') +
      '<button id="specialist-show-card" type="button" class="button ghost">Unvan kartını gör</button>';
    actions = btn('specialist-stay', 'Adada kal', 'secondary') + nexts.map((a, i) => i === 0 ? next(`specialist-next-${i}`, a.label) : btn(`specialist-next-${i}`, a.label, 'secondary')).join('');
  } else {
    body = ui.head({ kicker: 'Practitioner Program · Saha uygulaması', title: 'Kendi alanınızda uygulayın.', sub: 'Saha uygulaması, rapor ve değerlendirme' }) +
      ui.p('Dört günlük yüz yüze pratiğin ardından, kabul edildiğiniz her ana dalda sahada uygulama yapar ve raporlarsınız. Uzmanlığa geçişte bu kanıtlar değerlendirilir.') +
      `<fieldset class="choices"><legend>Örnek yolculukta saha kanıtları</legend>${areas.map(a => `<div class="branch"><strong>${a.name}</strong><label class="choice"><input type="checkbox" data-field-branch="${a.id}" data-field-key="practice" ${p.fieldEvidence[a.id]?.practice ? 'checked' : ''}><span>Saha uygulamasını tamamladım</span></label><label class="choice"><input type="checkbox" data-field-branch="${a.id}" data-field-key="report" ${p.fieldEvidence[a.id]?.report ? 'checked' : ''}><span>Uygulama raporunu sundum</span></label></div>`).join('')}</fieldset>` +
      `<fieldset class="choices"><label class="choice"><input id="field-review" type="checkbox" ${p.reviewAccepted ? 'checked' : ''} ${fieldEvidenceComplete(p) ? '' : 'disabled'}><span>Saha uygulaması ve raporların olumlu değerlendirilmesini oyunda göster</span></label></fieldset>` +
      ui.notes(ui.open('Saha uygulaması ve rapor değerlendirme ölçütleri.'));
    actions = position('Saha uygulaması', 'Her seçilen ana dal için') + back('field-back', 'Yüz yüze pratiğe dön') + next('field-complete', 'Saha uygulamasını tamamla', canCompleteSpecialist(state) ? '' : 'disabled');
  }
  showPanel({ label: done ? 'Uzmanlık sonrası seçenekler' : 'Saha uygulaması ve raporlama', body, actions });
  if (done) {
    $('specialist-show-card').onclick = () => showAchievement('specialist');
    $('specialist-stay').onclick = () => { setInfo(false); fly(fitTarget(landBounds('practitioner'), 1)); };
    nexts.forEach((a, i) => $(`specialist-next-${i}`).onclick = () => continueJourney(a));
  } else {
    for (const input of panel.querySelectorAll('[data-field-branch]')) input.onchange = () => {
      state.practitionerProgress = setFieldEvidence(state.practitionerProgress, input.dataset.fieldBranch, input.dataset.fieldKey, input.checked); save();
      $('field-review').checked = false; $('field-review').disabled = !fieldEvidenceComplete(state.practitionerProgress); $('field-complete').disabled = !canCompleteSpecialist(state);
    };
    $('field-review').onchange = e => { state.practitionerProgress = { ...state.practitionerProgress, reviewAccepted: fieldEvidenceComplete(state.practitionerProgress) && e.target.checked }; save(); $('field-complete').disabled = !canCompleteSpecialist(state); };
    $('field-back').onclick = () => { state.practitionerProgress = { ...p, stage: 'practice' }; save(); renderPractitioner(); };
    $('field-complete').onclick = () => {
      if (!canCompleteSpecialist(state)) return;
      const was = hasSpecialist(state);
      state = completeSpecialistInGame(state); save(); renderMap(); renderPractitioner();
      if (!was) showAchievement('specialist');
    };
  }
  renderMapSigns();
}
function renderTot() {
  const p = state.totProgress, page = TOT_STOPS[p.step], last = p.step === TOT_STOPS.length - 1;
  const body = ui.head({ kicker: 'Tamamlayıcı öğrenme · 6 gün yüz yüze', title: page.name, sub: `Training of Trainers · ${page.day}` }) +
    ui.segments(p.completedSteps.length, TOT_STOPS.length, p.step, 'ToT ilerlemesi') + ui.segLabel(`${p.completedSteps.length} / ${TOT_STOPS.length} durak tamamlandı`, page.day) +
    (last ? ui.q('Geribildirimden yeniden değerlendirmeye') : '') + ui.p(page.text) +
    ui.reflect('ToT, eğitim yöntemleri ve temel eğitimcilik hazırlığını geliştirir. Training Practice uygunluğu burada verilmez; programdan sonra Practitioner girişinde yeniden değerlendirilir.');
  showPanel({ label: 'Training of Trainers', body, actions: position(`${page.day} · ToT`, `${p.step + 1} / ${TOT_STOPS.length}${p.completedSteps.includes(page.id) ? ' · Tamamlandı' : ''}`) + back('tot-back') + next('tot-next', last ? 'Giriş değerlendirmesine dön' : 'Devam et') });
  $('tot-back').onclick = () => { if (p.step === 0) { showMap(); openCard('tot'); return; } state.totProgress = revisitTot(p, p.step - 1); save(); renderTot(); focusCourseStep(); };
  $('tot-next').onclick = () => {
    state.totProgress = advanceTot(p);
    if (last) {
      if (needsTot(state.practitionerProgress) && !hasTrainingSpecialist(state)) state.practitionerProgress = returnForTrainingReview(state.practitionerProgress);
      save(); showMap();
      if (canEnter('practitioner', state)) sail('practitioner'); else openCard('practitioner');
    } else { save(); renderTot(); focusCourseStep(); }
  };
}

/* --------------------------------------------------------- gates & cards */
function openSpecialistDestination(destination) {
  if (destination === 'membership') { openMembershipGate(); return; }
  if (hasTrainingSpecialist(state)) { openFreireApplication(); return; }
  if (sailing) return;
  if (isIslandMode()) leaveIsland();
  selected = 'freire';
  showPanel({ label: 'Freirean Praxis · Katılım koşulları', focus: true, body: ui.head({ kicker: 'Freirean Praxis', title: 'Praxis’e giden yol', status: ui.status('locked', 'Önce Training Practice') }) +
    ui.p('Freirean Praxis, Training Practice üzerinden uzmanlık tamamlamış kişilere açıktır. Dernek üyeliği giriş koşulu değildir.') +
    ui.req([{ text: 'Deneyimsel Öğrenme Uzmanı olmak', met: hasSpecialist(state) }, { text: 'Training Practice üzerinden uzmanlık', met: false }]) +
    ui.p('Research veya Technology Practice tek başına yeterli olmaz. Eğitmenlik altyapınız girişte değerlendirilir; hazırlık gerekiyorsa ToT’ye yönlendirilirsiniz.'),
    actions: next('freire-prepare', hasSpecialist(state) ? 'Training Practice’e hazırlan' : 'Practitioner koşullarını gör') });
  $('freire-prepare').onclick = () => {
    if (!hasSpecialist(state)) { openCard('practitioner'); return; }
    if (!state.practitionerProgress.branches.includes('training') || state.practitionerProgress.stage === 'completed') state.practitionerProgress = { ...state.practitionerProgress, stage: 'application', branches: ['training'], approvedBranches: [], trainingScenario: null, fieldEvidence: {}, reviewAccepted: false };
    save(); sail('practitioner');
  };
  focusIsland('freire');
}
function openMembershipGate() {
  if (sailing) return;
  if (isIslandMode()) leaveIsland();
  state.current = 'membership-gate';
  state.visitedGates = [...new Set([...state.visitedGates, 'membership-gate'])];
  save(); selected = 'community';
  renderMembershipGate();
  focusIsland('community', boundsToWorld('community', [420, 0, 1200, 520]));
}
function renderMembershipGate() {
  const p = state.membershipApplication, member = hasMembership(state), eligible = hasSpecialist(state), submitted = p.status === 'submitted';
  let body = ui.head({ kicker: 'Membership Gate', title: member ? 'Dernek üyesisiniz' : submitted ? 'Başvurunuz değerlendirmede' : 'Dernek üyeliğine başvurun' }) + ui.timeline(member ? 'approved' : p.status) +
    ui.p(member ? 'Asil üyelik kaydınız oyun yolculuğunda oluştu. Agora’ya, Genel Kurulun ortak karar alanına ilerleyebilirsiniz.' : submitted ? 'Örnek üyelik başvurunuz ve portfolyo kayıtlarınız Yönetim Kurulu değerlendirmesi aşamasına ulaştı.' : 'Deneyimsel Öğrenme Uzmanı unvanı, üyeliğe başvuru yolunu açar. Üyeliğe kabul kararı Yönetim Kuruluna aittir.');
  if (!eligible) body += ui.req([{ text: 'Önce Deneyimsel Öğrenme Uzmanı olmalısınız.', met: false }]);
  else if (!member && !submitted) body += `<fieldset class="choices"><legend>Başvuru hazırlığı</legend><label class="choice"><input type="checkbox" data-membership-check="portfolioReady" ${p.portfolioReady ? 'checked' : ''}><span>Uzmanlık portfolyosu başvuruya hazır</span></label><label class="choice"><input type="checkbox" data-membership-check="communityReady" ${p.communityReady ? 'checked' : ''}><span>Topluluk deneyimleri ve katkı kayıtları hazır</span></label></fieldset>`;
  else if (submitted) body += '<div class="review"><span>Uzmanlık kaydı</span><span>Portfolyo ve topluluk deneyimleri</span><strong>Yönetim Kurulu kararı bekleniyor</strong></div>';
  body += ui.notes(!member ? ui.open('Puan eşikleri ve portfolyo değerlendirme ölçütleri.') : '', ui.source('ELA Tüzüğü, md. 4.2–4.3, 8 ve 11.1.'));
  showPanel({ label: 'Membership Gate · Üyelik başvurusu', focus: true, body, actions: next('membership-action', !eligible ? 'Uzmanlık yolunu gör' : member ? 'Agora’ya git' : submitted ? 'Yönetim Kurulu kabulünü oyunda göster' : 'Başvuruyu oyunda gönder', eligible && !member && !submitted && !membershipReady(state) ? 'disabled' : '') });
  for (const input of panel.querySelectorAll('[data-membership-check]')) input.onchange = () => { state.membershipApplication = { ...state.membershipApplication, [input.dataset.membershipCheck]: input.checked }; save(); $('membership-action').disabled = !membershipReady(state); };
  $('membership-action').onclick = () => {
    if (!eligible) { openCard('practitioner'); return; }
    if (member) { showMap(); sail('agora'); return; }
    if (!submitted) { state = submitMembershipInGame(state); save(); renderMembershipGate(); return; }
    const before = hasMembership(state);
    state = approveMembershipInGame(state); save();
    if (!before && hasMembership(state)) { showMap(); sail('agora').then(() => { if (state.current === 'agora') showAchievement('membership'); }); }
  };
}
function openFreireApplication() {
  if (sailing) return;
  if (!hasTrainingSpecialist(state)) { openSpecialistDestination('freire'); return; }
  if (isIslandMode()) leaveIsland();
  selected = 'freire'; renderFreireApplication(); focusIsland('freire');
}
function renderFreireApplication() {
  const p = state.freireApplication, { done, approved, submitted, title, next: after } = freireEntryPresentation(state);
  if (done) {
    showPanel({ label: 'Freirean Praxis · Tamamlandı', focus: true, body: ui.head({ kicker: 'Freirean Praxis', title, status: ui.status('done', 'Tamamlandı') }) + ui.p('Bu deneyim yolculuğunuza kayıtlı. Tekrar başvurmanız veya programı yeniden tamamlamanız gerekmiyor.') + ui.p(after.text),
      actions: btn('praxis-revisit', 'Adayı yeniden ziyaret et', 'secondary') + next('praxis-completed-next', after.label) });
    $('praxis-completed-next').onclick = () => continueJourney(after);
    $('praxis-revisit').onclick = () => sail('freire');
    return;
  }
  let body = ui.head({ kicker: 'Freirean Praxis', title }) + ui.timeline(p.status) + ui.p('Training Practice üzerinden uzmanlık tamamladınız. Freirean Praxis’e dernek üyesi olmadan da katılabilirsiniz.') +
    ui.req([{ text: 'Training Practice üzerinden uzmanlık', met: true }, { text: 'Dernek üyeliği ön koşul değildir', met: true }]);
  if (!approved && !submitted) body += '<fieldset class="choices"><legend>Örnek başvuru</legend><label class="choice"><input id="freire-portfolio" type="checkbox" ' + (p.portfolioReady ? 'checked' : '') + '><span>Training Practice portfolyosunu başvuruya hazır olarak göster</span></label></fieldset>';
  else if (submitted) body += '<div class="review"><span>Training Practice kaydı</span><span>Örnek portfolyo</span><strong>Başvuru değerlendirmesi</strong></div>';
  body += ui.notes(ui.open('Gerçek başvuru ve değerlendirme ölçütleri.'));
  showPanel({ label: 'Freirean Praxis · Başvuru', focus: true, body, actions: next('freire-application-action', approved ? 'Freirean Praxis Adası’na git' : submitted ? 'Kabulü oyunda göster ve adaya git' : 'Başvuruyu oyunda gönder', !approved && !submitted && !p.portfolioReady ? 'disabled' : '') });
  if ($('freire-portfolio')) $('freire-portfolio').onchange = e => { state.freireApplication = { ...state.freireApplication, portfolioReady: e.target.checked }; save(); $('freire-application-action').disabled = !e.target.checked; };
  $('freire-application-action').onclick = () => {
    if (approved) { sail('freire'); return; }
    if (!submitted) { state = submitFreireInGame(state); save(); renderFreireApplication(); return; }
    state = approveFreireInGame(state); save();
    if (state.freireApplication.status === 'approved') sail('freire');
  };
}
function qualificationRequirements() {
  return [
    { text: 'Resmî dernek üyeliği', met: hasMembership(state), go: openMembershipGate },
    { text: 'Training Practice üzerinden uzmanlık', met: hasTrainingSpecialist(state), go: () => openSpecialistDestination('freire') },
    { text: 'Freirean Praxis deneyimi', met: hasCompletedIsland('freire', state), go: () => openSpecialistDestination('freire') }
  ];
}
const qualificationEvidence = (kind, p) => `<fieldset class="choices"><legend>Örnek kanıt dosyası</legend>${(kind === 'master' ? MASTER_EVIDENCE : TRAINER_EVIDENCE).map(item => `<label class="choice"><input type="checkbox" data-qualification="${kind}" data-evidence="${item.id}" ${p.evidence[item.id] ? 'checked' : ''}><span><strong>${item.name}</strong><small>${item.text}</small></span></label>`).join('')}</fieldset>`;
const qualificationReview = kind => `<div class="review">${(kind === 'master' ? MASTER_EVIDENCE : TRAINER_EVIDENCE).map(item => `<span>${item.name}</span>`).join('')}<strong>Kanıtlar için örnek yeterlilik değerlendirmesi</strong></div>` +
  ui.p('Önerilen değerlendirme yöntemleri: ' + (kind === 'master' ? 'portfolyo incelemesi, uygulama ve mentorluk gözlemi, üretimlerin akran değerlendirmesi, dernek katkıları ve değerlendirme görüşmesi.' : 'eğitim uygulamasının gözlenmesi, portfolyo ve öğrenen çalışmalarının incelenmesi, dernek katkıları ve değerlendirme görüşmesi.'));
const qualificationNotes = () => ui.notes(ui.open('Puan/kredi eşikleri, rubrik, değerlendirici yetkisi, nihai karar süreci ve unvanın yenilenmesi (revalidation).'), ui.source('ELA Topluluk, Yetkinlik ve Yeterlilik Çerçevesi, çalışma taslağı 0.1 (17 Ekim 2026), §2–5.'));
function bindQualificationChecks(kind, button) {
  for (const input of panel.querySelectorAll('[data-qualification]')) input.onchange = () => { state = setQualificationEvidence(state, kind, input.dataset.evidence, input.checked); save(); button.disabled = !qualificationReady(state, kind); };
}
function openTrainerGate() {
  if (sailing) return;
  if (isIslandMode()) leaveIsland();
  state.current = 'trainer-gate';
  state.visitedGates = [...new Set([...state.visitedGates, 'trainer-gate'])];
  save(); selected = 'trainers';
  renderTrainerGate(); focusIsland('trainers');
}
function renderTrainerGate() {
  const p = state.trainerApplication, awarded = hasTrainer(state), eligible = trainerPrerequisites(state), submitted = p.status === 'submitted', reqs = qualificationRequirements();
  let body = ui.head({ kicker: 'Experiential Learning Trainer · Yeterlilik', title: awarded ? 'Eğitmenlik yolunuz açık' : submitted ? 'Kanıtlarınız değerlendirmede' : 'Eğitmenlik yeterliliğine başvurun', status: !eligible && !awarded ? ui.status('locked', 'Ön koşullar var') : '' }) + ui.timeline(awarded ? 'approved' : p.status) +
    ui.p(awarded ? 'Deneyimsel Öğrenme Eğitmeni unvanınız oyun yolculuğunda kayıtlı. Trainers Adası, sürekli uygulama ve ortak gelişim alanınızdır.' : submitted ? 'Başvuru, program mezuniyetinden ayrı bir yeterlilik değerlendirmesine ulaştı. Olumlu sonuç bu oyunda ayrıca gösterilir.' : 'Bu aşama yeni bir kurs değildir. Deneyimsel öğrenmeyi başkalarına öğretme ve onların uygulama gelişimini destekleme yeterliliği, kanıtlarla değerlendirilir.') +
    ui.req(reqs);
  if (!awarded) body += !eligible ? ui.p('Eksik aşamaya dönebilirsiniz. Tamamladığınız uzmanlık, üyelik ve Praxis kayıtları korunur.') : submitted ? qualificationReview('trainer') : qualificationEvidence('trainer', p);
  body += qualificationNotes();
  showPanel({ label: 'Eğitmenlik · Başvuru ve değerlendirme', focus: true, body, actions: next('trainer-application-action', awarded ? 'Trainers Adası’na git' : !eligible ? 'Önce: ' + reqs.find(r => !r.met).text : submitted ? 'Olumlu yeterlilik kararını oyunda göster' : 'Başvuruyu oyunda gönder', eligible && !awarded && !submitted && !qualificationReady(state, 'trainer') ? 'disabled' : '') });
  bindQualificationChecks('trainer', $('trainer-application-action'));
  $('trainer-application-action').onclick = () => {
    if (!eligible) { reqs.find(r => !r.met).go(); return; }
    if (awarded) { sail('trainers'); return; }
    if (!submitted) { state = submitQualificationInGame(state, 'trainer'); save(); renderTrainerGate(); return; }
    state = approveQualificationInGame(state, 'trainer'); save();
    if (hasTrainer(state)) { showMap(); sail('trainers').then(() => { if (state.current === 'trainers') showAchievement('trainer'); }); }
  };
}
function renderTrainers() {
  if (!canEnter('trainers', state)) { openTrainerGate(); return; }
  if (hasMaster(state) || state.trainerProgress.view === 'master') return renderMasterQualification();
  const p = state.trainerProgress, page = TRAINER_STOPS[p.step], last = p.step === TRAINER_STOPS.length - 1;
  const body = ui.head({ kicker: 'Experiential Learning Trainers · Sürekli uygulama', title: page.name, status: ui.status('title', hasMaster(state) ? 'Deneyimsel Öğrenme Master Eğitmeni' : 'Deneyimsel Öğrenme Eğitmeni') }) +
    ui.segments(p.step, TRAINER_STOPS.length, p.step, 'Adanın uygulama alanları') + ui.segLabel('Adanın uygulama alanları', `${p.step + 1} / ${TRAINER_STOPS.length}`) +
    ui.q(page.question) + ui.p(page.text) + ui.reflect(page.connection) +
    ui.notes('<p class="note">Bu mekânlar ayrı kurslar, kesinleşmiş krediler veya zorunlu bir Master ders sırası değildir.</p>');
  showPanel({ label: 'Experiential Learning Trainers', body, actions: position(last ? 'Master Trainer alanı' : 'Eğitmenlerin ortak adası', hasMaster(state) ? 'Master unvanınız kayıtlı' : last ? 'Ayrı yeterlilik değerlendirmesi' : `${p.step + 1} / ${TRAINER_STOPS.length}`) + back('trainer-back', p.step === 0 ? 'Topluluğa dön' : 'Geri') + next('trainer-next', last ? (hasMaster(state) ? 'Master unvan kaydını gör' : 'Master Trainer koşullarını gör') : 'Devam et') });
  $('trainer-back').onclick = () => { if (p.step === 0) { goToCommunity(); return; } state.trainerProgress = revisitTrainer(p, p.step - 1); save(); renderTrainers(); focusCourseStep(); };
  $('trainer-next').onclick = () => { state.trainerProgress = advanceTrainer(p); if (last) state.trainerProgress = { ...state.trainerProgress, view: 'master' }; save(); renderTrainers(); focusCourseStep(); };
  renderMapSigns();
}
function renderMasterQualification() {
  const p = state.masterApplication, awarded = hasMaster(state), submitted = p.status === 'submitted';
  let body = ui.head({ kicker: 'Master Trainer · Aynı ada, deneyim ve katkı', title: awarded ? 'Master Eğitmen unvanınız kayıtlı.' : submitted ? 'Deneyim kanıtlarınız değerlendirmede.' : 'Deneyiminizi kanıtlarla buluşturun.' }) + ui.timeline(awarded ? 'approved' : p.status) +
    ui.p(awarded ? 'Oyun yolculuğunda Master Trainer yeterliliği tanındı. Aynı adada eğitim, mentorluk ve ortak üretime devam edersiniz. Bu düzey akademik yüksek lisans denkliği veya kendiliğinden değerlendirici yetkisi vermez.' : 'Master Trainer, yeni bir kurs veya ayrı bir gate değildir. Farklı bağlamlarda uygulama, eğitmen gelişimi ve alana katkı yeterliliğinin tanınmasıdır. Unvan, bu tepeye gelmekle otomatik kazanılmaz.');
  body += awarded ? ui.reflect('Güncel uygulama, eğitmen gelişimi, alana katkı ve dernek katkısı unvanın sürdürülmesinde ele alınır.') + ui.notes(ui.open('Unvan yenileme sıklığı ve kanıt güncellik aralığı.')) : (submitted ? qualificationReview('master') : qualificationEvidence('master', p)) + qualificationNotes();
  if (awarded) {
    showPanel({ label: 'Master Trainer', body, actions: btn('master-stay', 'Adada kal', 'secondary') + btn('master-card', 'Unvan kartını gör', 'secondary') + next('master-community', 'Topluluk Adası’na git') });
    $('master-stay').onclick = () => { setInfo(false); fly(fitTarget(landBounds('trainers'), 1)); };
    $('master-card').onclick = () => showAchievement('master-trainer');
    $('master-community').onclick = goToCommunity;
    renderMapSigns(); return;
  }
  showPanel({ label: 'Master Trainer · Yeterlilik', body, actions: position('Master Trainer', submitted ? 'Yeterlilik değerlendirmesi' : 'Deneyim ve kanıt dosyası') + back('master-back', 'Ada yolculuğuna dön') + next('master-action', submitted ? 'Olumlu kararı oyunda göster' : 'Başvuruyu oyunda gönder', !submitted && !qualificationReady(state, 'master') ? 'disabled' : '') });
  $('master-back').onclick = () => { state.trainerProgress = { ...state.trainerProgress, view: 'tour' }; save(); renderTrainers(); focusCourseStep(); };
  bindQualificationChecks('master', $('master-action'));
  $('master-action').onclick = () => {
    if (!submitted) { state = submitQualificationInGame(state, 'master'); save(); renderMasterQualification(); return; }
    state = approveQualificationInGame(state, 'master'); save(); renderMasterQualification();
    if (hasMaster(state)) showAchievement('master-trainer');
  };
  renderMapSigns();
}
function renderAgora() {
  if (!hasMembership(state)) { showMap(); openMembershipGate(); return; }
  const after = academicContinuation(state);
  const body = ui.head({ kicker: 'Agora · Dernek asil üyeleri', title: 'Genel Kurulun bir üyesisiniz.', status: ui.status('done', 'Üyeliğe kabul edildiniz') }) +
    ui.q('Derneğin en yetkili karar organına hoş geldiniz.') + ui.p('Genel Kurul, derneğe kayıtlı asil üyelerden oluşur. Agora, bu ortak karar alanını temsil eder.') +
    ui.p('Uzmanlık ve ayrı bir üyelik başvurusuyla bu statüye ulaştınız. Üyelik, öğrenme programlarından ayrı bir Yönetim Kurulu kabulüne dayanır.') +
    ui.reflect('Dernek üyesi olmak, deneyimsel öğrenme eğitmeni olmak anlamına gelmez. Eğitimcilik yoluna ilerlemek isteğe bağlıdır ve kendi yeterlilik koşullarına sahiptir.') +
    ui.p(after.text) + ui.notes(ui.source('ELA Tüzüğü, md. 4.2–4.3, 8, 11.1.'));
  showPanel({ label: 'Agora · Genel Kurul', body, actions: back('agora-community', 'Topluluk Adası') + next('agora-continue', after.label) });
  $('agora-community').onclick = goToCommunity;
  $('agora-continue').onclick = () => continueJourney(after);
}
function renderFreire() {
  if (!hasTrainingSpecialist(state) || (!hasFinishedFreire(state) && state.freireApplication.status !== 'approved')) { showMap(); openSpecialistDestination('freire'); return; }
  const p = state.freireProgress, page = FREIRE_STEPS[p.step], last = p.step === FREIRE_STEPS.length - 1, after = academicContinuation(state);
  const body = ui.head({ kicker: 'Freirean Praxis · Diyalog, yansıtma, eylem', title: page.name, status: p.finished && last ? ui.status('done', 'Praxis deneyimi kaydedildi') : '' }) +
    ui.segments(p.completedSteps.length, FREIRE_STEPS.length, p.step, 'Freirean Praxis ilerlemesi') + ui.segLabel(`${p.completedSteps.length} / ${FREIRE_STEPS.length} adım tamamlandı`, `${p.step + 1} / ${FREIRE_STEPS.length}`) +
    ui.q(page.question) + ui.p(page.text) + ui.reflect(page.connection);
  const actions = p.finished && last ? back('praxis-back') + btn('praxis-stay', 'Adada kal', 'secondary') + next('praxis-destination', after.label) : position(page.name, `${p.step + 1} / ${FREIRE_STEPS.length}${p.completedSteps.includes(page.id) ? ' · Tamamlandı' : ''}`) + back('praxis-back') + next('praxis-next', last ? 'Praxis yolculuğunu tamamla' : 'Devam et');
  showPanel({ label: 'Freirean Praxis', body, actions });
  $('praxis-back').onclick = () => { if (p.step === 0) { showMap(); openFreireApplication(); return; } state.freireProgress = revisitFreire(p, p.step - 1); save(); renderFreire(); focusCourseStep(); };
  if ($('praxis-next')) $('praxis-next').onclick = () => {
    if (last) { if (!freireReadyToFinish(p)) return; state.freireProgress = finishFreire(p); state.completed = [...new Set([...state.completed, 'freire'])]; save(); renderFreire(); renderMap(); if (!p.finished) showAchievement('praxis'); }
    else { state.freireProgress = advanceFreire(p); save(); renderFreire(); focusCourseStep(); }
  };
  if ($('praxis-stay')) $('praxis-stay').onclick = () => { setInfo(false); fly(fitTarget(landBounds('freire'), 1)); };
  if ($('praxis-destination')) $('praxis-destination').onclick = () => continueJourney(after);
  renderMapSigns();
}
function renderVolunteerGate() {
  const body = ui.head({ kicker: 'Topluluk yoluna giriş', title: 'Volunteer Gate' }) + ui.p('Community Island’ın girişindesiniz. Oryantasyonla derneği ve gönüllülük çerçevesini tanıyın.') +
    ui.section('Giriş koşulu', ui.req([{ text: `${hasCompletedIsland('foundations', state) ? 'Experiential Learning Foundations' : 'Certificate Program'} tamamlandı.`, met: true }])) +
    ui.section('Sonraki adım: Volunteer Orientation', ui.p('Kendi hızınızda tamamlayacağınız mikro programın ardından topluluk üyeliğine ilerleyebilirsiniz.'));
  showPanel({ label: 'Volunteer Gate', body, actions: back('gate-back') + next('gate-orientation', state.orientationProgress.completedSteps.length ? 'Oryantasyona devam et' : 'Oryantasyona başla') });
  $('gate-back').onclick = () => showMap({ overview: true });
  $('gate-orientation').onclick = startOrientation;
}
function startOrientation() { if (!mayVisitVolunteerGate(state)) return; state.current = 'orientation'; save(); showArrival('orientation'); }
function goToCommunity() { if (hasCommunityMembership(state)) { showMap(); sail('community'); } else openVolunteerGate(); }
function openVolunteerGate() {
  if (sailing) return;
  if (!mayVisitVolunteerGate(state)) { showMap(); openCard('community'); return; }
  if (hasCommunityMembership(state)) { showMap(); sail('community'); return; }
  if (state.current === 'volunteer-gate') { renderVolunteerGate(); return; }
  showMap();
  state.visitedGates = [...new Set([...state.visitedGates, 'volunteer-gate'])];
  save(); sail('volunteer-gate');
}

/* ----------------------------------------------------------- camera focus */
function stepBounds() {
  const c = state.current;
  if (c === 'trainers') return TRAINER_STOPS[state.trainerProgress.view === 'master' ? 6 : state.trainerProgress.step].bounds;
  if (c === 'agora') return [555, 0, 1075, 250];
  if (c === 'freire') return FREIRE_STEPS[state.freireProgress.step].bounds;
  if (c === 'practitioner') return ['practice', 'field', 'completed'].includes(state.practitionerProgress.stage) ? PRACTITIONER_CIRCLE_BOUNDS : PRACTITIONER_GATE_BOUNDS;
  if (c === 'tot') return TOT_STOPS[state.totProgress.step].bounds;
  if (c === 'community') return state.communityProgress.freeExplore ? ((COMMUNITY_STOPS.find(s => s.id === communityDetail) || { bounds: COMMUNITY_OVERVIEW_BOUNDS }).bounds) : COMMUNITY_STOPS[state.communityProgress.step].bounds;
  if (c === 'volunteer-gate' || c === 'orientation') return COMMUNITY_BOUNDS;
  if (c === 'foundations') return foundationPage(state.foundationsProgress).bounds;
  return certificateCameraBounds(certificateDisplayPage(state.certificateProgress, certificateScene));
}
function focusCourseStep(override = null, opts = {}) {
  if (!isIslandMode()) return;
  const isle = isleOf(state.current);
  fly(fitTarget(boundsToWorld(isle, override || stepBounds()), 1.1), opts);
}
function drawCoursePaths() {
  const overlay = $('route-overlay'), p = state.certificateProgress;
  if (state.current !== 'certificate' || certificateScene === 'welcome') { overlay.setAttribute('hidden', ''); overlay.innerHTML = ''; delete overlay.dataset.sceneKey; $('focus-layer').hidden = true; return; }
  overlay.removeAttribute('hidden');
  const page = signDetail === 'journal' ? signsFor('certificate').find(s => s.id === 'journal').page : certificateDisplayPage(p, certificateScene), [tx, ty] = page.route.target;
  paintCertificateFocus($('focus-layer'), $('isle-img-certificate'), page);
  const activeIds = certificateFocus(page)?.ids, paths = visiblePaths(p), key = [activeIds?.join(','), paths.map(s => s.id).join(','), tx, ty].join('|');
  if (overlay.dataset.sceneKey === key) {
    for (const g of overlay.querySelectorAll('.learning-path')) { const cur = g.dataset.route === page.id; g.classList.toggle('current', cur); g.classList.toggle('previous', !cur); const s = g.querySelectorAll('path'); s[0].setAttribute('stroke-width', cur ? 9 : 7); s[1].setAttribute('stroke-width', cur ? 5 : 4); }
    return;
  }
  overlay.dataset.sceneKey = key;
  const masks = signsFor('certificate').filter(s => !activeIds || activeIds.includes(s.id)).map(s => { const [x, y, x2, y2] = s.rect; return `<rect x="${x}" y="${y}" width="${x2 - x}" height="${y2 - y}" rx="4" fill="black"/>`; }).join('');
  overlay.innerHTML = `<defs><mask id="route-signs-mask"><rect width="1536" height="1024" fill="white"/>${masks}</mask></defs><g mask="url(#route-signs-mask)">` + paths.map(s => { const cur = s.id === page.id; return `<g class="learning-path ${cur ? 'current' : 'previous'}" data-route="${s.id}"><path d="${s.path}" fill="none" stroke="#153d47" stroke-width="${cur ? 9 : 7}" stroke-opacity=".85" vector-effect="non-scaling-stroke"/><path d="${s.path}" fill="none" stroke="${s.color}" stroke-width="${cur ? 5 : 4}" vector-effect="non-scaling-stroke"/><circle cx="${s.point[0]}" cy="${s.point[1]}" r="8" fill="${s.color}" stroke="#fff9de" stroke-width="3"/></g>`; }).join('') + `<circle cx="${tx}" cy="${ty}" r="11" fill="#fff7d7" stroke="#27645a" stroke-width="3"/><circle cx="${tx}" cy="${ty}" r="5" fill="#e9ad3e"/></g>`;
}

/* ----------------------------------------------------------- achievements */
function showAchievement(kind) {
  const roles = { certificate: 'Deneyimsel Öğrenme Sertifika Programı’nı', trainer: 'Deneyimsel Öğrenme Eğitmeni', 'master-trainer': 'Deneyimsel Öğrenme Master Eğitmeni', membership: 'Dernek Üyesi', praxis: 'Freirean Praxis', community: 'Topluluk Üyesi', facilitator: 'Topluluk Kolaylaştırıcısı', specialist: 'Deneyimsel Öğrenme Uzmanı' };
  const descriptions = {
    certificate: 'My Practice Journal gönderiminiz ve değerlendirmesi tamamlandı. Programa katılım belgeniz yolculuğunuza kaydedildi. Bu belge mesleki bir unvan vermez.',
    trainer: 'Yeterlilik başvurunuz ve kanıtlarınız ayrı değerlendirildi. Artık Trainers Adası’nda deneyimsel öğrenmeyi öğretme, birlikte uygulama ve eğitmen gelişimini destekleme alanına katılıyorsunuz.',
    'master-trainer': 'Farklı bağlamlarda uygulama, eğitmen gelişimi ve alana katkı kanıtlarının değerlendirilmesini tamamladınız. Aynı adada uygulamaya ve katkıya devam edebilirsiniz.',
    membership: 'Başvurunuz kabul edildi. Artık derneğin en yetkili karar organı olan Genel Kurulun bir üyesisiniz. Agora, asil üyelerin ortak karar alanıdır.',
    praxis: 'Diyalog, ortak sorgulama, yansıtma ve eylem arasındaki bağlantıları keşfettiniz. Freirean Praxis deneyiminiz yolculuğunuza eklendi.',
    community: 'Gönüllü oryantasyonunu tamamladınız. Artık birlikte öğrenen ve katkı sunan topluluğun bir parçasısınız.',
    facilitator: 'Katılım, katkı ve üretim deneyimlerinizi kanıtlarıyla buluşturdunuz. Ortak öğrenmeyi kolaylaştırma yolunuz açıldı.',
    specialist: 'Yüz yüze pratik, saha uygulaması ve rapor değerlendirmesini tamamladınız. Kendi alanınızdaki pratiğinizi yeni bir aşamaya taşıdınız.'
  };
  $('achievement-title').innerHTML = `<span class="congrats">Tebrikler!</span><span class="role">${roles[kind]}</span><span class="suffix">${kind === 'certificate' ? 'tamamladınız.' : kind === 'praxis' ? 'deneyimini tamamladınız.' : 'oldunuz.'}</span>`;
  $('achievement-description').textContent = descriptions[kind];
  const routes = kind === 'certificate' ? [{ title: hasCommunityMembership(state) ? 'Topluluğa dön' : 'Volunteer Gate’e git', text: 'Topluluk yolculuğunuza devam edin.', icon: 'community', meta: 'Topluluk', action: goToCommunity }, { ...academicContinuation(state), title: academicContinuation(state).label, action: () => continueJourney(academicContinuation(state)) }]
    : kind === 'trainer' ? [{ title: 'Trainers Adası’nı keşfedin', text: 'Öğretme, ortak uygulama, paylaşım ve mentorluk alanlarını görün.', icon: 'practice', meta: 'Sürekli uygulama', action: () => {} }]
    : kind === 'master-trainer' ? [{ title: 'Topluluk Adası’na git', text: 'Topluluğun ortak öğrenme ve katkı alanına dönün.', icon: 'community', meta: 'Topluluk Adası', action: goToCommunity }]
    : kind === 'membership' ? [{ title: 'Agora’yı tanıyın', text: 'Genel Kurulun ortak karar alanını ve üyelik statünüzü keşfedin.', icon: 'membership', meta: 'Genel Kurul', action: () => {} }]
    : kind === 'praxis' ? [{ ...academicContinuation(state), title: academicContinuation(state).label, action: () => continueJourney(academicContinuation(state)) }]
    : kind === 'specialist' ? specialistContinuations(state).map(a => ({ ...a, title: a.label, action: () => continueJourney(a) }))
    : [{ title: 'Topluluğu keşfet', text: 'Ortak bahçede buluşun, öğrenin ve katkı sunun.', icon: 'community', meta: 'Topluluk Adası', action: () => {} }];
  const meta = m => m || '';
  $('achievement-next-title').textContent = kind === 'membership' ? 'Ortak karar alanınıza hoş geldiniz.' : kind === 'community' ? 'Birlikte öğrenmeye yer açın.' : 'Şimdi hangi rotaya açılmak istersiniz?';
  $('achievement-actions').replaceChildren(...routes.map(r => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'route-card';
    b.innerHTML = `<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24">${ICON[r.icon] || ICON.practice}</svg></span><span><small>${esc(meta(r.meta))}</small><b>${esc(r.title)}</b><span class="t">${esc(r.text)}</span></span>`;
    b.onclick = () => { $('achievement').close(); r.action(); };
    return b;
  }));
  const stay = document.createElement('button'); stay.type = 'button'; stay.className = 'button ghost';
  stay.textContent = kind === 'membership' ? 'Agora’da kal' : ['praxis', 'trainer', 'master-trainer'].includes(kind) ? 'Adada kal' : kind === 'specialist' ? 'Şimdilik bu aşamada kal' : 'Burada kal';
  stay.onclick = () => $('achievement').close();
  $('achievement-stay').replaceChildren(stay);
  if (!$('achievement').open) $('achievement').showModal();
  $('achievement-close').focus({ preventScroll: true });
}
$('achievement-close').onclick = () => $('achievement').close();

function continueJourney(action) {
  if (action.id === 'membership') { openMembershipGate(); return; }
  if (action.id === 'agora') { showMap(); sail('agora'); return; }
  if (['trainer-qualification', 'trainers'].includes(action.id)) { openTrainerGate(); return; }
  if (['freire', 'training-practice'].includes(action.id)) { openSpecialistDestination('freire'); return; }
  if (action.id === 'practitioner') { openPractitionerInfo(); return; }
  showMap(); openCard(action.id);
}

/* ---------------------------------------------------------------- logbook */
function renderJourney() {
  const snap = journeySnapshot(state);
  const row = (r, done) => `<li class="lb-item ${done ? 'done' : r.current ? 'on' : ''}"><span class="dot" aria-hidden="true">${done ? '✓' : r.current ? '●' : '•'}</span><div><b>${r.name}</b><small>${done ? 'Tamamlandı' : r.current ? 'Buradasınız' : 'Başlandı'}${!done && r.total ? ` · ${r.count} / ${r.total} adım` : ''}</small></div></li>`;
  const gate = (mark, title, small, cls = '') => `<li class="lb-item ${cls}"><span class="dot" aria-hidden="true">${mark}</span><div><b>${title}</b><small>${small}</small></div></li>`;
  const extras = [
    snap.volunteer ? gate('◇', 'Volunteer Gate', snap.atVolunteer ? 'Başvuru adımındasınız' : 'Ziyaret edildi') : '',
    snap.orientation.started ? gate(snap.orientation.done ? '✓' : '◌', 'Volunteer Orientation', snap.orientation.done ? 'Tamamlandı · Topluluk yolu açık' : `${snap.orientation.count} / 3 adım tamamlandı`, snap.orientation.done ? 'done' : '') : '',
    snap.communityMember ? gate('✓', 'Topluluk üyesi', 'Derneğin gönüllüsü · resmî dernek üyeliğinden ayrı', 'done') : '',
    snap.associationMember ? gate('✓', 'Dernek asil üyesi', 'Agora · Genel Kurul', 'done') : ''
  ].join('');
  const bar = JOURNEY_ISLANDS.map(i => `<i class="${snap.completed.some(r => r.id === i.id) ? 'done' : snap.ongoing.some(r => r.id === i.id) ? 'on' : ''}"></i>`).join('');
  $('logbook-journey').innerHTML = `<div class="lb-summary"><strong>${snap.completed.length}</strong><span>/ ${snap.totalIslands} ada tamamlandı</span></div><div class="lb-bar" aria-hidden="true">${bar}</div>
<h3 class="lb-h">Tamamlanan adalar</h3>${snap.completed.length ? `<ol class="lb-list">${snap.completed.map(r => row(r, true)).join('')}</ol>` : '<p class="lb-empty">İlk adanızı keşfetmeye başlayın.</p>'}
${snap.ongoing.length ? `<h3 class="lb-h">Devam eden adalar</h3><ol class="lb-list">${snap.ongoing.map(r => row(r, false)).join('')}</ol>` : ''}
${extras ? `<h3 class="lb-h">Kapılar ve üyelikler</h3><ol class="lb-list">${extras}</ol>` : ''}
<h3 class="lb-h">Kazandığım unvanlar</h3>${snap.awards.length ? snap.awards.map(a => `<div class="lb-award">${ICON.star}${a.name}</div>`).join('') : '<p class="lb-empty">Henüz unvan kazanılmadı.</p>'}`;
  if (logbookOpen && logbookTab === 'structure') renderStructureTab();
}
function renderStructureTab() {
  $('logbook-structure').innerHTML = renderStructure(state);
  for (const b of $('logbook-structure').querySelectorAll('[data-structure]')) b.onclick = () => {
    const id = b.dataset.structure;
    if (desktop() === false) setLogbook(false);
    if (['foundations', 'certificate', 'community', 'practitioner', 'tot', 'freire'].includes(id)) { if (isIslandMode()) leaveIsland(); openCard(id); }
    else if (id === 'volunteer-gate' || id === 'orientation') { if (mayVisitVolunteerGate(state)) openVolunteerGate(); else { if (isIslandMode()) leaveIsland(); openCard('community'); } }
    else if (id === 'membership-gate' || id === 'agora') goAgora();
    else openTrainerGate();
  };
}
function setLogbook(open, tab) {
  logbookOpen = open;
  if (tab) logbookTab = tab;
  $('logbook').hidden = !open;
  $('logbook-open').setAttribute('aria-expanded', String(open));
  for (const [t, id] of [['journey', 'tab-journey'], ['structure', 'tab-structure']]) { const on = logbookTab === t; $(id).setAttribute('aria-selected', String(on)); $(id).tabIndex = on ? 0 : -1; $('logbook-' + t).hidden = !on; }
  if (open) { renderJourney(); if (logbookTab === 'structure') renderStructureTab(); $('logbook-close').focus({ preventScroll: true }); }
  else $('logbook-open').focus({ preventScroll: true });
  if (desktop()) refocus();
}
$('logbook-open').onclick = () => setLogbook(!logbookOpen);
$('logbook-close').onclick = () => setLogbook(false);
$('tab-journey').onclick = () => setLogbook(true, 'journey');
$('tab-structure').onclick = () => setLogbook(true, 'structure');
document.querySelector('.tabs').addEventListener('keydown', e => { if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); setLogbook(true, logbookTab === 'journey' ? 'structure' : 'journey'); $(logbookTab === 'journey' ? 'tab-journey' : 'tab-structure').focus(); } });

/* -------------------------------------------------- welcome, menu, dialogs */
function renderSwatches() {
  paintBoat();
  $('swatches').replaceChildren(...COLORS.map(c => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'swatch'; b.setAttribute('role', 'radio');
    b.style.setProperty('--swatch', c.hex); b.textContent = c.name; b.setAttribute('aria-checked', String(c.hex === state.color));
    b.onclick = () => { state.color = c.hex; renderSwatches(); if (state.started) save(); $('swatches').querySelector('[aria-checked=true]').focus(); };
    return b;
  }));
}
function showWelcome(editing = false) {
  colorEditing = editing;
  $('welcome-title').innerHTML = editing ? 'Yelkeninize<br>yeni bir renk.' : 'Yolculuk sizin.<br>Teknenizi seçin.';
  $('start').textContent = editing ? 'Yolculuğa dön' : state.started ? 'Yolculuğa devam et' : 'Evrene açıl';
  $('welcome-note').hidden = editing; $('welcome-lead').hidden = editing;
  renderSwatches();
  if (!$('welcome').open) $('welcome').showModal();
  setTimeout(() => $('swatches').querySelector('[aria-checked=true]')?.focus(), 40);
}
$('start').onclick = () => {
  const fresh = !state.started;
  state.started = true; save();
  $('welcome').close();
  renderMap();
  if (fresh) openUniverseIntroduction();
};
$('welcome').addEventListener('cancel', e => { if (!state.started) e.preventDefault(); });
function setMenu(open) {
  $('menu').hidden = !open; $('menu-open').setAttribute('aria-expanded', String(open));
  if (open) $('menu').querySelector('button').focus();
}
$('menu-open').onclick = e => { e.stopPropagation(); setMenu($('menu').hidden); };
document.addEventListener('click', e => { if (!$('menu').hidden && !$('menu').contains(e.target)) setMenu(false); });
$('menu').addEventListener('keydown', e => {
  const items = [...$('menu').querySelectorAll('button')], i = items.indexOf(document.activeElement);
  if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
  if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
});
$('menu-boat').onclick = () => { setMenu(false); if (!sailing) showWelcome(true); };
$('menu-motion').onclick = () => setMotion(!motionEnabled());
function paintMotion(on) { $('menu-motion').setAttribute('aria-checked', String(on)); $('menu-motion-state').textContent = on ? 'Açık' : 'Kapalı'; $('app').classList.toggle('motion-on', on); }
onMotion(paintMotion);
$('menu-about').onclick = () => { setMenu(false); $('about').showModal(); };
$('menu-reset').onclick = () => { setMenu(false); if (!sailing) $('reset').showModal(); };
for (const d of document.querySelectorAll('.sheet-dialog')) d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
$('reset-confirm').onclick = () => {
  $('reset').close(); setLogbook(false); cancelCamera();
  state = freshState(); certificateScene = 'welcome'; save();
  hideIslandLayers(); closeCard(); renderMap(); flyOverview({ instant: true }); showWelcome();
};
$('home').onclick = () => showMap({ overview: true });
$('map-return').onclick = () => showMap({ overview: true });

document.addEventListener('keydown', e => {
  if (document.querySelector('dialog[open]')) return;
  if (e.key === 'Escape') {
    if (!$('menu').hidden) { setMenu(false); $('menu-open').focus(); return; }
    if (logbookOpen) { setLogbook(false); return; }
    if (panel.dataset.state === 'closed') return;
    if (isIslandMode()) { if (panel.dataset.state !== 'mini') setInfo(false); } else closeCard();
    return;
  }
  const t = e.target;
  if (['ArrowLeft', 'ArrowRight'].includes(e.key) && !t.closest?.('input,textarea,select,[role=tablist],#stage,.menu') && !e.altKey && !e.metaKey && !e.ctrlKey) {
    const b = panel.querySelector(`#panel-actions [data-nav="${e.key === 'ArrowLeft' ? 'back' : 'next'}"]`);
    if (b && !b.disabled && panel.dataset.state !== 'closed') { e.preventDefault(); b.click(); }
  }
});

/* -------------------------------------------------------------------- init */
buildWorld();
initGestures();
$('app').addEventListener('scroll', e => { e.target.scrollTop = 0; e.target.scrollLeft = 0; });
initAmbient(() => Object.keys(ISLES).map(id => { const [cx, cy, rx, ry] = ISLES[id].land, [wx, wy] = toWorld(id, [cx, cy]), [sx, sy] = toScreen(wx, wy); return { cx: sx, cy: sy, rx: rx * ISLES[id].s * view.scale, ry: ry * ISLES[id].s * view.scale }; }));
paintMotion(motionEnabled());
renderSwatches();
renderJourney();
if (ISLAND_MODES.includes(state.current)) { state.position = dockOf(isleOf(state.current)); save(); }
renderMap();
view = { ...view, ...overviewTarget() }; applyView();
window.requestIdleCallback ? requestIdleCallback(upgradeImages, { timeout: 600 }) : setTimeout(upgradeImages, 300);
if (!state.started) showWelcome();
else if (state.current === 'trainer-gate') openTrainerGate();
else if (state.current === 'membership-gate') openMembershipGate();
else if (state.current === 'volunteer-gate') { renderCourse(); renderMap(); focusCourseStep(null, { instant: true }); }
else if (ISLAND_MODES.includes(state.current)) { renderCourse(); renderMap(); focusCourseStep(null, { instant: true }); }
else if (state.visited.length === 0) openUniverseIntroduction();
document.body.classList.add('ready');
