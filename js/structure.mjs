// "Evrenin yapısı": the whole pathway at a glance, built only from the
// existing admission rules so it can never disagree with the game.
import { hasCompletedIsland, mayVisitVolunteerGate } from './journey.mjs';
import { canEnter } from './model.mjs';
import { hasMembership } from './pathways.mjs';
import { hasSpecialist, hasTrainingSpecialist } from './milestones.mjs';
import { orientationComplete, hasCommunityMembership } from './orientation.mjs';
import { hasTrainer, hasMaster, trainerPrerequisites } from './trainers.mjs';
import { totComplete } from './practitioner.mjs';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function structureStages(s) {
  const here = id => s.current === id;
  const node = (id, name, note, status, extra = {}) => ({ id, name, note, status: here(id) ? 'here' : status, ...extra });
  const st = (done, open) => done ? 'done' : open ? 'open' : 'locked';
  return [
    { title: 'Başlangıç', text: 'İki giriş adası; ikisinin de ön koşulu yok.', nodes: [
      node('foundations', 'Experiential Learning Foundations', 'Ücretsiz mikro e-öğrenme · isteğe bağlı bağış', st(hasCompletedIsland('foundations', s), true)),
      node('certificate', 'Certificate Program', 'Ücretli, kendi hızınızda çevrimiçi program · My Practice Journal ile tamamlanır', st(hasCompletedIsland('certificate', s), true), { title: 'Katılım belgesi' })
    ] },
    { title: 'Topluluk', text: 'Foundations ya da Certificate sonrasında açılır. Topluluk üyeliği, resmî dernek üyeliğinden ayrıdır.', nodes: [
      node('volunteer-gate', 'Volunteer Gate', 'Topluluk yoluna giriş', st(hasCommunityMembership(s), mayVisitVolunteerGate(s))),
      node('orientation', 'Volunteer Orientation', 'Derneği ve gönüllülük çerçevesini tanıtan mikro program', st(orientationComplete(s), mayVisitVolunteerGate(s)), { sub: true }),
      node('community', 'Community Island', 'Gönüllü topluluğun ortak alanı', st(hasCommunityMembership(s), canEnter('community', s)), { sub: true, title: 'Topluluk üyesi' })
    ] },
    { title: 'Uygulama', text: 'Certificate mezuniyeti gerekir. Seçilen dalda mevcut uygulayıcı olduğunuzu gösterirsiniz.', nodes: [
      node('practitioner', 'Practitioner Program', 'Training, Research veya Technology Practice · 4 gün yüz yüze + saha uygulaması', st(hasSpecialist(s), canEnter('practitioner', s)), { title: 'Deneyimsel Öğrenme Uzmanı' }),
      node('tot', 'Training of Trainers (ToT)', '6 gün yüz yüze · Training Practice için hazırlık; ayrı unvan vermez', st(totComplete(s), canEnter('tot', s)), { sub: true })
    ] },
    { title: 'Üyelik', text: 'Deneyimsel Öğrenme Uzmanı unvanı başvuru yolunu açar; kabul kararı Yönetim Kurulunundur.', nodes: [
      node('membership-gate', 'Membership Gate', 'Resmî dernek üyeliği başvurusu', st(hasMembership(s), hasSpecialist(s))),
      node('agora', 'Agora · Genel Kurul', 'Asil üyelerin ortak karar alanı', st(hasMembership(s), hasMembership(s)), { sub: true, title: 'Dernek asil üyesi' })
    ] },
    { title: 'Praxis', text: 'Training Practice üzerinden Uzman olanlara açıktır; dernek üyeliği aranmaz.', nodes: [
      node('freire', 'Freirean Praxis', 'Diyalog, yansıtma ve eylem deneyimi', st(hasCompletedIsland('freire', s), hasTrainingSpecialist(s)))
    ] },
    { title: 'Eğitmenlik', text: 'Asil üyelik, Training Practice uzmanlığı, Freirean Praxis ve ek yeterlilik kanıtları birlikte aranır.', nodes: [
      node('trainer-gate', 'Eğitmenlik yeterliliği', 'Kanıtlarla değerlendirilen başvuru; yeni bir kurs değildir', st(hasTrainer(s), trainerPrerequisites(s))),
      node('trainers', 'Experiential Learning Trainers', 'Öğretme, ortak uygulama ve mentorluk adası', st(hasTrainer(s), hasTrainer(s)), { sub: true, title: 'Deneyimsel Öğrenme Eğitmeni' }),
      node('master', 'Master Trainer', 'Aynı adada ayrı yeterlilik değerlendirmesi', st(hasMaster(s), hasTrainer(s)), { sub: true, title: 'Master Eğitmen' })
    ] }
  ];
}

const label = { done: 'Tamamlandı', open: 'Açık', locked: 'Koşullar var', here: 'Buradasınız' };

export function renderStructure(s) {
  const stages = structureStages(s);
  return `<p class="st-intro">ELA'nın öğrenme yolları, topluluk ve üyelik aşamaları bir arada. Bir aşamaya dokunarak haritada tanıtımını açabilirsiniz.</p>
<ul class="st-legend"><li><i class="done"></i>Tamamlandı</li><li><i class="open"></i>Açık</li><li><i></i>Koşullar var</li><li><i class="here"></i>Buradasınız</li></ul>
${stages.map((g, i) => `<section class="st-stage"><span class="st-num" aria-hidden="true">${i + 1}</span><h3>${esc(g.title)}</h3><p>${esc(g.text)}</p><div class="st-nodes">${g.nodes.map(n => `<button type="button" class="st-node ${n.status}${n.sub ? ' sub' : ''}" data-structure="${n.id}"><i aria-hidden="true"></i><span><b>${esc(n.name)}</b><small>${esc(n.note)}</small><span class="sr-only">, ${label[n.status]}</span>${n.title ? `<span class="st-title">${esc(n.title)}</span>` : ''}</span></button>`).join('')}</div></section>`).join('')}`;
}
