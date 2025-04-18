
import { JobFormData } from "@/services/coverLetter/types";
import { User, JobPosting, CoverLetter } from "@/lib/types";
import { isNonNull } from "@/utils/typeGuards";
import { GenerationPhase, TimeoutConfig } from "./types";

/**
 * Set up timeout for generation process
 */
export const setupGenerationTimeout = (
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  { handleTimeoutCallback, timeoutMs = 45000 }: TimeoutConfig
): number => {
  // Create a timeout to abort generation if it takes too long
  const timeoutId = setTimeout(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      
      handleTimeoutCallback(new Error("Generation timeout - took too long to generate"));
    }
  }, timeoutMs);
  
  // Store the timeout ID for cleanup
  (window as any).__generationTimeoutId = timeoutId;
  
  return timeoutId;
};

/**
 * Create a new job posting from job form data
 */
export const createJobPosting = (jobData: JobFormData, userId: string): JobPosting => {
  return {
    id: jobData.id || Math.random().toString(),
    title: jobData.title,
    company: jobData.company,
    description: jobData.description,
    contact_person: jobData.contact_person || null,
    url: jobData.url || null,
    deadline: jobData.deadline || null,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

/**
 * Create a new cover letter
 */
export const createCoverLetter = (
  jobId: string, 
  userId: string, 
  content: string
): CoverLetter => {
  return {
    id: Math.random().toString(),
    content,
    user_id: userId,
    job_posting_id: jobId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

/**
 * Handle mock letter generation (for development/testing)
 */
export const generateMockLetter = async (
  jobData: JobFormData,
  userId: string,
  updatePhase: (phase: GenerationPhase, progress: number, message: string) => void
): Promise<GenerationResult> => {
  updatePhase('job-save', 20, 'Gemmer job information...');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  updatePhase('user-fetch', 40, 'Henter bruger profil...');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  updatePhase('generation', 60, 'Genererer ansøgning...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  updatePhase('letter-save', 90, 'Gemmer ansøgning...');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const job = createJobPosting(jobData, userId);
  const letter = createCoverLetter(
    job.id, 
    userId, 
    `Sample cover letter for ${jobData.title} at ${jobData.company}`
  );
  
  return { job, letter };
};

/**
 * Clean up generation process
 */
export const cleanupGeneration = (timeoutId?: number): void => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  } else if ((window as any).__generationTimeoutId) {
    clearTimeout((window as any).__generationTimeoutId);
    (window as any).__generationTimeoutId = null;
  }
};
