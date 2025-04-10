
import React from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ResumeBuilderContent from "./builders/ResumeBuilderContent";
import { useResumeData } from "@/hooks/resume/useResumeData";
import { useResumeExport } from "@/hooks/resume/useResumeExport";

const ResumeBuilder: React.FC = () => {
  const { 
    resumeData, 
    isLoading, 
    handleUpdateSection,
    handleUpdateStructuredExperience,
    handleUpdateStructuredEducation,
    handleUpdateStructuredSkills,
    handlePhotoChange
  } = useResumeData();

  const { isDownloading, handleExport } = useResumeExport();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner message="Indlæser dine profildata..." />
      </div>
    );
  }

  return (
    <ResumeBuilderContent 
      resumeData={resumeData}
      handleUpdateSection={handleUpdateSection}
      handleUpdateStructuredExperience={handleUpdateStructuredExperience}
      handleUpdateStructuredEducation={handleUpdateStructuredEducation}
      handleUpdateStructuredSkills={handleUpdateStructuredSkills}
      handlePhotoChange={handlePhotoChange}
      handleExport={(format) => handleExport(resumeData, format)}
      isDownloading={isDownloading}
    />
  );
};

export default ResumeBuilder;
