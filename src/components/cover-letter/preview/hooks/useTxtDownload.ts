
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { createTextDocument } from "../factories/textDocumentFactory";
import { getTextContent } from "@/utils/download/contentExtractor";
import { useDownloadErrorHandler } from "@/utils/download/downloadErrorHandler";
import { generateCoverLetterFilename } from "@/utils/fileNaming";

interface UseTxtDownloadParams {
  company?: string;
  jobTitle?: string;
  formattedDate: string;
  userName?: string;
}

export const useTxtDownload = ({
  company,
  jobTitle,
  formattedDate,
  userName
}: UseTxtDownloadParams) => {
  const { toast } = useToast();
  const { handleDownloadError } = useDownloadErrorHandler();

  const handleDownloadTxt = useCallback(async (letterContent: string) => {
    if (!letterContent) {
      toast({
        title: 'Ingen indhold',
        description: 'Der er intet indhold at downloade.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Extract text content from possible HTML
      const contentText = getTextContent(letterContent);
      
      // Create text document
      const documentOptions = {
        content: contentText,
        company,
        jobTitle,
        formattedDate
      };
      
      const documentText = createTextDocument(documentOptions);
      
      // Create Blob from text
      const blob = new Blob([documentText], { type: 'text/plain;charset=utf-8' });
      
      // Generate filename
      const filename = generateCoverLetterFilename('txt', {
        fullName: userName,
        jobTitle,
        companyName: company,
      });
      
      // Create download link
      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);
      }, 100);
      
      toast({
        title: 'TXT downloaded',
        description: 'Din ansøgning er blevet downloadet som TXT.',
      });
    } catch (error) {
      handleDownloadError(error, 'TXT');
    }
  }, [company, jobTitle, formattedDate, userName, toast, handleDownloadError]);

  return { handleDownloadTxt };
};
