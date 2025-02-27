
import React from 'react';

interface CavalierDogProps {
  className?: string;
}

const CavalierDog: React.FC<CavalierDogProps> = ({ className = "" }) => {
  return (
    <img 
      src="/lovable-uploads/ddd2a12f-1253-4b04-9998-642e1cd5366c.png" 
      alt="Cute puppy dog"
      className={`w-auto h-auto ${className}`}
    />
  );
};

export default CavalierDog;
