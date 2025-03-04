import React, { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { useSubscription } from "@/hooks/useSubscription";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bug } from "lucide-react";
import { createCheckoutSession } from "@/services/subscription/subscriptionService";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface SubscriptionInfoProps {
  user: User;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ user }) => {
  const { subscriptionStatus, isLoading, error, fetchSubscriptionStatus } = useSubscription(user);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (user?.id) {
      fetchSubscriptionStatus(user.id);
    }
  }, [user?.id, fetchSubscriptionStatus]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Fejl ved indlæsning af abonnement",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
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

  const handleRefreshStatus = () => {
    if (user?.id) {
      toast({
        title: "Opdaterer abonnementsstatus",
        description: "Henter den seneste abonnementsstatus...",
      });
      fetchSubscriptionStatus(user.id);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle>Abonnement</CardTitle>
          <CardDescription>Dit abonnementsdetaljer</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <LoadingSpinner size="md" message="Indlæser abonnementsinformation..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
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
            onClick={handleRefreshStatus}
            className="w-full"
          >
            Prøv igen
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // No subscription or subscription data available
  if (!subscriptionStatus || !subscriptionStatus.subscription) {
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
            onClick={handleRefreshStatus}
            className="w-full"
          >
            Opdater abonnementsstatus
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Active subscription
  const subscription = subscriptionStatus.subscription;
  const isActive = subscription.status === 'active';
  const endDate = subscription.current_period_end ? new Date(subscription.current_period_end) : null;
  
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
            <p>{subscription.plan_price} {subscription.currency}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Betalingsmetode</p>
            <p className="capitalize">{subscription.payment_method === 'stripe' ? 'Kreditkort' : 'MobilePay'}</p>
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
            onClick={() => window.open('https://dashboard.stripe.com/billing/portal', '_blank')}
          >
            Administrer abonnement
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshStatus}
          className="w-full"
        >
          Opdater abonnementsstatus
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionInfo;
