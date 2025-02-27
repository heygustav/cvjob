
import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="text-left mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">Gemte ansøgninger</h1>
          <p className="text-gray-600 mt-1">
            Administrer og rediger dine ansøgninger
          </p>
        </div>
        <Link to="/generator">
          <Button className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Opret ny ansøgning
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
