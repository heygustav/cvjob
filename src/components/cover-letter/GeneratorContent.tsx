
import React, { useEffect, useState } from "react";
import JobFormStep from "./JobFormStep";
import { PreviewStep } from "./PreviewStep";
import { GeneratorHeader } from "./GeneratorHeader";
import { GeneratorLoadingState } from "./GeneratorLoadingState";
import { GeneratorErrorState } from "./GeneratorErrorState";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useLetterGeneration } from "@/hooks/coverLetter/useLetterGeneration";
import { useLetterFetching } from "@/hooks/coverLetter/useLetterFetching";
import { useAuth } from "@/components/AuthProvider";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionRequired from "../subscription/SubscriptionRequired";
import { useToastMessages } from "@/hooks/coverLetter/useToastMessages";
import { CoverLetter, JobPosting, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";

interface GeneratorProps {
  existingLetterId?: string;
}

export const GeneratorContent: React.FC<GeneratorProps> = ({ existingLetterId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<1 | 2>(1);
  const [jobData, setJobData] = useState<JobFormData>({
    title: "",
    company: "",
    description: "",
  });
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState("idle");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  
  const toastMessages = useToastMessages();
  const { fetchLetter } = useLetterFetching();
  const { subscriptionStatus, fetchSubscriptionStatus } = useSubscription();

  // Ensure user has all required properties by creating a complete User object
  const completeUser: User | null = user ? {
    id: user.id || "",
    email: user.email || "",
    name: user.name || "",
    phone: user.phone || "",
    address: user.address || "",
    profileComplete: user.profileComplete || false
  } : null;

  // Fetch subscription status on mount
  useEffect(() => {
    if (completeUser?.id) {
      fetchSubscriptionStatus(completeUser.id);
    }
  }, [completeUser?.id, fetchSubscriptionStatus]);

  // Handle job form submission
  const handleGenerateLetter = async (data: JobFormData) => {
    setIsGenerating(true);
    setLoadingState("generating");
    setJobData(data);
    
    try {
      // Simulation of letter generation process
      // In a real app, you would call an API here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update job data
      if (data.id) {
        setSelectedJob({
          ...data,
          id: data.id,
          user_id: completeUser?.id || "",
          created_at: new Date().toISOString()
        } as JobPosting);
      }
      
      // Create a mock letter
      const letter: CoverLetter = {
        id: Math.random().toString(36).substring(2, 15),
        user_id: completeUser?.id || "",
        job_posting_id: data.id || Math.random().toString(36).substring(2, 15),
        content: `Kære HR,\n\nJeg ansøger hermed om stillingen som ${data.title} hos ${data.company}.\n\nMed venlig hilsen,\n${completeUser?.name || ""}`,
        created_at: new Date().toISOString()
      };
      
      setGeneratedLetter(letter);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Der opstod en fejl");
    } finally {
      setIsGenerating(false);
      setLoadingState("idle");
    }
  };

  // Handle letter content edit
  const handleEditContent = async (content: string) => {
    if (!generatedLetter) return;
    
    setIsLoading(true);
    try {
      // Update letter content
      setGeneratedLetter({
        ...generatedLetter,
        content,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error updating letter:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset any error
  const resetError = () => {
    setError(null);
    setIsGenerating(false);
    setLoadingState("idle");
  };

  // Handle existing letter
  useEffect(() => {
    const loadExistingLetter = async () => {
      if (existingLetterId && completeUser?.id) {
        try {
          const letter = await fetchLetter(existingLetterId);
          if (letter) {
            setGeneratedLetter(letter);
            setStep(2);
          }
        } catch (error) {
          console.error("Error fetching letter:", error);
        }
      }
    };

    loadExistingLetter();
  }, [existingLetterId, completeUser?.id, fetchLetter]);

  // Handle job ID from URL
  useEffect(() => {
    if (jobId && !existingLetterId) {
      navigate(`/generator?jobId=${jobId}`);
    }
  }, [jobId, existingLetterId, navigate]);

  // If subscription check is complete and user can't generate
  if (subscriptionStatus && !subscriptionStatus.canGenerate && !generatedLetter) {
    return (
      <div className="container py-8">
        <SubscriptionRequired 
          user={completeUser}
          freeGenerationsUsed={subscriptionStatus.freeGenerationsUsed}
          freeGenerationsAllowed={subscriptionStatus.freeGenerationsAllowed}
        />
      </div>
    );
  }

  // Show loading screen
  if (isGenerating) {
    return (
      <GeneratorLoadingState 
        isGenerating={isGenerating}
        loadingState={loadingState}
        generationPhase={generationPhase}
        resetError={resetError}
      />
    );
  }

  // Show error screen
  if (error) {
    return (
      <GeneratorErrorState 
        message={error} 
        onRetry={resetError} 
      />
    );
  }

  return (
    <div className="container py-8">
      <GeneratorHeader 
        step={step} 
        setStep={setStep} 
        hasGeneratedLetter={!!generatedLetter}
      />

      {step === 1 && (
        <JobFormStep
          jobData={jobData}
          setJobData={setJobData}
          onSubmit={handleGenerateLetter}
          isLoading={isLoading}
          user={completeUser}
          initialJobId={searchParams.get("jobId") || undefined}
          selectedJob={selectedJob}
          isGenerating={isGenerating}
          generationPhase={generationPhase}
        />
      )}

      {step === 2 && generatedLetter && (
        <PreviewStep 
          generatedLetter={generatedLetter} 
          onEdit={handleEditContent}
        />
      )}
    </div>
  );
};
