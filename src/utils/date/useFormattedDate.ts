
import { useCallback } from 'react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

export const useFormattedDate = () => {
  const getFormattedDate = useCallback(() => {
    const currentDate = new Date();
    return format(currentDate, "d. MMMM yyyy", { locale: da });
  }, []);

  return { formattedDate: getFormattedDate() };
};
