
import { useRef, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export const useDownloadDebounce = (debounceTime: number = 300) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const debounce = useCallback((func: Function) => {
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
      }, debounceTime);
    };
  }, [isDownloading, toast, debounceTime]);

  return {
    isDownloading,
    debounce
  };
};
