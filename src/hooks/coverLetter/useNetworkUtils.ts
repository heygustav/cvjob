
import { useNetworkHelpers } from '@/hooks/shared/useNetworkHelpers';

/**
 * @deprecated Use useNetworkHelpers instead
 */
export const useNetworkUtils = () => {
  const { createError, withTimeout } = useNetworkHelpers();
  
  return {
    createError,
    fetchWithTimeout: withTimeout
  };
};
