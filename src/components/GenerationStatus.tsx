
import React from "react";
import { Sparkles } from "lucide-react";

export const GenerationStatus: React.FC = () => {
  return (
    <div className="mt-8 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-gray-600 animate-pulse-subtle" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Genererer din ansøgning
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Vores AI analyserer jobopslaget og udarbejder en personlig ansøgning til dig. Dette skulle kun tage få sekunder...
        </p>
      </div>
    </div>
  );
};
