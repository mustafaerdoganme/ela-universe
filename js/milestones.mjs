import {
 fieldPracticeReady
} from './practitioner.mjs';
import {
 hasCompletedIsland
} from './journey.mjs';
export function hasSpecialist(s) {
 return s.earnedTitles?.includes('specialist') === true || s.completed?.includes('specialist') === true;
}
export function hasTrainingSpecialist(s) {
 return hasSpecialist(s) && (s.practitionerProgress?.completedBranches?.includes('training') === true || s.completed?.includes('training-practice-specialist') === true);
}
export function canCompleteSpecialist(s) {
 return hasCompletedIsland('certificate', s) && fieldPracticeReady(s.practitionerProgress);
}
// Presentation-game award only: real field reports and assessment are not submitted.
export function completeSpecialistInGame(s) {
 if (!canCompleteSpecialist(s)) return s;
 const p = s.practitionerProgress,
  completedBranches = [...new Set([...p.completedBranches, ...p.approvedBranches])];
 return {
  ...s,
  practitionerProgress: {
   ...p,
   stage: 'completed',
   completedBranches
  },
  earnedTitles: [...new Set([...s.earnedTitles, 'specialist'])],
  completed: [...new Set([...s.completed, ...(completedBranches.includes('training') ? ['training-practice-specialist'] : [])])]
 };
}