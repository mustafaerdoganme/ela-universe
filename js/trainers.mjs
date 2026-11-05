import {
 hasFinishedFreire
} from './freire.mjs';
import {
 hasMembership
} from './pathways.mjs';
import {
 hasTrainingSpecialist
} from './milestones.mjs';

// The 17 Oct working framework supplies these evidence themes. They remain
// drafts, not an approved rubric, numerical threshold or assessment authority.
export const TRAINER_EVIDENCE = [{
  id: 'teaching',
  name: 'Öğretme ve uygulama',
  text: 'Deneyimsel öğrenmeyi konu alan eğitim tasarımları, materyaller ve uygulama kayıtları.'
 },
 {
  id: 'learning',
  name: 'Öğrenme, etik ve yansıtma',
  text: 'Öğrenen çalışmalarındaki gelişim, Freirean Praxis, yansıtma ve sorumlu eğitimcilik kanıtları.'
 },
 {
  id: 'contribution',
  name: 'Dernek katkısı',
  text: 'Üstlenilen sorumluluklar ve sürdürülen katkı kayıtları. Unvanın korunmasıyla ilişkili çalışma kararı.'
 }
];
export const MASTER_EVIDENCE = [{
  id: 'contexts',
  name: 'Farklı bağlamlarda uygulama',
  text: 'Farklı sektörlerdeki uygulama dosyaları, bağlama uyarlamalar ve bunlardan öğrenilenler.'
 },
 {
  id: 'development',
  name: 'Eğitmen gelişimi ve alana katkı',
  text: 'Eğitmen gelişimine katkı örnekleri; gerekçelendirilmiş kavramsal veya metodolojik üretimler.'
 },
 {
  id: 'contribution',
  name: 'Süreklilik, etik ve dernek katkısı',
  text: 'Güncel uygulama, sorumlu mentorluk, ortak üretimde emeğin tanınması ve sürdürülen dernek katkısı.'
 }
];
export const hasTrainer = s => s.earnedTitles?.includes('trainer') === true || s.completed?.includes('trainer') === true;
export const hasMaster = s => s.earnedTitles?.includes('master-trainer') === true || s.completed?.includes('master-trainer') === true;
export const trainerPrerequisites = s => hasMembership(s) && hasTrainingSpecialist(s) && hasFinishedFreire(s);
export const freshQualificationApplication = () => ({
 status: 'draft',
 evidence: {}
});
export function restoreQualificationApplication(p) {
 return {
  status: ['draft', 'submitted', 'approved'].includes(p?.status) ? p.status : 'draft',
  evidence: Object.fromEntries(['teaching', 'learning', 'contribution', 'contexts', 'development'].filter(id => p?.evidence?.[id] === true).map(id => [id, true]))
 };
}
export function qualificationReady(s, kind) {
 const master = kind === 'master',
  p = master ? s.masterApplication : s.trainerApplication,
  items = master ? MASTER_EVIDENCE : TRAINER_EVIDENCE;
 return (master ? hasTrainer(s) : trainerPrerequisites(s)) && items.every(i => p?.evidence?.[i.id] === true);
}
export function setQualificationEvidence(s, kind, id, checked) {
 const key = kind === 'master' ? 'masterApplication' : 'trainerApplication',
  items = kind === 'master' ? MASTER_EVIDENCE : TRAINER_EVIDENCE;
 if (s[key]?.status !== 'draft' || !items.some(i => i.id === id)) return s;
 return {
  ...s,
  [key]: {
   ...s[key],
   evidence: {
    ...s[key].evidence,
    [id]: checked === true
   }
  }
 };
}
export function submitQualificationInGame(s, kind) {
 const key = kind === 'master' ? 'masterApplication' : 'trainerApplication';
 return qualificationReady(s, kind) && s[key].status === 'draft' ? {
  ...s,
  [key]: {
   ...s[key],
   status: 'submitted'
  }
 } : s;
}
export function approveQualificationInGame(s, kind) {
 const master = kind === 'master',
  key = master ? 'masterApplication' : 'trainerApplication',
  title = master ? 'master-trainer' : 'trainer';
 if (!qualificationReady(s, kind) || s[key].status !== 'submitted') return s;
 return {
  ...s,
  [key]: {
   ...s[key],
   status: 'approved'
  },
  earnedTitles: [...new Set([...(s.earnedTitles || []), title])],
  completed: [...new Set([...(s.completed || []), title, ...(master ? [] : ['trainer-evidence'])])]
 };
}

