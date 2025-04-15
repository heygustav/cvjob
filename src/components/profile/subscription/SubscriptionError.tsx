
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ErrorDisplay from "@/components/ErrorDisplay";

interface SubscriptionErrorProps {
  onRetry: () => void;
  message?: string;
}

const SubscriptionError: React.FC<SubscriptionErrorProps> = ({ 
  onRetry,
  message = "Der opstod en fejl ved indlæsning af abonnementsinformation."
}) => {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle>Abonnement</CardTitle>
        <CardDescription>Der opstod en fejl</CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <ErrorDisplay 
          title="Fejl ved indlæsning af abonnement"
          message={message}
          phase="service-unavailable"
          onRetry={onRetry}
        />
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="w-full"
        >
          Prøv igen
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionError;
