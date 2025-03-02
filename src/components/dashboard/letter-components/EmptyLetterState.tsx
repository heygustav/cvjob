
import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyLetterState: React.FC = () => {
  return (
    <div className="text-center py-10">
      <div className="rounded-full bg-gray-100 p-4 inline-flex mx-auto mb-4">
        <FileText className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mt-2 text-sm font-semibold text-gray-900">Ingen ansøgninger endnu</h3>
      <p className="mt-1 text-sm text-gray-500">
        Du har ikke gemt nogen ansøgninger endnu.
      </p>
      <div className="mt-6">
        <Link to="/generator">
          <Button>
            Opret din første ansøgning
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyLetterState;
