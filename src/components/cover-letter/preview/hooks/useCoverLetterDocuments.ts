
import { useState } from 'react';
import { CoverLetter } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export type FileFormat = 'pdf' | 'docx' | 'txt';

export const useCoverLetterDocuments = (letter: CoverLetter, customContent?: string) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileFormat, setFileFormat] = useState<FileFormat>('pdf');
  const { toast } = useToast();
  
  // Use customContent if provided, otherwise use letter.content
  const contentToDownload = customContent || letter.content;

  // Handle download based on selected format
  const handleDownloadClick = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      const fileName = `Ansøgning_${new Date().toISOString().split('T')[0]}`;
      
      switch (fileFormat) {
        case 'pdf':
          await handleDownloadPdf(contentToDownload);
          break;
        case 'docx':
          await handleDownloadDocx(contentToDownload);
          break;
        case 'txt':
          await handleDownloadTxt(contentToDownload);
          break;
      }
      
      toast({
        title: 'Download fuldført',
        description: `Din ansøgning er downloadet som ${fileFormat.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: 'Download fejlede',
        description: 'Der opstod en fejl ved download af dokumentet',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFormatChange = (format: FileFormat) => {
    setFileFormat(format);
  };

  // Placeholder functions that will be implemented with actual download logic
  const handleDownloadPdf = async (content: string) => {
    console.log("Download as PDF", content);
    // PDF download implementation will go here
  };

  const handleDownloadDocx = async (content: string) => {
    console.log("Download as DOCX", content);
    // DOCX download implementation will go here
  };

  const handleDownloadTxt = async (content: string) => {
    console.log("Download as TXT", content);
    // TXT download implementation will go here
  };

  return {
    isDownloading,
    fileFormat,
    handleDownloadClick,
    handleFormatChange,
    // Export these methods for direct use if needed
    handleDownloadPdf,
    handleDownloadDocx,
    handleDownloadTxt
  };
};
