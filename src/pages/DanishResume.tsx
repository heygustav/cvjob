
import React from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import DanishResumeContent from "@/components/resume/danish/DanishResumeContent";
import { useResumeData } from "@/hooks/resume/useResumeData";

const DanishResume: React.FC = () => {
  const { resumeData, isLoading } = useResumeData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner message="Indlæser dine profildata..." />
      </div>
    );
  }

  return <DanishResumeContent resumeData={resumeData} />;
};

export default DanishResume;
