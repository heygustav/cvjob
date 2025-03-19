
import React from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ResumeProgressProps {
  isExtracting: boolean;
}

const ResumeProgress: React.FC<ResumeProgressProps> = ({ isExtracting }) => {
  if (!isExtracting) return null;
  
  return (
    <div className="flex items-center justify-center mt-2">
      <LoadingSpinner size="sm" message="Analyserer CV..." />
    </div>
  );
};

export default ResumeProgress;
