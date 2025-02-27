
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { JobPosting, CoverLetter } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/lib/types";

export const useCoverLetterGeneration = (user: User | null) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchJob = async (id: string) => {
    try {
      setIsLoading(true);
      const { data: job, error: jobError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", id)
        .single();

      if (jobError) throw jobError;

      setSelectedJob(job);

      const { data: letters, error: letterError } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("job_posting_id", id);

      if (letterError) throw letterError;

      if (letters && letters.length > 0) {
        setGeneratedLetter(letters[0]);
        setStep(2);
      } else {
        setStep(1);
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      toast({
        title: "Fejl ved indlæsning",
        description: "Der opstod en fejl under indlæsning af jobopslaget.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLetter = async (id: string) => {
    try {
      setIsLoading(true);
      const { data: letter, error: letterError } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("id", id)
        .single();

      if (letterError) throw letterError;

      setGeneratedLetter(letter);

      const { data: job, error: jobError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", letter.job_posting_id)
        .single();

      if (jobError) throw jobError;

      setSelectedJob(job);
      setStep(2);
    } catch (error) {
      console.error("Error fetching letter:", error);
      toast({
        title: "Fejl ved indlæsning",
        description: "Der opstod en fejl under indlæsning af ansøgningen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobFormSubmit = async (jobData: Partial<JobPosting>) => {
    if (!user) return;

    try {
      setIsGenerating(true);
      
      let jobId: string;

      if (selectedJob?.id) {
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

        if (error) throw error;
        jobId = selectedJob.id;
      } else {
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

        if (error) throw error;
        jobId = data.id;
      }

      const { data: updatedJob, error: jobError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", jobId)
        .single();

      if (jobError) throw jobError;
      setSelectedJob(updatedJob);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") throw profileError;

      const userInfo = profile || {
        name: "",
        email: user.email,
        phone: "",
        address: "",
        experience: "",
        education: "",
        skills: ""
      };

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
        const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-cover-letter', {
          body: generationData
        });
        
        if (functionError) {
          console.error("Edge function error:", functionError);
          throw new Error(`Edge function error: ${functionError.message}`);
        }
        
        if (!functionData || !functionData.content) {
          throw new Error("Missing content in edge function response");
        }
        
        letterContent = functionData.content;
      } catch (fetchError) {
        console.error("Error calling edge function:", fetchError);
        
        const today = new Date().toLocaleDateString("da-DK", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        
        letterContent = `${today}\n\nKære ${updatedJob.contact_person || 'Rekrutteringsansvarlig'},\n\nJeg skriver for at ansøge om stillingen som ${updatedJob.title} hos ${updatedJob.company}.\n\nJeg mener, at mine kvalifikationer og erfaringer gør mig til et godt match for denne rolle, og jeg ser frem til muligheden for at bidrage til jeres team.\n\nMed venlig hilsen,\n\n${userInfo.name || 'Dit navn'}${userInfo.phone ? '\n' + userInfo.phone : ''}\n${userInfo.email || 'Din e-mail'}${userInfo.address ? '\n' + userInfo.address : ''}`;
      }
      
      let letterId: string;
      const { data: existingLetters, error: letterCheckError } = await supabase
        .from("cover_letters")
        .select("id")
        .eq("job_posting_id", jobId);

      if (letterCheckError) throw letterCheckError;

      if (existingLetters && existingLetters.length > 0) {
        const { error: updateError } = await supabase
          .from("cover_letters")
          .update({
            content: letterContent,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingLetters[0].id);

        if (updateError) throw updateError;
        letterId = existingLetters[0].id;
      } else {
        const { data: newLetter, error: createError } = await supabase
          .from("cover_letters")
          .insert({
            user_id: user.id,
            job_posting_id: jobId,
            content: letterContent
          })
          .select()
          .single();

        if (createError) throw createError;
        letterId = newLetter.id;
      }

      const { data: updatedLetter, error: fetchError } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("id", letterId)
        .single();

      if (fetchError) throw fetchError;

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
  };

  const handleEditLetter = async (updatedContent: string) => {
    if (!generatedLetter || !user) return;

    try {
      const { error } = await supabase
        .from("cover_letters")
        .update({
          content: updatedContent,
          updated_at: new Date().toISOString()
        })
        .eq("id", generatedLetter.id);

      if (error) throw error;

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
  };

  const handleSaveLetter = () => {
    navigate("/dashboard");
    toast({
      title: "Ansøgning gemt",
      description: "Din ansøgning er blevet gemt til din konto.",
    });
  };

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
