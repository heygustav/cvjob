
import { useMemo } from "react";
import { ToastMessagesType } from "./types";

export const useToastMessages = (): ToastMessagesType => {
  // Memoize toast configurations
  return useMemo(() => ({
    networkError: {
      title: "Forbindelsesfejl",
      description: "Kontroller din internetforbindelse og prøv igen.",
      variant: "destructive" as const,
    },
    jobNotFound: {
      title: "Job ikke fundet",
      description: "Det valgte job kunne ikke findes.",
      variant: "destructive" as const,
    },
    letterNotFound: {
      title: "Ansøgning ikke fundet",
      description: "Den valgte ansøgning kunne ikke findes.",
      variant: "destructive" as const,
    },
    letterGenerated: {
      title: "Ansøgning genereret",
      description: "Din ansøgning er blevet oprettet med succes.",
    },
    letterUpdated: {
      title: "Ansøgning opdateret",
      description: "Dine ændringer er blevet gemt.",
    },
    letterSaved: {
      title: "Ansøgning gemt",
      description: "Din ansøgning er blevet gemt til din konto.",
    },
    missingFields: {
      title: "Manglende information",
      description: "Udfyld venligst jobtitel, virksomhed og beskrivelse.",
      variant: "destructive" as const,
    },
    generationInProgress: {
      title: "Generation i gang",
      description: "Vent venligst mens din ansøgning genereres.",
    },
    loginRequired: {
      title: "Log ind krævet",
      description: "Du skal være logget ind for at generere en ansøgning.",
      variant: "destructive" as const,
    },
    incompleteProfile: {
      title: "Bemærk",
      description: "Udfyld venligst din profil for at få en bedre ansøgning.",
      variant: "default" as const,
    },
    generationTimeout: {
      title: "Generering tog for lang tid",
      description: "Prøv igen senere eller kontakt support hvis problemet fortsætter.",
      variant: "destructive" as const,
    },
  }), []);
};
