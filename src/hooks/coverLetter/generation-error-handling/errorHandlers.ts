
export const handleTypedError = (error: any) => {
  const errorMessages: Record<string, { title: string; description: string; recoverable: boolean }> = {
    'user-fetch': {
      title: 'Fejl ved bruger hentning',
      description: 'Kunne ikke hente brugerdata. Prøv at logge ind igen.',
      recoverable: false
    },
    'job-save': {
      title: 'Fejl ved gem',
      description: 'Kunne ikke gemme jobdata. Prøv igen.',
      recoverable: true
    },
    'generation': {
      title: 'Generering fejlede',
      description: 'Kunne ikke generere ansøgning. Prøv igen.',
      recoverable: true
    }
  };

  const defaultError = {
    title: 'Ukendt fejl',
    description: 'Der opstod en ukendt fejl. Prøv igen.',
    recoverable: true
  };

  return errorMessages[error.phase] || defaultError;
};

export const handleStandardError = (error: Error) => {
  return {
    title: 'Fejl',
    description: error.message,
    recoverable: true
  };
};

export const handleTimeoutError = () => {
  return {
    title: 'Timeout',
    description: 'Operationen tog for lang tid. Prøv igen.',
    recoverable: true
  };
};
