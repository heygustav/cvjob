
import { fetchJobById, saveOrUpdateJob } from './jobOperations';
import { fetchLettersForJob, fetchLetterById, saveCoverLetter, updateLetterContent, editCoverLetter } from './letterOperations';
import { fetchUserProfile, fetchEmailPreferences, updateEmailPreferences } from './userOperations';
import { checkSubscriptionStatus, createCheckoutSession, incrementGenerationCount, validatePromoCode } from '../subscription/subscriptionService';

// Re-export all functions
export {
  fetchJobById,
  saveOrUpdateJob,
  fetchLettersForJob,
  fetchLetterById,
  saveCoverLetter,
  updateLetterContent,
  editCoverLetter,
  fetchUserProfile,
  fetchEmailPreferences,
  updateEmailPreferences,
  checkSubscriptionStatus,
  createCheckoutSession,
  incrementGenerationCount,
  validatePromoCode
};
