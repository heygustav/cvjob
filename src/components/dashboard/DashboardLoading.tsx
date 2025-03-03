
import React from "react";
import Icon from "../ui/icon";

const DashboardLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center" role="alert" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <Icon 
          name="loader-2" 
          className="h-12 w-12 animate-spin text-primary" 
          dynamic 
          aria-hidden="true"
          alt="Indlæsningsanimation"
        />
        <p className="text-gray-500">Indlæser dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardLoading;
