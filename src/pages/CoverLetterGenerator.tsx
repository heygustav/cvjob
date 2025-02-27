
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

Gennem min karriere har jeg opbygget omfattende erfaring inden for ${job.title.toLowerCase()}-området. Jeg har arbejdet på projekter, der krævede stærke analytiske evner, problemløsningskomp