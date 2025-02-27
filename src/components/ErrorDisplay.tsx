
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  title: string;
  message: string;
  onRetry?: () => void;
  phase?: 'job-save' | 'user-fetch' | 'generation' | 'letter-save';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  message,
  onRetry,
  phase
}) => {
  // Get more specific help text based on the phase
  const getHelpText = () => {
    switch (phase) {
      case 'job-save':
        return "Tjek din internetforbindelse og prøv igen. Hvis problemet fortsætter, prøv at opdatere siden.";
      case 'user-fetch':
        return "Sørg for at din profil er udfyldt. Prøv at logge ud og ind igen.";
      case 'generation':
        return "AI-tjenesten er muligvis midlertidigt utilgængelig. Vent lidt og prøv igen.";
      case 'letter-save':
        return "Din ansøgning blev genereret, men kunne ikke gemmes. Prøv at kopiere teksten manuelt.";
      default:
        return "Hvis problemet fortsætter, prøv at genindlæse siden eller kontakt heygustav@icloud.com";
    }
  };
  
  return (
    <div 
      className="mt-6 p-5 bg-red-50 rounded-lg border border-red-200 shadow-sm" 
      role="alert" 
      aria-live="assertive"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-base font-semibold text-red-800">{title}</h3>
            <p className="text-sm text-red-700 mt-2">{message}</p>
            <p className="text-xs text-red-600 mt-3 pb-1">{getHelpText()}</p>
          </div>
        </div>
        
        {onRetry && (
          <div className="flex">
            <button
              onClick={onRetry}
              className="flex items-center px-4 py-2 bg-white border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label="Prøv igen"
            >
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Prøv igen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
