import {
 freshQualificationApplication,
 restoreQualificationApplication,
 freshTrainerProgress,
 restoreTrainerProgress,
 hasTrainer
} from './trainers.mjs';
import {
 freshMembershipApplication,
 restoreMembershipApplication,
 hasMembership,
 freshFreireApplication,
 restoreFreireApplication
} from './pathways.mjs';
import {
 freshFreireProgress,
 restoreFreireProgress
} from './freire.mjs';
import {
 hasSpecialist,
 hasTrainingSpecialist
} from './milestones.mjs';
import {
 freshPractitionerProgress,
 restorePractitionerProgress,
 freshTotProgress,
 restoreTotProgress
} from './practitioner.mjs';
import {
 freshFacilitatorApplication,
 restoreFacilitatorApplication,
 hasFacilitator
} from './facilitator.mjs';
import {
 freshCommunityProgress,
 restoreCommunityProgress
} from './community.mjs';
import {
 freshOrientationProgress,
 restoreOrientationProgress,
 orientationComplete,
 hasCommunityMembership
} from './orientation.mjs';
import {
 restoreJourneyFields,
 hasCompletedIsland
} from './journey.mjs';
import {
 freshFoundationProgress,
 restoreFoundationProgress
} from './foundations.mjs';
import {
 freshCourseProgress,
 restoreCourseProgress
} from './course.mjs';
export const STORAGE_KEY = 'ela-universe-entry-v1';
export const COLORS = [{
 name: 'Kiremit',
 hex: '#d76b48'
}, {
 name: 'Deniz yeşili',
 hex: '#3a8b82'
}, {
 name: 'Safran',
 hex: '#d8a943'
}, {
 name: 'Mavi',
 hex: '#557ead'
}, {
 name: 'Mürdüm',
 hex: '#976b8b'
}];
export function freshState() {
 return {
  version: 1,
  started: false,
  color: COLORS[0].hex,
  completed: [],
  visited: [],
  current: 'map',
  position: [3010, 3010],
  layout: 2,
  certificateProgress: freshCourseProgress(),
  foundationsProgress: freshFoundationProgress(),
  exploredIslands: [],
  earnedTitles: [],
  visitedGates: [],
  orientationProgress: freshOrientationProgress(),
  communityProgress: freshCommunityProgress(),
  facilitatorApplication: freshFacilitatorApplication(),
  practitionerProgress: freshPractitionerProgress(),
  totProgress: freshTotProgress(),
  membershipApplication: freshMembershipApplication(),
  freireApplication: freshFreireApplication(),
  freireProgress: freshFreireProgress(),
  trainerApplication: freshQualificationApplication(),
  masterApplication: freshQualificationApplication(),
  trainerProgress: freshTrainerProgress()
 };
}
export function restoreState(raw) {
 try {
  const s = JSON.parse(raw);
  if (!s || s.version !== 1) return freshState();
  return {
   ...freshState(),
   started: s.started === true,
   color: COLORS.some(c => c.hex === s.color) ? s.color : COLORS[0].hex,
   completed: Array.isArray(s.completed) ? s.completed.filter(x => typeof x === 'string') : [],
   visited: Array.isArray(s.visited) ? s.visited.filter(x => typeof x === 'string') : [],
   current: ['foundations', 'certificate', 'volunteer-gate', 'orientation', 'community', 'practitioner', 'tot', 'membership-gate', 'agora', 'freire', 'trainer-gate', 'trainers'].includes(s.current) ? s.current : 'map',
   position: s.layout === 2 && Array.isArray(s.position) && s.position.length === 2 && s.position.every(Number.isFinite) ? s.position : [3010, 3010],
   layout: 2,
   certificateProgress: restoreCourseProgress(s.certificateProgress),
   foundationsProgress: restoreFoundationProgress(s.foundationsProgress),
   orientationProgress: restoreOrientationProgress(s.orientationProgress),
   communityProgress: restoreCommunityProgress(s.communityProgress),
   facilitatorApplication: restoreFacilitatorApplication(s.facilitatorApplication),
   practitionerProgress: restorePractitionerProgress(s.practitionerProgress),
   totProgress: restoreTotProgress(s.totProgress),
   membershipApplication: restoreMembershipApplication(s.membershipApplication),
   freireApplication: restoreFreireApplication(s.freireApplication),
   freireProgress: restoreFreireProgress(s.freireProgress, s.completed?.includes('freire') === true),
   trainerApplication: restoreQualificationApplication(s.trainerApplication),
   masterApplication: restoreQualificationApplication(s.masterApplication),
   trainerProgress: restoreTrainerProgress(s.trainerProgress),
   ...restoreJourneyFields(s)
  };
 } catch {
  return freshState();
 }
}
export const prerequisites = {
 agora: ['membership'],
 'membership-gate': ['specialist'],
 foundations: [],
 certificate: [],
 community: ['orientation'],
 practitioner: ['certificate'],
 tot: ['certificate'],
 freire: ['training-practice-specialist'],
 trainers: ['membership', 'training-practice-specialist', 'freire', 'trainer-qualification']
};
export function unmet(id, state) {
 return (prerequisites[id] || []).filter(x => !(x === 'freire' ? hasCompletedIsland('freire', state) : x === 'trainer-qualification' ? hasTrainer(state) : x === 'membership' ? hasMembership(state) : x === 'training-practice-specialist' ? hasTrainingSpecialist(state) : x === 'specialist' ? hasSpecialist(state) : x === 'orientation' ? hasCommunityMembership(state) : x === 'certificate' && ['practitioner', 'tot'].includes(id) ? hasCompletedIsland('certificate', state) : x === 'facilitator' ? hasFacilitator(state) : state.completed.includes(x)));
}
export function canEnter(id, state) {
 return unmet(id, state).length === 0;
}
export function visit(state, id, position) {
 return {
  ...state,
  current: id,
  position,
  visited: [...new Set([...state.visited, id])]
 };
}