
import { useEffect } from "react";
import { User } from "@/lib/types";

interface InitializationProps {
  isAuthenticated: boolean;
  jobId: string | null;
  letterId: string | null;
  stepParam: string | null;
  isDirect: boolean;
  user: User | null;
  authUser: any;
  initStarted: React.MutableRefObject<boolean>;
  isMountedRef: React.MutableRefObject<boolean>;
  setInitialLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setStep: (step: 1 | 2) => void;
  fetchJob: (id: string) => Promise<any>;
  fetchLetter: (id: string) => Promise<any>;
}

export const useGeneratorInitialization = ({
  isAuthenticated,
  jobId,
  letterId,
  stepParam,
  isDirect,
  user,
  authUser,
  initStarted,
  isMountedRef,
  setInitialLoading,
  setStep,
  fetchJob,
  fetchLetter
}: InitializationProps) => {
  // Handle initial data fetching
  useEffect(() => {
    const initializeGenerator = async () => {
      // Prevent duplicate initialization
      if (initStarted.current) {
        return;
      }
      
      try {
        console.log("Initializing generator with:", {
          jobId,
          letterId,
          stepParam,
          isDirect,
          isAuthenticated
        });
        
        initStarted.current = true;
        
        // Wait a bit for auth to settle if needed
        if (!isAuthenticated && authUser) {
          console.log("Waiting for auth to complete...");
          await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        // Set step from URL parameter if provided
        if (stepParam === "1" || stepParam === "2") {
          setStep(parseInt(stepParam) as 1 | 2);
        }
        
        // First try to fetch by letter ID if provided
        if (letterId && isAuthenticated) {
          console.log("Fetching letter with ID:", letterId);
          await fetchLetter(letterId);
        } 
        // Then try fetching by job ID
        else if (jobId && isAuthenticated) {
          console.log("Fetching job with ID:", jobId);
          await fetchJob(jobId);
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      } finally {
        if (isMountedRef.current) {
          setInitialLoading(false);
        }
      }
    };
    
    if (isAuthenticated || authUser) {
      initializeGenerator();
    } else {
      console.log("Auth not ready, skipping initialization");
      setInitialLoading(false);
    }
  }, [
    isAuthenticated, 
    jobId, 
    letterId, 
    stepParam, 
    isDirect, 
    user, 
    authUser, 
    initStarted, 
    isMountedRef, 
    setInitialLoading, 
    setStep, 
    fetchJob, 
    fetchLetter
  ]);
};
