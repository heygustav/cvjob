
import { ToastMessagesType } from "./types";

export const useToastMessages = () => {
  const messages: ToastMessagesType = {
    networkError: {
      title: "Netværksfejl",
      description: "Kunne ikke forbinde til serveren. Tjek din internetforbindelse og prøv igen.",
      variant: "destructive",
    },
    jobNotFound: {
      title: "Job ikke fundet",
      description: "Det angivne job blev ikke fundet. Prøv igen eller opret et nyt job.",
      variant: "destructive",
    },
    letterNotFound: {
      title: "Ansøgning ikke fundet",
      description: "Den angivne ansøgning blev ikke fundet. Prøv igen eller opret en ny ansøgning.",
      variant: "destructive",
    },
    letterGenerated: {
      title: "Ansøgning genereret",
      description: "Din ansøgning er blevet genereret. Du kan nu redigere og gemme den.",
    },
    letterUpdated: {
      title: "Ansøgning opdateret",
      description: "Din ansøgning er blevet opdateret og gemt.",
    },
    letterSaved: {
      title: "Ansøgning gemt",
      description: "Din ansøgning er blevet gemt.",
    },
    missingFields: {
      title: "Manglende felter",
      description: "Udfyld venligst alle påkrævede felter.",
      variant: "destructive",
    },
    generationInProgress: {
      title: "Generering i gang",
      description: "En ansøgning er allerede ved at blive genereret. Vent venligst et øjeblik.",
    },
    loginRequired: {
      title: "Login påkrævet",
      description: "Du skal være logget ind for at udføre denne handling.",
      variant: "destructive",
    },
    incompleteProfile: {
      title: "Ufuldstændig profil",
      description: "For at få bedre resultater, opdater venligst din profil med mere information.",
      variant: "default",
    },
    generationTimeout: {
      title: "Generering tog for lang tid",
      description: "Generering af ansøgningen tog for lang tid. Prøv igen senere.",
      variant: "destructive",
    },
  };

  return messages;
};
