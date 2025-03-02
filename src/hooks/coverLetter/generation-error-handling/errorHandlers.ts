
import { TypedError, GenerationErrorResult } from "./types";
import { ToastMessagesType } from "../types";

/**
 * Handles typed errors with identified phases
 */
export const handleTypedError = (error: TypedError): GenerationErrorResult => {
  let title = "Fejl ved generering";
  let description = "Der opstod en ukendt fejl. Prøv venligst igen.";
  const recoverable = error.recoverable ?? true;
  
  switch (error.phase) {
    case 'job-save':
      description = "Kunne ikke gemme jobinformation. Tjek venligst din forbindelse.";
      break;
    case 'user-fetch':
      description = "Kunne ikke hente din profilinformation. Prøv at opdatere din profil.";
      break;
    case 'generation':
      title = "Generering mislykkedes";
      description = "AI-tjenesten kunne ikke generere din ansøgning. Prøv igen om lidt.";
      break;
    case 'letter-save':
      description = "Din ansøgning blev genereret, men kunne ikke gemmes. Prøv igen.";
      break;
  }
  
  return { title, description, recoverable };
};

/**
 * Handles standard JavaScript errors
 */
export const handleStandardError = (error: Error): GenerationErrorResult => {
  let title = "Fejl ved generering";
  let description = error.message;
  const recoverable = true;
  
  // Check for network-related errors
  const isNetworkError = !navigator.onLine || 
    error.message.includes('forbindelse') || 
    error.message.includes('timeout') ||
    error.message.includes('network');
  
  if (isNetworkError) {
    title = "Forbindelsesfejl";
    description = "Kontroller din internetforbindelse og prøv igen.";
  }
  
  return { title, description, recoverable };
};

/**
 * Handles timeout specific errors
 */
export const handleTimeoutError = (toastMessages: ToastMessagesType): GenerationErrorResult => {
  const { title, description } = toastMessages.generationTimeout;
  
  return {
    title,
    description,
    recoverable: true
  };
};
