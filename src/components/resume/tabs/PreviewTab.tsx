
import React, { useState } from "react";
import ResumePreview from "../ResumePreview";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Resume } from "@/types/resume";
import { ResumeFormat } from "@/utils/resume/pdfExporter";

interface PreviewTabProps {
  resumeData: Resume;
  templateName: string;
  handleExport: (format: ResumeFormat) => void;
  isDownloading: boolean;
}

const PreviewTab: React.FC<PreviewTabProps> = ({
  resumeData,
  templateName,
  handleExport,
  isDownloading
}) => {
  const [exportFormat, setExportFormat] = useState<ResumeFormat>("pdf");

  return (
    <div className="space-y-6">
      <ResumePreview 
        data={resumeData} 
        template={templateName as "modern" | "classic" | "creative"} 
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
  );
};

export default PreviewTab;
