
import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { JobPosting, CoverLetter } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/lib/types";

export const useCoverLetterGeneration = (user: User | null) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  // Add a ref to track generation attempts
  const generationAttemptRef = useRef(0);

  const fetchJob = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      console.log("Fetching job with ID:", id);
      
      const { data: job, error: jobError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (jobError) {
        console.error("Error fetching job:", jobError);
        throw jobError;
      }

      if (!job) {
        console.log("No job found with ID:", id);
        toast({
          title: "Job ikke fundet",
          description: "Det valgte job kunne ikke findes.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return null;
      }

      console.log("Retrieved job:", job);
      setSelectedJob(job);

      const { data: letters, error: letterError } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("job_posting_id", id);

      if (letterError) {
        console.error("Error fetching letters:", letterError);
        // Don't throw here, just log the error as this is not critical
      }

      console.log("Retrieved letters:", letters);
      if (letters && letters.length > 0) {
        setGeneratedLetter(letters[0]);
        setStep(2);
      } else {
        setStep(1);
      }
      
      return job;
    } catch (error) {
      console.error("Error in fetchJob:", error);
      if (!navigator.onLine) {
        toast({
          title: "Ingen internetforbindelse",
          description: "Kontroller din internetforbindelse og prøv igen.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fejl ved indlæsning",
          description: "Der opstod en fejl under indlæsning. Prøv igen senere.",
          variant: "destructive",
        });
      }
      navigate("/dashboard");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast, navigate]);

  const fetchLetter = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      console.log("Fetching letter with ID:", id);
      
      const { data: letter, error: letterError } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (letterError) {
        console.error("Error fetching letter:", letterError);
        throw letterError;
      }

      if (!letter) {
        console.log("No letter found with ID:", id);
        toast({
          title: "Ansøgning ikke fundet",
          description: "Den valgte ansøgning kunne ikke findes.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return null;
      }

      console.log("Retrieved letter:", letter);
      setGeneratedLetter(letter);

      const { data: job, error: jobError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", letter.job_posting_id)
        .maybeSingle();

      if (jobError) {
        console.error("Error fetching job for letter:", jobError);
        // Don't throw here, just log the error
      }

      if (job) {
        console.log("Retrieved job for letter:", job);
        setSelectedJob(job);
      }
      
      setStep(2);
      return letter;
    } catch (error) {
      console.error("Error in fetchLetter:", error);
      if (!navigator.onLine) {
        toast({
          title: "Ingen internetforbindelse",
          description: "Kontroller din internetforbindelse og prøv igen.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fejl ved indlæsning",
          description: "Der opstod en fejl under indlæsning. Prøv igen senere.",
          variant: "destructive",
        });
      }
      navigate("/dashboard");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast, navigate]);

const handleJobFormSubmit = useCallback(async (jobData: Partial<JobPosting>) => {
    if (!user) {
      toast({
        title: "Log ind krævet",
        description: "Du skal være logget ind for at generere en ansøgning.",
        variant: "destructive",
      });
      return;
    }

    // Increment generation attempt counter
    generationAttemptRef.current += 1;
    const currentAttempt = generationAttemptRef.current;
    console.log(`Starting generation attempt #${currentAttempt}`);

    try {
      setIsGenerating(true);
      console.log("Submitting job data:", jobData);
      
      let jobId: string;

      // Step 1: Save or update the job posting
      if (selectedJob?.id) {
        console.log(`Attempt #${currentAttempt}: Updating existing job:`, selectedJob.id);
        const { error } = await supabase
          .from("job_postings")
          .update({
            title: jobData.title,
            company: jobData.company,
            description: jobData.description,
            contact_person: jobData.contact_person,
            url: jobData.url,
            updated_at: new Date().toISOString()
          })
          .eq("id", selectedJob.id);

        if (error) {
          console.error(`Attempt #${currentAttempt}: Error updating job:`, error);
          throw new Error(`Fejl ved opdatering af job: ${error.message}`);
        }
        jobId = selectedJob.id;
        console.log(`Attempt #${currentAttempt}: Successfully updated job ${jobId}`);
      } else {
        console.log(`Attempt #${currentAttempt}: Creating new job for user:`, user.id);
        const { data, error } = await supabase
          .from("job_postings")
          .insert({
            user_id: user.id,
            title: jobData.title || "",
            company: jobData.company || "",
            description: jobData.description || "",
            contact_person: jobData.contact_person,
            url: jobData.url
          })
          .select()
          .single();

        if (error) {
          console.error(`Attempt #${currentAttempt}: Error creating job:`, error);
          throw new Error(`Fejl ved oprettelse af job: ${error.message}`);
        }
        if (!data) {
          console.error(`Attempt #${currentAttempt}: No job data returned`);
          throw new Error("Intet job-id returneret fra serveren");
        }
        jobId = data.id;
        console.log(`Attempt #${currentAttempt}: Successfully created job ${jobId}`);
      }

      // Step 2: Fetch user profile if available
      console.log(`Attempt #${currentAttempt}: Fetching user profile data`);
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError && profileError.code !== "PGRST116") {
        console.error(`Attempt #${currentAttempt}: Error fetching profile:`, profileError);
      }

      const userInfo = profile || {
        name: "",
        email: user.email,
        phone: "",
        address: "",
        experience: "",
        education: "",
        skills: ""
      };

      console.log(`Attempt #${currentAttempt}: Calling edge function for letter generation`);

      // Step 3: Call the edge function
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'generate-cover-letter',
        {
          body: {
            jobInfo: {
              title: jobData.title,
              company: jobData.company,
              description: jobData.description,
              contactPerson: jobData.contact_person,
              url: jobData.url
            },
            userInfo: {
              name: userInfo.name,
              email: userInfo.email,
              phone: userInfo.phone,
              address: userInfo.address,
              experience: userInfo.experience,
              education: userInfo.education,
              skills: userInfo.skills,
            }
          }
        }
      );

      if (functionError) {
        console.error(`Attempt #${currentAttempt}: Edge function error:`, functionError);
        throw new Error(`Edge function fejl: ${functionError.message}`);
      }

      if (!functionData || !functionData.content) {
        console.error(`Attempt #${currentAttempt}: No content received from edge function`);
        throw new Error("Intet indhold modtaget fra serveren");
      }

      console.log(`Attempt #${currentAttempt}: Successfully received content from edge function`);

      // Step 4: Save the generated letter
      console.log(`Attempt #${currentAttempt}: Saving letter to database`);
      const { data: letter, error: letterError } = await supabase
        .from("cover_letters")
        .insert({
          user_id: user.id,
          job_posting_id: jobId,
          content: functionData.content
        })
        .select()
        .single();

      if (letterError) {
        console.error(`Attempt #${currentAttempt}: Error saving letter:`, letterError);
        throw new Error(`Fejl ved gem af ansøgning: ${letterError.message}`);
      }

      console.log(`Attempt #${currentAttempt}: Letter saved successfully:`, letter);
      setGeneratedLetter(letter);
      setStep(2);

      toast({
        title: "Ansøgning genereret",
        description: "Din ansøgning er blevet oprettet med succes.",
      });

    } catch (error) {
      console.error(`Attempt #${currentAttempt}: Error in job submission process:`, error);
      
      // Check if we still have a connection
      if (!navigator.onLine) {
        toast({
          title: "Ingen internetforbindelse",
          description: "Kontroller din internetforbindelse og prøv igen.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fejl ved generering",
          description: error instanceof Error 
            ? `Der opstod en fejl: ${error.message}` 
            : "Der opstod en ukendt fejl. Prøv venligst igen.",
          variant: "destructive",
        });
      }
    } finally {
      console.log(`Attempt #${currentAttempt}: Generation process completed`);
      setIsGenerating(false);
    }
  }, [selectedJob, toast, user, setStep]);

  const handleEditLetter = useCallback(async (updatedContent: string) => {
    if (!generatedLetter || !user) return;

    try {
      console.log("Updating letter content:", generatedLetter.id);
      const { error } = await supabase
        .from("cover_letters")
        .update({
          content: updatedContent,
          updated_at: new Date().toISOString()
        })
        .eq("id", generatedLetter.id);

      if (error) {
        console.error("Error updating letter content:", error);
        throw error;
      }

      setGeneratedLetter({
        ...generatedLetter,
        content: updatedContent
      });

      toast({
        title: "Ansøgning opdateret",
        description: "Dine ændringer er blevet gemt.",
      });
    } catch (error) {
      console.error('Error updating letter:', error);
      toast({
        title: "Fejl ved opdatering",
        description: "Der opstod en fejl under opdatering af ansøgningen.",
        variant: "destructive",
      });
    }
  }, [generatedLetter, toast, user]);

  const handleSaveLetter = useCallback(() => {
    navigate("/dashboard");
    toast({
      title: "Ansøgning gemt",
      description: "Din ansøgning er blevet gemt til din konto.",
    });
  }, [navigate, toast]);

  return {
    step,
    isGenerating,
    isLoading,
    selectedJob,
    generatedLetter,
    setStep,
    fetchJob,
    fetchLetter,
    handleJobFormSubmit,
    handleEditLetter,
    handleSaveLetter,
  };
};
