
import { useState } from 'react';
import { CoverLetter } from '@/lib/types';
import { usePdfDownload } from './usePdfDownload';
import { useDocxDownload } from './useDocxDownload';
import { useTxtDownload } from './useTxtDownload';
import { useToast } from '@/hooks/use-toast';

export type FileFormat = 'pdf' | 'docx' | 'txt';

export const useCoverLetterDocuments = (letter: CoverLetter, customContent?: string) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileFormat, setFileFormat] = useState<FileFormat>('pdf');
  const { toast } = useToast();
  
  // Use customContent if provided, otherwise use letter.content
  const contentToDownload = customContent || letter.content;

  // Initialize download hooks
  const { downloadAsPdf } = usePdfDownload();
  const { downloadAsDocx } = useDocxDownload();
  const { downloadAsTxt } = useTxtDownload();

  const handleDownloadClick = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      const fileName = `Ansøgning_${new Date().toISOString().split('T')[0]}`;
      
      switch (fileFormat) {
        case 'pdf':
          await downloadAsPdf(contentToDownload, fileName);
          break;
        case 'docx':
          await downloadAsDocx(contentToDownload, fileName);
          break;
        case 'txt':
          await downloadAsTxt(contentToDownload, fileName);
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
