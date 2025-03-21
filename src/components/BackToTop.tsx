import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  threshold?: number;
  className?: string;
  showLabel?: boolean;
}

const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 400,
  className,
  showLabel = false
}) => {
  const [visible, setVisible] = useState(false);
  
  // Handle scroll event to show/hide button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Check initial position
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);
  
  // Scroll to top function with smooth animation
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <button
      type="button"
      aria-label="Tilbage til toppen"
      className={cn(
        'fixed bottom-4 right-4 z-50 rounded-full bg-primary p-2 text-white shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:bg-primary-600 active:scale-95',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none',
        showLabel ? 'px-4' : 'h-10 w-10',
        className
      )}
      onClick={scrollToTop}
    >
      <span className="flex items-center justify-center">
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
        {showLabel && <span className="ml-2">Til toppen</span>}
      </span>
    </button>
  );
};

export default BackToTop; 