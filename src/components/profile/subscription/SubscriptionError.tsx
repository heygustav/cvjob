
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubscriptionErrorProps {
  onRetry: () => void;
}

const SubscriptionError: React.FC<SubscriptionErrorProps> = ({ onRetry }) => {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle>Abonnement</CardTitle>
        <CardDescription>Der opstod en fejl</CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <Alert variant="destructive">
          <AlertDescription>
            Der opstod en fejl ved indlæsning af abonnementsinformation. Prøv at opdatere siden eller kontakt support.
          </AlertDescription>
        </Alert>
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
