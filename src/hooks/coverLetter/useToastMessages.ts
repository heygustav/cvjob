
import { useToast } from "../use-toast";
import { ToastMessagesType } from "./types";

export const useToastMessages = (): ToastMessagesType => {
  const { toast } = useToast();

  const messages: ToastMessagesType = {
    networkError: {
      title: "Netværksfejl",
      description: "Der opstod en fejl med forbindelsen. Kontrollér din internetforbindelse og prøv igen.",
      variant: "destructive",
    },
    jobNotFound: {
      title: "Job ikke fundet",
      description: "Det angivne job kunne ikke findes.",
      variant: "destructive",
    },
    letterNotFound: {
      title: "Ansøgning ikke fundet",
      description: "Den angivne ansøgning kunne ikke findes.",
      variant: "destructive",
    },
    letterGenerated: {
      title: "Ansøgning genereret",
      description: "Din ansøgning er nu klar. Du kan redigere og downloade den.",
    },
    letterEdited: {
      title: "Ansøgning redigeret",
      description: "Dine ændringer er blevet gemt.",
    },
    letterUpdated: {
      title: "Ansøgning opdateret",
      description: "Dine ændringer er blevet gemt.",
    },
    letterSaved: {
      title: "Ansøgning gemt",
      description: "Din ansøgning er blevet gemt i din profil.",
    },
    letterError: {
      title: "Fejl ved ansøgning",
      description: "Der opstod en fejl ved behandling af ansøgningen. Prøv venligst igen.",
      variant: "destructive",
    },
    missingFields: {
      title: "Manglende felter",
      description: "Udfyld venligst alle påkrævede felter.",
      variant: "destructive",
    },
    generationInProgress: {
      title: "Generering i gang",
      description: "Vi arbejder allerede på din ansøgning. Vent venligst et øjeblik.",
    },
    loginRequired: {
      title: "Login påkrævet",
      description: "Du skal være logget ind for at generere en ansøgning.",
      variant: "destructive",
    },
    incompleteProfile: {
      title: "Ufuldstændig profil",
      description: "Din profil mangler vigtige oplysninger. Opdater venligst din profil for bedre resultater.",
      variant: "default",
    },
    generationTimeout: {
      title: "Timeout ved generering",
      description: "Generering tog for lang tid. Prøv venligst igen senere.",
      variant: "destructive",
    }
  };

  return messages;
};
