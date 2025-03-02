
import { JobFormData, UserProfile } from "@/services/coverLetter/types";
import { User, JobPosting } from "@/lib/types";
import { GenerationOptions, GenerationResult } from "./types";

const TIMEOUT_DURATION = 60000; // 1 minute

export const setupGenerationTimeout = (): [Promise<never>, number] => {
  let timeoutId: number = 0;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => {
      console.error("Generation timed out after 60 seconds");
      reject(new Error('Generation timed out. Prøv igen senere.'));
    }, TIMEOUT_DURATION);
    
    // Store the timeout ID for cleanup
    (window as any).__generationTimeoutId = timeoutId;
  });
  
  return [timeoutPromise, timeoutId];
};

export const validateJobFormData = (jobData: JobFormData): boolean => {
  return !!(jobData.title && jobData.company && jobData.description);
};

export const validateUserLogin = (user: User | null): boolean => {
  return !!user;
};

export const executeGenerationProcess = async (
  jobData: JobFormData, 
  user: User,
  selectedJob: JobPosting | null,
  options: GenerationOptions,
  generationSteps: any,
  updatePhase: (phase: string, progress: number, message: string) => void,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<GenerationResult> => {
  try {
    // Step 1: Fetch user profile
    const userInfo = await generationSteps.fetchUserStep();
    
    if (!isMountedRef.current) {
      console.warn("Component unmounted after fetching user profile");
      throw new Error('Component unmounted');
    }
    
    // Step 2: Save or update the job posting
    const jobId = await generationSteps.saveJobStep(jobData, user.id, selectedJob?.id);

    // Step 3: Generate letter content
    const content = await generationSteps.generateLetterStep(jobData, userInfo);

    // Step 4: Save the generated letter
    const letter = await generationSteps.saveLetterStep(user.id, jobId, content);

    // Step 5: Update the job object 
    const updatedJob = await generationSteps.fetchUpdatedJobStep(jobId, jobData, user.id);
    
    // Final progress update
    updatePhase('letter-save', 100, 'Færdig!');
    
    return { letter, job: updatedJob };
  } catch (error) {
    console.error("Error in generation process:", error);
    throw error;
  }
};
