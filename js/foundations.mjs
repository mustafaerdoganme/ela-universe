// Source: user's locked EL101 micro-course brief: approach, cycle and styles.
// Presentation copy only; completion does not certify real learning or status.
export const FOUNDATION_STEPS = [{
  id: 'foundation-approach',
  name: 'Experiential Learning Approach',
  question: 'Yaşadığımız bir deneyimden nasıl öğreniriz?',
  text: 'Deneyimi inceleme, anlamlandırma ve yeni bir denemeyle ilişkilendirme yaklaşımıyla tanışıyoruz. Başlangıç sorumuz şu: Yaşadığımız bir durumda neye dikkat eder, neyi sorgular ve bir sonraki uygulamaya hangi soruyla döneriz?',
  connection: 'Kendi hayatınızdan veya çalışmanızdan yakın tarihli bir deneyim seçin. Ne oldu, siz ne fark ettiniz ve yeniden deneseniz neyi değiştirmek isterdiniz?'
 },
 {
  id: 'foundation-cycle',
  name: 'Experiential Learning Cycle',
  question: 'Deneyim, yansıtma, kavram ve deneme nasıl bağlanır?',
  text: 'Somut deneyim, yansıtıcı gözlem, soyut kavramsallaştırma ve aktif deneme kavramlarını bir öğrenme çerçevesi olarak okuyoruz. Kendi örneğimizde yaşananı inceleme, bir açıklama geliştirme ve yeni bir şeyi deneme arasındaki geçişlere bakıyoruz.',
  connection: 'Seçtiğiniz deneyimde bu hareketlerin izini sürün. Yeni denemenizin sonucuna yeniden baktığınızda hangi soru açılabilir?'
 },
 {
  id: 'foundation-styles',
  name: 'Learning Styles',
  question: 'Kendi öğrenme tercihlerimize nasıl bakarız?',
  text: 'Öğrenmeye yaklaşırken fark ettiğimiz tercihleri ve farklı durumlarda neler denediğimizi ele alıyoruz. Stiller ve envanterlerle karşılaştığımızda neyi anlattıklarını, neyi açıklayamadıklarını ve kendi deneyimimizle nasıl karşılaştırabileceğimizi soruyoruz.',
  connection: 'Hangi durumda alıştığınız yaklaşım işe yarıyor, hangi durumda başka bir yaklaşım denemek istiyorsunuz? Bir tercihin her koşul için aynı yöntem seçimini gerektirip gerektirmediğini düşünün.'
 }
];
export const FOUNDATION_CONNECTION = {
 id: 'foundation-community',
 name: 'Next Destination',
 question: 'Yolculuğa nereden devam etmek istersiniz?',
 text: 'Certificate Program ile deneyimsel öğrenmede derinleşebilir veya Volunteer Gate üzerinden topluluk yoluna ilerleyebilirsiniz. Gönüllülük yolunda, derneği ve gönüllülük çerçevesini tanıtan Volunteer Orientation yer alır.',
 connection: 'Topluluk katılımı, Türkiye gönüllülüğü ve akademik seviyeler ayrı süreçlerdir. Resmî dernek üyeliği ayrı bir başvuru sürecidir.'
};
export const FOUNDATION_BOUNDS = [240, 10, 1270, 815];
export function freshFoundationProgress() {
 return {
  step: 0,
  highestSeen: 0,
  completedSteps: []
 };
}
export function restoreFoundationProgress(value) {
 if (!value || typeof value !== 'object') return freshFoundationProgress();
 const highestSeen = Number.isInteger(value.highestSeen) ? Math.max(0, Math.min(FOUNDATION_STEPS.length, value.highestSeen)) : 0;
 return {
  step: Number.isInteger(value.step) ? Math.max(0, Math.min(highestSeen, value.step)) : 0,
  highestSeen,
  completedSteps: Array.isArray(value.completedSteps) ? [...new Set(value.completedSteps.filter(id => FOUNDATION_STEPS.some(s => s.id === id)))] : []
 };
}
export function foundationPage(p) {
 return {
  ...(FOUNDATION_STEPS[p.step] || FOUNDATION_CONNECTION),
  bounds: FOUNDATION_BOUNDS
 };
}
export function advanceFoundation(p) {
 if (p.step >= FOUNDATION_STEPS.length) return p;
 const step = p.step + 1;
 return {
  ...p,
  step,
  highestSeen: Math.max(p.highestSeen, step),
  completedSteps: [...new Set([...p.completedSteps, FOUNDATION_STEPS[p.step].id])]
 };
}
export function revisitFoundation(p, step) {
 return Number.isInteger(step) && step >= 0 && step <= Math.min(p.highestSeen, FOUNDATION_STEPS.length) ? {
  ...p,
  step
 } : p;
}

// The presentation completes the micro-course in one explicit action.
export function completeFoundation(p) {
 return {
  ...p,
  step: FOUNDATION_STEPS.length,
  highestSeen: FOUNDATION_STEPS.length,
  completedSteps: FOUNDATION_STEPS.map(s => s.id)
 };
}