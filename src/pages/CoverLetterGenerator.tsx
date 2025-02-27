
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import JobPostingForm from "../components/JobPostingForm";
import CoverLetterPreview from "../components/CoverLetterPreview";
import { JobPosting, CoverLetter, mockJobPostings, mockCoverLetters } from "../lib/types";
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

  const handleJobFormSubmit = (jobData: Partial<JobPosting>) => {
    // In a real app, we would save this to the database
    // For demo purposes, we'll just use the data in memory
    const newJob: JobPosting = {
      id: selectedJob?.id || `job-${Date.now()}`,
      userId: "1", // Assuming logged in user has ID 1
      title: jobData.title || "",
      company: jobData.company || "",
      description: jobData.description || "",
      contactPerson: jobData.contactPerson,
      url: jobData.url,
      createdAt: new Date(),
    };
    
    setSelectedJob(newJob);
    setIsGenerating(true);

    // Simulate AI-based cover letter generation
    setTimeout(() => {
      generateCoverLetter(newJob);
      setIsGenerating(false);
      setStep(2);
    }, 3000);
  };

  const generateCoverLetter = (job: JobPosting) => {
    // In a real app, this would call an API to generate the letter using AI
    // For demo purposes, we'll use a template

    const today = new Date();
    const formattedDate = today.toLocaleDateString("da-DK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const contactPerson = job.contactPerson || "Ansættelsesansvarlig";

    const letterContent = `${formattedDate}

Kære ${contactPerson},

VEDRØRENDE: ANSØGNING TIL STILLINGEN SOM ${job.title.toUpperCase()} HOS ${job.company.toUpperCase()}

Jeg skriver til dig for at ansøge om stillingen som ${job.title} hos ${job.company}, som jeg så annonceret. Med min baggrund inden for dette felt og mine færdigheder, tror jeg, at jeg vil være et værdifuldt aktiv for jeres team.

Gennem min karriere har jeg opbygget omfattende erfaring inden for ${job.title.toLowerCase()}-området. Jeg har arbejdet på projekter, der krævede stærke analytiske evner, problemløsningskompetencer og teknisk ekspertise. Min erfaring har givet mig et solidt fundament, som jeg kan bygge videre på i denne rolle.

Jeg er særligt tiltrukket af ${job.company} på grund af jeres omdømme for innovation og kvalitet inden for branchen. Jeres fokus på [relevant virksomhedsværdi] matcher perfekt med mine egne professionelle værdier og ambitioner.

Jeg ser frem til muligheden for at diskutere, hvordan mine kvalifikationer kan bidrage til jeres team. Jeg er tilgængelig for et interview på et tidspunkt, der passer jer.

Med venlig hilsen,

Demo Bruger
Telefon: +45 12 34 56 78
Email: demo@example.com`;

    const newLetter: CoverLetter = {
      id: generatedLetter?.id || `letter-${Date.now()}`,
      userId: "1", // Assuming logged in user has ID 1
      jobPostingId: job.id,
      content: letterContent,
      createdAt: new Date(),
    };

    setGeneratedLetter(newLetter);

    // In a real app, we would save the letter to the database here
    toast({
      title: "Ansøgning genereret",
      description: "Din ansøgning er blevet oprettet med succes.",
    });
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
    // In a real app, we would update the letter in the database here
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
