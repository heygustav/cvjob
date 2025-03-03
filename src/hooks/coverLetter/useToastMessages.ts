
import { useToast } from "../use-toast";

type ToastMessagesType = {
  generationStarted: () => void;
  generationSuccess: () => void;
  generationError: (errorMessage: string) => void;
  letterSaved: () => void;
  letterSaveError: (errorMessage: string) => void;
  letterUpdated: () => void;
  letterUpdateError: (errorMessage: string) => void;
  subscriptionRequired: () => void;
};

export const useToastMessages = (): ToastMessagesType => {
  const { toast } = useToast();

  const messages: ToastMessagesType = {
    generationStarted: () => {
      toast({
        title: "Generering startet",
        description: "Vi genererer nu din ansøgning. Det kan tage op til et minut.",
      });
    },
    
    generationSuccess: () => {
      toast({
        title: "Ansøgning genereret",
        description: "Din ansøgning er nu klar. Du kan redigere og downloade den.",
      });
    },
    
    generationError: (errorMessage: string) => {
      toast({
        title: "Fejl ved generering",
        description: errorMessage || "Der opstod en fejl under generering af ansøgningen.",
        variant: "destructive",
      });
    },
    
    letterSaved: () => {
      toast({
        title: "Ansøgning gemt",
        description: "Din ansøgning er blevet gemt i din profil.",
      });
    },
    
    letterSaveError: (errorMessage: string) => {
      toast({
        title: "Fejl ved gemning",
        description: errorMessage || "Der opstod en fejl under gemning af ansøgningen.",
        variant: "destructive",
      });
    },
    
    letterUpdated: () => {
      toast({
        title: "Ansøgning opdateret",
        description: "Dine ændringer er blevet gemt.",
      });
    },
    
    letterUpdateError: (errorMessage: string) => {
      toast({
        title: "Fejl ved opdatering",
        description: errorMessage || "Der opstod en fejl under opdatering af ansøgningen.",
        variant: "destructive",
      });
    },
    
    subscriptionRequired: () => {
      toast({
        title: "Abonnement påkrævet",
        description: "Du har brugt din gratis generering. Opret et abonnement for at fortsætte.",
        variant: "default",
      });
    }
  };

  return messages;
};
