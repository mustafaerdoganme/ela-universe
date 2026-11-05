import {
 ADDITIONAL_METHOD_FAMILIES,
 EQE_INTRO
} from './method-families.mjs';
// Inventory/source: Ana Kaynak §6 and the user's 17 Oct naming workbook.
// Route membership is source-backed; the short presentation copy is a draft.
export const PHILOSOPHY_STEPS = [{
  id: 'james',
  name: 'William James',
  color: '#edb13e',
  question: 'Deneyim, bir bilme biçimi olabilir mi?',
  text: 'Bu durakta deneyim ile bilme arasındaki ilişkiye ve pragmatizme ilk bakışı görüyoruz. Başlangıç sorumuz: Bir şeyi yalnızca açıklamasını okuyarak bilmekle, onunla karşılaşarak bilmek arasında nasıl bir fark var?',
  connection: 'James’in durağı, deneyim–bilgi ilişkisini ele alan Philosophy of Experiential Learning okuluna bağlanıyor.',
  point: [790, 118],
  bounds: [390, 0, 885, 410],
  path: 'M790 125 C775 168 783 220 778 263 C768 302 714 327 669 344 C613 361 559 366 518 360 C493 354 475 334 475 306'
 },
 {
  id: 'dewey',
  name: 'John Dewey',
  color: '#28c5d7',
  question: 'Yaşanan her deneyim aynı ölçüde eğitici midir?',
  text: 'Bu durakta deneyim ile eğitim arasındaki ilişkiyi sorguluyoruz. Odak, yalnızca bir etkinliğin yapılması değil; deneyimin ne anlama geldiği, nasıl incelendiği ve öğrenmeyle nasıl ilişkilendirildiği.',
  connection: 'Dewey’in mekânından gelen yol, aynı felsefi soruya eğitim ve öğrenme açısından katılıyor.',
  point: [222, 260],
  bounds: [85, 70, 525, 390],
  path: 'M223 262 C254 268 287 280 309 293 C326 306 329 330 355 345 C390 361 451 337 475 306'
 },
 {
  id: 'freire',
  name: 'Paulo Freire',
  color: '#ef806b',
  question: 'Kimin deneyimi, kimin sesi ve kimin bilgisi?',
  text: 'Freire’ye bu ilk temasta, insanların yaşadıklarının ve sözlerinin öğrenmedeki yerine bakıyoruz. Diyalog ve katılım, deneyimden bilgi üretme sorusuna yeni bir boyut ekliyor. Güç, eleştirel bilinç ve dönüşümde derinleşme, Dialogue & Transformation rotasında ele alınacak.',
  connection: 'Freire’nin kültür çemberinden gelen yol da Philosophy of Experiential Learning okuluna ulaşıyor. Bu durak, ayrı Freirean Praxis programı değildir.',
  point: [205, 510],
  bounds: [60, 165, 540, 590],
  path: 'M206 516 C245 536 287 533 311 509 C327 488 312 458 307 422 C302 382 315 345 329 326 C345 343 372 356 400 354 C426 353 468 332 475 306'
 },
 {
  id: 'synthesis',
  name: 'Rotanın sentezi',
  color: '#b98a32',
  question: 'Üç bakış, ortak bir soru.',
  text: 'Deneyim–bilgi ilişkisi, deneyimin eğitimle bağı ve diyalogda söz sahibi olma: Bu rotada üç bağlantı aynı okulda buluştu. Amaç düşünürleri tek bir görüşe indirgemek değil, deneyimsel öğrenmenin felsefi sorularını birlikte görebilmek.',
  connection: 'Kendi pratiğinizi düşünün: Bir deneyimin öğrenmeye dönüşmesini açıklarken bu sorulardan hangisi size yeni bir bakış açısı sağlıyor?',
  point: [475, 306],
  bounds: [60, 0, 885, 590]
 }
];
// Source: naming workbook, school 1.2 (working topic inventory).
export const NEXT_ROUTE_INTRO = {
 name: 'How Learning Moves',
 question: 'Deneyim nasıl öğrenmeye dönüşür?',
 text: 'Bu rotada öğrenmenin deneyim, yansıtma, kavram ve deneme arasında nasıl ilerlediğini ele alıyoruz. Döngü, süreç ve diyalektik ilişkiler üzerinden öğrenmenin hareketini inceleyeceğiz.',
 topics: ['Somut deneyim', 'Yansıtıcı gözlem', 'Soyut kavramsallaştırma', 'Aktif deneme', 'Süreç ve diyalektik', 'Döngü ve spiral'],
 thinkers: 'John Dewey · Jean Piaget · Kurt Lewin · David Kolb',
 bounds: [100, 0, 1420, 820]
};
export const JOURNEYS = [{
  name: 'Architecture of Experiential Learning',
  routes: ['Philosophy of Experiential Learning', 'How Learning Moves', 'Different Ways of Learning', 'Becoming a Learner', 'Learning in Relationship', 'Dialogue & Transformation']
 },
 {
  name: 'Methods & Modalities',
  routes: ['Constructed & Simulated Experience', 'Action & Real-world Practice', 'Inquiry & Investigation', 'Reflection & Meaning-making', 'Embodied, Creative & Performative Experience']
 },
 {
  name: 'Evidence, Quality & Ethics',
  routes: ['Evidence', 'Quality', 'Ethics']
 }
];
// Presentation drafts drawn from the working topic inventory; no fixed
// thinker-to-cycle-stage equivalence, historical lineage or efficacy claim.
export const MOVES_STEPS = [{
  id: 'moves-dewey',
  name: 'John Dewey',
  color: '#28c5d7',
  question: 'Deneyimi yeniden inceleyince ne değişir?',
  text: 'Bir etkinlik yaşamakla ondan öğrenmek arasındaki ilişkiye geri dönüyoruz. Bu kez odağımız süreç: Yaşananı durup incelemek, ilk yorumumuzu sorgulamak ve yeni bir denemeye hazırlanmak.',
  connection: 'Kendi pratiğinizden bir deneyim seçin. O anda ne oldu, sonradan ne fark ettiniz ve yeniden deneseniz neyi değiştirirdiniz?',
  point: [222, 260],
  bounds: [85, 115, 780, 420],
  path: 'M222 260 C258 267 291 281 310 296 C327 309 328 332 356 347 C399 369 462 374 515 366 C568 358 602 337 651 336 C685 335 716 315 725 282 C731 263 729 246 712 243 L668 243'
 },
 {
  id: 'moves-piaget',
  name: 'Jean Piaget',
  color: '#edb13e',
  question: 'Yeni bir deneyim, açıklamamızı değiştirebilir mi?',
  text: 'Bu durakta deneyim ile düşünme arasındaki ilişkiyi ele alıyoruz. Bildiğimiz bir açıklamanın yeni karşılaştığımız duruma yetmediği anları düşünün: Gözlemimizi nasıl yeniden yorumlar, daha kapsayıcı bir açıklamayı nasıl kurarız?',
  connection: 'İlk açıklamanızı değiştirmenize neden olan bir örnek bulun. Deneyiminizle kavramınız arasındaki hareketi My Practice Journal için not edebilirsiniz.',
  point: [1177, 176],
  bounds: [590, 45, 1260, 395],
  path: 'M1177 176 C1166 199 1137 211 1107 226 C1080 240 1063 258 1037 269 C999 281 966 269 938 281 C902 297 874 319 838 333 C805 347 769 350 746 329 C733 313 722 295 725 277 C731 257 726 242 711 243 L668 243'
 },
 {
  id: 'moves-lewin',
  name: 'Kurt Lewin',
  color: '#ef806b',
  question: 'Denediğimiz şeyin etkisini nasıl göreceğiz?',
  text: 'Eylem, gözlem ve yeniden deneme arasındaki bağı inceliyoruz. Bir uygulama yaptıktan sonra yalnızca başarılı olup olmadığına karar vermek yerine, neye baktığımızı ve sonraki kararımızı hangi gözleme dayandırdığımızı soruyoruz.',
  connection: 'Küçük bir değişiklik deneseniz neyi gözlemlerdiniz? Hangi bulgu sizi aynı denemeyi sürdürmeye, hangisi yön değiştirmeye çağırırdı?',
  point: [1342, 304],
  bounds: [600, 140, 1440, 430],
  path: 'M1342 304 C1310 325 1270 338 1234 325 C1202 314 1174 303 1145 311 C1103 322 1071 292 1037 276 C1002 262 965 267 938 281 C902 297 874 319 838 333 C805 347 769 350 746 329 C733 313 722 295 725 277 C731 257 726 242 711 243 L668 243'
 },
 {
  id: 'moves-kolb',
  name: 'Alice & David Kolb',
  color: '#a5c45d',
  question: 'Deneyim, yansıtma, kavram ve deneme nasıl bağlanır?',
  text: 'Somut deneyim, yansıtıcı gözlem, soyut kavramsallaştırma ve aktif denemeyi birlikte okuyoruz. Rotanın odağı bu kavramları ezberlemek değil; bir deneyim üzerinde aralarındaki geçişleri ve yeni denemenin açtığı soruları görebilmek.',
  connection: 'Kendi örneğinizde bu dört hareketin izini sürün. Yeni deneme sizi başlangıçtaki soruya aynı yerden mi, başka bir yerden mi döndürüyor? Döngü ve spiral sorusunu burada ele alıyoruz.',
  point: [1190, 703],
  bounds: [595, 140, 1390, 810],
  path: 'M1190 703 C1148 697 1108 685 1077 666 C1045 646 1026 616 1010 581 C991 537 971 505 937 481 C902 457 862 436 828 402 C800 374 772 352 746 329 C733 313 722 295 725 277 C731 257 726 242 711 243 L668 243'
 }
];
export const DIFFERENT_WAYS_INTRO = {
 name: 'Different Ways of Learning',
 question: 'Herkes öğrenmeye aynı yerden mi yaklaşır?',
 text: 'Bu rotada öğrenme tercihlerini, bireysel farklılıkları ve envanterleri ele alacağız. Stiller ve psikolojik tiplerle ilgili iddiaları, kullanılabilecekleri alanlar ve sınırlarıyla birlikte inceleyeceğiz.',
 topics: ['Psikolojik tipler', 'Öğrenme tercihleri ve stilleri', 'Bireysel farklılıklar', 'Öğrenme envanterleri', 'Envanterlerin ve iddiaların sınırları'],
 thinkers: 'Carl Jung · Kolb’un öğrenme stilleri ve envanter literatürü',
 bounds: [450, 200, 1470, 820]
};
export const DIFFERENT_WAYS_STEPS = [{
  id: 'different-jung',
  name: 'Carl Jung',
  color: '#b9a0e0',
  question: 'Öğrenmeye yaklaşırken hangi eğilimlerimizi fark ediyoruz?',
  text: 'Psikolojik tipler ve bireysel farklılıklar bu durağın başlangıç soruları. Kendi yaklaşımınızı gözlemleyin: Yalnız düşünmek, başkalarıyla konuşmak, somut örnek görmek ya da olasılıkları araştırmak farklı durumlarda sizin için nasıl işliyor?',
  connection: 'Bir eğilimi fark etmekle kendinizi değişmez bir tipe yerleştirmek aynı şey mi? Journal’ınızda, alıştığınız yaklaşımın işe yaradığı ve yetmediği iki durumu karşılaştırabilirsiniz.',
  point: [1366, 492],
  bounds: [455, 270, 1470, 690],
  path: 'M1366 492 C1327 508 1285 517 1246 540 C1207 564 1167 590 1124 600 C1080 610 1036 601 997 577 C957 552 934 514 900 488 C867 462 833 448 793 447 C747 445 719 462 684 465 C632 469 587 451 550 414'
 },
 {
  id: 'different-kolb',
  name: 'Alice & David Kolb',
  color: '#a5c45d',
  question: 'Bir öğrenme envanteri bize ne söyler; neyi söylemez?',
  text: 'Öğrenme tercihlerini, stilleri ve envanterleri kendi pratiğimiz üzerine düşünmek için ele alıyoruz. Bir sonuçla karşılaştığımızda şu soruları soracağız: Bu envanter neyi ölçmeyi amaçlıyor? Sonucu hangi gözlemlerle karşılaştırabiliriz? Hangi iddialar için ayrıca kanıt gerekir?',
  connection: 'Bir tercih, her koşulda aynı yöntemle öğrenmeniz gerektiğini gösterir mi? Bir envanter sonucunu, kendi öğrenme örneğinize bakarak hangi yönlerden destekler ya da sorgularsınız?',
  point: [1190, 703],
  bounds: [450, 285, 1380, 820],
  path: 'M1190 703 C1148 697 1108 685 1077 666 C1045 646 1026 616 1010 581 C991 537 971 505 937 481 C902 457 867 446 828 445 C772 440 737 457 699 463 C642 472 590 454 550 414'
 }
];
export const BECOMING_INTRO = {
 name: 'Becoming a Learner',
 question: 'Kendi öğrenmenizde nasıl söz sahibi olursunuz?',
 text: 'Bu rotada kendimizi öğrenen olarak nasıl gördüğümüze, öğrenmemize nasıl yön verdiğimize ve farklı öğrenme yollarına nasıl açılabileceğimize bakacağız.',
 topics: ['Kişi merkezli öğrenme', 'Benlik', 'Agency: kendi öğrenmesinde söz sahibi olma', 'Öğrenen kimliği', 'Learning flexibility: öğrenme esnekliği'],
 thinkers: 'Carl Rogers · Öğrenen kimliği ve öğrenme esnekliğiyle pedagojik bağlantılar',
 bounds: [480, 240, 850, 850]
};
// School 1.4: Rogers plus pedagogical connections; not a claim that
// Rogers originated the later learning-identity / learning-flexibility terms.
export const BECOMING_STEPS = [{
 id: 'becoming-rogers',
 name: 'Carl Rogers',
 color: '#6bc3ad',
 question: 'Kendi öğrenmenize nasıl yön veriyorsunuz?',
 text: 'Kişi merkezli öğrenmeden başlayarak kendi hedeflerimize, benliğimize ve öğrenen olarak kendimizi nasıl gördüğümüze bakıyoruz. Bu durakta öğrenen kimliği ve öğrenme esnekliğiyle bağlantı kuruyoruz: Alıştığımız yaklaşımın ötesine geçmek için neyi denemek isteriz?',
 connection: 'Journal’ınızda seçtiğiniz çalışmaya dönün. Neyi öğrenmek istediğinize kim karar veriyor? “Ben böyle öğrenirim” dediğinizde hangi imkânları açıyor, hangilerini kapatıyorsunuz? Bir sonraki küçük denemenizi kendiniz belirleyin.',
 point: [590, 830],
 bounds: [475, 235, 850, 895],
 path: 'M590 830 C627 835 666 823 694 798 C722 771 731 728 743 687 C759 634 767 583 768 530 L768 490 C763 465 741 449 710 443 C677 438 646 423 628 399 C609 374 629 347 662 330'
}];
export const RELATIONSHIP_INTRO = {
 name: 'Learning in Relationship',
 question: 'Öğrenmeyi mümkün kılan ilişkileri nasıl kurarız?',
 text: 'Bu rotada kişiler arası ilişkileri, öğrenme ortamlarını ve eğitimcinin üstlendiği rolleri birlikte inceleyeceğiz. Odağımız, kişinin tek başına yaptıklarının yanında birlikte öğrenmenin koşullarını da görebilmek.',
 topics: ['Sosyal ve ilişkisel öğrenme', 'Öğrenme ortamını kuran ilişkiler', 'Learning Spaces: güven, diyalog, yansıtma ve oyun', 'Öğrenen merkezli ve derin öğrenmeye açık alanlar', 'Educator Role Profile: Facilitator, Expert, Evaluator, Coach'],
 thinkers: 'Lev Vygotsky · Mary Parker Follett · Kurt Lewin · Carl Rogers',
 connection: 'Buradaki eğitimci rolleri dernek unvanları değildir.',
 bounds: [230, 0, 1450, 910]
};
// School 1.5: presentation questions, not fixed Learning Spaces/source mappings.
export const RELATIONSHIP_STEPS = [{
  id: 'relationship-vygotsky',
  name: 'Lev Vygotsky',
  color: '#edb13e',
  question: 'Birlikte düşünürken tek başımıza göremediğimiz neyi fark ederiz?',
  text: 'Bu durakta sosyal ve ilişkisel öğrenmeyi ele alıyoruz. Bir kişinin sorusu, kullandığımız bir araç ya da birlikte kurduğumuz bir açıklama öğrenme deneyimimizi nasıl değiştiriyor? Öğrenmeyi yalnızca kişinin kendi içinde yaptıklarıyla açıklamak yeterli mi?',
  connection: 'Journal’ınızdaki çalışmaya bakın. Başka birinin sorusu veya desteği nerede yeni bir imkân açabilir? O kişinin sizin yerinize yapmasıyla, sizin öğrenmenize destek olması arasındaki farkı düşünün.',
  point: [420, 154],
  bounds: [260, 0, 570, 490],
  path: 'M420 154 C394 175 373 202 361 232 C347 264 325 289 317 322 C304 365 307 402 330 432 C349 455 377 451 400 438 L430 420'
 },
 {
  id: 'relationship-follett',
  name: 'Mary Parker Follett',
  color: '#b9a0e0',
  question: 'Farklı ihtiyaçları ortak bir çalışmada nasıl buluştururuz?',
  text: 'Birlikte öğrenirken söz alma, katılma ve ortak karar verme biçimlerimize bakıyoruz. Farklı görüşleri yalnızca sırayla dinlemekle, bu görüşlerin birlikte çalışmanın şeklini değiştirmesine alan açmak arasında nasıl bir fark var?',
  connection: 'Seçtiğiniz çalışmada kimlerin ihtiyacı görünür, kimlerinki sessiz kalıyor? Herkesin aynı cevabı vermesini beklemeden birlikte değiştirebileceğiniz bir düzenleme düşünün.',
  point: [377, 736],
  bounds: [245, 300, 570, 810],
  path: 'M377 736 C417 728 452 705 473 675 C497 639 490 606 465 578 C441 550 406 532 378 500 C356 476 337 453 352 441 C369 429 387 442 402 438 L430 420'
 },
 {
  id: 'relationship-lewin',
  name: 'Kurt Lewin',
  color: '#ef806b',
  question: 'Grubun yaşadıklarından birlikte nasıl öğreniriz?',
  text: 'Grup deneyimini de inceleyebileceğimiz bir öğrenme malzemesi olarak ele alıyoruz. Bir etkinlik sırasında kim konuştu, kim geri çekildi, hangi davranışlar katılımı açtı veya daralttı? Oyun ve ortak çalışma sonrasında bu deneyimi nasıl birlikte gözden geçirebiliriz?',
  connection: 'Journal’ınızdaki çalışmaya küçük bir grup denemesi ekleseniz neyi gözlemlerdiniz? Yalnızca sonucu değil, birlikte çalışma sürecini de konuşabilmek için hangi soruyu sorardınız?',
  point: [1342, 304],
  bounds: [300, 180, 1450, 590],
  path: 'M1342 304 C1310 325 1270 338 1234 325 C1202 314 1174 303 1145 311 C1103 322 1071 292 1037 276 C1002 262 965 267 938 281 C902 297 874 319 838 333 C798 350 761 361 725 385 C689 411 660 436 621 448 C578 462 541 456 504 446 C477 439 453 430 430 420'
 },
 {
  id: 'relationship-rogers',
  name: 'Carl Rogers',
  color: '#6bc3ad',
  question: 'Öğrenenin ihtiyacına göre hangi rolü üstleniriz?',
  text: 'Öğrenen merkezli bir ortamda dinleme, güven ve kişinin söz sahibi olması üzerine düşünüyoruz. Bu çerçevede Facilitator, Expert, Evaluator ve Coach rollerini karşılaştırıyoruz: Ne zaman alan açmak, bilgi sunmak, değerlendirmek ya da gelişimi destekleyen sorular sormak gerekir?',
  connection: 'Kendi çalışmanızda hangi role daha sık geçiyorsunuz? Başka bir rolü seçmeniz gereken bir anı düşünün. Buradaki roller dernek unvanları değildir; Expert rolü, Deneyimsel Öğrenme Uzmanı unvanı anlamına gelmez.',
  point: [590, 830],
  bounds: [280, 300, 800, 900],
  path: 'M590 830 C627 835 666 823 694 798 C722 771 731 728 743 687 C759 634 767 583 768 530 L768 490 C750 463 720 450 685 453 C640 459 605 478 565 465 C521 449 477 438 430 420'
 }
];
export const DIALOGUE_INTRO = {
 name: 'Dialogue & Transformation',
 question: 'Diyalog, katılım ve dönüşüm arasında nasıl bir bağ kurarız?',
 text: 'Bu rotada kültür çemberlerinden başlayarak kimin söz sahibi olduğuna, güç ilişkilerine ve ortak deneyimimizi nasıl sorguladığımıza bakacağız. Diyalogla ortaya çıkan soruların eylem ve dönüşümle ilişkisini ele alacağız.',
 topics: ['Culture circles: kültür çemberleri', 'Diyalog', 'Eleştirel bilinç', 'Güç ilişkileri', 'Katılım', 'Dönüşüm'],
 thinkers: 'Paulo Freire',
 connection: 'Bu, Certificate içindeki düşünsel rotadır; ayrı Freirean Praxis programı değildir.',
 bounds: [60, 300, 700, 670]
};
export const DIALOGUE_STEPS = [{
 id: 'dialogue-freire',
 name: 'Paulo Freire',
 color: '#ef806b',
 question: 'Kimin sözü, hangi değişime alan açıyor?',
 text: 'Kültür çemberi, diyalog, eleştirel bilinç ve güç ilişkileri bu durağın odağı. Ortak bir durumu konuşurken hangi deneyimleri görünür kılıyor, hangi kabulleri sorguluyoruz? Katılımı yalnızca söz almakla sınırlamadan, insanların soruları ve eylemleri üzerinde söz sahibi olmasını nasıl ele alabiliriz?',
 connection: 'Journal’ınızdaki çalışmada kimin sesi eksik? Katılımcılarla birlikte adlandırmak ve değiştirmek istediğiniz bir durumu seçin. Bu soruşturmadan hangi küçük eylem doğabilir? Bu Certificate durağı ayrı Freirean Praxis programının yerine geçmez.',
 point: [205, 516],
 bounds: [60, 300, 700, 660],
 path: 'M205 516 C245 536 287 533 311 509 C334 488 348 466 379 459 C407 452 431 465 460 455 C492 444 516 432 541 430 C552 429 562 433 570 438'
}];
export const METHODS_INTRO = {
 name: 'Methods & Modalities',
 journeyIntro: true,
 question: 'Hangi deneyimi, hangi yöntemle kurarız?',
 text: 'İkinci yolculukta beş yöntem ailesini tanıyacak, karşılaştıracak ve kendi pratiğimize bağlayacağız. Yöntemin ürettiği deneyime, kaynaklarına, sınırlarına ve öğrenme süreciyle bağlantısına bakacağız.',
 topics: JOURNEYS[1].routes,
 introNote: 'Method Passport, yöntemin kaynaklarını, ürettiği deneyimi ve kendi pratiğinizle bağlantısını düşünmenize eşlik eder.',
 connection: 'Bu yolculuk yöntem okuryazarlığı sağlar; her yöntemde uzman uygulayıcılık kazandıran bir ToT olarak kurgulanmaz.',
 bounds: [780, 80, 1280, 620]
};
// School 2.1: the six source-inventory examples share the approved learning
// area. They are not six new buildings, an exhaustive catalogue or ToT awards.
const constructedView = {
 bounds: [740, 40, 1190, 460],
 highlight: [955, 237, 108, 83]
};
export const CONSTRUCTED_INTRO = {
 name: 'Constructed & Simulated Experience',
 question: 'Kurguladığımız deneyimde neyin öğrenilmesini istiyoruz?',
 text: 'Bu ailede gerçek yaşamı temsil eden veya özel olarak kurgulanmış deneyimleri inceleyeceğiz. Deneyimin nasıl kurulduğuna, katılımcının ne yaptığına ve sonrasında neyi tartışabildiğine bakacağız.',
 topics: ['Simulation: simülasyon', 'Scenario: senaryo', 'Case study: vaka çalışması', 'Role play: rol oynama', 'Serious games', 'Sanal / karma deneyimler'],
 introNote: 'Bu altı örnek, mevcut yöntem envanterinin bir bölümüdür; tamamlanmış bir yöntem kataloğu değildir.',
 connection: 'Her adımda kendi çalışmanızla bağlantı kurarak Method Passport için notlar geliştirebilirsiniz.',
 ...constructedView
};
export const CONSTRUCTED_STEPS = [{
  id: 'constructed-simulation',
  name: 'Simulation · Simülasyon',
  question: 'Gerçek durumun hangi ilişkilerini temsil ediyoruz?',
  text: 'Simülasyon örneğinde bir durumun işleyişini, kararları ve bu kararların olası sonuçlarını nasıl temsil edebileceğimize bakıyoruz. Tasarım sorumuz: Katılımcı hangi kararı verecek, kararının etkisini nasıl görecek ve deneyimden sonra neyi inceleyecek?',
  connection: 'Method Passport: Kendi çalışmanız için hangi ilişkiyi görünür kılmak istersiniz? Temsilin gerçek hayattan nerede ayrıldığını ve bu sınırın öğrenme sorunuza etkisini not edin.'
 },
 {
  id: 'constructed-scenario',
  name: 'Scenario · Senaryo',
  question: 'Hangi durum, anlamlı bir karar sorusu açar?',
  text: 'Senaryo örneğinde koşulları, kişileri ve karar anlarını ele alıyoruz. Bir hikâye anlatmanın ötesinde, katılımcının durumu yorumlamasına ve seçenekleri tartışmasına hangi bilgilerle alan açacağımızı soruyoruz.',
  connection: 'Method Passport: Kendi çalışmanızdan bir karar anı seçin. Başlangıçta hangi bilgi verilmeli, hangi soru açık kalmalı? Katılımcıların farklı tercihlerini nasıl konuşabilirsiniz?'
 },
 {
  id: 'constructed-case',
  name: 'Case study · Vaka çalışması',
  question: 'Bir durumu hangi kanıtlarla inceliyoruz?',
  text: 'Vaka çalışması örneğinde tanımlanmış bir durumu, içindeki bilgileri ve farklı yorumları inceliyoruz. Hemen doğru cevaba koşmak yerine, ne bildiğimizi, neyi varsaydığımızı ve karar için hangi bilginin eksik olduğunu soruyoruz.',
  connection: 'Method Passport: Çalışmanızdaki bir durumu vaka olarak ele alsanız hangi kanıtları paylaşırdınız? Katılımcıların kendi yorumlarının dayanaklarını görünür kılması için bir soru yazın.'
 },
 {
  id: 'constructed-roleplay',
  name: 'Role play · Rol oynama',
  question: 'Bir duruma başka bir rolden bakınca ne değişir?',
  text: 'Rol oynama örneğinde bir durumun içindeki farklı kişilerin bakışlarını ve etkileşimlerini ele alıyoruz. Rollerin ne istediğini, hangi sınırlarda hareket ettiğini ve karşılaşma sonrasında nelerin konuşulabileceğini düşünüyoruz.',
  connection: 'Method Passport: Kendi çalışmanızdaki iki rolü seçin. Her birinin ihtiyacı ve hareket alanı ne? Deneyim sonrasında roller ile gerçek kişiler arasındaki ayrımı nasıl konuşursunuz?'
 },
 {
  id: 'constructed-seriousgames',
  name: 'Serious games',
  question: 'Oyunun amacıyla öğrenme sorusu nasıl buluşur?',
  text: 'Bu örnekte kurallar, hedefler, seçimler ve geri bildirim üzerine düşünüyoruz. Oyunda ilerlemek için yapılanlarla, deneyimden öğrenmek için konuşulacaklar arasındaki ilişkiye bakıyoruz: Katılımcının hangi kararı öğrenme sorumuzu görünür kılacak?',
  connection: 'Method Passport: Bir kural veya karar anı önerin. Oyunun kazanılmasıyla öğrenme amacının karşılanmasını ayrı ayrı nasıl gözlemlerdiniz?'
 },
 {
  id: 'constructed-virtual',
  name: 'Virtual & mixed experiences',
  question: 'Sanal ve fiziksel parçalar nasıl bir deneyim oluşturuyor?',
  text: 'Sanal ve karma deneyim örneklerinde ortamı, etkileşimi ve kullanılan araçları ele alıyoruz. Ekranda ya da fiziksel alanda ne yapılacağını, katılımcıların birbirleriyle nasıl ilişki kuracağını ve deneyimin nasıl inceleneceğini soruyoruz.',
  connection: 'Method Passport: Çalışmanız için bir sanal veya karma deneyim düşünün. Hangi parça hangi ortamda yapılmalı? Araçların varlığından ayrı olarak, öğrenme amacını nasıl gözden geçirirsiniz?'
 }
].map(s => ({
 ...s,
 color: '#edb13e',
 ...constructedView
}));
export const ACTION_INTRO = {
 name: 'Action & Real-world Practice',
 question: 'Gerçek bir iş yaparken öğrenmeyi nasıl görünür kılarız?',
 text: 'Bu ailede gerçek sorunlar, projeler, iş ve topluluk katkıları içindeki eyleme bakacağız. Yapılan iş ile o işten öğrenilenler arasındaki bağı gözlem, yansıtma ve kişisel pratiğe aktarım üzerinden ele alacağız.',
 topics: ['Action learning', 'Project-based learning: proje temelli öğrenme', 'Workplace learning: işbaşında öğrenme', 'Fieldwork: saha çalışması', 'Service / community learning'],
 introNote: 'Farklı araştırma ve uygulama gelenekleriyle ilişkilidir; kaynak bağlantıları tek bir kurucuya indirgenmez.',
 connection: 'Journal’ınızdaki çalışmada hangi gerçek sorun veya katkı bir öğrenme fırsatı açabilir?',
 bounds: [780, 190, 1250, 610],
 highlight: [990, 385, 99, 67]
};
export const PRACTICE_JOURNAL = {
 id: 'practice-journal',
 type: 'journal',
 color: '#edb13e',
 name: 'My Practice Journal',
 question: 'Yolculuğa kendi pratiğinizle başlayın.',
 text: 'Kendi alanınızdan geliştirmek istediğiniz bir çalışma seçin: bir yöntem, bir tasarım ya da yürüttüğünüz bir uygulama olabilir. Bütün yolculuklarda aynı çalışma üzerine düşünecek; bağlantılarınızı, denemelerinizi ve değişim izlerini kendi günlüğünüzde biriktireceksiniz.',
 topics: ['Hangi çalışma üzerinde ilerleyeceğim?', 'Şu anda bu çalışmada ne oluyor?', 'Yolculuk boyunca neyi geliştirmek istiyorum?'],
 connection: 'My Practice Journey / Journal bütün yolculuklara eşlik eder. İsterseniz günlüğünüz için akademiden danışman geribildirimi ayrıca alabilirsiniz.',
 point: [768, 948],
 bounds: [680, 290, 925, 490],
 path: 'M768 948 L768 490 Q768 445 801 408',
 route: {
  number: 0,
  name: 'My Practice Journal',
  target: [801, 408]
 }
};
// School 3.1–3.3: three shared-building axes. Sublesson catalogues and
// individual thinker/source-place mappings remain open.
const eqeRoute = {
 ...EQE_INTRO.route,
 caption: 'KANIT · KALİTE · ETİK'
};
export const EQE_STEPS = [{
  id: 'eqe-evidence',
  name: 'Evidence',
  question: 'Bu iddiayı neye dayanarak kuruyoruz?',
  text: 'Kanıt ekseninde kaynakların türünü ve güvenilirliğini, teorik bir açıklamayla ampirik bir bulgunun ayrımını ele alıyoruz. Bir araştırma veya uygulama anlatısıyla karşılaştığımızda neyin gözlendiğini, neyin yorumlandığını ve çıkarımın hangi sınırlar içinde geçerli olabileceğini soruyoruz.',
  connection: 'Journal’ınızdaki bir iddiayı seçin. Kaynağı ne, hangi tür destek sunuyor ve neyi henüz bilmiyorsunuz? Kanıtın izin verdiğinden daha geniş bir sonuç çıkarıp çıkarmadığınızı inceleyin.'
 },
 {
  id: 'eqe-quality',
  name: 'Quality',
  question: 'İyi görünen bir uygulamada öğrenmeyi nasıl inceleriz?',
  text: 'Kalite ekseninde experiential etiketini, öğrenme stillerine ilişkin iddiaları, geçerliği ve transferi sorguluyoruz. Etkinliğin ilgi çekici olması, öğrenmenin gerçekleşmesi ve öğrenilenin başka bir bağlama taşınması için hangi farklı soruları sormamız gerektiğini ele alıyoruz.',
  connection: 'Kendi çalışmanızda neyi başarı sayıyorsunuz? Bu ölçüt öğrenme amacınızla ne kadar ilişkili? Öğrenilenin başka bir durumda kullanılmasını hangi izlerle inceleyebilirsiniz?'
 },
 {
  id: 'eqe-ethics',
  name: 'Ethics',
  question: 'Bu deneyim kime yarıyor; kimin katılımını zorlaştırıyor?',
  text: 'Etik ekseninde güç, rıza, güvenlik, katılım ve kapsayıcılığı birlikte ele alıyoruz. Kimin deneyiminin nasıl temsil edildiğine, veri ve araştırma süreçlerine, olası zararlara ve tasarlayan ya da uygulayan kişinin sorumluluğuna bakıyoruz.',
  connection: 'Journal’ınızdaki çalışmada hangi kararlar katılımcının elinde? Katılmama veya farklı biçimde katılma alanı nerede? Temsil, veri kullanımı ve olası zararlar için hangi soruları tasarıma geri taşımalısınız?'
 }
].map(s => ({
 ...s,
 type: 'stop',
 color: '#edb13e',
 bounds: EQE_INTRO.bounds,
 highlight: EQE_INTRO.highlight,
 route: eqeRoute
}));
export const JOURNAL_REVIEW = {
 id: 'journal-review',
 type: 'journal-review',
 name: 'My Practice Journal',
 question: 'Çalışmanızda ne değişti; sıradaki denemeniz ne?',
 text: 'Başlangıçta seçtiğiniz çalışmaya yeniden bakın. Düşünsel rotalarda kurduğunuz bağlantıları, yöntem tercihlerinizi ve kanıt–kalite–etik sorularını birlikte değerlendirin. Günlüğünüzde yalnızca vardığınız sonucu değil, düşüncenizin nasıl değiştiğini ve hangi soruların açık kaldığını da görünür kılabilirsiniz.',
 topics: ['Reflect: ilk notlarınızla bugün neyi farklı gördüğünüzü karşılaştırın.', 'Connect: düşünsel rotalar, yöntemler ve kendi çalışmanız arasında bağlantı kurun.', 'Practice: geliştirmek istediğiniz bir denemeyi belirleyin.', 'Transfer: bu denemeyi kendi bağlamınıza nasıl taşıyacağınızı düşünün.'],
 connection: 'My Practice Journey / Journal bütün yolculukları birleştirir. İsterseniz günlüğünüz için akademiden danışman geribildirimi ayrıca alabilirsiniz.',
 bounds: [680, 290, 925, 490],
 highlight: [801, 408, 81, 63],
 route: {
  ...PRACTICE_JOURNAL.route
 }
};
const philosophy = {
 number: 1,
 name: 'Philosophy of Experiential Learning',
 target: [475, 306]
};
const moves = {
 number: 2,
 name: 'How Learning Moves',
 target: [668, 243]
};
const different = {
 number: 3,
 name: 'Different Ways of Learning',
 target: [550, 414]
};
const becoming = {
 number: 4,
 name: 'Becoming a Learner',
 target: [662, 330]
};
const relationship = {
 number: 5,
 name: 'Learning in Relationship',
 target: [430, 420]
};
const dialogue = {
 number: 6,
 name: 'Dialogue & Transformation',
 target: [570, 438]
};
const methods = {
 number: 7,
 name: 'Methods & Modalities',
 journey: 'Methods & Modalities',
 target: [1040, 420]
};
const constructed = {
 number: 8,
 displayNumber: 1,
 name: 'Constructed & Simulated Experience',
 journey: 'Methods & Modalities',
 target: [955, 237]
};
const action = {
 number: 9,
 displayNumber: 2,
 name: 'Action & Real-world Practice',
 journey: 'Methods & Modalities',
 target: [990, 385]
};
export const LEGACY_COURSE_PAGES = [
 ...PHILOSOPHY_STEPS.map(s => ({
  ...s,
  type: 'stop',
  route: philosophy
 })),
 {
  ...NEXT_ROUTE_INTRO,
  id: 'moves-intro',
  type: 'intro',
  route: moves
 },
 ...MOVES_STEPS.map(s => ({
  ...s,
  type: 'stop',
  route: moves
 })),
 {
  ...DIFFERENT_WAYS_INTRO,
  id: 'different-intro',
  type: 'intro',
  route: different
 },
 ...DIFFERENT_WAYS_STEPS.map(s => ({
  ...s,
  type: 'stop',
  route: different
 })),
 {
  ...BECOMING_INTRO,
  id: 'becoming-intro',
  type: 'intro',
  route: becoming
 },
 ...BECOMING_STEPS.map(s => ({
  ...s,
  type: 'stop',
  route: becoming
 })),
 {
  ...RELATIONSHIP_INTRO,
  id: 'relationship-intro',
  type: 'intro',
  route: relationship
 },
 ...RELATIONSHIP_STEPS.map(s => ({
  ...s,
  type: 'stop',
  route: relationship
 })),
 {
  ...DIALOGUE_INTRO,
  id: 'dialogue-intro',
  type: 'intro',
  route: dialogue
 },
 ...DIALOGUE_STEPS.map(s => ({
  ...s,
  type: 'stop',
  route: dialogue
 })),
 {
  ...METHODS_INTRO,
  id: 'methods-intro',
  type: 'intro',
  route: methods
 },
 {
  ...CONSTRUCTED_INTRO,
  id: 'constructed-intro',
  type: 'intro',
  route: constructed
 },
 ...CONSTRUCTED_STEPS.map(s => ({
  ...s,
  type: 'stop',
  route: constructed
 })),
 {
  ...ACTION_INTRO,
  id: 'action-intro',
  type: 'intro',
  route: action
 },
 ...ADDITIONAL_METHOD_FAMILIES.flatMap((family, i) => [...(i ? [family.intro] : []), ...family.steps]),
 EQE_INTRO,
 ...EQE_STEPS,
 JOURNAL_REVIEW
];
// v25: examples remain in the source inventory, not in the navigation sequence.
const METHOD_SUMMARIES = {
 constructed: ['Bir durumun işleyişini ve karar sonuçlarını temsil etmek.', 'Koşullar ve karar anları üzerinden seçenekleri tartışmak.', 'Tanımlı bir durumu kanıtları ve farklı yorumlarıyla incelemek.', 'Farklı rollerin ihtiyaçlarını ve etkileşimini deneyimlemek.', 'Kurallar, seçimler ve geribildirimi öğrenme sorusuyla ilişkilendirmek.', 'Sanal ve fiziksel etkileşimleri öğrenme amacıyla birleştirmek.'],
 action: ['Gerçek bir sorun üzerinde eylem ve ortak sorgulama.', 'Bir proje üretirken kararları ve öğrenmeyi izleme.', 'Gerçek iş görevleri ve çalışma ilişkilerinden öğrenme.', 'Doğrudan gözlem ve sahadan gelen deneyimleri inceleme.', 'Gerçek topluluk katkısı ve birlikte değerlendirme.'],
 inquiry: ['Uygulamayı değiştirirken bilgi toplama ve yeniden deneme.', 'Deneyimi yaşayanları soruya ve yoruma ortak etme.', 'Bir problem etrafında araştırma ve çözüm seçenekleri geliştirme.', 'Önemli bir olayı somut ayrıntılarıyla inceleme.'],
 reflection: ['Yaşananları ve öğrenme amacıyla bağlantılarını birlikte inceleme.', 'Farklı yorumların gözlemlerini ve varsayımlarını görünür kılma.', 'Notlarla soruları, değişimleri ve sonraki denemeleri izleme.', 'Deneyimi bir anlatıya dönüştürürken farklı bakışları inceleme.', 'Olağan kabulleri, güç ilişkilerini ve eksik sesleri sorgulama.'],
 embodied: ['Çizim, ses ve yaratıcı ifadeyle deneyimi inceleme.', 'Beden, ritim, mesafe ve birlikte hareketten öğrenme.', 'Malzemeyle tasarlama, deneme ve yeniden üretme.', 'Durumları kişiler, ilişkiler ve sahne eylemleriyle görünür kılma.', 'Beden, mekân, eylem ve izleyici deneyimini ilişkilendirme.', 'Sahnelenen bir soruna müdahaleleri ve güç ilişkilerini tartışma.', 'Tiyatro araçlarını öğrenme ve topluluk bağlamlarında kullanma.']
};
const families = [{
 key: 'constructed',
 intro: CONSTRUCTED_INTRO,
 route: constructed,
 steps: CONSTRUCTED_STEPS
}, ...ADDITIONAL_METHOD_FAMILIES];
export const METHOD_FAMILY_PAGES = families.map(f => ({
 ...f.intro,
 id: f.key + '-family',
 type: 'stop',
 route: f.route,
 color: '#edb13e',
 examples: f.steps.map((s, i) => ({
  name: s.name,
  text: METHOD_SUMMARIES[f.key][i]
 })),
 connection: 'Bu aileden kendi çalışmanıza uygun bir örnek seçin. Oluşturduğu deneyimi, sınırlarını ve öğrenme amacıyla bağlantısını Method Passport için not edin.'
}));
export const COURSE_PAGES = [...LEGACY_COURSE_PAGES.slice(0, 22), ...METHOD_FAMILY_PAGES, EQE_INTRO, ...EQE_STEPS, JOURNAL_REVIEW];
export function coursePage(p) {
 return !p.started || p.journalOpen ? PRACTICE_JOURNAL : COURSE_PAGES[p.step] || COURSE_PAGES[0];
}
export function routeProgress(p) {
 const page = coursePage(p),
  stops = COURSE_PAGES.filter(s => s.type === 'stop' && s.route.number === page.route.number);
 return {
  total: stops.length,
  count: stops.filter(s => p.completedSteps.includes(s.id)).length,
  index: stops.findIndex(s => s.id === page.id) + 1
 };
}
export function freshCourseProgress() {
 return {
  layoutVersion: 2,
  started: false,
  journalOpen: true,
  step: 0,
  highestSeen: 0,
  completedSteps: [],
  journalStatus: "draft"
 };
}
export function restoreCourseProgress(value) {
 if (!value || typeof value !== 'object') return freshCourseProgress();
 const old = value.layoutVersion !== 2,
  source = old ? LEGACY_COURSE_PAGES : COURSE_PAGES;
 const safeIndex = n => Number.isInteger(n) ? Math.max(0, Math.min(source.length - 1, n)) : 0;
 const oldHigh = safeIndex(value.highestSeen),
  oldStep = Math.min(oldHigh, safeIndex(value.step));
 const mapIndex = i => {
  const page = source[i],
   family = METHOD_FAMILY_PAGES.find(f => f.route.number === page.route.number);
  return Math.max(0, COURSE_PAGES.findIndex(p => p.id === (family ? family.id : page.id)));
 };
 const highestSeen = old ? mapIndex(oldHigh) : oldHigh,
  step = old ? mapIndex(oldStep) : oldStep;
 const completed = new Set(Array.isArray(value.completedSteps) ? value.completedSteps : []);
 if (old)
  for (const family of METHOD_FAMILY_PAGES) {
   const previous = LEGACY_COURSE_PAGES.filter(p => p.type === 'stop' && p.route.number === family.route.number);
   // Partial families stay open at the consolidated card; only fully completed
   // families receive completion credit. Preserve partial IDs for audit/recovery.
   if (previous.every(p => completed.has(p.id))) completed.add(family.id);
  }
 const legacyApproved = value.journalStatus === undefined && value.started === true && highestSeen >= COURSE_PAGES.length - 1 && COURSE_PAGES.filter(p => p.type === 'stop').every(p => completed.has(p.id));
 return {
  journalStatus: legacyApproved ? 'approved' : ['draft', 'submitted', 'approved'].includes(value.journalStatus) ? value.journalStatus : 'draft',
  layoutVersion: 2,
  started: value.started === true,
  journalOpen: value.started !== true || value.journalOpen === true,
  step,
  highestSeen,
  completedSteps: COURSE_PAGES.filter(p => p.type === 'stop' && completed.has(p.id)).map(p => p.id),
  legacyCompletedSteps: old ? [...completed].filter(id => LEGACY_COURSE_PAGES.some(p => p.id === id)) : Array.isArray(value.legacyCompletedSteps) ? value.legacyCompletedSteps.filter(id => LEGACY_COURSE_PAGES.some(p => p.id === id)) : []
 };
}
export function advanceCourse(p) {
 if (coursePage(p).type === 'journal') return {
  ...p,
  started: true,
  journalOpen: false
 };
 if (p.step >= COURSE_PAGES.length - 1) return p;
 const page = coursePage(p),
  step = p.step + 1;
 return {
  ...p,
  started: true,
  step,
  highestSeen: Math.max(p.highestSeen, step),
  completedSteps: page.type === 'stop' ? [...new Set([...p.completedSteps, page.id])] : p.completedSteps
 };
}
export function revisitCourse(p, step) {
 if (!Number.isInteger(step) || step < 0 || step > Math.min(p.highestSeen, COURSE_PAGES.length - 1)) return p;
 return {
  ...p,
  journalOpen: false,
  step
 };
}
export function visiblePaths(p) {
 if (coursePage(p).type === 'journal') return [PRACTICE_JOURNAL];
 const route = coursePage(p).route.number;
 return p.started ? COURSE_PAGES.filter((s, i) => s.path && s.route.number === route) : [];
}

// Explicit journal submission and approval, represented in the presentation game.
export function journalReady(p) {
 return p.started && p.highestSeen >= COURSE_PAGES.length - 1 && COURSE_PAGES.filter(s => s.type === 'stop').every(s => p.completedSteps.includes(s.id));
}
export function submitJournalInGame(p) {
 return journalReady(p) && p.journalStatus === 'draft' ? {
  ...p,
  journalStatus: 'submitted'
 } : p;
}
export function approveJournalInGame(p) {
 return journalReady(p) && p.journalStatus === 'submitted' ? {
  ...p,
  journalStatus: 'approved'
 } : p;
}