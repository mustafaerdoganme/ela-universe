import {
 hasCompletedIsland
} from './journey.mjs';
import {
 hasMembership
} from './pathways.mjs';
import {
 hasSpecialist,
 hasTrainingSpecialist
} from './milestones.mjs';
import {
 hasTrainer,
 hasMaster
} from './trainers.mjs';
import {
 hasFinishedFreire
} from './freire.mjs';

// All onward recommendations read earned/completed records, never the island
// just visited. Membership and Praxis may be completed in either order.
export function academicContinuation(s) {
 if (hasMaster(s) || hasTrainer(s)) return {
  id: 'trainers',
  label: 'Trainers Adası’na dön',
  text: 'Eğitmenlik unvanınız kayıtlı. Uygulama ve ortak gelişime devam edebilirsiniz.',
  icon: 'practice',
  meta: 'Eğitmenlik alanı'
 };
 if (!hasCompletedIsland('certificate', s)) return {
  id: 'certificate',
  label: 'Certificate’a git',
  text: 'Deneyimsel öğrenme okuryazarlığı programına devam edin.',
  icon: 'practice',
  meta: 'Certificate Program'
 };
 if (!hasSpecialist(s)) return {
  id: 'practitioner',
  label: s.practitionerProgress?.branches?.length ? 'Practitioner’a devam et' : 'Practitioner’a başvur',
  text: s.practitionerProgress?.branches?.length ? 'Uygulayıcı programında kaldığınız aşamadan ilerleyin.' : 'Uygulama alanınızı seçerek başvuru aşamasına geçin.',
  icon: 'practice',
  meta: 'Uygulama programı'
 };
 if (!hasTrainingSpecialist(s)) return {
  id: 'training-practice',
  label: 'Training Practice koşullarını gör',
  text: 'Eğitmenlik yolunu seçerseniz Training Practice üzerinden uzmanlık gerekir.',
  icon: 'practice',
  meta: 'İsteğe bağlı eğitmenlik yolu'
 };
 if (!hasFinishedFreire(s)) return {
  id: 'freire',
  label: s.freireApplication?.status === 'approved' ? 'Freirean Praxis’e devam et' : 'Freirean Praxis koşullarını gör',
  text: 'Training Practice sonrasında diyalog, yansıtma ve eylemle derinleşin.',
  icon: 'freire',
  meta: 'Praxis yolu'
 };
 if (!hasMembership(s)) return membershipContinuation(s);
 return {
  id: 'trainer-qualification',
  label: s.trainerApplication?.status === 'submitted' ? 'Eğitmenlik başvuruna devam et' : 'Eğitmenlik yeterliliğine ilerle',
  text: 'Praxis tamamlandı ve resmî üyeliğiniz kayıtlı. Eğitmenliğin ek kanıt ve değerlendirme aşamasına ilerleyebilirsiniz.',
  icon: 'practice',
  meta: 'Eğitmenlik yeterliliği'
 };
}
export function membershipContinuation(s) {
 return hasMembership(s) ? {
  id: 'agora',
  label: 'Agora’ya dön',
  text: 'Resmî dernek üyeliğiniz kayıtlı. Genel Kurul alanına dönebilirsiniz.',
  icon: 'membership',
  meta: 'Genel Kurul'
 } : {
  id: 'membership',
  label: 'Membership Gate’e git',
  text: 'İsterseniz resmî dernek üyeliğine başvurabilirsiniz.',
  icon: 'membership',
  meta: 'Üyelik yolu'
 };
}
export function communityContinuation(s) {
 return hasSpecialist(s) && !hasMembership(s) ? membershipContinuation(s) : academicContinuation(s);
}
export function specialistContinuations(s) {
 const member = membershipContinuation(s),
  next = academicContinuation(s);
 return next.id === member.id ? [member] : [member, next];
}
export function freireEntryPresentation(s) {
 const done = hasFinishedFreire(s),
  approved = s.freireApplication?.status === 'approved',
  submitted = s.freireApplication?.status === 'submitted';
 return {
  done,
  approved,
  submitted,
  title: done ? 'Freirean Praxis’i tamamladınız' : approved ? 'Praxis yolunuz açık' : submitted ? 'Başvurunuz değerlendirmede' : 'Diyalogdan eyleme',
  next: done ? academicContinuation(s) : null
 };
}