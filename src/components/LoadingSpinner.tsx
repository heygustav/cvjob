
import React from "react";
import { Loader } from "lucide-react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
      <Loader className="h-12 w-12 animate-spin text-black" />
    </div>
  );
};
