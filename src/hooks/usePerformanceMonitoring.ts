
import { useEffect, useRef } from 'react';

interface PerformanceOptions {
  componentName: string;
  logMount?: boolean;
  logRender?: boolean;
  logUpdate?: boolean;
  logUnmount?: boolean;
}

/**
 * Hook to monitor component performance including render times,
 * mount times, and re-render counts
 */
export const usePerformanceMonitoring = ({
  componentName,
  logMount = true,
  logRender = true,
  logUpdate = false,
  logUnmount = false
}: PerformanceOptions) => {
  const mountTimeRef = useRef<number>(0);
  const renderStartTimeRef = useRef<number>(performance.now());
  const renderCountRef = useRef<number>(0);
  const isFirstRender = useRef<boolean>(true);
  
  // Log mount time
  useEffect(() => {
    if (logMount) {
      mountTimeRef.current = performance.now();
      const mountDuration = performance.now() - mountTimeRef.current;
      console.log(`[Performance] ${componentName} mounted in ${mountDuration.toFixed(2)}ms`);
    }
    
    return () => {
      if (logUnmount) {
        console.log(`[Performance] ${componentName} unmounted after ${renderCountRef.current} renders`);
      }
    };
  }, [componentName, logMount, logUnmount]);
  
  // Log render time
  useEffect(() => {
    if (logRender) {
      renderCountRef.current += 1;
      const renderDuration = performance.now() - renderStartTimeRef.current;
      
      if (isFirstRender.current) {
        console.log(`[Performance] ${componentName} initial render: ${renderDuration.toFixed(2)}ms`);
        isFirstRender.current = false;
      } else if (logUpdate) {
        console.log(`[Performance] ${componentName} re-render #${renderCountRef.current}: ${renderDuration.toFixed(2)}ms`);
      }
      
      renderStartTimeRef.current = performance.now();
    }
  });
  
  return {
    renderCount: renderCountRef.current,
    logTiming: (label: string) => {
      const now = performance.now();
      const elapsed = now - renderStartTimeRef.current;
      console.log(`[Performance] ${componentName} - ${label}: ${elapsed.toFixed(2)}ms`);
      return now;
    }
  };
};
