// User-approved Community illustration and locked places; exploration awards no title.
export const COMMUNITY_OVERVIEW_BOUNDS = [10, 0, 1525, 1010];
export const COMMUNITY_STOPS = [{
  id: 'community-garden',
  name: 'Community Island',
  question: 'Ortak alanı birlikte keşfedelim.',
  text: 'Oryantasyonun ardından topluluk üyesi, yani derneğin gönüllüsü olarak bu ortak alana geldiniz. Kütüphane, açık hava sineması, etkinlik meydanı ve ortak çalışma evi farklı katılım yollarını görünür kılar.',
  connection: 'Geri dön ve Devam et ile adayı tanıyın. Görseli sürükleyebilir, yakınlaştırabilir veya bilgi panelini kapatarak serbestçe gezebilirsiniz.',
  bounds: COMMUNITY_OVERVIEW_BOUNDS
 },
 {
  id: 'community-map',
  name: 'Community Map',
  question: 'Bu topluluğun neresinde yer almak istersiniz?',
  text: 'Topluluk haritası, adadaki ortak alanları ve farklı katkı yollarını bir arada düşünmek için bir buluşma noktasıdır. Öğrenmek, paylaşmak ve gönüllü katkı sunmak için farklı duraklarda yer alabilirsiniz.',
  connection: 'Toplulukta kalmak da bir seçenektir. Herkesin uzmanlık veya eğitmenlik yoluna ilerlemesi gerekmez.',
  bounds: [170, 475, 570, 735]
 },
 {
  id: 'community-library',
  name: 'Library',
  question: 'Birlikte üretilen bilgiye nereden ulaşırız?',
  text: 'Kütüphane, deneyimsel öğrenme üzerine kaynaklara açılan kapıdır. Deneyimselogrenme.com’daki içerikler bu alanla ilişkilidir.',
  connection: 'Okuyabilir, kendi pratiğiniz için kaynakları inceleyebilir ve toplulukta paylaşmak istediğiniz soruları geliştirebilirsiniz.',
  link: {
   label: 'Deneyimselogrenme.com’u aç ↗',
   href: 'https://deneyimselogrenme.com'
  },
  bounds: [165, 65, 620, 300]
 },
 {
  id: 'community-cinema',
  name: 'Open-Air Cinema',
  question: 'Bir videodan hangi ortak soru doğabilir?',
  text: 'Açık hava sineması, deneyimsel öğrenmeyle ilgili videoları ve söyleşileri toplulukla buluşturan alanı temsil eder.',
  connection: 'İzlenen bir deneyim üzerine konuşmak, farklı bakış açılarını duymak ve kendi uygulamamızla bağlantı kurmak için bir buluşma yeri.',
  bounds: [990, 110, 1410, 340]
 },
 {
  id: 'community-events',
  name: 'Event Square',
  question: 'Birlikte ne deneyimleyebiliriz?',
  text: 'Etkinlik meydanı; metot atölyeleri, buluşmalar ve farklı topluluk etkinlikleri için ortak bir alandır. Tek bir etkinlik türüne ayrılmaz.',
  connection: 'Katılımcı olabilir, bir etkinliğe destek verebilir veya başkalarıyla birlikte bir çalışma geliştirebilirsiniz.',
  bounds: [45, 260, 600, 520]
 },
 {
  id: 'community-work',
  name: 'Shared Work House',
  question: 'Katkıyı birlikte nasıl üretiriz?',
  text: 'Ortak çalışma evi, gönüllü çalışma gruplarının birlikte üretimini temsil eder. Çeviri, kaynak paylaşımı veya iletişim çalışmalarına katkı sunmak bu ortak üretimin örnekleridir.',
  connection: 'Katkının kapsamını, sorumluluklarını ve bıraktığı izleri görünür kılmak, sonraki gönüllülük kanıtlarının temelini oluşturur.',
  bounds: [1110, 330, 1515, 570]
 },
 {
  id: 'community-agora',
  name: 'Agora · Association Members',
  question: 'Topluluk ile resmî dernek üyeliği nasıl ayrılır?',
  text: 'Kuzeydeki Agora, resmî dernek üyelerine ayrılmış alandır. Gönüllü topluluk üyeliği, bu alana otomatik erişim sağlamaz.',
  connection: 'Uzmanlık ve üyelik başvurusu yolculuğu ayrıca ele alınır. Şimdi bu alanın yerini ve işlevini tanıyoruz; burada üyelik kazanılmıyor.',
  bounds: [560, 0, 1070, 240]
 }
];
export function freshCommunityProgress() {
 return {
  step: 0,
  highestSeen: 0,
  completedSteps: [],
  freeExplore: false
 };
}
export function restoreCommunityProgress(p) {
 if (!p || typeof p !== 'object') return freshCommunityProgress();
 const highestSeen = Number.isInteger(p.highestSeen) ? Math.max(0, Math.min(COMMUNITY_STOPS.length - 1, p.highestSeen)) : 0;
 return {
  freeExplore: p.freeExplore === true || (Array.isArray(p.completedSteps) && COMMUNITY_STOPS.every(s => p.completedSteps.includes(s.id))),
  step: Number.isInteger(p.step) ? Math.max(0, Math.min(highestSeen, p.step)) : 0,
  highestSeen,
  completedSteps: Array.isArray(p.completedSteps) ? [...new Set(p.completedSteps.filter(id => COMMUNITY_STOPS.some(s => s.id === id)))] : []
 };
}
export function advanceCommunity(p) {
 const step = Math.min(COMMUNITY_STOPS.length - 1, p.step + 1);
 return {
  ...p,
  step,
  highestSeen: Math.max(p.highestSeen, step),
  completedSteps: [...new Set([...p.completedSteps, COMMUNITY_STOPS[p.step].id])]
 };
}
export function revisitCommunity(p, step) {
 return Number.isInteger(step) && step >= 0 && step <= p.highestSeen ? {
  ...p,
  step
 } : p;
}
export function communityComplete(s) {
 return COMMUNITY_STOPS.every(p => s.communityProgress?.completedSteps?.includes(p.id));
}