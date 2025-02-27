
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import JobPostingForm from "../components/JobPostingForm";
import CoverLetterPreview from "../components/CoverLetterPreview";
import { JobPosting, CoverLetter } from "../lib/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const CoverLetterGenerator = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const letterId = searchParams.get("letterId");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      if (jobId) {
        fetchJob(jobId);
      } else if (letterId) {
        fetchLetter(letterId);
      } else {
        setIsLoading(false);
      }
    }
  }, [user, jobId, letterId]);

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

      // Check if there's already a cover letter for this job
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

      // Fetch the associated job
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

      // If we're editing an existing job
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
        // Creating a new job
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

      // Fetch the updated/created job
      const { data: updatedJob, error: jobError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", jobId)
        .single();

      if (jobError) throw jobError;
      setSelectedJob(updatedJob);

      // Fetch user profile for AI generation
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // Allow PGRST116 error (no profile found) but not other errors
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

      // Prepare the data for edge function
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

      // Call the edge function directly using Supabase functions.invoke
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
        
        // Create a fallback letter directly in the frontend
        const today = new Date().toLocaleDateString("da-DK", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        
        letterContent = `${today}

Kære ${updatedJob.contact_person || 'Rekrutteringsansvarlig'},

Jeg skriver for at ansøge om stillingen som ${updatedJob.title} hos ${updatedJob.company}.

Jeg mener, at mine kvalifikationer og erfaringer gør mig til et godt match for denne rolle, og jeg ser frem til muligheden for at bidrage til jeres team.

Med venlig hilsen,

${userInfo.name || 'Dit navn'}
${userInfo.phone ? '\n' + userInfo.phone : ''}
${userInfo.email || 'Din e-mail'}
${userInfo.address ? '\n' + userInfo.address : ''}`;
      }
      
      // Check if we already have a cover letter for this job
      let letterId: string;
      const { data: existingLetters, error: letterCheckError } = await supabase
        .from("cover_letters")
        .select("id")
        .eq("job_posting_id", jobId);

      if (letterCheckError) throw letterCheckError;

      if (existingLetters && existingLetters.length > 0) {
        // Update existing letter
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
        // Create new letter
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

      // Fetch the updated/created letter
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

  const handleBackToJobDetails = () => {
    setStep(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              {step === 1 ? "Indtast jobdetaljer" : "Din ansøgning"}
            </h1>
            <p className="mt-1 text-lg text-gray-600">
              {step === 1
                ? "Angiv information om jobbet, du søger"
                : "Gennemgå og rediger din AI-genererede ansøgning"}
            </p>
          </div>
          {step === 2 && (
            <button
              onClick={handleBackToJobDetails}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Rediger jobdetaljer
            </button>
          )}
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
          {step === 1 ? (
            <div className="p-6">
              <JobPostingForm
                onSubmit={handleJobFormSubmit}
                initialData={selectedJob || undefined}
                isLoading={isGenerating}
              />

              {isGenerating && (
                <div className="mt-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Sparkles className="h-8 w-8 text-gray-600 animate-pulse-subtle" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Genererer din ansøgning
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      Vores AI analyserer jobopslaget og udarbejder en personlig ansøgning til dig. Dette skulle kun tage få sekunder...
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              {generatedLetter && selectedJob && (
                <CoverLetterPreview
                  content={generatedLetter.content}
                  jobTitle={selectedJob.title}
                  company={selectedJob.company}
                  onEdit={handleEditLetter}
                  onSave={handleSaveLetter}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
