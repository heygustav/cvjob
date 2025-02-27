
import React from 'react';

interface CavalierDogProps {
  className?: string;
}

const CavalierDog: React.FC<CavalierDogProps> = ({ className = "" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Long ears */}
      <path d="M3.5 12C3.5 9 5 6 6.5 6C8 6 8.5 8 8.5 10C8.5 12 8 16.5 6 18C4 19.5 3.5 16 3.5 12Z" />
      <path d="M20.5 12C20.5 9 19 6 17.5 6C16 6 15.5 8 15.5 10C15.5 12 16 16.5 18 18C20 19.5 20.5 16 20.5 12Z" />

      {/* Head shape */}
      <path d="M8.5 10C8.5 6 10 4 12 4C14 4 15.5 6 15.5 10C15.5 14 14 17 12 17C10 17 8.5 14 8.5 10Z" />

      {/* Eyes */}
      <circle cx="9.5" cy="10" r="0.8" />
      <circle cx="14.5" cy="10" r="0.8" />
      <circle cx="9.5" cy="10" r="0.3" fill="currentColor" />
      <circle cx="14.5" cy="10" r="0.3" fill="currentColor" />

      {/* Face markings */}
      <path d="M10.5 8C10.5 8 11 7 12 7C13 7 13.5 8 13.5 8" />
      
      {/* Nose and mouth */}
      <circle cx="12" cy="12.5" r="0.8" />
      <path d="M10 14C10 14 11 15 12 15C13 15 14 14 14 14" />
      <path d="M9 13.5C9 13.5 10.5 14.5 12 14.5C13.5 14.5 15 13.5 15 13.5" />
    </svg>
  );
};

export default CavalierDog;
