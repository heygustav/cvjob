
import React, { useState, useEffect, useCallback, memo } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  threshold?: number;
  className?: string;
  showLabel?: boolean;
}

const BackToTop: React.FC<BackToTopProps> = memo(({
  threshold = 400,
  className,
  showLabel = false
}) => {
  const [visible, setVisible] = useState(false);
  
  // Memoize scroll handler to prevent recreating on each render
  const handleScroll = useCallback(() => {
    const shouldShow = window.scrollY > threshold;
    if (visible !== shouldShow) {
      setVisible(shouldShow);
    }
  }, [threshold, visible]);
  
  // Use passive event listener for better performance
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial position
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  // Memoize scroll function for better performance
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  return (
    <button
      type="button"
      aria-label={showLabel ? "Tilbage til toppen" : "Tilbage til toppen af siden"}
      className={cn(
        'fixed bottom-4 right-4 z-50 rounded-full bg-primary p-2 text-white shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:bg-primary-600 active:scale-95',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none',
        showLabel ? 'px-4' : 'h-10 w-10',
        className
      )}
      onClick={scrollToTop}
      // Add better keyboard accessibility support
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollToTop();
        }
      }}
    >
      <span className="flex items-center justify-center">
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
        {showLabel && <span className="ml-2">Til toppen</span>}
      </span>
    </button>
  );
});

// Add display name for better debugging
BackToTop.displayName = 'BackToTop';

export default BackToTop;
