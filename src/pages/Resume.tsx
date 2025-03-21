import React from "react";
import ResumeBuilder from "@/components/resume/ResumeBuilder";

const Resume: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">CV Builder</h1>
          <p className="text-muted-foreground">Create a professional resume that helps you stand out</p>
        </header>
        
        <main>
          <ResumeBuilder />
        </main>
      </div>
    </div>
  );
};

export default Resume;
