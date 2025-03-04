
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Bug } from "lucide-react";
import { createCheckoutSession, validatePromoCode } from "@/services/subscription/subscriptionService";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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
  const [showDebug, setShowDebug] = useState(false);
  const [testMode, setTestMode] = useState(false);
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

  const handleValidatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoCodeError("Indtast en kampagnekode");
      return;
    }

    setIsLoading(true);
    setPromoCodeError("");
    setPromoCodeSuccess("");

    try {
      if (showDebug) {
        console.log("Validating promo code:", promoCode);
      }
      
      const result = await validatePromoCode(promoCode);
      
      if (showDebug) {
        console.log("Promo code validation result:", result);
      }
      
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

  const toggleTestMode = () => {
    setTestMode(!testMode);
    toast({
      title: testMode ? "Test-tilstand deaktiveret" : "Test-tilstand aktiveret",
      description: testMode 
        ? "Nu vil du blive sendt direkte til betalingssiden" 
        : "Nu vil du se checkout URL'en før omdirigering",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-center">Abonnement påkrævet</CardTitle>
          <div className="flex space-x-2">
            {testMode && (
              <Badge variant="outline" className="bg-yellow-50">Test tilstand</Badge>
            )}
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
            {showDebug && (
              <div className="mt-2 text-xs text-muted-foreground">
                Test kort: 4242 4242 4242 4242, enhver fremtidig udløbsdato, enhver CVC
              </div>
            )}
          </TabsContent>
          <TabsContent value="mobilepay" className="text-center py-4">
            Betal nemt med MobilePay
          </TabsContent>
        </Tabs>
        
        {showDebug && (
          <Alert className="mt-4 bg-gray-100">
            <AlertDescription className="font-mono text-xs overflow-auto">
              <p className="font-semibold">Debug information:</p>
              <p>User ID: {user.id}</p>
              <p>Free generations used: {freeGenerationsUsed}</p>
              <p>Free generations allowed: {freeGenerationsAllowed}</p>
              <p>Payment method: {paymentMethod}</p>
              <p>Promo code: {promoCode || "None"}</p>
              <p>Discount: {discountPercent}%</p>
              <p>Test mode: {testMode ? "Enabled" : "Disabled"}</p>
              <p>Return URL: {`${window.location.origin}/dashboard?subscription=success`}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full" 
          onClick={handleSubscribe} 
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Opret abonnement nu
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={toggleTestMode}
        >
          {testMode ? "Deaktiver test-tilstand" : "Aktiver test-tilstand"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionRequired;
