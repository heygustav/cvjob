
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { createPdfDocument } from "../factories/pdfDocumentFactory";
import { getTextContent } from "@/utils/download/contentExtractor";
import { useDownloadErrorHandler } from "@/utils/download/downloadErrorHandler";
import { generateCoverLetterFilename } from "@/utils/fileNaming";

interface UsePdfDownloadParams {
  company?: string;
  jobTitle?: string;
  formattedDate: string;
  userName?: string;
}

export const usePdfDownload = ({
  company,
  jobTitle,
  formattedDate,
  userName
}: UsePdfDownloadParams) => {
  const { toast } = useToast();
  const { handleDownloadError } = useDownloadErrorHandler();

  const handleDownloadPdf = useCallback(async (letterContent: string) => {
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
      
      // Create PDF document
      const documentOptions = {
        content: contentText,
        company,
        jobTitle,
        formattedDate
      };
      
      const doc = createPdfDocument(documentOptions);
      
      // Generate filename
      const filename = generateCoverLetterFilename('pdf', {
        fullName: userName,
        jobTitle,
        companyName: company,
      });
      
      // Save PDF
      doc.save(filename);
      
      toast({
        title: 'PDF downloaded',
        description: 'Din ansøgning er blevet downloadet som PDF.',
      });
    } catch (error) {
      handleDownloadError(error, 'PDF');
    }
  }, [company, jobTitle, formattedDate, userName, toast, handleDownloadError]);

  return { handleDownloadPdf };
};
