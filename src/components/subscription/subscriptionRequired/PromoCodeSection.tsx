
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { validatePromoCode } from "@/services/subscription/subscriptionService";

interface PromoCodeSectionProps {
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoCodeError: string;
  setPromoCodeError: (error: string) => void;
  promoCodeSuccess: string;
  setPromoCodeSuccess: (success: string) => void;
  discountPercent: number;
  setDiscountPercent: (percent: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showDebug: boolean;
}

const PromoCodeSection: React.FC<PromoCodeSectionProps> = ({
  promoCode,
  setPromoCode,
  promoCodeError,
  setPromoCodeError,
  promoCodeSuccess,
  setPromoCodeSuccess,
  setDiscountPercent,
  isLoading,
  setIsLoading,
  showDebug
}) => {
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

  return (
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
  );
};

export default PromoCodeSection;
