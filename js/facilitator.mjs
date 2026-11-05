// A presentation-game simulation of the user's Participate / Contribute / Create flow.
// No numeric thresholds are defined; no real application or award is issued.
export const EXPERIENCE_AREAS = [{
  id: 'participate',
  name: 'Participate',
  verb: 'Katıl',
  example: 'Topluluk etkinliklerine ve birlikte öğrenme deneyimlerine katıl; katılımını kaydet.'
 },
 {
  id: 'contribute',
  name: 'Contribute',
  verb: 'Katkı sun',
  example: 'Bir çalışma grubuna, çeviriye veya iletişim çalışmasına katkı sun; katkının kanıtlarını biriktir.'
 },
 {
  id: 'create',
  name: 'Create',
  verb: 'Üret',
  example: 'Bir kaynak, yöntem paylaşımı veya ortak ürün geliştir; ürettiğin çalışmayı belgele.'
 }
];
export function freshFacilitatorApplication() {
 return {
  areas: [],
  status: 'not-started'
 };
}
export function restoreFacilitatorApplication(v) {
 if (!v || typeof v !== 'object') return freshFacilitatorApplication();
 return {
  areas: Array.isArray(v.areas) ? [...new Set(v.areas.filter(id => EXPERIENCE_AREAS.some(a => a.id === id)))] : [],
  status: ['not-started', 'preparing', 'approved'].includes(v.status) ? v.status : 'not-started'
 };
}
export function hasFacilitator(s) {
 return s.facilitatorApplication?.status === 'approved' || s.earnedTitles?.includes('facilitator') === true || s.completed?.includes('facilitator') === true;
}
export function readyForFacilitatorReview(s) {
 return EXPERIENCE_AREAS.every(a => s.facilitatorApplication?.areas?.includes(a.id));
}
export function approveFacilitatorInGame(s) {
 if (!readyForFacilitatorReview(s)) return s;
 return {
  ...s,
  facilitatorApplication: {
   ...s.facilitatorApplication,
   status: 'approved'
  },
  earnedTitles: [...new Set([...s.earnedTitles, 'facilitator'])]
 };
}