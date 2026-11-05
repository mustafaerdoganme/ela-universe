import {
 hasSpecialist,
 hasTrainingSpecialist
} from './milestones.mjs';
// These application records simulate the journey; they submit no real application.
export function freshMembershipApplication() {
 return {
  status: 'draft',
  portfolioReady: false,
  communityReady: false
 };
}
export function restoreMembershipApplication(p) {
 return {
  status: ['draft', 'submitted', 'approved'].includes(p?.status) ? p.status : 'draft',
  portfolioReady: p?.portfolioReady === true,
  communityReady: p?.communityReady === true
 };
}
export function hasMembership(s) {
 return s.membershipApplication?.status === 'approved' || s.completed?.includes('membership') === true;
}
export function membershipReady(s) {
 return hasSpecialist(s) && s.membershipApplication?.portfolioReady && s.membershipApplication?.communityReady;
}
export function submitMembershipInGame(s) {
 return membershipReady(s) && s.membershipApplication.status === 'draft' ? {
  ...s,
  membershipApplication: {
   ...s.membershipApplication,
   status: 'submitted'
  }
 } : s;
}
export function approveMembershipInGame(s) {
 return membershipReady(s) && s.membershipApplication.status === 'submitted' ? {
  ...s,
  membershipApplication: {
   ...s.membershipApplication,
   status: 'approved'
  },
  completed: [...new Set([...s.completed, 'membership'])]
 } : s;
}
export function freshFreireApplication() {
 return {
  status: 'draft',
  portfolioReady: false
 };
}
export function restoreFreireApplication(p) {
 return {
  status: ['draft', 'submitted', 'approved'].includes(p?.status) ? p.status : 'draft',
  portfolioReady: p?.portfolioReady === true
 };
}
export function submitFreireInGame(s) {
 return hasTrainingSpecialist(s) && s.freireApplication.portfolioReady && s.freireApplication.status === 'draft' ? {
  ...s,
  freireApplication: {
   ...s.freireApplication,
   status: 'submitted'
  }
 } : s;
}
export function approveFreireInGame(s) {
 return hasTrainingSpecialist(s) && s.freireApplication.portfolioReady && s.freireApplication.status === 'submitted' ? {
  ...s,
  freireApplication: {
   ...s.freireApplication,
   status: 'approved'
  }
 } : s;
}