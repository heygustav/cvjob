
import React from "react";

const DashboardHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900">Gemte ansøgninger</h1>
        <p className="text-gray-600 mt-1">
          Administrer og rediger dine ansøgninger
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
