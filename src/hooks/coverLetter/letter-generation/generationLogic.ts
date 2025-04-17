
import { JobFormData } from "@/services/coverLetter/types";
import { User } from "@/lib/types";

// Validate user login
export const validateUserLogin = (user: User | null): boolean => {
  return !!user;
};

// Validate job form data
export const validateJobFormData = (jobData: JobFormData): boolean => {
  return !!(jobData.title && jobData.company && jobData.description);
};

// Setup generation timeout
export const setupGenerationTimeout = (): [Promise<never>, number] => {
  let timeoutId: number;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new Error("Generation timed out. Please try again."));
    }, 60000); // 60-second timeout
    
    // Store timeoutId on window for access from other components
    (window as any).__generationTimeoutId = timeoutId;
  });
  
  return [timeoutPromise, timeoutId];
};

// Execute generation process
export const executeGenerationProcess = async (
  jobData: JobFormData,
  user: User,
  selectedJob: any,
  generationMeta: {
    currentAttempt: number;
    abortController: AbortController;
  },
  generationSteps: any,
  updatePhase: (phase: string, progress: number, message: string) => void,
  isMountedRef: React.MutableRefObject<boolean>
) => {
  const { currentAttempt, abortController } = generationMeta;
  
  console.log(`Starting generation execution (attempt #${currentAttempt})`);
  
  try {
    // Step 1: Fetch user profile
    const userInfo = await generationSteps.fetchUserProfile?.();
    
    if (!isMountedRef.current) return { job: null, letter: null };
    
    // Step 2: Save job details
    const existingJobId = selectedJob?.id;
    const jobId = await generationSteps.saveJob?.(jobData, user.id, existingJobId);
    
    if (!isMountedRef.current) return { job: null, letter: null };
    
    // Step 3: Generate letter content
    const content = await generationSteps.generateLetter?.(jobData, userInfo);
    
    if (!isMountedRef.current || abortController.signal.aborted) {
      return { job: null, letter: null };
    }
    
    // Step 4: Save the generated letter
    const letter = await generationSteps.saveLetter?.(user.id, jobId, content);
    
    if (!isMountedRef.current) return { job: null, letter: null };
    
    // Step 5: Fetch updated job details
    const updatedJob = await generationSteps.fetchUpdatedJob?.(jobId, jobData, user.id);
    
    updatePhase('complete', 100, 'Din ansøgning er klar!');
    
    return { job: updatedJob, letter };
  } catch (error) {
    console.error(`Generation failed (attempt #${currentAttempt})`, error);
    throw error;
  }
};
