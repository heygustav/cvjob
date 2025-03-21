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
import AtsOptimizer from "./AtsOptimizer";

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
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="edit">Rediger Indhold</TabsTrigger>
        <TabsTrigger value="preview">Forhåndsvisning</TabsTrigger>
        <TabsTrigger value="ats">ATS Optimering</TabsTrigger>
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
      </TabsContent>

      <TabsContent value="preview">
        <div className="space-y-6">
          <ResumePreview 
            data={resumeData} 
            template={selectedTemplate as "modern" | "classic" | "creative"} 
          />
          
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Eksporter CV</h3>
              
              <RadioGroup 
                value={exportFormat}
                onValueChange={(value) => setExportFormat(value as ResumeFormat)}
                className="flex space-x-4 mb-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf">PDF</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="docx" id="docx" />
                  <Label htmlFor="docx">DOCX</Label>
                </div>
              </RadioGroup>
              
              <Button 
                onClick={() => handleExport(exportFormat)}
                disabled={isDownloading}
                className="w-full"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Eksporterer...
                  </>
                ) : (
                  `Download som ${exportFormat.toUpperCase()}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="ats">
        <div className="space-y-6">
          <div className="bg-muted/40 p-4 rounded-md mb-6">
            <h3 className="text-lg font-medium mb-2">ATS Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Applicant Tracking Systems (ATS) are software used by employers to scan and filter resumes.
              Use this tool to check how well your resume might perform with these systems and get tailored advice.
            </p>
          </div>
          
          <AtsOptimizer resumeData={resumeData} />
          
          <div className="border-t pt-4 mt-6">
            <h4 className="font-medium mb-3">ATS Tips</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Use standard section headings (Experience, Education, Skills)</li>
              <li>Apply proper formatting with consistent spacing</li>
              <li>Include relevant keywords from the job description</li>
              <li>Use a clean, simple layout without complex tables or graphics</li>
              <li>Save your resume as a simple PDF or DOCX format</li>
            </ul>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ResumeEditorTabs;
