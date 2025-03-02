
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
  // We're not enforcing validation anymore - we'll use defaults instead
  return true;
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
    console.log("Starting generation process with job data:", {
      title: jobData.title || "(missing)",
      company: jobData.company || "(missing)",
      description: jobData.description?.length || 0
    });
    
    // Step 1: Fetch user profile
    updatePhase('user-fetch', 20, 'Henter din profil...');
    console.log("Step 1: Starting user profile fetch");
    const userInfo = await generationSteps.fetchUserStep();
    console.log("Step 1: User profile fetch completed", {
      hasName: !!userInfo.name,
      hasEmail: !!userInfo.email
    });
    
    if (!isMountedRef.current) {
      console.warn("Component unmounted after fetching user profile");
      throw new Error('Component unmounted');
    }
    
    // Step 2: Save or update the job posting
    updatePhase('job-save', 40, 'Gemmer jobdetaljer...');
    console.log("Step 2: Starting job save");
    const jobId = await generationSteps.saveJobStep(jobData, user.id, selectedJob?.id);
    console.log("Step 2: Job saved with ID:", jobId);

    // Step 3: Generate letter content
    updatePhase('generation', 60, 'Genererer ansøgning...');
    console.log("Step 3: Starting letter generation");
    const content = await generationSteps.generateLetterStep(jobData, userInfo);
    console.log("Step 3: Letter generation completed, content length:", content?.length);

    // Step 4: Save the generated letter
    updatePhase('letter-save', 80, 'Gemmer ansøgning...');
    console.log("Step 4: Starting letter save");
    const letter = await generationSteps.saveLetterStep(user.id, jobId, content);
    console.log("Step 4: Letter saved with ID:", letter.id);

    // Step 5: Update the job object 
    console.log("Step 5: Fetching updated job");
    const updatedJob = await generationSteps.fetchUpdatedJobStep(jobId, jobData, user.id);
    console.log("Step 5: Updated job fetched");
    
    // Final progress update
    updatePhase('letter-save', 100, 'Færdig!');
    
    return { letter, job: updatedJob };
  } catch (error) {
    console.error("Error in generation process:", error);
    throw error;
  }
};
