
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@/lib/types";

interface DebugInfoPanelProps {
  user: User;
  freeGenerationsUsed: number;
  freeGenerationsAllowed: number;
  paymentMethod: string;
  promoCode: string;
  discountPercent: number;
  testMode: boolean;
}

const DebugInfoPanel: React.FC<DebugInfoPanelProps> = ({
  user,
  freeGenerationsUsed,
  freeGenerationsAllowed,
  paymentMethod,
  promoCode,
  discountPercent,
  testMode
}) => {
  return (
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
  );
};

export default DebugInfoPanel;
