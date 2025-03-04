
import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { createPdfDocument, generatePdfFilename, PdfDocumentOptions } from "../factories/pdfDocumentFactory";
import { createDocxDocument, generateDocxFilename, saveDocxDocument, DocxDocumentOptions } from "../factories/docxDocumentFactory";
import { createTextDocument, generateTextFilename, TextDocumentOptions } from "../factories/textDocumentFactory";

export const useCoverLetterDocuments = (
  content: string,
  company?: string,
  jobTitle?: string
) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Generate a memoized formatted date
  const formattedDate = useCallback(() => {
    const currentDate = new Date();
    return format(currentDate, "d. MMMM yyyy", { locale: da });
  }, []);

  // Debounce function to prevent multiple quick downloads
  const debounce = (func: Function, wait: number) => {
    return (...args: any[]) => {
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current);
      }
      
      if (isDownloading) {
        toast({
          title: "Download i gang",
          description: "Vent venligst mens vi forbereder din fil...",
        });
        return;
      }
      
      setIsDownloading(true);
      
      downloadTimeoutRef.current = setTimeout(async () => {
        try {
          await func(...args);
        } finally {
          setIsDownloading(false);
          downloadTimeoutRef.current = null;
        }
      }, wait);
    };
  };

  // Helper for error handling
  const handleDownloadError = useCallback((error: any, format: string) => {
    console.error(`Error downloading ${format}:`, error);
    toast({
      title: `Download fejlede`,
      description: `Der opstod en fejl under download af ${format}. Prøv igen senere.`,
      variant: 'destructive',
    });
    setIsDownloading(false);
  }, [toast]);

  // Helper to create a sanitized filename
  const createFilename = useCallback((letter: string, job: string | undefined, company: string | undefined, extension: string) => {
    // Get job title and company if available
    const jobTitle = job ? job.replace(/[^\w\s-]/g, '') : 'untitled';
    const companyName = company ? company.replace(/[^\w\s-]/g, '') : 'unknown';
    
    // Create a timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Create filename: sanitize and replace spaces with hyphens
    return `ansøgning-${companyName}-${jobTitle}-${timestamp}.${extension}`
      .toLowerCase()
      .replace(/\s+/g, '-');
  }, []);

  // Helper to safely get text content from possible HTML
  const getTextContent = useCallback((htmlString: string) => {
    // Create a temporary div element
    const tempDiv = document.createElement('div');
    // Set the HTML content of the div
    tempDiv.innerHTML = htmlString;
    // Return the text content of the div
    return tempDiv.textContent || tempDiv.innerText || '';
  }, []);

  // Download as PDF - wrapped with debounce
  const handleDownloadPdf = useCallback(debounce(async (letterContent: string) => {
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
      const documentOptions: PdfDocumentOptions = {
        content: contentText,
        company,
        jobTitle,
        formattedDate: formattedDate()
      };
      
      const doc = createPdfDocument(documentOptions);
      
      // Generate filename
      const filename = createFilename(letterContent, jobTitle, company, 'pdf');
      
      // Save PDF
      doc.save(filename);
      
      toast({
        title: 'PDF downloaded',
        description: 'Din ansøgning er blevet downloadet som PDF.',
      });
    } catch (error) {
      handleDownloadError(error, 'PDF');
    }
  }, 300), [company, jobTitle, formattedDate, getTextContent, createFilename, handleDownloadError, toast]);

  // Download as DOCX - wrapped with debounce
  const handleDownloadDocx = useCallback(debounce(async (letterContent: string) => {
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
      const documentOptions: DocxDocumentOptions = {
        content: contentText,
        company,
        jobTitle,
        formattedDate: formattedDate()
      };
      
      const doc = createDocxDocument(documentOptions);
      
      // Generate filename
      const filename = createFilename(letterContent, jobTitle, company, 'docx');
      
      // Save file
      await saveDocxDocument(doc, filename);
      
      toast({
        title: 'DOCX downloaded',
        description: 'Din ansøgning er blevet downloadet som DOCX.',
      });
    } catch (error) {
      handleDownloadError(error, 'DOCX');
    }
  }, 300), [company, jobTitle, formattedDate, getTextContent, createFilename, handleDownloadError, toast]);

  // Download as TXT - wrapped with debounce
  const handleDownloadTxt = useCallback(debounce(async (letterContent: string) => {
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
      const documentOptions: TextDocumentOptions = {
        content: contentText,
        company,
        jobTitle,
        formattedDate: formattedDate()
      };
      
      const documentText = createTextDocument(documentOptions);
      
      // Create Blob from text
      const blob = new Blob([documentText], { type: 'text/plain;charset=utf-8' });
      
      // Generate filename
      const filename = createFilename(letterContent, jobTitle, company, 'txt');
      
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
  }, 300), [company, jobTitle, formattedDate, getTextContent, createFilename, handleDownloadError, toast]);

  return {
    isDownloading,
    formattedDate: formattedDate(),
    handleDownloadPdf: () => handleDownloadPdf(content),
    handleDownloadDocx: () => handleDownloadDocx(content),
    handleDownloadTxt: () => handleDownloadTxt(content)
  };
};
