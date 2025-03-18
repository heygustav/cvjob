
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { createDocxDocument, saveDocxDocument } from "../factories/docxDocumentFactory";
import { getTextContent } from "@/utils/download/contentExtractor";
import { useDownloadErrorHandler } from "@/utils/download/downloadErrorHandler";
import { generateCoverLetterFilename } from "@/utils/fileNaming";

interface UseDocxDownloadParams {
  company?: string;
  jobTitle?: string;
  formattedDate: string;
  userName?: string;
}

export const useDocxDownload = ({
  company,
  jobTitle,
  formattedDate,
  userName
}: UseDocxDownloadParams) => {
  const { toast } = useToast();
  const { handleDownloadError } = useDownloadErrorHandler();

  const handleDownloadDocx = useCallback(async (letterContent: string) => {
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
      
      // Create DOCX document
      const documentOptions = {
        content: contentText,
        company,
        jobTitle,
        formattedDate
      };
      
      const doc = createDocxDocument(documentOptions);
      
      // Generate filename
      const filename = generateCoverLetterFilename('docx', {
        fullName: userName,
        jobTitle,
        companyName: company,
      });
      
      // Save file
      await saveDocxDocument(doc, filename);
      
      toast({
        title: 'DOCX downloaded',
        description: 'Din ansøgning er blevet downloadet som DOCX.',
      });
    } catch (error) {
      handleDownloadError(error, 'DOCX');
    }
  }, [company, jobTitle, formattedDate, userName, toast, handleDownloadError]);

  return { handleDownloadDocx };
};
