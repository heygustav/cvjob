
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, JobPosting } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface UseGeneratorInitializationProps {
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
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  fetchJob: (id: string) => Promise<JobPosting | null>;
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
}: UseGeneratorInitializationProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const redirectChecked = useRef(false);
  const initTimeoutRef = useRef<number | null>(null);

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    initTimeoutRef.current = window.setTimeout(() => {
      console.log("Safety timeout: Forcing initialLoading to false after 5 seconds");
      if (isMountedRef.current) {
        setInitialLoading(false);
      }
    }, 5000);
    
    return () => {
      if (initTimeoutRef.current !== null) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
    };
  }, [setInitialLoading, isMountedRef]);

  // Check auth state and redirect if necessary
  useEffect(() => {
    // Skip if we've already checked or component isn't mounted
    if (redirectChecked.current) return;
    
    // Mark as checked so we only do this once
    redirectChecked.current = true;
    
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to auth");
      if (jobId) {
        localStorage.setItem('redirectAfterLogin', `/cover-letter/generator?jobId=${jobId}&step=1&direct=true`);
      }
      navigate('/auth');
    } else {
      console.log("User is authenticated:", authUser?.id);
    }
  }, [isAuthenticated, jobId, navigate, authUser]);

  // One-time initialization
  useEffect(() => {
    let isMounted = true;
    isMountedRef.current = true;
    
    const initialize = async () => {
      if (initStarted.current || !isAuthenticated) return;
      initStarted.current = true;
      
      try {
        console.log("Starting initialization with params:", { 
          jobId, 
          letterId, 
          stepParam, 
          isDirect,
          isAuthenticated
        });
        
        if (!user) {
          console.log("No user found, can't initialize");
          if (isMounted) setInitialLoading(false);
          return;
        }

        // For direct access (from dashboard button) or when step=1 is specified, ensure we go to step 1
        if (isDirect || stepParam === "1") {
          setStep(1);
        }
        
        // For saved job viewing
        if (jobId) {
          try {
            await fetchJob(jobId);
            console.log("Job fetched successfully");
            
            // Always ensure we're on step 1 when a job ID is provided with direct=true
            if (isMounted && (isDirect || stepParam === "1")) {
              console.log("Explicitly setting to step 1 due to isDirect or stepParam");
              setStep(1);
            }
          } catch (error) {
            console.error("Error fetching job:", error);
            toast({
              title: "Fejl ved indlæsning",
              description: "Der opstod en fejl under indlæsning af jobdata.",
              variant: "destructive",
            });
          } finally {
            // Always set loading to false when job fetch completes (success or error)
            if (isMounted) {
              console.log("Marking initialization as complete after job fetch");
              setInitialLoading(false);
            }
          }
        } 
        // For viewing generated letters
        else if (letterId) {
          try {
            await fetchLetter(letterId);
            console.log("Letter fetched successfully");
          } catch (error) {
            console.error("Error fetching letter:", error);
            toast({
              title: "Fejl ved indlæsning",
              description: "Der opstod en fejl under indlæsning af ansøgningen.",
              variant: "destructive",
            });
          } finally {
            if (isMounted) {
              console.log("Marking initialization as complete after letter fetch");
              setInitialLoading(false);
            }
          }
        } 
        // Default - for new job submissions
        else {
          console.log("No job or letter ID provided - new submission mode");
          if (isMounted) {
            console.log("Marking initialization as complete for new submission");
            setInitialLoading(false);
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
        if (isMounted) {
          toast({
            title: "Fejl ved indlæsning",
            description: "Der opstod en fejl under indlæsning af data.",
            variant: "destructive",
          });
          console.log("Marking initialization as complete after error");
          setInitialLoading(false);
        }
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
      isMountedRef.current = false;
      console.log("Generator component unmounting");
      if (initTimeoutRef.current !== null) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
    };
  }, [
    fetchJob, 
    fetchLetter, 
    jobId, 
    letterId, 
    stepParam, 
    isDirect, 
    toast, 
    user, 
    setStep, 
    navigate, 
    isAuthenticated, 
    setInitialLoading,
    isMountedRef,
    initStarted
  ]);
};
