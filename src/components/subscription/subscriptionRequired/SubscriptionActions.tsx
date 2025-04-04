
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, InfoIcon } from "lucide-react";
import { User } from "@/lib/types";
import { createCheckoutSession } from "@/services/subscription/subscriptionService";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SubscriptionActionsProps {
  user: User;
  promoCode: string;
  paymentMethod: 'stripe' | 'mobilepay';
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  testMode: boolean;
  showDebug: boolean;
  toggleTestMode: () => void;
}

const SubscriptionActions: React.FC<SubscriptionActionsProps> = ({
  user,
  promoCode,
  paymentMethod,
  isLoading,
  setIsLoading,
  testMode,
  showDebug,
  toggleTestMode
}) => {
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // Log the options we're sending for debugging
      const options = {
        userId: user.id,
        ...(promoCode && { promoCode }),
        returnUrl: `${window.location.origin}/dashboard?subscription=success`,
        cancelUrl: window.location.href,
        paymentMethod
      };
      
      if (showDebug) {
        console.log("Creating checkout session with options:", options);
      }

      const { url } = await createCheckoutSession(options);
      
      if (showDebug) {
        console.log("Checkout session created, URL:", url);
      }
      
      // In test mode, show the URL instead of redirecting
      if (testMode) {
        toast({
          title: "Test Mode",
          description: "Redirecting to: " + url,
        });
        // Wait a moment before redirecting to allow reading the toast
        setTimeout(() => {
          window.location.href = url;
        }, 3000);
      } else {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Fejl ved oprettelse af abonnement",
        description: "Der opstod en fejl. Prøv igen senere.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        className="w-full" 
        onClick={handleSubscribe} 
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Opret abonnement nu
      </Button>
      
      <div className="flex items-center mt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={toggleTestMode}
        >
          {testMode ? "Deaktiver test-tilstand" : "Aktiver test-tilstand"}
        </Button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 ml-2 text-gray-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Test-tilstand viser checkout URL og giver dig tid til at læse den, før du omdirigeres.
                Brug dette til at teste betalingsprocessen uden at gennemføre en betaling.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};

export default SubscriptionActions;
