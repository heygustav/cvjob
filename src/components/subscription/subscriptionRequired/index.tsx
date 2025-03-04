
import React from "react";
import { User } from "@/lib/types";
import SubscriptionRequiredContainer from "./SubscriptionRequiredContainer";

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
  return (
    <SubscriptionRequiredContainer 
      user={user}
      freeGenerationsUsed={freeGenerationsUsed}
      freeGenerationsAllowed={freeGenerationsAllowed}
    />
  );
};

export default SubscriptionRequired;
