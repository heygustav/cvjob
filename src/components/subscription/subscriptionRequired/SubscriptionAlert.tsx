
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubscriptionAlertProps {
  freeGenerationsUsed: number;
  freeGenerationsAllowed: number;
}

const SubscriptionAlert: React.FC<SubscriptionAlertProps> = ({
  freeGenerationsUsed,
  freeGenerationsAllowed
}) => {
  return (
    <Alert>
      <AlertDescription>
        Du har brugt {freeGenerationsUsed} ud af {freeGenerationsAllowed} gratis generering.
        For at generere flere ansøgninger, skal du oprette et abonnement.
      </AlertDescription>
    </Alert>
  );
};

export default SubscriptionAlert;
