import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ResumeSectionEditor from "./ResumeSectionEditor";
import ResumePreview from "./ResumePreview";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Resume, ExperienceEntry, EducationEntry, SkillEntry } from "@/types/resume";
import { ResumeFormat } from "@/utils/resume/pdfExporter";
import { ExperienceEditor, EducationEditor, SkillEditor } from "./StructuredSections";

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
  const [exportFormat, setExportFormat] = useState<ResumeFormat>("pdf");

  return (
    <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="edit">Rediger Indhold</TabsTrigger>
        <TabsTrigger value="preview">Forhåndsvisning</TabsTrigger>
      </TabsList>

      <TabsContent value="edit" className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <ResumeSectionEditor
            title="Personlige Oplysninger"
            sections={[
              { key: "name", label: "Fulde Navn", value: resumeData.name },
              { key: "email", label: "Email", value: resumeData.email },
              { key: "phone", label: "Telefon", value: resumeData.phone || "" },
              { key: "address", label: "Adresse", value: resumeData.address || "" },
              { 
                key: "summary", 
                label: "Kort beskrivelse", 
                value: resumeData.summary || "", 
                multiline: true 
              },
            ]}
            onUpdate={handleUpdateSection}
          />
        </div>

        <div className="space-y-6">
          <ExperienceEditor 
            experiences={resumeData.structuredExperience || []}
            onUpdate={handleUpdateStructuredExperience}
          />
        </div>

        <div className="space-y-6">
          <EducationEditor
            educations={resumeData.structuredEducation || []}
            onUpdate={handleUpdateStructuredEducation}
          />
        </div>

        <div className="space-y-6">
          <SkillEditor
            skills={resumeData.structuredSkills || []}
            onUpdate={handleUpdateStructuredSkills}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setActiveTab("preview")} className="h-10 px-4">
            Forhåndsvis CV
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="preview">
        <ResumePreview 
          data={resumeData} 
          template={selectedTemplate as "modern" | "classic" | "creative"} 
        />
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
          <Button variant="outline" onClick={() => setActiveTab("edit")} className="h-10 px-4">
            Tilbage til Redigering
          </Button>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <RadioGroup 
              value={exportFormat} 
              onValueChange={(value) => setExportFormat(value as ResumeFormat)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf">PDF</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="docx" id="docx" />
                <Label htmlFor="docx">Word (DOCX)</Label>
              </div>
            </RadioGroup>
            
            <Button 
              onClick={() => handleExport(exportFormat)} 
              disabled={isDownloading}
              className="h-10 px-4 min-w-[140px]"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloader...
                </>
              ) : (
                "Download CV"
              )}
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ResumeEditorTabs;
