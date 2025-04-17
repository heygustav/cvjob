
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDownloadErrorHandler } from '@/utils/download/downloadErrorHandler';
import { 
  createPdfDocument, 
  createDocxDocument, 
  saveDocxDocument,
  createTextDocument,
  saveTextDocument,
  processContentForDownload,
  generateDocumentFilename
} from '@/utils/shared/documentUtils';

interface DocumentDownloadOptions {
  userName?: string;
  jobTitle?: string;
  companyName?: string;
  formattedDate?: string;
}

/**
 * Hook for handling document downloads in various formats
 */
export const useDocumentDownload = (options: DocumentDownloadOptions = {}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { handleDownloadError } = useDownloadErrorHandler();
  
  const { userName, jobTitle, companyName, formattedDate = new Date().toLocaleDateString() } = options;

  /**
   * Validate content before download
   */
  const validateContent = useCallback((content: string | null | undefined): string => {
    if (!content) {
      toast({
        title: 'Ingen indhold',
        description: 'Der er intet indhold at downloade.',
        variant: 'destructive',
      });
      throw new Error('No content to download');
    }
    return content;
  }, [toast]);

  /**
   * Download content as PDF
   */
  const downloadPdf = useCallback(async (content: string | null | undefined) => {
    setIsDownloading(true);

    try {
      const validatedContent = validateContent(content);
      const processedContent = processContentForDownload(validatedContent);
      
      // Create PDF document
      const doc = createPdfDocument({
        content: processedContent,
        company: companyName,
        jobTitle,
        formattedDate
      });
      
      // Generate filename
      const filename = generateDocumentFilename('pdf', {
        fullName: userName,
        jobTitle,
        companyName,
      });
      
      // Save PDF
      doc.save(filename);
      
      toast({
        title: 'PDF downloaded',
        description: 'Din ansøgning er blevet downloadet som PDF.',
      });
    } catch (error) {
      handleDownloadError(error, 'PDF');
    } finally {
      setIsDownloading(false);
    }
  }, [
    validateContent, companyName, jobTitle, formattedDate, 
    userName, toast, handleDownloadError
  ]);

  /**
   * Download content as DOCX
   */
  const downloadDocx = useCallback(async (content: string | null | undefined) => {
    setIsDownloading(true);

    try {
      const validatedContent = validateContent(content);
      const processedContent = processContentForDownload(validatedContent);
      
      // Create DOCX document
      const doc = createDocxDocument({
        content: processedContent,
        company: companyName,
        jobTitle,
        formattedDate
      });
      
      // Generate filename
      const filename = generateDocumentFilename('docx', {
        fullName: userName,
        jobTitle,
        companyName,
      });
      
      // Save file
      await saveDocxDocument(doc, filename);
      
      toast({
        title: 'DOCX downloaded',
        description: 'Din ansøgning er blevet downloadet som DOCX.',
      });
    } catch (error) {
      handleDownloadError(error, 'DOCX');
    } finally {
      setIsDownloading(false);
    }
  }, [
    validateContent, companyName, jobTitle, formattedDate,
    userName, toast, handleDownloadError
  ]);

  /**
   * Download content as TXT
   */
  const downloadTxt = useCallback(async (content: string | null | undefined) => {
    setIsDownloading(true);

    try {
      const validatedContent = validateContent(content);
      const processedContent = processContentForDownload(validatedContent);
      
      // Create text document
      const documentText = createTextDocument({
        content: processedContent,
        company: companyName,
        jobTitle,
        formattedDate
      });
      
      // Generate filename
      const filename = generateDocumentFilename('txt', {
        fullName: userName,
        jobTitle,
        companyName,
      });
      
      // Save text file
      saveTextDocument(documentText, filename);
      
      toast({
        title: 'TXT downloaded',
        description: 'Din ansøgning er blevet downloadet som TXT.',
      });
    } catch (error) {
      handleDownloadError(error, 'TXT');
    } finally {
      setIsDownloading(false);
    }
  }, [
    validateContent, companyName, jobTitle, formattedDate,
    userName, toast, handleDownloadError
  ]);

  return {
    isDownloading,
    downloadPdf,
    downloadDocx,
    downloadTxt
  };
};
