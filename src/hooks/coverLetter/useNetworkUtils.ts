
/**
 * @deprecated Use useNetworkHelpers instead
 */
export const useNetworkUtils = () => {
  return {
    createError: (message: string, phase?: string) => new Error(message),
    fetchWithTimeout: async <T>(promise: Promise<T>, timeoutMs = 30000) => {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
      });
      return Promise.race([promise, timeoutPromise]) as Promise<T>;
    }
  };
};

