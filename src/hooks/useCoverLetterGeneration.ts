
import { useState, useCallback } from "react";
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

  const fetchJob = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      console.log("Fetching job with ID:", id);
      
      const { data: job, error: jobError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", id)
        .single();

      if (jobError) {
        console.error("Error fetching job:", jobError);
        throw jobError;
      }

      console.log("Retrieved job:", job);
      setSelectedJob(job);

      const { data: letters, error: letterError } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("job_posting_id", id);

      if (letterError) {
        console.error("Error fetching letters:", letterError);
        throw letterError;
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
      toast({
        title: "Fejl ved indlæsning",
        description: "Der opstod en fejl under indlæsning af jobopslaget.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchLetter = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      console.log("Fetching letter with ID:", id);
      
      const { data: letter, error: letterError } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("id", id)
        .single();

      if (letterError) {
        console.error("Error fetching letter:", letterError);
        throw letterError;
      }

      console.log("Retrieved letter:", letter);
      setGeneratedLetter(letter);

      const { data: job, error: jobError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", letter.job_posting_id)
        .single();

      if (jobError) {
        console.error("Error fetching job for letter:", jobError);
        throw jobError;
      }

      console.log("Retrieved job for letter:", job);
      setSelectedJob(job);
      setStep(2);
      
      return letter;
    } catch (error) {
      console.error("Error in fetchLetter:", error);
      toast({
        title: "Fejl ved indlæsning",
        description: "Der opstod en fejl under indlæsning af ansøgningen.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleJobFormSubmit = useCallback(async (jobData: Partial<JobPosting>) => {
    if (!user) {
      toast({
        title: "Log ind krævet",
        description: "Du skal være logget ind for at generere en ansøgning.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      console.log("Submitting job data:", jobData);
      
      let jobId: string;

      if (selectedJob?.id) {
        console.log("Updating existing job:", selectedJob.id);
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
          console.error("Error updating job:", error);
          throw error;
        }
        jobId = selectedJob.id;
      } else {
        console.log("Creating new job for user:", user.id);
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
          console.error("Error creating job:", error);
          throw error;
        }
        jobId = data.id;
      }

      console.log("Job saved with ID:", jobId);
      const { data: updatedJob, error: jobError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", jobId)
        .single();

      if (jobError) {
        console.error("Error fetching updated job:", jobError);
        throw jobError;
      }

      console.log("Retrieved updated job:", updatedJob);
      setSelectedJob(updatedJob);

      // Fetch user profile data for the letter
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError);
        // Continue without profile data, don't throw error here
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

      console.log("User info for generation:", userInfo);
      
      const generationData = {
        jobInfo: {
          title: updatedJob.title,
          company: updatedJob.company,
          description: updatedJob.description,
          contactPerson: updatedJob.contact_person,
          url: updatedJob.url
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
      };

      console.log("Sending data to generate-cover-letter:", JSON.stringify(generationData));

      let letterContent = "";
      try {
        console.log("Calling edge function...");
        
        // Set a timeout to prevent infinite waiting
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Function timeout after 15 seconds")), 15000);
        });
        
        const functionPromise = supabase.functions.invoke('generate-cover-letter', {
          body: generationData
        });
        
        // Race between timeout and actual function call
        const result = await Promise.race([functionPromise, timeoutPromise]);
        const { data: functionData, error: functionError } = result as any;
        
        if (functionError) {
          console.error("Edge function error:", functionError);
          throw new Error(`Edge function error: ${functionError.message}`);
        }
        
        if (!functionData || !functionData.content) {
          console.error("Missing content in edge function response:", functionData);
          throw new Error("Missing content in edge function response");
        }
        
        console.log("Received response from edge function");
        letterContent = functionData.content;
      } catch (fetchError) {
        console.error("Error calling edge function:", fetchError);
        
        // Generate fallback content if edge function call fails
        const today = new Date().toLocaleDateString("da-DK", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        
        console.log("Generating fallback letter content");
        letterContent = `${today}\n\nKære ${updatedJob.contact_person || 'Rekrutteringsansvarlig'},\n\nJeg skriver for at ansøge om stillingen som ${updatedJob.title} hos ${updatedJob.company}.\n\nJeg mener, at mine kvalifikationer og erfaringer gør mig til et godt match for denne rolle, og jeg ser frem til muligheden for at bidrage til jeres team.\n\nMed venlig hilsen,\n\n${userInfo.name || 'Dit navn'}${userInfo.phone ? '\n' + userInfo.phone : ''}\n${userInfo.email || 'Din e-mail'}${userInfo.address ? '\n' + userInfo.address : ''}`;
      }
      
      console.log("Generated letter content, saving to database...");
      
      let letterId: string;
      const { data: existingLetters, error: letterCheckError } = await supabase
        .from("cover_letters")
        .select("id")
        .eq("job_posting_id", jobId);

      if (letterCheckError) {
        console.error("Error checking existing letters:", letterCheckError);
        throw letterCheckError;
      }

      if (existingLetters && existingLetters.length > 0) {
        console.log("Updating existing letter:", existingLetters[0].id);
        const { error: updateError } = await supabase
          .from("cover_letters")
          .update({
            content: letterContent,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingLetters[0].id);

        if (updateError) {
          console.error("Error updating letter:", updateError);
          throw updateError;
        }
        letterId = existingLetters[0].id;
      } else {
        console.log("Creating new letter");
        const { data: newLetter, error: createError } = await supabase
          .from("cover_letters")
          .insert({
            user_id: user.id,
            job_posting_id: jobId,
            content: letterContent
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating letter:", createError);
          throw createError;
        }
        letterId = newLetter.id;
      }

      console.log("Letter saved with ID:", letterId);
      const { data: updatedLetter, error: fetchError } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("id", letterId)
        .single();

      if (fetchError) {
        console.error("Error fetching updated letter:", fetchError);
        throw fetchError;
      }

      console.log("Retrieved updated letter:", updatedLetter);
      setGeneratedLetter(updatedLetter);
      setStep(2);

      toast({
        title: "Ansøgning genereret",
        description: "Din ansøgning er blevet oprettet med succes.",
      });
    } catch (error) {
      console.error('Error in job submission process:', error);
      toast({
        title: "Fejl ved generering",
        description: error instanceof Error 
          ? `Der opstod en fejl: ${error.message}` 
          : "Der opstod en ukendt fejl. Prøv venligst igen.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [selectedJob, toast, user]);

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
