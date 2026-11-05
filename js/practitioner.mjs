// Sources: locked three practice areas; user-approved two Training Practice scenarios.
export const PRACTICE_AREAS = [{
  id: 'training',
  name: 'Training Practice',
  bounds: [300, 110, 690, 295]
 },
 {
  id: 'research',
  name: 'Research Practice',
  bounds: [985, 120, 1400, 325]
 },
 {
  id: 'technology',
  name: 'Technology Practice',
  bounds: [315, 480, 680, 675]
 }
];
export const PRACTITIONER_GATE_BOUNDS = [520, 630, 1090, 1000];
export const PRACTITIONER_CIRCLE_BOUNDS = [500, 270, 1120, 570];
export function freshPractitionerProgress() {
 return {
  branches: [],
  trainingScenario: null,
  stage: 'application',
  approvedBranches: [],
  returnedFromTot: false,
  fieldEvidence: {},
  reviewAccepted: false,
  completedBranches: []
 };
}
const validBranches = v => Array.isArray(v) ? [...new Set(v.filter(id => PRACTICE_AREAS.some(a => a.id === id)))] : [];
export function restorePractitionerProgress(p) {
 if (!p || typeof p !== 'object') return freshPractitionerProgress();
 const approvedBranches = validBranches(p.approvedBranches),
  completedBranches = validBranches(p.completedBranches);
 const fieldEvidence = Object.fromEntries(approvedBranches.map(id => [id, {
  practice: p.fieldEvidence?.[id]?.practice === true,
  report: p.fieldEvidence?.[id]?.report === true
 }]));
 return {
  branches: validBranches(p.branches),
  trainingScenario: ['suitable', 'preparation'].includes(p.trainingScenario) ? p.trainingScenario : null,
  stage: ['practice', 'field', 'completed'].includes(p.stage) ? p.stage : 'application',
  approvedBranches,
  returnedFromTot: p.returnedFromTot === true,
  fieldEvidence,
  reviewAccepted: p.reviewAccepted === true,
  completedBranches
 };
}
export function startFieldPractice(p) {
 return p.stage === 'practice' && p.approvedBranches.length ? {
  ...p,
  stage: 'field'
 } : p;
}
export function setFieldEvidence(p, id, key, value) {
 if (p.stage !== 'field' || !p.approvedBranches.includes(id) || !['practice', 'report'].includes(key)) return p;
 return {
  ...p,
  reviewAccepted: false,
  fieldEvidence: {
   ...p.fieldEvidence,
   [id]: {
    ...p.fieldEvidence[id],
    [key]: value === true
   }
  }
 };
}
export function fieldEvidenceComplete(p) {
 return p.approvedBranches.length > 0 && p.approvedBranches.every(id => p.fieldEvidence?.[id]?.practice && p.fieldEvidence?.[id]?.report);
}
export function fieldPracticeReady(p) {
 return p.stage === 'field' && fieldEvidenceComplete(p) && p.reviewAccepted === true;
}
export function needsTot(p) {
 return p.branches.includes('training') && p.trainingScenario === 'preparation';
}
export function practiceReady(p) {
 return p.branches.length > 0 && (!p.branches.includes('training') || p.trainingScenario === 'suitable');
}
export function choosePracticeArea(p, id, checked) {
 if (!PRACTICE_AREAS.some(a => a.id === id)) return p;
 return {
  ...p,
  stage: 'application',
  fieldEvidence: {},
  reviewAccepted: false,
  branches: checked ? [...new Set([...p.branches, id])] : p.branches.filter(b => b !== id)
 };
}
export function chooseTrainingScenario(p, value) {
 if (!['suitable', 'preparation'].includes(value)) return p;
 return {
  ...p,
  stage: 'application',
  trainingScenario: value,
  approvedBranches: value === 'preparation' ? p.approvedBranches.filter(b => b !== 'training') : p.approvedBranches
 };
}
export function acceptPracticeInGame(p) {
 return practiceReady(p) ? {
  ...p,
  stage: 'practice',
  approvedBranches: [...p.branches],
  fieldEvidence: {},
  reviewAccepted: false
 } : p;
}
export function returnForTrainingReview(p) {
 return {
  ...p,
  stage: 'application',
  fieldEvidence: {},
  reviewAccepted: false,
  trainingScenario: null,
  approvedBranches: p.approvedBranches.filter(b => b !== 'training'),
  returnedFromTot: true
 };
}
export const TOT_STOPS = [{
  id: 'tot-introductions',
  day: '1. gün',
  name: 'Introductions, Icebreakers & Group Dynamics',
  text: 'Tanışma, buz kırıcılar ve grup dinamiği üzerinden bir öğrenme grubunun başlangıcını çalışıyoruz.',
  bounds: [885, 645, 1400, 850]
 },
 {
  id: 'tot-needs',
  day: '2. gün',
  name: 'Needs Analysis & Program Design',
  text: 'İhtiyaç analiziyle başlayan program tasarımını ve eğitim yöntemlerini bu ihtiyaçlarla ilişkilendirmeyi çalışıyoruz.',
  bounds: [1000, 515, 1450, 695]
 },
 {
  id: 'tot-constructed',
  day: '3. gün',
  name: 'Constructed & Simulated Experience',
  text: 'Kurgulanmış deneyim ve simülasyonları eğitim yöntemi olarak nasıl tasarlayabileceğimizi ele alıyoruz.',
  bounds: [1000, 315, 1450, 535]
 },
 {
  id: 'tot-action',
  day: '3. gün',
  name: 'Action & Real-world Practice',
  text: 'Gerçek yaşam ve eylem temelli uygulamaları öğrenme hedefleriyle ilişkilendiriyoruz.',
  bounds: [990, 80, 1450, 305]
 },
 {
  id: 'tot-inquiry',
  day: '4. gün',
  name: 'Inquiry & Investigation',
  text: 'Soruşturma, araştırma ve incelemeyi eğitim yöntemleri açısından çalışıyoruz.',
  bounds: [610, 100, 1040, 325]
 },
 {
  id: 'tot-reflection',
  day: '4. gün',
  name: 'Reflection & Meaning-making',
  text: 'Yansıtma ve anlam oluşturmayı destekleyen eğitim yöntemlerini ele alıyoruz.',
  bounds: [190, 110, 640, 315]
 },
 {
  id: 'tot-embodied',
  day: '4. gün',
  name: 'Embodied, Creative & Performative Experience',
  text: 'Bedensel, yaratıcı ve performatif deneyimlerin eğitimde kullanımını çalışıyoruz.',
  bounds: [160, 300, 675, 490]
 },
 {
  id: 'tot-micro',
  day: '5. gün',
  name: 'Micro-Session Practice',
  text: 'Mikro oturum uygulamalarıyla eğitim yöntemlerini ve program tasarımını pratiğe taşıyoruz.',
  bounds: [220, 490, 680, 675]
 },
 {
  id: 'tot-feedback',
  day: '6. gün',
  name: 'Feedback & Assessment Methods',
  text: 'Mikro oturumlara geribildirim veriyor; değerlendirme yöntemlerini ele alıyoruz. Bu hazırlık sonrasında Training Practice için tekrar giriş değerlendirmesine dönülür.',
  bounds: [220, 670, 730, 850]
 }
];
export function freshTotProgress() {
 return {
  step: 0,
  highestSeen: 0,
  completedSteps: []
 };
}
export function restoreTotProgress(p) {
 if (!p || typeof p !== 'object') return freshTotProgress();
 const highestSeen = Number.isInteger(p.highestSeen) ? Math.max(0, Math.min(TOT_STOPS.length - 1, p.highestSeen)) : 0;
 return {
  step: Number.isInteger(p.step) ? Math.max(0, Math.min(highestSeen, p.step)) : 0,
  highestSeen,
  completedSteps: Array.isArray(p.completedSteps) ? [...new Set(p.completedSteps.filter(id => TOT_STOPS.some(s => s.id === id)))] : []
 };
}
export function advanceTot(p) {
 const step = Math.min(TOT_STOPS.length - 1, p.step + 1);
 return {
  ...p,
  step,
  highestSeen: Math.max(p.highestSeen, step),
  completedSteps: [...new Set([...p.completedSteps, TOT_STOPS[p.step].id])]
 };
}
export function revisitTot(p, step) {
 return Number.isInteger(step) && step >= 0 && step <= p.highestSeen ? {
  ...p,
  step
 } : p;
}
export function totComplete(s) {
 return TOT_STOPS.every(p => s.totProgress?.completedSteps?.includes(p.id));
}