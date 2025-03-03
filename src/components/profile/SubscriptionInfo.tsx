
import React, { useEffect, useState } from "react";
import { User } from "@/lib/types";
import { useSubscription } from "@/hooks/useSubscription";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/services/subscription/subscriptionService";
import { format } from "date-fns";

interface SubscriptionInfoProps {
  user: User;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ user }) => {
  const { subscriptionStatus, isLoading, fetchSubscriptionStatus } = useSubscription(user);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    if (user?.id) {
      fetchSubscriptionStatus(user.id);
    }
  }, [user?.id, fetchSubscriptionStatus]);
  
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
    } finally {
      setIsUpdating(false);
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
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  // No subscription or subscription data available
  if (!subscriptionStatus || !subscriptionStatus.subscription) {
    return (
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle>Abonnement</CardTitle>
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
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSubscribe}
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Opret abonnement - 99 DKK/måned
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
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Aktiv" : "Inaktiv"}
          </Badge>
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
      </CardContent>
      <CardFooter>
        {!isActive ? (
          <Button 
            className="w-full" 
            onClick={handleSubscribe}
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
      </CardFooter>
    </Card>
  );
};

export default SubscriptionInfo;
