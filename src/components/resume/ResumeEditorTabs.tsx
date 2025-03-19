
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeSectionEditor from "./ResumeSectionEditor";
import ResumePreview from "./ResumePreview";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Resume } from "@/types/resume";

interface ResumeEditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  resumeData: Resume;
  selectedTemplate: string;
  handleUpdateSection: (section: keyof Resume, value: string) => void;
  handleExport: () => void;
  isDownloading: boolean;
}

const ResumeEditorTabs: React.FC<ResumeEditorTabsProps> = ({
  activeTab,
  setActiveTab,
  resumeData,
  selectedTemplate,
  handleUpdateSection,
  handleExport,
  isDownloading
}) => {
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

        <div className="grid md:grid-cols-2 gap-6">
          <ResumeSectionEditor
            title="Erhvervserfaring"
            sections={[
              { 
                key: "experience", 
                label: "Erfaring", 
                value: resumeData.experience || "", 
                multiline: true 
              },
            ]}
            onUpdate={handleUpdateSection}
          />
          
          <ResumeSectionEditor
            title="Uddannelse"
            sections={[
              { 
                key: "education", 
                label: "Uddannelse", 
                value: resumeData.education || "", 
                multiline: true 
              },
            ]}
            onUpdate={handleUpdateSection}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ResumeSectionEditor
            title="Færdigheder"
            sections={[
              { 
                key: "skills", 
                label: "Færdigheder", 
                value: resumeData.skills || "", 
                multiline: true 
              },
            ]}
            onUpdate={handleUpdateSection}
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
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setActiveTab("edit")} className="h-10 px-4">
            Tilbage til Redigering
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isDownloading}
            className="h-10 px-4"
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
      </TabsContent>
    </Tabs>
  );
};

export default ResumeEditorTabs;
