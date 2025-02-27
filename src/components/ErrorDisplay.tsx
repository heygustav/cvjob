
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
    <div className="mt-6 p-4 bg-red-50 rounded-md border border-red-100">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">{title}</h3>
            <p className="text-sm text-red-700 mt-1">{message}</p>
            <p className="text-xs text-red-600 mt-2">{getHelpText()}</p>
          </div>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-white border border-red-300 rounded-md py-2 px-4 inline-flex items-center justify-center text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Prøv igen
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
