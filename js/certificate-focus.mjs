// Approved certificate artwork coordinates. Display emphasis only: no image edits,
// no new content or completion records. All connections in a route remain visible.
export const CERTIFICATE_VENUES = {
 constructed: [838, 100, 1082, 284],
 action: [890, 285, 1085, 435],
 inquiry: [1010, 325, 1240, 455],
 reflection: [1050, 213, 1220, 334],
 embodied: [900, 440, 1160, 615],
 journal: [688, 290, 930, 485],
 philosophy: [375, 150, 552, 335],
 moves: [552, 102, 751, 251],
 different: [478, 316, 620, 416],
 becoming: [585, 247, 752, 356],
 relationship: [327, 318, 495, 454],
 dialogue: [480, 374, 650, 500],
 eqe: [505, 503, 847, 662],
 james: [693, 0, 927, 150],
 dewey: [102, 88, 317, 345],
 freire: [60, 358, 298, 563],
 piaget: [1067, 28, 1266, 209],
 lewin: [1240, 135, 1441, 336],
 kolbs: [1082, 570, 1419, 792],
 jung: [1283, 370, 1501, 560],
 rogers: [480, 670, 706, 848],
 vygotsky: [332, 0, 515, 165],
 follett: [285, 567, 495, 758]
};
export const CERTIFICATE_PROTECTED_AREAS = {
 constructed: [825, 98, 1093, 286],
 action: [890, 285, 1095, 442],
 inquiry: [1005, 322, 1245, 470],
 reflection: [1028, 208, 1230, 343],
 embodied: [890, 438, 1165, 631],
 journal: [678, 283, 936, 494],
 philosophy: [368, 146, 554, 356],
 moves: [513, 96, 763, 278],
 different: [470, 311, 645, 449],
 becoming: [537, 240, 762, 378],
 relationship: [320, 309, 512, 470],
 dialogue: [474, 368, 661, 508],
 eqe: [491, 496, 855, 681],
 james: [681, 0, 941, 173],
 dewey: [88, 81, 333, 362],
 freire: [48, 348, 314, 587],
 piaget: [1055, 22, 1280, 225],
 lewin: [1215, 127, 1465, 358],
 kolbs: [1062, 562, 1450, 819],
 jung: [1268, 359, 1520, 587],
 rogers: [461, 660, 727, 871],
 vygotsky: [314, 0, 537, 187],
 follett: [264, 555, 519, 781]
};
const routes = {
 1: ['philosophy', 'james', 'dewey', 'freire'],
 2: ['moves', 'piaget', 'lewin', 'kolbs', 'dewey'],
 3: ['different', 'jung', 'kolbs'],
 4: ['becoming', 'rogers'],
 5: ['relationship', 'vygotsky', 'follett', 'lewin', 'rogers'],
 6: ['dialogue', 'freire']
};
export function certificateFocus(page) {
 if (page.type === 'welcome') return null;
 const methodIds = page.id === 'methods-intro' ? ['constructed', 'action', 'inquiry', 'reflection', 'embodied'] : page.id.endsWith('-family') ? [page.id.replace('-family', '')] : [];
 const ids = methodIds.length ? methodIds : ['journal', 'journal-review'].includes(page.type) ? ['journal'] : page.route.name === 'Evidence, Quality & Ethics' ? ['eqe'] : routes[page.route.number] || [];
 const regions = ids.map(id => CERTIFICATE_PROTECTED_AREAS[id]);
 if (!regions.length) return null;
 const bounds = [Math.max(0, Math.min(...regions.map(r => r[0])) - 20), Math.max(0, Math.min(...regions.map(r => r[1])) - 12), Math.min(1536, Math.max(...regions.map(r => r[2])) + 20), Math.min(1024, Math.max(...regions.map(r => r[3])) + 20)];
 return {
  ids,
  regions,
  bounds
 };
}
// Rasterize the display-only veil once per route. Scaling a live SVG filter on
// every animation frame is expensive; a canvas travels as a single bitmap layer.
const toneCache = new WeakMap();
const LAND = 'M352 18 Q470 -10 554 44 Q650 4 797 0 Q917 4 993 39 Q1088 0 1176 21 Q1272 50 1324 104 Q1435 119 1454 214 Q1494 315 1505 415 Q1540 490 1487 594 Q1486 699 1414 769 Q1360 826 1244 846 Q1134 927 1004 917 Q893 930 808 904 L711 905 Q605 921 498 886 Q372 872 269 827 Q153 825 89 725 Q20 662 37 548 Q0 451 38 355 Q19 275 104 216 Q147 125 266 122 Q296 48 352 18Z';
export function paintCertificateFocus(canvas, image, page) {
 const focus = certificateFocus(page);
 if (!focus || !image.complete || !image.naturalWidth || !image.currentSrc.includes('isle-certificate.')) {
  canvas.hidden = true;
  return;
 }
 const key = image.currentSrc + '|' + focus.ids.join(',');
 canvas.hidden = false;
 if (canvas.dataset.focusKey === key) return;
 canvas.dataset.focusKey = key;
 canvas.width = 1536;
 canvas.height = 1024;
 let tone = toneCache.get(image);
 if (!tone || tone.src !== image.currentSrc) {
  const bitmap = document.createElement('canvas');
  bitmap.width = 1536;
  bitmap.height = 1024;
  const c = bitmap.getContext('2d');
  c.drawImage(image, 0, 0, 1536, 1024);
  const pixels = c.getImageData(0, 0, 1536, 1024),
   a = pixels.data;
  for (let i = 0; i < a.length; i += 4) {
   const l = (a[i] * .2126 + a[i + 1] * .7152 + a[i + 2] * .0722) * .42 + 107.1;
   a[i] = a[i + 1] = a[i + 2] = l;
   a[i + 3] *= .92;
  }
  c.putImageData(pixels, 0, 0);
  tone = {
   src: image.currentSrc,
   bitmap
  };
  toneCache.set(image, tone);
 }
 const c = canvas.getContext('2d');
 c.filter = 'blur(8px)';
 c.fill(new Path2D(LAND));
 c.globalCompositeOperation = 'destination-out';
 // The soft edge stays outside the protected footprint. The solid pass then
 // guarantees that no grey pixels cover any part of a selected building.
 for (const [x, y, x2, y2] of focus.regions) c.fillRect(x - 19, y - 19, x2 - x + 38, y2 - y + 38);
 c.filter = 'none';
 for (const [x, y, x2, y2] of focus.regions) c.fillRect(x, y, x2 - x, y2 - y);
 c.globalCompositeOperation = 'source-in';
 c.drawImage(tone.bitmap, 0, 0);
 c.globalCompositeOperation = 'source-over';
}

// Broad orientation first; individual stops then frame the actual place closely.
export function certificateCameraBounds(page) {
 if (['welcome', 'intro'].includes(page.type)) return [0, 0, 1536, 1024];
 if (['journal', 'journal-review'].includes(page.type)) return CERTIFICATE_VENUES.journal;
 if (page.id.startsWith('eqe-')) return CERTIFICATE_VENUES.eqe;
 if (page.id === 'synthesis') return CERTIFICATE_VENUES.philosophy;
 if (page.id.endsWith('-family')) return CERTIFICATE_VENUES[page.id.replace('-family', '')] || page.bounds;
 const place = page.id.split('-').at(-1),
  id = place === 'kolb' ? 'kolbs' : place;
 return CERTIFICATE_VENUES[id] || page.bounds;
}