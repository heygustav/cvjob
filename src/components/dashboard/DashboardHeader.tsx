
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useSubscription } from "@/hooks/useSubscription";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { User } from "@/lib/types";

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscriptionStatus } = useSubscription(user ? {
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.name || "",
    profileComplete: false
  } as User : null);

  const handleNewLetter = () => {
    navigate("/cover-letter/generator");
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Administrer dine ansøgninger og jobopslag
          </p>
        </div>
        <Button
          className="mt-4 sm:mt-0"
          onClick={handleNewLetter}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Opret ansøgning
        </Button>
      </div>

      {subscriptionStatus && subscriptionStatus.freeGenerationsUsed >= subscriptionStatus.freeGenerationsAllowed && 
       !subscriptionStatus.hasActiveSubscription && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200 mb-6">
          <InfoIcon className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Abonnement påkrævet</AlertTitle>
          <AlertDescription className="text-amber-700">
            Du har brugt din gratis generering. Opret et abonnement for at få adgang til ubegrænset generering af ansøgninger.
            <Button 
              variant="link" 
              className="text-amber-900 p-0 h-auto font-semibold" 
              onClick={() => navigate("/profile?tab=subscription")}
            >
              Gå til abonnement
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DashboardHeader;
