
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { createCheckoutSession, validatePromoCode } from "@/services/coverLetter/database";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionRequiredProps {
  user: User;
  freeGenerationsUsed: number;
  freeGenerationsAllowed: number;
}

const SubscriptionRequired: React.FC<SubscriptionRequiredProps> = ({
  user,
  freeGenerationsUsed,
  freeGenerationsAllowed
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeError, setPromoCodeError] = useState("");
  const [promoCodeSuccess, setPromoCodeSuccess] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'mobilepay'>('stripe');
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const options = {
        userId: user.id,
        ...(promoCode && { promoCode }),
        returnUrl: `${window.location.origin}/dashboard?subscription=success`,
        cancelUrl: window.location.href,
        paymentMethod
      };

      const { url } = await createCheckoutSession(options);
      window.location.href = url;
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

  const handleValidatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoCodeError("Indtast en kampagnekode");
      return;
    }

    setIsLoading(true);
    setPromoCodeError("");
    setPromoCodeSuccess("");

    try {
      const result = await validatePromoCode(promoCode);
      
      if (result.isValid) {
        setDiscountPercent(result.discountPercent || 0);
        setPromoCodeSuccess(`Kampagnekode giver ${result.discountPercent}% rabat!`);
      } else {
        setPromoCodeError(result.message || "Ugyldig kampagnekode");
      }
    } catch (error) {
      console.error("Error validating promo code:", error);
      setPromoCodeError("Der opstod en fejl ved validering af kampagnekoden");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Abonnement påkrævet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Du har brugt {freeGenerationsUsed} ud af {freeGenerationsAllowed} gratis generering.
            For at generere flere ansøgninger, skal du oprette et abonnement.
          </AlertDescription>
        </Alert>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">Ubegrænset generering af ansøgninger</h3>
          <p className="text-3xl font-bold">
            {discountPercent > 0 ? (
              <>
                <span className="line-through text-muted-foreground text-xl mr-2">99 DKK</span>
                {Math.round(99 * (1 - discountPercent / 100))} DKK
              </>
            ) : (
              "99 DKK"
            )}
            <span className="text-sm text-muted-foreground font-normal">/måned</span>
          </p>
          <p className="text-sm text-muted-foreground">Abonnementet kan opsiges når som helst</p>
        </div>

        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              placeholder="Kampagnekode"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={isLoading}
            />
            <Button
              variant="outline"
              onClick={handleValidatePromoCode}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Anvend"}
            </Button>
          </div>
          {promoCodeError && <p className="text-sm text-destructive">{promoCodeError}</p>}
          {promoCodeSuccess && <p className="text-sm text-green-600">{promoCodeSuccess}</p>}
        </div>

        <Tabs defaultValue="stripe" className="w-full" onValueChange={(v) => setPaymentMethod(v as 'stripe' | 'mobilepay')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stripe">Kreditkort</TabsTrigger>
            <TabsTrigger value="mobilepay">MobilePay</TabsTrigger>
          </TabsList>
          <TabsContent value="stripe" className="text-center py-4">
            Betal sikkert med dit kreditkort via Stripe
          </TabsContent>
          <TabsContent value="mobilepay" className="text-center py-4">
            Betal nemt med MobilePay
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubscribe} 
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Opret abonnement nu
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionRequired;
