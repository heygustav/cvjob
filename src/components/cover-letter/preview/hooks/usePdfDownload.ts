
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentDownload } from "@/hooks/shared/useDocumentDownload";
import { getTextContent } from "@/utils/download/contentExtractor";
import { useDownloadErrorHandler } from "@/utils/download/downloadErrorHandler";

interface UsePdfDownloadParams {
  company?: string;
  jobTitle?: string;
  formattedDate: string;
  userName?: string;
}

export const usePdfDownload = ({
  company,
  jobTitle,
  formattedDate,
  userName
}: UsePdfDownloadParams) => {
  const { downloadPdf } = useDocumentDownload({
    userName,
    jobTitle,
    companyName: company,
    formattedDate
  });

  return { handleDownloadPdf: downloadPdf };
};
