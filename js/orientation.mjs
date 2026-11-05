// Source: three-step orientation flow approved by the user, 23 October 2026.
// These are presentation steps, not a real membership application or assessment.
export const COMMUNITY_BOUNDS = [600, 580, 1010, 890];
export const ORIENTATION_STEPS = [{
  id: 'orientation-ela',
  name: 'ELA’yı tanı',
  question: 'Nasıl bir topluluğa katılıyorsunuz?',
  text: 'ELA, deneyimsel öğrenme etrafında farklı alanlardan kişilerin bir araya geldiği dernek ve topluluk yapısıdır. Akademi bu yapının öğrenme programlarını sunar.',
  connection: 'Buradaki yolculuk, bir programı takip etmenin yanında birlikte öğrenmeye ve gönüllü katkıya da alan açar.'
 },
 {
  id: 'orientation-volunteering',
  name: 'Gönüllülüğü tanı',
  question: 'Topluluğa nasıl katkı sunabilirsiniz?',
  text: 'Bir çalışma grubuna katılmak, çeviriye destek vermek, yöntem paylaşmak veya iletişim çalışmalarına katkı sunmak gönüllülük yollarından bazılarıdır. Hangi katkıyı, hangi sorumlulukla ve nasıl bir süreklilik içinde sunabileceğinizi düşünün.',
  connection: 'Gönüllülük çerçevesi karşılıklı beklentileri görünür kılar. Puanlar, katkı kayıtları ve kanıtların değerlendirme ayrıntıları ayrıca geliştirilecek; bu sunum sayısal bir eşik belirlemez.'
 },
 {
  id: 'orientation-community',
  name: 'Topluluğa katıl',
  question: 'Topluluk üyeliği hangi kapıyı açar?',
  text: 'Oryantasyonun ardından topluluk üyesi, yani derneğin gönüllüsü olarak ortak alana katılırsınız. Resmî dernek üyeliği ayrıca ele alınır.',
  connection: 'Toplulukta kalabilir, katkı sunabilir veya Certificate Program’a geçebilirsiniz. Practitioner başvurusu için Certificate tamamlanmalıdır. Türkiye gönüllülüğü akademik ilerlemenin ön koşulu değildir.'
 }
];
export function freshOrientationProgress() {
 return {
  step: 0,
  highestSeen: 0,
  completedSteps: [],
  membershipStatus: "draft"
 };
}
export function restoreOrientationProgress(p) {
 if (!p || typeof p !== 'object') return freshOrientationProgress();
 const highestSeen = Number.isInteger(p.highestSeen) ? Math.max(0, Math.min(2, p.highestSeen)) : 0;
 const oldMember = p.membershipStatus === undefined && ORIENTATION_STEPS.every(s => p.completedSteps?.includes(s.id));
 return {
  membershipStatus: oldMember ? 'approved' : ['draft', 'submitted', 'approved'].includes(p.membershipStatus) ? p.membershipStatus : 'draft',
  step: Number.isInteger(p.step) ? Math.max(0, Math.min(highestSeen, p.step)) : 0,
  highestSeen,
  completedSteps: Array.isArray(p.completedSteps) ? [...new Set(p.completedSteps.filter(id => ORIENTATION_STEPS.some(s => s.id === id)))] : []
 };
}
export function orientationComplete(s) {
 return ORIENTATION_STEPS.every(p => s.orientationProgress?.completedSteps?.includes(p.id));
}
export function advanceOrientation(p) {
 const step = Math.min(2, p.step + 1);
 return {
  ...p,
  step,
  highestSeen: Math.max(p.highestSeen, step),
  completedSteps: [...new Set([...p.completedSteps, ORIENTATION_STEPS[p.step].id])]
 };
}
export function revisitOrientation(p, step) {
 return Number.isInteger(step) && step >= 0 && step <= p.highestSeen ? {
  ...p,
  step
 } : p;
}

export function hasCommunityMembership(s) {
 return orientationComplete(s) && s.orientationProgress?.membershipStatus === 'approved';
}
export function submitCommunityInGame(p) {
 return orientationComplete({
  orientationProgress: p
 }) ? {
  ...p,
  membershipStatus: p.membershipStatus === 'approved' ? 'approved' : 'submitted'
 } : p;
}
export function approveCommunityInGame(p) {
 return orientationComplete({
  orientationProgress: p
 }) && p.membershipStatus === 'submitted' ? {
  ...p,
  membershipStatus: 'approved'
 } : p;
}