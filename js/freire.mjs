// Place names: approved 17 Oct “Freirean Praxis Adası: Diyalog ve Eylem”.
// Short presentation copy follows the user's dialogue/reflection/action framing;
// this is not an approved detailed syllabus or a claimed historical site.
export const FREIRE_STEPS = [{
  id: 'praxis-arrival',
  name: 'Freirean Praxis',
  question: 'Birlikte adlandırın, sorgulayın ve harekete geçin.',
  text: 'Bu adada kendi eğitimcilik pratiğinizden bir duruma, onu yaşayan kişilerin deneyimleriyle birlikte bakıyoruz. Diyalog, eleştirel sorgulama, yansıtma ve eylemi birbirine bağlı ele alıyoruz.',
  connection: 'Bu yolculuk ayrı bir praxis deneyimidir. Certificate içindeki Freire rotasının tekrarı veya deneyimsel öğrenme eğitmeni unvanı veren bir program değildir.',
  bounds: [100, 35, 1450, 940]
 },
 {
  id: 'praxis-world',
  name: 'Reading the World',
  question: 'Durumu kimin gözünden okuyoruz?',
  text: 'Kendi eğitimcilik pratiğinizden gerçek bir durum seçin. Kimin deneyimi görünür, kiminki eksik? Hazır bir açıklamayla başlamak yerine insanların yaşadıklarından ve kullandıkları dilden ortak sorular üretin.',
  connection: 'Bir resim, olay anlatısı veya gündelik durum, farklı deneyimleri konuşmanın başlangıcı olabilir. Durumu yalnızca sizin tanımlamanızla katılımcıların da adlandırması arasındaki farkı inceleyin.',
  bounds: [90, 65, 590, 365]
 },
 {
  id: 'praxis-circle',
  name: 'Culture Circle',
  question: 'Herkesin sözü ortak düşünmeyi nasıl değiştirir?',
  text: 'Kültür çemberinde farklı deneyimler ve yorumlar karşılaşır. Odağımız, tek bir doğru cevabı aktarmaktan çok insanların soruları üzerinde söz sahibi olabileceği bir diyalog kurmaktır.',
  connection: 'Kim konuşuyor, kim sessiz kalıyor? Kolaylaştıran kişinin soruları katılımı açıyor mu, yönlendiriyor mu? Güç ilişkilerini konuşmanın da bir parçası yapın.',
  bounds: [470, 220, 1055, 570]
 },
 {
  id: 'praxis-inquiry',
  name: 'Shared Inquiry',
  question: 'Doğal kabul ettiğimiz şeyi birlikte sorgulayabilir miyiz?',
  text: 'Seçtiğiniz durumun nedenlerini, ilişkilerini ve kabullerini birlikte inceleyin. Kimin ihtiyacı belirleyici, hangi sesler dışarıda ve farklı yorumlar neye dayanıyor? Eleştirel sorgulama bu sorulara alan açar.',
  connection: 'Sorunu başkaları adına çözmek yerine, durumu yaşayanların araştırmaya ve anlam üretmeye nasıl katılabileceğini düşünün.',
  bounds: [970, 65, 1485, 390]
 },
 {
  id: 'praxis-reflection',
  name: 'Reflection & Dialogue',
  question: 'İlk yorumumuzda ne değişti?',
  text: 'Yaşanan deneyime ve ortak sorgulamaya dönün. Hangi varsayımınız değişti, hangi yeni sorular açıldı? Yansıtma, eylemin etkilerini birlikte anlamlandırmayı ve sonraki kararı gözden geçirmeyi destekler.',
  connection: 'Yansıtma ile eylem birbirini besler. Değişmeyen bir yorumu tekrarlamak yerine, başka birinin deneyiminin yaklaşımınızı nerede değiştirdiğini görünür kılın.',
  bounds: [100, 385, 610, 740]
 },
 {
  id: 'praxis-action',
  name: 'Collective Action',
  question: 'Birlikte hangi küçük değişikliği deneyeceğiz?',
  text: 'Ortak sorunuzdan hareketle katılımcıların söz sahibi olduğu bir eylem düşünün. Neyi, kimlerle ve neden değiştirmek istiyorsunuz? Denemenin sonuçlarına birlikte bakmak yeni bir sorgulamaya zemin oluşturur.',
  connection: 'Amaç, bir etkinliği yapmakla yetinmek değil; eylem, diyalog ve yansıtma arasındaki bağı sürdürebilmektir.',
  bounds: [960, 410, 1460, 790]
 },
 {
  id: 'praxis-review',
  name: 'Praxis’inizi yeniden düşünün',
  question: 'Kendi eğitimcilik pratiğinize ne taşıyacaksınız?',
  text: 'Durumu okuma, kültür çemberi, ortak sorgulama, yansıtma ve kolektif eylem arasında kurduğunuz bağlara bakın. Kimlerin sözü, hangi kararları değiştirdi? Yeni bir denemeye hangi soruyla dönmek istersiniz?',
  connection: 'Deneyimsel öğrenme eğitmenliği için resmî üyelik ve ek yeterlilik kanıtları gerekir. Praxis kanıtları ve değerlendirme ölçütleri henüz netleşmedi.',
  bounds: [390, 200, 1135, 660]
 }
];
export function freshFreireProgress() {
 return {
  step: 0,
  highestSeen: 0,
  completedSteps: [],
  finished: false
 };
}
export const hasFinishedFreire = s => s.freireProgress?.finished === true || s.completed?.includes('freire') === true;
export function restoreFreireProgress(p, completedRecord = false) {
 const last = FREIRE_STEPS.length - 1,
  finished = completedRecord || p?.finished === true,
  highestSeen = finished ? last : Number.isInteger(p?.highestSeen) ? Math.max(0, Math.min(last, p.highestSeen)) : 0;
 return {
  step: Number.isInteger(p?.step) ? Math.max(0, Math.min(highestSeen, p.step)) : 0,
  highestSeen,
  completedSteps: finished ? FREIRE_STEPS.map(s => s.id) : Array.isArray(p?.completedSteps) ? [...new Set(p.completedSteps.filter(id => FREIRE_STEPS.some(s => s.id === id)))] : [],
  finished
 };
}
export function advanceFreire(p) {
 if (p.step >= FREIRE_STEPS.length - 1) return p;
 const step = p.step + 1;
 return {
  ...p,
  step,
  highestSeen: Math.max(p.highestSeen, step),
  completedSteps: [...new Set([...p.completedSteps, FREIRE_STEPS[p.step].id])]
 };
}
export function revisitFreire(p, step) {
 return Number.isInteger(step) && step >= 0 && step <= p.highestSeen ? {
  ...p,
  step
 } : p;
}
export function freireReadyToFinish(p) {
 return p.step === FREIRE_STEPS.length - 1 && FREIRE_STEPS.slice(0, -1).every(s => p.completedSteps.includes(s.id));
}
export function finishFreire(p) {
 return freireReadyToFinish(p) ? {
  ...p,
  finished: true,
  completedSteps: FREIRE_STEPS.map(s => s.id)
 } : p;
}