
import React, { useState } from "react";
import { User } from "@/lib/types";
import { SubscriptionStatus } from "@/services/subscription/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bug } from "lucide-react";
import { createCheckoutSession } from "@/services/subscription/subscriptionService";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface SubscriptionEmptyProps {
  user: User;
  subscriptionStatus: SubscriptionStatus | null;
  onRefresh: () => void;
}

const SubscriptionEmpty: React.FC<SubscriptionEmptyProps> = ({ 
  user, 
  subscriptionStatus, 
  onRefresh 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setIsUpdating(true);
    try {
      const options = {
        userId: user.id,
        returnUrl: `${window.location.origin}/profile?subscription=success`,
        cancelUrl: window.location.href,
        paymentMethod: 'stripe' as const
      };

      const { url } = await createCheckoutSession(options);
      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Fejl ved oprettelse af abonnement",
        description: "Der opstod en fejl ved oprettelse af abonnement. Prøv igen senere.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Abonnement</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDebug(!showDebug)}
            title="Vis/skjul debug info"
          >
            <Bug className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Du har ingen aktive abonnementer</CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="text-center space-y-2">
          <p>
            Du har brugt {subscriptionStatus?.freeGenerationsUsed || 0} af {subscriptionStatus?.freeGenerationsAllowed || 1} gratis generering.
          </p>
          <p className="text-muted-foreground">
            Opret et abonnement for at få ubegrænset adgang til at generere ansøgninger.
          </p>
        </div>
        
        {showDebug && (
          <Alert className="mt-4 bg-gray-100">
            <AlertDescription className="font-mono text-xs overflow-auto">
              <p className="font-semibold">Debug information:</p>
              <pre>{JSON.stringify(subscriptionStatus, null, 2)}</pre>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full" 
          onClick={handleSubscribe}
          disabled={isUpdating}
        >
          {isUpdating ? <LoadingSpinner size="sm" className="mr-2" /> : null}
          Opret abonnement - 99 DKK/måned
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          className="w-full"
        >
          Opdater abonnementsstatus
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionEmpty;
