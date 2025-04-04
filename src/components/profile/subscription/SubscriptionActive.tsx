
import React, { useState } from "react";
import { User } from "@/lib/types";
import { SubscriptionStatus } from "@/services/subscription/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bug } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { createCheckoutSession, getCustomerPortalUrl } from "@/services/subscription/subscriptionService";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface SubscriptionActiveProps {
  user: User;
  subscriptionStatus: SubscriptionStatus;
  onRefresh: () => void;
}

const SubscriptionActive: React.FC<SubscriptionActiveProps> = ({ 
  user, 
  subscriptionStatus, 
  onRefresh 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { toast } = useToast();
  
  const subscription = subscriptionStatus.subscription;
  const isActive = subscription?.status === 'active';
  const endDate = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;
  
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

  const handleManageSubscription = async () => {
    setIsPortalLoading(true);
    try {
      const { url } = await getCustomerPortalUrl(user.id);
      window.location.href = url;
    } catch (error) {
      console.error("Error accessing customer portal:", error);
      toast({
        title: "Fejl ved adgang til kundeportal",
        description: "Der opstod en fejl ved adgang til kundeportalen. Prøv igen senere.",
        variant: "destructive",
      });
    } finally {
      setIsPortalLoading(false);
    }
  };
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Abonnement</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={isActive ? "default" : "destructive"}>
              {isActive ? "Aktiv" : "Inaktiv"}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDebug(!showDebug)}
              title="Vis/skjul debug info"
            >
              <Bug className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>Dit abonnementsdetaljer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Plan</p>
            <p>Ubegrænset ansøgninger</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pris</p>
            <p>{subscription?.plan_price} {subscription?.currency}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Betalingsmetode</p>
            <p className="capitalize">{subscription?.payment_method === 'stripe' ? 'Kreditkort' : 'MobilePay'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Næste betaling</p>
            <p>{endDate ? format(endDate, 'dd/MM/yyyy') : 'Ikke tilgængelig'}</p>
          </div>
        </div>
        
        {!isActive && (
          <div className="bg-amber-50 p-3 rounded border border-amber-200 text-amber-800 text-sm">
            Dit abonnement er ikke længere aktivt. Opret et nyt abonnement for at få adgang til at generere ansøgninger.
          </div>
        )}
        
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
        {!isActive ? (
          <Button 
            className="w-full" 
            onClick={handleSubscribe}
            disabled={isUpdating}
          >
            {isUpdating ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            Forny abonnement
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleManageSubscription}
            disabled={isPortalLoading}
          >
            {isPortalLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            Administrer abonnement
          </Button>
        )}
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

export default SubscriptionActive;
