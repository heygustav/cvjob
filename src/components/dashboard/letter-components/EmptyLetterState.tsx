
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FilePlus, Plus } from "lucide-react";

const EmptyLetterState: React.FC = () => {
  return (
    <div className="py-12">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-gray-100 p-5 mb-5">
          <FilePlus className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Ingen ansøgninger endnu
        </h3>
        <p className="text-gray-500 max-w-md mb-6 text-left">
          Du har ikke oprettet nogen ansøgninger endnu. 
          Kom i gang med at skabe din første ansøgning nu.
        </p>
        <Button asChild>
          <Link to="/ansoegning">
            <Plus className="h-4 w-4 mr-2" />
            Opret din første ansøgning
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EmptyLetterState;
