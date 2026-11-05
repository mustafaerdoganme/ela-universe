import {
 TRAINER_STOPS
} from './trainers.mjs';
import {
 FREIRE_STEPS
} from './freire.mjs';
import {
 COURSE_PAGES,
 PHILOSOPHY_STEPS,
 MOVES_STEPS,
 DIFFERENT_WAYS_STEPS,
 BECOMING_STEPS,
 RELATIONSHIP_STEPS,
 NEXT_ROUTE_INTRO,
 DIFFERENT_WAYS_INTRO,
 BECOMING_INTRO,
 RELATIONSHIP_INTRO,
 DIALOGUE_INTRO,
 PRACTICE_JOURNAL,
 EQE_STEPS
} from './course.mjs';
import {
 COMMUNITY_STOPS
} from './community.mjs';
// Coordinates follow the placards in the unchanged 1536 × 1024 approved art.
// Bounds are sign-only hit targets, never the whole learning region.
const sign = (id, page, rect) => ({
 id,
 name: page.name,
 page,
 rect,
 dot: [(rect[0] + rect[2]) / 2, rect[1] - 13]
});
const page = id => COURSE_PAGES.find(p => p.id === id);
export const CERTIFICATE_SIGNS = [
 sign('james', PHILOSOPHY_STEPS[0], [768, 2, 914, 39]),
 sign('dewey', PHILOSOPHY_STEPS[1], [119, 99, 257, 139]),
 sign('freire', PHILOSOPHY_STEPS[2], [106, 363, 245, 400]),
 sign('vygotsky', RELATIONSHIP_STEPS[0], [346, 3, 498, 42]),
 sign('piaget', MOVES_STEPS[1], [1115, 31, 1241, 70]),
 sign('lewin', MOVES_STEPS[2], [1288, 137, 1427, 178]),
 sign('jung', DIFFERENT_WAYS_STEPS[0], [1340, 373, 1497, 414]),
 sign('follett', RELATIONSHIP_STEPS[1], [300, 568, 491, 609]),
 sign('rogers', BECOMING_STEPS[0], [518, 672, 668, 739]),
 sign('kolbs', {
  ...MOVES_STEPS[3],
  name: 'Alice & David Kolb'
 }, [1174, 572, 1357, 613]),
 sign('philosophy', {
  ...page('synthesis'),
  name: 'Philosophy of Experiential Learning'
 }, [382, 153, 550, 205]),
 sign('moves', NEXT_ROUTE_INTRO, [599, 106, 741, 156]),
 sign('different', DIFFERENT_WAYS_INTRO, [478, 319, 612, 370]),
 sign('becoming', BECOMING_INTRO, [583, 250, 748, 289]),
 sign('relationship', RELATIONSHIP_INTRO, [329, 319, 458, 373]),
 sign('dialogue', DIALOGUE_INTRO, [484, 444, 625, 493]),
 sign('constructed', page('constructed-family'), [911, 103, 1078, 156]),
 sign('action', page('action-family'), [916, 293, 1076, 341]),
 sign('inquiry', page('inquiry-family'), [1099, 330, 1224, 381]),
 sign('reflection', page('reflection-family'), [1075, 216, 1210, 265]),
 sign('embodied', page('embodied-family'), [950, 446, 1138, 499]),
 sign('journal', PRACTICE_JOURNAL, [802, 344, 917, 396]),
 sign('eqe', {
  name: 'Evidence, Quality & Ethics',
  text: EQE_STEPS.map(p => p.name + ': ' + p.question).join(' '),
  connection: 'Kanıt, kalite ve etik aynı ortak binanın üç eksenidir. Kendi çalışmanızın dayanaklarını, öğrenme izlerini ve katılım koşullarını birlikte inceleyin.'
 }, [624, 505, 840, 549])
];
const communityRects = {
 'community-map': [284, 504, 465, 549],
 'community-library': [333, 88, 468, 132],
 'community-cinema': [1112, 137, 1294, 177],
 'community-events': [259, 277, 424, 315],
 'community-work': [1204, 337, 1395, 377],
 'community-agora': [712, 0, 879, 60]
};
export const COMMUNITY_SIGNS = COMMUNITY_STOPS.slice(1).map(p => sign(p.id, p, communityRects[p.id]));
export const PRACTITIONER_SIGNS = [
 sign('training', {
  name: 'Training Practice',
  text: 'Eğitim alanından seçtiğiniz bir yöntemi deneyimsel öğrenme tasarımına yansıtıp ortak yüz yüze programda pratik edersiniz. Ardından bu dalda saha uygulaması yapar ve raporlarsınız.',
  connection: 'Bu dala kabul için eğitmenlik altyapısı portfolyoyla değerlendirilir. Hazırlık gerekiyorsa ToT’ye yönlendirilir, sonra giriş değerlendirmesine dönersiniz.'
 }, [438, 115, 610, 159]),
 sign('research', {
  name: 'Research Practice',
  text: 'Kendi araştırma alanınızdan bir yöntemi deneyimsel öğrenme tasarımına dönüştürmeyi pratik edersiniz. Ortak dört günlük programı, seçtiğiniz alandaki saha uygulaması ve raporlama izler.',
  connection: 'Bu dal eğitmenlik unvanı vermez. Kendi alanınızdaki yöntem bilgisi ve uygulama geçmişiniz girişte değerlendirilir.'
 }, [1065, 129, 1245, 169]),
 sign('technology', {
  name: 'Technology Practice',
  text: 'Teknoloji alanınızdaki bir yöntemi veya çalışma biçimini deneyimsel öğrenme tasarımına nasıl taşıyacağınızı denersiniz. Yüz yüze pratikten sonra kendi alanınızda uygular ve raporlarsınız.',
  connection: 'Teknoloji pratiği ile eğitmenlik pratiği ayrı dallardır. Sonradan Training Practice seçerseniz o dalın giriş koşulları ayrıca değerlendirilir.'
 }, [413, 488, 596, 530]),
 sign('circle', {
  name: 'Practitioner Program · Ortak çember',
  text: 'Farklı alanlardan uygulayıcılar dört gün yüz yüze buluşur; kendi yöntemlerini deneyimsel öğrenmeyle ilişkilendirir ve birlikte pratik eder.',
  connection: 'Birden fazla ana dal seçilebilir. Saha uygulaması ve raporlama her seçilen dal için ayrıca tamamlanır. Uzmanlık unvanı, yalnızca adayı keşfetmekle verilmez.'
 }, [675, 270, 946, 334]),
 sign('gate', {
  name: 'Practitioner Gate',
  text: 'İskelede Certificate tamamlanması ve seçilen alandaki uygulayıcılık geçmişi ele alınır. Bir veya birden fazla ana dal için başvurulur.',
  connection: 'Training Practice için portfolyo değerlendirilir. ToT hazırlık sağlar; değerlendirme burada yapılır. Kabul ve kanıt ölçütleri henüz netleşmedi.'
 }, [699, 659, 878, 706])
];
export const FREIRE_SIGNS = [
 sign('praxis-world', FREIRE_STEPS[1], [279, 87, 465, 128]),
 sign('praxis-circle', FREIRE_STEPS[2], [731, 244, 881, 283]),
 sign('praxis-inquiry', FREIRE_STEPS[3], [1171, 87, 1338, 131]),
 sign('praxis-reflection', FREIRE_STEPS[4], [235, 434, 441, 478]),
 sign('praxis-action', FREIRE_STEPS[5], [1111, 465, 1291, 506])
];
export const TRAINER_SIGNS = [
 sign('training-terraces', TRAINER_STOPS[1], [238, 527, 478, 567]),
 sign('training-peer', TRAINER_STOPS[2], [249, 250, 523, 294]),
 sign('training-sharing', TRAINER_STOPS[3], [651, 365, 897, 404]),
 sign('training-design', TRAINER_STOPS[4], [1120, 414, 1400, 459]),
 sign('training-mentoring', TRAINER_STOPS[5], [1024, 141, 1204, 182]),
 sign('training-master', TRAINER_STOPS[6], [692, 13, 862, 57])
];
export function signsFor(island) {
 return island === 'trainers' ? TRAINER_SIGNS : island === 'freire' ? FREIRE_SIGNS : island === 'certificate' ? CERTIFICATE_SIGNS : island === 'practitioner' ? PRACTITIONER_SIGNS : island === 'community' ? COMMUNITY_SIGNS : [];
}
export function hitSign(signs, x, y) {
 return signs.find(s => {
  const [a, b, c, d] = s.rect;
  return (x >= a && x <= c && y >= b && y <= d) || Math.hypot(x - s.dot[0], y - s.dot[1]) <= 17;
 });
}