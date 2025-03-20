
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SubscriptionLoading: React.FC = () => {
  const [progress, setProgress] = React.useState(13);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    const timer2 = setTimeout(() => setProgress(87), 1200);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle>Abonnement</CardTitle>
        <CardDescription>Dit abonnementsdetaljer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          Indlæser abonnementsinformation...
        </p>
      </CardContent>
    </Card>
  );
};

export default SubscriptionLoading;
