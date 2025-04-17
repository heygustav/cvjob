
import { CoverLetter, JobPosting, User } from '@/lib/types';
import { useDocumentDownload } from '@/hooks/shared/useDocumentDownload';

export const useLetterDownload = (currentUser?: User | null) => {
  const { isDownloading, downloadPdf, downloadDocx, downloadTxt } = useDocumentDownload({
    userName: currentUser?.name
  });

  // Wrapper functions to adapt to the expected interface
  const handleDownloadPdf = async (letter: CoverLetter, job?: JobPosting | null) => {
    return downloadPdf(letter?.content);
  };

  const handleDownloadDocx = async (letter: CoverLetter, job?: JobPosting | null) => {
    return downloadDocx(letter?.content);
  };

  const handleDownloadTxt = async (letter: CoverLetter, job?: JobPosting | null) => {
    return downloadTxt(letter?.content);
  };

  return {
    isDownloading,
    handleDownloadPdf,
    handleDownloadDocx,
    handleDownloadTxt
  };
};
