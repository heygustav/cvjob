
import React from "react";

interface SubscriptionPricingInfoProps {
  discountPercent: number;
}

const SubscriptionPricingInfo: React.FC<SubscriptionPricingInfoProps> = ({
  discountPercent
}) => {
  return (
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
  );
};

export default SubscriptionPricingInfo;
