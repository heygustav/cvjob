
import React from "react";

interface TechnicalInfoProps {
  authStatus: string;
  dbStatus: string;
  browserInfo: string;
}

const TechnicalInfo: React.FC<TechnicalInfoProps> = ({
  authStatus,
  dbStatus,
  browserInfo
}) => {
  return (
    <div className="p-6">
      <h3 className="text-sm font-medium text-gray-500">Teknisk information:</h3>
      <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Autentificeringsstatus</dt>
          <dd className="mt-1 text-sm text-gray-900">{authStatus}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Databasestatus</dt>
          <dd className="mt-1 text-sm text-gray-900">{dbStatus}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-gray-500">Browser information</dt>
          <dd className="mt-1 text-sm text-gray-900 break-words">
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
              {browserInfo}
            </pre>
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default TechnicalInfo;
