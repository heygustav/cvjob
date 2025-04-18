
import { useToast } from '@/hooks/use-toast';
import { showErrorToast } from '@/utils/errorHandling';

// Define ErrorPhase type if it's missing from types.ts
type ErrorPhase = 'user-fetch' | 'job-save' | 'generation' | 'letter-save';

export const handleTypedError = (error: any) => {
  const phase = error.phase as ErrorPhase;
  const result = {
    title: 'Fejl ved generering',
    description: error.message || 'Der opstod en ukendt fejl. Prøv venligst igen.',
    recoverable: true
  };

  switch (phase) {
    case 'user-fetch':
      result.title = 'Fejl ved hentning af profil';
      break;
    case 'job-save':
      result.title = 'Fejl ved gemning af job';
      break;
    case 'generation':
      result.title = 'Fejl ved generering';
      break;
    case 'letter-save':
      result.title = 'Fejl ved gemning';
      break;
  }

  showErrorToast(error);
  return result;
};

export const handleStandardError = (error: Error) => {
  const result = {
    title: 'Fejl ved generering',
    description: error.message,
    recoverable: true
  };

  if (error.message.includes('network') || error.message.includes('connection')) {
    result.title = 'Netværksfejl';
    result.description = 'Der er problemer med din internetforbindelse. Tjek din forbindelse og prøv igen.';
  } else if (error.message.includes('500') || error.message.includes('server')) {
    result.title = 'Serverfejl';
    result.description = 'Der er problemer med vores server. Prøv igen senere.';
    result.recoverable = false;
  }

  showErrorToast(error);
  return result;
};

export const handleTimeoutError = (error: Error) => {
  const { toast } = useToast();
  
  toast({
    title: "Generering tog for lang tid",
    description: "Forsøg venligst igen senere.",
    variant: "destructive"
  });

  return {
    title: 'Timeout fejl',
    description: error.message,
    recoverable: true
  };
};
