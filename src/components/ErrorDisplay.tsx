
import React from 'react';
import { AlertCircle, RefreshCw, HelpCircle, WifiOff, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ErrorMetadata, ErrorCategory, ErrorPhase } from '@/utils/errorHandler/types';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  metadata?: ErrorMetadata;
  icon?: React.ReactNode;
  phase?: ErrorPhase;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  message,
  onRetry,
  metadata,
  icon,
  phase
}) => {
  const errorCategory = metadata?.category || 'system';

  // Get help text based on error category
  const getHelpText = (category: ErrorCategory) => {
    switch (category) {
      case 'network':
        return "Tjek din internetforbindelse og prøv igen.";
      case 'auth':
        return "Din session kan være udløbet. Prøv at logge ind igen.";
      case 'validation':
        return "Kontroller venligst de indtastede oplysninger.";
      case 'timeout':
        return "Handlingen tog for lang tid. Prøv igen senere.";
      case 'security':
        return "Der opstod en sikkerhedsrelateret fejl. Vi arbejder på at løse problemet.";
      case 'business':
        return "Der opstod en fejl i behandlingen. Prøv igen eller kontakt support.";
      default:
        return "Hvis problemet fortsætter, prøv at genindlæse siden eller kontakt support.";
    }
  };

  // Get action text based on error category and metadata
  const getActionText = () => {
    if (!metadata?.retryable) return undefined;
    
    switch (errorCategory) {
      case 'network': return "Prøv igen";
      case 'auth': return "Log ind igen";
      case 'timeout': return "Prøv igen";
      default: return "Prøv igen";
    }
  };

  // Select icon based on error category
  const getIcon = () => {
    if (icon) return icon;
    
    switch (errorCategory) {
      case 'network':
        return <WifiOff className="h-5 w-5 text-red-600" />;
      case 'timeout':
        return <Clock className="h-5 w-5 text-red-600" />;
      case 'security':
        return <ShieldAlert className="h-5 w-5 text-red-600" />;
      case 'auth':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const errorTitle = title || 'Der opstod en fejl';
  const actionText = getActionText();
  
  return (
    <Alert 
      variant={metadata?.severity === 'critical' ? 'destructive' : 'default'}
      className="mt-6" 
      role="alert"
      data-testid="error-display"
      data-error-category={errorCategory}
      data-error-phase={phase}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-start">
          <span className="mr-3 mt-0.5">{getIcon()}</span>
          <div className="space-y-2 flex-1">
            <AlertTitle>{errorTitle}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
            <div className="flex items-start pt-2">
              <HelpCircle className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                {getHelpText(errorCategory)}
              </p>
            </div>
          </div>
        </div>
        
        {onRetry && actionText && (
          <div className="flex justify-center sm:justify-start mt-2">
            <button
              onClick={onRetry}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
              data-testid="error-retry-button"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {actionText}
            </button>
          </div>
        )}
      </div>
    </Alert>
  );
};

export default ErrorDisplay;
