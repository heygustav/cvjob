
import { useDownloadDebounce } from "@/utils/download/useDownloadDebounce";
import { useFormattedDate } from "@/utils/date/useFormattedDate";
import { usePdfDownload } from "./usePdfDownload";
import { useDocxDownload } from "./useDocxDownload";
import { useTxtDownload } from "./useTxtDownload";
import { useAuth } from "@/components/AuthProvider";

export const useCoverLetterDocuments = (
  content: string,
  company?: string,
  jobTitle?: string
) => {
  const { user } = useAuth();
  const { isDownloading, debounce } = useDownloadDebounce(300);
  const { formattedDate } = useFormattedDate();
  
  // Get user name from auth context
  const userName = user?.user_metadata?.name;

  // Initialize our download hooks
  const { handleDownloadPdf } = usePdfDownload({ 
    company, 
    jobTitle, 
    formattedDate,
    userName 
  });
  
  const { handleDownloadDocx } = useDocxDownload({ 
    company, 
    jobTitle, 
    formattedDate,
    userName 
  });
  
  const { handleDownloadTxt } = useTxtDownload({ 
    company, 
    jobTitle, 
    formattedDate,
    userName 
  });

  return {
    isDownloading,
    formattedDate,
    handleDownloadPdf: debounce(() => handleDownloadPdf(content)),
    handleDownloadDocx: debounce(() => handleDownloadDocx(content)),
    handleDownloadTxt: debounce(() => handleDownloadTxt(content))
  };
};
