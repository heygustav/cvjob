
import React, { useState } from "react";
import { User } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SubscriptionAlert from "./SubscriptionAlert";
import SubscriptionPricingInfo from "./SubscriptionPricingInfo";
import PromoCodeSection from "./PromoCodeSection";
import PaymentMethodSelector from "./PaymentMethodSelector";
import DebugInfoPanel from "./DebugInfoPanel";
import SubscriptionActions from "./SubscriptionActions";

interface SubscriptionRequiredContainerProps {
  user: User;
  freeGenerationsUsed: number;
  freeGenerationsAllowed: number;
}

const SubscriptionRequiredContainer: React.FC<SubscriptionRequiredContainerProps> = ({
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

  const toggleTestMode = () => {
    setTestMode(!testMode);
    toast({
      title: testMode ? "Test-tilstand deaktiveret" : "Test-tilstand aktiveret",
      description: testMode 
        ? "Nu vil du blive sendt direkte til betalingssiden" 
        : "Nu vil du se checkout URL'en før omdirigering",
    });
  };

  const promoCodeProps = {
    promoCode,
    setPromoCode,
    promoCodeError,
    setPromoCodeError,
    promoCodeSuccess,
    setPromoCodeSuccess,
    discountPercent,
    setDiscountPercent,
    isLoading,
    setIsLoading,
    showDebug
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
        <SubscriptionAlert 
          freeGenerationsUsed={freeGenerationsUsed} 
          freeGenerationsAllowed={freeGenerationsAllowed} 
        />

        <SubscriptionPricingInfo discountPercent={discountPercent} />

        <PromoCodeSection {...promoCodeProps} />

        <PaymentMethodSelector 
          paymentMethod={paymentMethod} 
          setPaymentMethod={setPaymentMethod} 
          showDebug={showDebug} 
        />
        
        {showDebug && (
          <DebugInfoPanel 
            user={user}
            freeGenerationsUsed={freeGenerationsUsed}
            freeGenerationsAllowed={freeGenerationsAllowed}
            paymentMethod={paymentMethod}
            promoCode={promoCode}
            discountPercent={discountPercent}
            testMode={testMode}
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <SubscriptionActions 
          user={user}
          promoCode={promoCode}
          paymentMethod={paymentMethod}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          testMode={testMode}
          showDebug={showDebug}
          toggleTestMode={toggleTestMode}
        />
      </CardFooter>
    </Card>
  );
};

export default SubscriptionRequiredContainer;
