
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { exportResume, ResumeFormat } from "@/utils/resume/pdfExporter";
import { Resume } from "@/types/resume";
import { useDownloadErrorHandler } from "@/utils/download/downloadErrorHandler";

export function useResumeExport() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { handleDownloadError } = useDownloadErrorHandler();

  const handleExport = async (resumeData: Resume, format: ResumeFormat) => {
    try {
      setIsDownloading(true);
      
      await exportResume(resumeData, format);
      
      toast({
        title: "CV Downloadet",
        description: `Dit CV er blevet downloadet som ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error("Error exporting resume:", error);
      handleDownloadError(error, format.toUpperCase());
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    handleExport
  };
}
