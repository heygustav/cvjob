
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
      {/* Cavalier-specific features - rounder face */}
      <path d="M12 4c3 0 5 2 5 5 0 1.5-1 3-1 3s1 1 1 3c0 2-2 5-5 5s-5-3-5-5c0-2 1-3 1-3s-1-1.5-1-3c0-3 2-5 5-5z" />
      
      {/* Long, droopy ears specific to Cavalier King Charles Spaniel */}
      <path d="M7 9c-1.5 0-3 1-3 3s1 3 3 4" />
      <path d="M17 9c1.5 0 3 1 3 3s-1 3-3 4" />
      
      {/* Snout */}
      <path d="M9 12.5c.5 1 1.5 1.5 3 1.5s2.5-.5 3-1.5" />
      <path d="M12 14v1" />
      
      {/* Sweet, expressive eyes */}
      <circle cx="9.5" cy="9.5" r=".6" />
      <circle cx="14.5" cy="9.5" r=".6" />
      
      {/* Gentle expression - eyebrows */}
      <path d="M9 8.5c.5-.5 1-.5 1.5 0" />
      <path d="M13.5 8.5c.5-.5 1-.5 1.5 0" />
      
      {/* Soft, feathered coat detail on ears */}
      <path d="M6 11c-.5 1-1 3-.5 4.5" />
      <path d="M18 11c.5 1 1 3 .5 4.5" />
    </svg>
  );
};

export default CavalierDog;
