
import { useState } from 'react';
import { CoverLetter } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { usePdfDownload } from './usePdfDownload';
import { useDocxDownload } from './useDocxDownload';
import { useTxtDownload } from './useTxtDownload';

export type FileFormat = 'pdf' | 'docx' | 'txt';

export const useCoverLetterDocuments = (letter: CoverLetter, customContent?: string) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileFormat, setFileFormat] = useState<FileFormat>('pdf');
  const { toast } = useToast();
  
  // Use customContent if provided, otherwise use letter.content
  const contentToDownload = customContent || letter.content;

  // Use our specialized hooks
  const { handleDownloadPdf } = usePdfDownload({
    company: letter.company,
    jobTitle: letter.job_title,
    formattedDate: new Date().toLocaleDateString('da-DK'),
  });

  const { handleDownloadDocx } = useDocxDownload({
    company: letter.company,
    jobTitle: letter.job_title,
    formattedDate: new Date().toLocaleDateString('da-DK'),
  });

  const { handleDownloadTxt } = useTxtDownload({
    company: letter.company,
    jobTitle: letter.job_title,
    formattedDate: new Date().toLocaleDateString('da-DK'),
  });

  // Handle download based on selected format
  const handleDownloadClick = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
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

  return {
    isDownloading,
    fileFormat,
    handleDownloadClick,
    handleFormatChange
  };
};
