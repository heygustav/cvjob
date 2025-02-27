
import React from "react";
import { Sparkles } from "lucide-react";

export const GenerationStatus: React.FC = () => {
  return (
    <div className="mt-6 md:mt-8 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full mb-3 md:mb-4">
          <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-gray-600 animate-pulse-subtle" />
        </div>
        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1 md:mb-2">
          Genererer din ansøgning
        </h3>
        <p className="text-xs md:text-sm text-gray-500 max-w-xs md:max-w-md mx-auto">
          Vores AI analyserer jobopslaget og udarbejder en personlig ansøgning til dig. Dette skulle kun tage få sekunder...
        </p>
      </div>
    </div>
  );
};
