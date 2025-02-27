
import React from "react";
import { Loader } from "lucide-react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-[60vh] md:min-h-screen bg-gray-50 flex justify-center items-center px-4">
      <div className="text-center">
        <Loader className="h-10 w-10 md:h-12 md:w-12 animate-spin text-black mx-auto" />
        <p className="mt-4 text-sm md:text-base text-gray-600">Indlæser...</p>
      </div>
    </div>
  );
};
