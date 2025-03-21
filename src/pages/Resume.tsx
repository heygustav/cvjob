import React from "react";
import ResumeBuilder from "@/components/resume/ResumeBuilder";
import { Card, CardContent } from "@/components/ui/card";

const ResumeGuide = () => (
  <Card className="mb-8 bg-white">
    <CardContent className="p-6">
      <h2 className="text-xl font-bold mb-4">Create an ATS-Optimized Resume</h2>
      <p className="mb-4">
        Your resume will be automatically formatted according to best practices for 
        getting through Applicant Tracking Systems (ATS):
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>Uses ATS-friendly fonts (Arial/Helvetica) and standardized formatting</li>
        <li>Clear section headers in uppercase formatting for better ATS parsing</li>
        <li>Proper bullet point formatting with strategic indentation</li>
        <li>Clean document structure with consistent spacing and margins</li>
        <li>PDF metadata optimization for improved keyword recognition</li>
        <li>Skill categorization to highlight your core competencies</li>
      </ul>
      <p className="mb-3">
        For best results with ATS systems:
      </p>
      <ol className="list-decimal pl-6 space-y-2 mb-4">
        <li><strong>Use bullet points</strong> for work experience and skills - they're easier for ATS to parse</li>
        <li><strong>Include relevant keywords</strong> from the job posting in your skills and experience</li>
        <li><strong>Be specific with dates</strong> - include months and years for all experience</li>
        <li><strong>Quantify achievements</strong> with numbers and metrics when possible</li>
        <li><strong>Use standard section headings</strong> like "Experience", "Education", and "Skills"</li>
      </ol>
      <p>
        Fill out the form below to create your professional resume. The more details you 
        provide, the better the results will be.
      </p>
    </CardContent>
  </Card>
);

const Resume: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">CV Builder</h1>
          <p className="text-muted-foreground">Create a professional resume that helps you stand out</p>
        </header>
        
        <main>
          <ResumeGuide />
          <ResumeBuilder />
        </main>
      </div>
    </div>
  );
};

export default Resume;
