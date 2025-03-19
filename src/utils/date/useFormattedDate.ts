
import { useCallback } from 'react';

export const useFormattedDate = () => {
  const formattedDate = new Date().toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return { formattedDate };
};
