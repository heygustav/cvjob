
import React from "react";
import { FilePlus } from "lucide-react";

const EmptyLetterState: React.FC = () => {
  return (
    <div className="py-12">
      <div className="flex flex-col items-start">
        <div className="rounded-full bg-gray-100 p-5 mb-5">
          <FilePlus className="h-6 w-6 text-gray-400" /> {/* Standardized size */}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Ingen ansøgninger endnu
        </h3>
        <p className="text-gray-500 max-w-md mb-6">
          Du har ikke oprettet nogen ansøgninger endnu. 
          Kom i gang med at skabe din første ansøgning.
        </p>
      </div>
    </div>
  );
};

export default EmptyLetterState;
