
import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );
};
