
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ResumeHeader from "../ResumeHeader";
import ResumeEditorTabs from "../ResumeEditorTabs";
import TemplateSelector from "../TemplateSelector";
import PhotoUploader from "../PhotoUploader";
import { Resume } from "@/types/resume";
import { ResumeFormat } from "@/utils/resume/pdfExporter";

interface ResumeBuilderContentProps {
  resumeData: Resume;
  handleUpdateSection: (section: keyof Resume, value: string) => void;
  handleUpdateStructuredExperience: (experiences: Resume['structuredExperience']) => void;
  handleUpdateStructuredEducation: (educations: Resume['structuredEducation']) => void;
  handleUpdateStructuredSkills: (skills: Resume['structuredSkills']) => void;
  handlePhotoChange: (photo?: string) => void;
  handleExport: (format: ResumeFormat) => void;
  isDownloading: boolean;
}

const ResumeBuilderContent: React.FC<ResumeBuilderContentProps> = ({
  resumeData,
  handleUpdateSection,
  handleUpdateStructuredExperience,
  handleUpdateStructuredEducation,
  handleUpdateStructuredSkills,
  handlePhotoChange,
  handleExport,
  isDownloading
}) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <ResumeHeader 
            title="CV Generator" 
            subtitle="Opret et professionelt CV fra dine profiloplysninger" 
          />

          <TemplateSelector 
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
          />

          <PhotoUploader 
            photo={resumeData.photo} 
            onPhotoChange={handlePhotoChange} 
          />

          <ResumeEditorTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
            handleUpdateSection={handleUpdateSection}
            handleUpdateStructuredExperience={handleUpdateStructuredExperience}
            handleUpdateStructuredEducation={handleUpdateStructuredEducation}
            handleUpdateStructuredSkills={handleUpdateStructuredSkills}
            handleExport={handleExport}
            isDownloading={isDownloading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeBuilderContent;
