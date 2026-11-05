import {
 TRAINER_STOPS
} from './trainers.mjs';
import {
 FREIRE_STEPS,
 hasFinishedFreire
} from './freire.mjs';
import {
 TOT_STOPS,
 totComplete
} from './practitioner.mjs';
import {
 COMMUNITY_STOPS,
 communityComplete
} from './community.mjs';
import {
 ORIENTATION_STEPS,
 orientationComplete,
 hasCommunityMembership
} from './orientation.mjs';
import {
 COURSE_PAGES
} from './course.mjs';
import {
 FOUNDATION_STEPS
} from './foundations.mjs';
// Exploration and explicit award records are distinct from admission rules.
export const JOURNEY_ISLANDS = [{
  id: 'foundations',
  name: 'Experiential Learning Foundations'
 },
 {
  id: 'certificate',
  name: 'Certificate Program'
 },
 {
  id: 'community',
  name: 'Community Island'
 },
 {
  id: 'practitioner',
  name: 'Practitioner Program'
 },
 {
  id: 'tot',
  name: 'Training of Trainers'
 },
 {
  id: 'freire',
  name: 'Freirean Praxis'
 },
 {
  id: 'trainers',
  name: 'Experiential Learning Trainers'
 }
];
export const TITLE_AWARDS = [{
  id: 'facilitator',
  name: 'Topluluk Kolaylaştırıcısı'
 },
 {
  id: 'specialist',
  name: 'Deneyimsel Öğrenme Uzmanı'
 },
 {
  id: 'trainer',
  name: 'Deneyimsel Öğrenme Eğitmeni'
 },
 {
  id: 'master-trainer',
  name: 'Deneyimsel Öğrenme Master Eğitmeni'
 }
];
const list = (value, allowed) => Array.isArray(value) ? [...new Set(value.filter(id => allowed.includes(id)))] : [];
export function restoreJourneyFields(s) {
 return {
  exploredIslands: list(s.exploredIslands, JOURNEY_ISLANDS.map(i => i.id)),
  earnedTitles: list(s.earnedTitles, TITLE_AWARDS.map(i => i.id)),
  visitedGates: list(s.visitedGates, ['volunteer-gate', 'membership-gate', 'trainer-gate'])
 };
}
export function islandProgress(id, s) {
 if (id === 'trainers') return {
  count: TRAINER_STOPS.filter(p => s.trainerProgress?.completedSteps?.includes(p.id)).length,
  total: TRAINER_STOPS.length
 };
 if (id === 'freire') return {
  count: FREIRE_STEPS.filter(p => s.freireProgress?.completedSteps?.includes(p.id)).length,
  total: FREIRE_STEPS.length
 };
 if (id === 'foundations') return {
  count: FOUNDATION_STEPS.filter(p => s.foundationsProgress?.completedSteps?.includes(p.id)).length,
  total: FOUNDATION_STEPS.length
 };
 if (id === 'certificate') {
  const stops = COURSE_PAGES.filter(p => p.type === 'stop');
  return {
   count: stops.filter(p => s.certificateProgress?.completedSteps?.includes(p.id)).length,
   total: stops.length
  };
 }
 if (id === 'practitioner') {
  const p = s.practitionerProgress,
   n = p?.approvedBranches?.length || 0;
  return {
   count: p?.stage === 'completed' ? 2 + n : p?.stage === 'field' ? 1 + (p.approvedBranches.filter(id => p.fieldEvidence?.[id]?.practice && p.fieldEvidence?.[id]?.report).length) : p?.stage === 'practice' ? 1 : 0,
   total: 2 + n
  };
 }
 if (id === 'tot') return {
  count: TOT_STOPS.filter(p => s.totProgress?.completedSteps?.includes(p.id)).length,
  total: TOT_STOPS.length
 };
 if (id === 'community') return {
  count: COMMUNITY_STOPS.filter(p => s.communityProgress?.completedSteps?.includes(p.id)).length,
  total: COMMUNITY_STOPS.length
 };
 return {
  count: 0,
  total: 0
 };
}
export function hasCompletedIsland(id, s) {
 if (id === 'freire') return hasFinishedFreire(s);
 if (id === 'trainers') return s.trainerProgress?.explored === true;
 if (id === 'certificate') return s.certificateProgress?.journalStatus === 'approved';
 if (s.completed?.includes(id) || s.exploredIslands?.includes(id)) return true;
 if (id === 'community') return communityComplete(s);
 if (id === 'practitioner') return s.earnedTitles?.includes('specialist') === true;
 if (id === 'tot') return totComplete(s);
 const p = islandProgress(id, s);
 if (!p.total || p.count !== p.total) return false;
 if (id === 'foundations') return s.foundationsProgress.highestSeen >= FOUNDATION_STEPS.length;
 if (id === 'certificate') return s.certificateProgress.started === true && s.certificateProgress.highestSeen >= COURSE_PAGES.length - 1;
 return false;
}
export function foundationExitOptions(s) {
 return [...(hasCompletedIsland('certificate', s) ? [] : ['certificate']), 'volunteer-gate'];
}
export function mayVisitVolunteerGate(s) {
 return hasCompletedIsland('foundations', s) || hasCompletedIsland('certificate', s);
}
export function journeySnapshot(s) {
 const rows = JOURNEY_ISLANDS.map(i => ({
  ...i,
  ...islandProgress(i.id, s),
  done: hasCompletedIsland(i.id, s),
  current: s.current === i.id,
  visited: s.visited?.includes(i.id) || s.current === i.id
 }));
 const awardIds = new Set([...(s.earnedTitles || []), ...(s.completed || [])]);
 return {
  totalIslands: JOURNEY_ISLANDS.length,
  completed: rows.filter(r => r.done),
  ongoing: rows.filter(r => !r.done && (r.visited || r.count > 0)),
  awards: TITLE_AWARDS.filter(a => a.id !== 'facilitator' && awardIds.has(a.id)),
  communityMember: hasCommunityMembership(s),
  associationMember: s.membershipApplication?.status === 'approved' || s.completed?.includes('membership') === true,
  volunteer: s.visitedGates?.includes('volunteer-gate') === true,
  atVolunteer: s.current === 'volunteer-gate',
  orientation: {
   started: s.current === 'orientation' || s.orientationProgress?.completedSteps?.length > 0,
   done: orientationComplete(s),
   count: s.orientationProgress?.completedSteps?.length || 0,
   total: ORIENTATION_STEPS.length
  }
 };
}

export function certificateExitOptions(s) {
 return hasCompletedIsland('certificate', s) ? [hasCommunityMembership(s) ? 'community' : 'volunteer-gate', 'practitioner'] : [];
}