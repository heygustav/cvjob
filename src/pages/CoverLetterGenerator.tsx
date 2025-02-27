import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import JobPostingForm from "../components/JobPostingForm";
import CoverLetterPreview from "../components/CoverLetterPreview";
import { JobPosting, CoverLetter, mockJobPostings, mockCoverLetters, mockUsers } from "../lib/types";
import { useToast } from "@/hooks/use-toast";

const CoverLetterGenerator = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const letterId = searchParams.get("letterId");

  const [step, setStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (jobId) {
      const job = mockJobPostings.find(j => j.id === jobId);
      if (job) {
        setSelectedJob(job);
        const letter = mockCoverLetters.find(l => l.jobPostingId === jobId);
        if (letter) {
          setGeneratedLetter(letter);
          setStep(2);
        } else {
          setStep(1);
        }
      }
    } else if (letterId) {
      const letter = mockCoverLetters.find(l => l.id === letterId);
      if (letter) {
        setGeneratedLetter(letter);
        const job = mockJobPostings.find(j => j.id === letter.jobPostingId);
        if (job) {
          setSelectedJob(job);
        }
        setStep(2);
      }
    }
  }, [jobId, letterId]);

  const handleJobFormSubmit = async (jobData: Partial<JobPosting>) => {
    const newJob: JobPosting = {
      id: selectedJob?.id || `job-${Date.now()}`,
      userId: "1",
      title: jobData.title || "",
      company: jobData.company || "",
      description: jobData.description || "",
      contactPerson: jobData.contactPerson,
      url: jobData.url,
      createdAt: new Date(),
    };
    
    setSelectedJob(newJob);
    setIsGenerating(true);

    try {
      const user = mockUsers[0];

      const response = await fetch('/functions/v1/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobInfo: newJob,
          userInfo: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            experience: "",
            education: "",
            skills: "",
          },
          jobPosting: newJob.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate cover letter');
      }

      const data = await response.json();
      
      const newLetter: CoverLetter = {
        id: generatedLetter?.id || `letter-${Date.now()}`,
        userId: "1",
        jobPostingId: newJob.id,
        content: data.content,
        createdAt: new Date(),
      };

      setGeneratedLetter(newLetter);
      setStep(2);

      toast({
        title: "Ansøgning genereret",
        description: "Din ansøgning er blevet oprettet med succes.",
      });
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast({
        title: "Fejl ved generering",
        description: "Der opstod en fejl under generering af ansøgningen. Prøv venligst igen.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditLetter = (updatedContent: string) => {
    if (generatedLetter) {
      setGeneratedLetter({
        ...generatedLetter,
        content: updatedContent,
      });
    }
  };

  const handleSaveLetter = () => {
    toast({
      title: "Ansøgning gemt",
      description: "Din ansøgning er blevet gemt til din konto.",
    });
  };

  const handleBackToJobDetails = () => {
    setStep(1);
  };

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
