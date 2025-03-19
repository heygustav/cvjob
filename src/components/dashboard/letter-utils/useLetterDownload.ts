
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CoverLetter, JobPosting, User } from '@/lib/types';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { generateCoverLetterFilename } from '@/utils/fileNaming';
import { getTextContent } from '@/utils/download/contentExtractor';
import { useDownloadErrorHandler } from '@/utils/download/downloadErrorHandler';

export const useLetterDownload = (currentUser?: User | null) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { handleDownloadError } = useDownloadErrorHandler();

  // Generate filename using our new utility
  const createFilename = (letter: CoverLetter, job: JobPosting | null | undefined, extension: string) => {
    return generateCoverLetterFilename(extension, {
      fullName: currentUser?.name,
      jobTitle: job?.title,
      companyName: job?.company,
    });
  };

  // Download as PDF
  const handleDownloadPdf = async (letter: CoverLetter, job?: JobPosting | null) => {
    if (!letter || !letter.content) {
      toast({
        title: 'Ingen indhold',
        description: 'Der er intet indhold at downloade.',
        variant: 'destructive',
      });
      return;
    }

    setIsDownloading(true);

    try {
      // Extract text content from possible HTML
      const contentText = getTextContent(letter.content);
      
      // Create PDF document
      const doc = new jsPDF();
      
      // Add content to PDF
      const splitText = doc.splitTextToSize(contentText, 180);
      doc.text(splitText, 15, 15);
      
      // Generate filename
      const filename = createFilename(letter, job, 'pdf');
      
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
  };

  // Download as DOCX
  const handleDownloadDocx = async (letter: CoverLetter, job?: JobPosting | null) => {
    if (!letter || !letter.content) {
      toast({
        title: 'Ingen indhold',
        description: 'Der er intet indhold at downloade.',
        variant: 'destructive',
      });
      return;
    }

    setIsDownloading(true);

    try {
      // Extract text content from possible HTML
      const contentText = getTextContent(letter.content);
      
      // Create DOCX document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun(contentText),
              ],
            }),
          ],
        }],
      });
      
      // Generate buffer
      const buffer = await Packer.toBuffer(doc);
      
      // Create Blob from buffer
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      
      // Generate filename
      const filename = createFilename(letter, job, 'docx');
      
      // Save file
      saveAs(blob, filename);
      
      toast({
        title: 'DOCX downloaded',
        description: 'Din ansøgning er blevet downloadet som DOCX.',
      });
    } catch (error) {
      handleDownloadError(error, 'DOCX');
    } finally {
      setIsDownloading(false);
    }
  };

  // Download as TXT
  const handleDownloadTxt = async (letter: CoverLetter, job?: JobPosting | null) => {
    if (!letter || !letter.content) {
      toast({
        title: 'Ingen indhold',
        description: 'Der er intet indhold at downloade.',
        variant: 'destructive',
      });
      return;
    }

    setIsDownloading(true);

    try {
      // Extract text content from possible HTML
      const contentText = getTextContent(letter.content);
      
      // Create Blob from text
      const blob = new Blob([contentText], { type: 'text/plain;charset=utf-8' });
      
      // Generate filename
      const filename = createFilename(letter, job, 'txt');
      
      // Save file
      saveAs(blob, filename);
      
      toast({
        title: 'TXT downloaded',
        description: 'Din ansøgning er blevet downloadet som TXT.',
      });
    } catch (error) {
      handleDownloadError(error, 'TXT');
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    handleDownloadPdf,
    handleDownloadDocx,
    handleDownloadTxt
  };
}
