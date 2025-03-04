
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const SubscriptionLoading: React.FC = () => {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle>Abonnement</CardTitle>
        <CardDescription>Dit abonnementsdetaljer</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <LoadingSpinner size="md" message="Indlæser abonnementsinformation..." />
      </CardContent>
    </Card>
  );
};

export default SubscriptionLoading;