// These are places in the exact approved illustration, not a new course list
// or a mandatory sequence of Master qualification credits.
export const TRAINER_STOPS = [{
  id: 'training-arrival',
  name: 'Experiential Learning Trainers',
  question: 'Artık bu adada eğitmen olarak yer alıyorsunuz.',
  text: 'Eğitmenlik yeterliliği girişte ayrı değerlendirildi. Bu ada yeni bir kurs değil; deneyimsel öğrenmeyi öğretme, birlikte uygulama, mentorluk ve ortak üretim alanıdır.',
  connection: 'Burada kalabilir, toplulukla çalışmayı sürdürebilir veya ileride Master Trainer yeterliliğine başvurabilirsiniz. Adadaki gezinti bir mesleki yeterlilik kanıtı değildir.',
  bounds: [80, 110, 1450, 920]
 },
 {
  id: 'training-terraces',
  name: 'Training Practice Terraces',
  question: 'Deneyimsel öğrenmeyi başkalarına nasıl öğretiyorsunuz?',
  text: 'Deneyimsel öğrenmenin kendisini konu alan eğitimler tasarlar, yürütür ve öğrenenlerin uygulama geliştirmesini desteklersiniz. Tasarım kararlarınızı ve öğrenme izlerini görünür kılarsınız.',
  connection: 'Bir yöntemi kullanmak ile deneyimsel öğrenmeyi başkalarına öğretmek aynı kapsam değildir. Eğitmenlik, başkalarının öğrenmesini destekleme sorumluluğunu içerir.',
  bounds: [135, 490, 685, 805]
 },
 {
  id: 'training-peer',
  name: 'Co-Training & Peer Observation',
  question: 'Birlikte çalışınca pratiğinizde ne görünür olur?',
  text: 'Ortak eğitim ve akran gözlemi, farklı tercihleri ve öğrenenlerin deneyimini konuşabileceğiniz bir alan açar. Gözlemler, geri bildirimler ve değişen uygulama kararları portfolyonuzu besleyebilir.',
  connection: 'Gözlem ve değerlendirme yöntemleri henüz taslak hâlinde. Bu alanı ziyaret etmek gözlem kanıtı veya kredi üretmez.',
  bounds: [170, 230, 640, 490]
 },
 {
  id: 'training-sharing',
  name: 'Practice Sharing Amphitheatre',
  question: 'Deneyiminizi diğer eğitmenler için nasıl yararlı kılarsınız?',
  text: 'Gerçek uygulamalarınızı, sorularınızı ve öğrendiklerinizi diğer eğitmenlerle paylaşırsınız. Ortak yansıtma, farklı bağlamlar arasında bilgi ve uygulama aktarımını destekler.',
  connection: 'Uygulama sonuçlarını, sınırlılıkları ve etik koşulları görünür tutun. Unvan, kendiliğinden başkalarını değerlendirme yetkisi vermez.',
  bounds: [535, 340, 990, 640]
 },
 {
  id: 'training-design',
  name: 'Design & Development Courtyard',
  question: 'Alana hangi gerekçeli katkıyı sunabilirsiniz?',
  text: 'Eğitim tasarımları, materyaller ve ortak çalışmalar geliştirirsiniz. Master Trainer yolunda kavramsal veya metodolojik üretimin gerekçesi, niteliği ve alana katkısı da ele alınır.',
  connection: 'Bu alan bir zorunlu yeni modül değildir. Üretimlerin ve akran değerlendirmesinin nasıl kanıt sayılacağı henüz netleşmedi.',
  bounds: [1005, 385, 1460, 750]
 },
 {
  id: 'training-mentoring',
  name: 'Mentoring Garden',
  question: 'Başka eğitmenlerin gelişimini nasıl desteklersiniz?',
  text: 'Eğitmenlerin kendi uygulamalarını incelemesini, tercihlerini gerekçelendirmesini ve yeni denemeler geliştirmesini desteklersiniz. Mentorluk ilişkisini karşılıklı öğrenmeye ve sorumlu rehberliğe açarsınız.',
  connection: 'Eğitmen gelişimine katkı, Master Trainer profilinin boyutlarından biridir. Ayrıntılı göstergeler, kanıtlar ve değerlendirme yöntemleri henüz kesinleşmedi.',
  bounds: [970, 110, 1310, 365]
 },
 {
  id: 'training-master',
  name: 'Master Trainer',
  question: 'Deneyimden yeterliliğin tanınmasına.',
  text: 'Tepenin üzerindeki mütevazı buluşma alanı Master Trainer düzeyini temsil eder. Farklı bağlamlarda uygulama, eğitmen gelişimi, kavramsal/metodolojik üretim ve sürdürülen dernek katkısı birlikte ele alınır.',
  connection: 'Buraya gelmek veya merdivenleri gezmek unvan kazandırmaz. Ayrı bir kurs ya da yeni gate yoktur; deneyim kanıtları ve yeterlilik değerlendirmesi gerekir. Master adı akademik yüksek lisans denkliği ifade etmez.',
  bounds: [570, 0, 1010, 235]
 }
];
export const freshTrainerProgress = () => ({
 step: 0,
 highestSeen: 0,
 completedSteps: [],
 explored: false,
 view: 'tour'
});
export function restoreTrainerProgress(p) {
 const last = TRAINER_STOPS.length - 1,
  highestSeen = Number.isInteger(p?.highestSeen) ? Math.max(0, Math.min(last, p.highestSeen)) : 0;
 return {
  step: Number.isInteger(p?.step) ? Math.max(0, Math.min(highestSeen, p.step)) : 0,
  highestSeen,
  completedSteps: Array.isArray(p?.completedSteps) ? [...new Set(p.completedSteps.filter(id => TRAINER_STOPS.some(s => s.id === id)))] : [],
  explored: p?.explored === true,
  view: p?.view === 'master' ? 'master' : 'tour'
 };
}
export function advanceTrainer(p) {
 if (p.step === TRAINER_STOPS.length - 1) return {
  ...p,
  explored: true,
  completedSteps: TRAINER_STOPS.map(s => s.id)
 };
 const step = p.step + 1;
 return {
  ...p,
  step,
  highestSeen: Math.max(p.highestSeen, step),
  completedSteps: [...new Set([...p.completedSteps, TRAINER_STOPS[p.step].id])]
 };
}
export const revisitTrainer = (p, step) => Number.isInteger(step) && step >= 0 && step <= p.highestSeen ? {
 ...p,
 step,
 view: 'tour'
} : p;