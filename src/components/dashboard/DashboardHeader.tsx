
import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const DashboardHeader: React.FC = () => {
  return (
    <div className="md:flex md:items-center md:justify-between mb-8">
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Sendte ansøgninger</h1>
        <p className="mt-1 text-lg text-gray-600">
          Administrer dine jobansøgninger og ansøgningsbreve
        </p>
      </div>
      <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
        <Link
          to="/generator"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Ny ansøgning
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
