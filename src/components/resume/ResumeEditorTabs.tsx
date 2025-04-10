
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Resume, ExperienceEntry, EducationEntry, SkillEntry } from "@/types/resume";
import { ResumeFormat } from "@/utils/resume/pdfExporter";
import EditTab from "./tabs/EditTab";
import PreviewTab from "./tabs/PreviewTab";
import AtsTab from "./tabs/AtsTab";
import { FileText, Eye, BarChart2 } from "lucide-react";

interface ResumeEditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  resumeData: Resume;
  selectedTemplate: string;
  handleUpdateSection: (section: keyof Resume, value: string) => void;
  handleUpdateStructuredExperience: (experiences: ExperienceEntry[]) => void;
  handleUpdateStructuredEducation: (educations: EducationEntry[]) => void;
  handleUpdateStructuredSkills: (skills: SkillEntry[]) => void;
  handleExport: (format: ResumeFormat) => void;
  isDownloading: boolean;
}

const ResumeEditorTabs: React.FC<ResumeEditorTabsProps> = ({
  activeTab,
  setActiveTab,
  resumeData,
  selectedTemplate,
  handleUpdateSection,
  handleUpdateStructuredExperience,
  handleUpdateStructuredEducation,
  handleUpdateStructuredSkills,
  handleExport,
  isDownloading
}) => {
  return (
    <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="edit" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Rediger Indhold</span>
          <span className="sm:hidden">Rediger</span>
        </TabsTrigger>
        <TabsTrigger value="preview" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">Forhåndsvisning</span>
          <span className="sm:hidden">Vis</span>
        </TabsTrigger>
        <TabsTrigger value="ats" className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          <span className="hidden sm:inline">ATS Optimering</span>
          <span className="sm:hidden">ATS</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="edit">
        <EditTab 
          resumeData={resumeData}
          handleUpdateSection={handleUpdateSection}
          handleUpdateStructuredExperience={handleUpdateStructuredExperience}
          handleUpdateStructuredEducation={handleUpdateStructuredEducation}
          handleUpdateStructuredSkills={handleUpdateStructuredSkills}
        />
      </TabsContent>

      <TabsContent value="preview">
        <PreviewTab
          resumeData={resumeData}
          templateName={selectedTemplate}
          handleExport={handleExport}
          isDownloading={isDownloading}
        />
      </TabsContent>
      
      <TabsContent value="ats">
        <AtsTab resumeData={resumeData} />
      </TabsContent>
    </Tabs>
  );
};

export default ResumeEditorTabs;
