
export const setupGenerationTimeout = (
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  handleTimeoutCallback: Function,
  timeoutMs: number = 45000
) => {
  // Create a timeout to abort generation if it takes too long
  const timeoutId = setTimeout(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      
      handleTimeoutCallback(new Error("Generation timeout - took too long to generate"));
    }
  }, timeoutMs);
  
  // Store the timeout ID on window for cleanup
  (window as any).__generationTimeoutId = timeoutId;
  
  return timeoutId;
};
