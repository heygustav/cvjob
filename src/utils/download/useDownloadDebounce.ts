
import { useState, useCallback } from 'react';

export const useDownloadDebounce = (delay: number = 300) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const debounce = useCallback((callback: () => void) => {
    return () => {
      if (isDownloading) return;
      
      setIsDownloading(true);
      
      try {
        callback();
      } finally {
        // Reset download state after the specified delay
        setTimeout(() => {
          setIsDownloading(false);
        }, delay);
      }
    };
  }, [isDownloading, delay]);

  return { isDownloading, debounce };
};
