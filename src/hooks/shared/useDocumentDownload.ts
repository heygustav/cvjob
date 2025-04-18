
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
import { validateContentForDownload } from '@/components/cover-letter/preview/utils/contentCleaner';
import { sanitizeInput } from '@/utils/security';

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
  
  const { 
    userName = '', 
    jobTitle = '', 
    companyName = '', 
    formattedDate = new Date().toLocaleDateString() 
  } = options;

  // Sanitize all input parameters
  const sanitizedUserName = sanitizeInput(userName);
  const sanitizedJobTitle = sanitizeInput(jobTitle);
  const sanitizedCompanyName = sanitizeInput(companyName);
  const sanitizedFormattedDate = sanitizeInput(formattedDate);

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
    
    try {
      // Validate and sanitize content for security purposes
      return validateContentForDownload(content);
    } catch (error) {
      toast({
        title: 'Sikkerhedsproblem',
        description: 'Indholdet kunne ikke valideres til download. Det kan indeholde ugyldige elementer.',
        variant: 'destructive',
      });
      throw new Error('Content validation failed');
    }
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
        company: sanitizedCompanyName,
        jobTitle: sanitizedJobTitle,
        formattedDate: sanitizedFormattedDate
      });
      
      // Generate filename
      const filename = generateDocumentFilename('pdf', {
        fullName: sanitizedUserName,
        jobTitle: sanitizedJobTitle,
        companyName: sanitizedCompanyName,
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
    validateContent, sanitizedCompanyName, sanitizedJobTitle, 
    sanitizedFormattedDate, sanitizedUserName, toast, handleDownloadError
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
        company: sanitizedCompanyName,
        jobTitle: sanitizedJobTitle,
        formattedDate: sanitizedFormattedDate
      });
      
      // Generate filename
      const filename = generateDocumentFilename('docx', {
        fullName: sanitizedUserName,
        jobTitle: sanitizedJobTitle,
        companyName: sanitizedCompanyName,
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
    validateContent, sanitizedCompanyName, sanitizedJobTitle, 
    sanitizedFormattedDate, sanitizedUserName, toast, handleDownloadError
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
        company: sanitizedCompanyName,
        jobTitle: sanitizedJobTitle,
        formattedDate: sanitizedFormattedDate
      });
      
      // Generate filename
      const filename = generateDocumentFilename('txt', {
        fullName: sanitizedUserName,
        jobTitle: sanitizedJobTitle,
        companyName: sanitizedCompanyName,
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
    validateContent, sanitizedCompanyName, sanitizedJobTitle, 
    sanitizedFormattedDate, sanitizedUserName, toast, handleDownloadError
  ]);

  return {
    isDownloading,
    downloadPdf,
    downloadDocx,
    downloadTxt
  };
};
