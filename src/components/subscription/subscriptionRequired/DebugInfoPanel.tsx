
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User } from "@/lib/types";
import { InfoIcon } from "lucide-react";

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
    <Alert className="mt-4 bg-gray-100 border-yellow-400">
      <InfoIcon className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-700">Udvikler Information</AlertTitle>
      <AlertDescription className="font-mono text-xs overflow-auto mt-2">
        <div className="p-2 bg-gray-200 rounded">
          <p className="font-semibold mb-1">Debug information (kun for udvikling):</p>
          <p>User ID: {user.id}</p>
          <p>Free generations used: {freeGenerationsUsed}</p>
          <p>Free generations allowed: {freeGenerationsAllowed}</p>
          <p>Payment method: {paymentMethod}</p>
          <p>Promo code: {promoCode || "None"}</p>
          <p>Discount: {discountPercent}%</p>
          <p>Test mode: {testMode ? "Enabled" : "Disabled"}</p>
          <p>Return URL: {`${window.location.origin}/dashboard?subscription=success`}</p>
        </div>
        <p className="text-xs mt-2 text-gray-600">Dette panel er kun synligt i udviklingstilstand.</p>
      </AlertDescription>
    </Alert>
  );
};

export default DebugInfoPanel;
