
import React from 'react';
import { AlertCircle, RefreshCw, HelpCircle, WifiOff, AlertTriangle, Clock } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ErrorPhase, getErrorTitle } from '@/utils/errorHandling';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  phase?: ErrorPhase;
  icon?: React.ReactNode;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  message,
  onRetry,
  phase,
  icon
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
      case 'cv-parsing':
        return "Der opstod en fejl ved analyse af dit CV. Kontroller at filen er i PDF-format og ikke er for stor (max 2MB). Prøv at uploade igen eller udfyld oplysningerne manuelt.";
      case 'network':
        return "Tjek din internetforbindelse. Sørg for, at du er forbundet til et stabilt netværk og prøv igen.";
      case 'timeout':
        return "Serveren reagerer langsomt. Prøv igen senere, eller kontakt support hvis problemet fortsætter.";
      case 'auth':
        return "Din session er muligvis udløbet. Prøv at logge ud og ind igen.";
      case 'api-rate-limit':
        return "Du har foretaget for mange anmodninger på kort tid. Vent venligst nogle minutter og prøv igen.";
      case 'service-unavailable':
        return "Tjenesten er midlertidigt utilgængelig. Prøv igen senere.";
      case 'auth-error':
        return "Der opstod en fejl med din autorisation. Prøv at logge ud og ind igen.";
      default:
        return "Hvis problemet fortsætter, prøv at genindlæse siden eller kontakt heygustav@icloud.com";
    }
  };

  // Get specific action text based on the error phase
  const getActionText = () => {
    switch (phase) {
      case 'job-save': return "Prøv igen";
      case 'user-fetch': return "Genindlæs profil";
      case 'generation': return "Generer igen";
      case 'letter-save': return "Gem igen";
      case 'cv-parsing': return "Forsøg igen";
      case 'network': return "Kontroller forbindelse";
      case 'timeout': return "Prøv igen";
      case 'auth': return "Log ind igen";
      case 'api-rate-limit': return "Prøv igen senere";
      case 'service-unavailable': return "Prøv igen senere";
      case 'auth-error': return "Log ind igen";
      default: return "Prøv igen";
    }
  };

  // Select appropriate icon based on the error phase
  const getIcon = () => {
    if (icon) {
      return icon;
    }
    
    switch (phase) {
      case 'network':
        return <WifiOff className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />;
      case 'timeout':
        return <Clock className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />;
      case 'auth':
      case 'auth-error':
        return <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />;
    }
  };

  // Use provided title or get a title based on phase
  const errorTitle = title || (phase ? getErrorTitle(phase) : 'Der opstod en fejl');
  
  return (
    <Alert 
      variant="destructive" 
      className="mt-6 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50" 
      role="alert" 
      aria-live="assertive"
      aria-atomic="true"
      aria-labelledby="error-title"
      aria-describedby="error-description"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-start">
          <span className="mr-3 mt-0.5 flex-shrink-0" aria-hidden="true">{getIcon()}</span>
          <div className="space-y-2 flex-1 min-w-0">
            <AlertTitle id="error-title" className="text-base font-semibold text-red-800 dark:text-red-300 break-words">
              {errorTitle}
            </AlertTitle>
            <AlertDescription id="error-description" className="text-sm text-red-700 dark:text-red-400 break-words">
              {message}
            </AlertDescription>
            <div className="flex items-start pt-2">
              <HelpCircle className="h-4 w-4 text-red-500 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <p className="text-xs text-red-600 dark:text-red-400 break-words" id="error-help-text">{getHelpText()}</p>
            </div>
          </div>
        </div>
        
        {onRetry && (
          <div className="flex justify-center sm:justify-start mt-2 w-full">
            <button
              onClick={onRetry}
              type="button"
              className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-white dark:bg-red-950/30 border border-red-300 dark:border-red-800/50 rounded-md text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 min-h-[44px]"
              aria-label={getActionText()}
              aria-describedby="error-help-text"
            >
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              {getActionText()}
            </button>
          </div>
        )}
      </div>
    </Alert>
  );
};

export default ErrorDisplay;
