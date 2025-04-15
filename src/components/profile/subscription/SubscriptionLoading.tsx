
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const SubscriptionLoading: React.FC = () => {
  const [progress, setProgress] = React.useState(13);
  
  React.useEffect(() => {
    // More gradual progress transition for better UX
    const timer1 = setTimeout(() => setProgress(33), 400);
    const timer2 = setTimeout(() => setProgress(66), 1000);
    const timer3 = setTimeout(() => setProgress(87), 1800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle>Abonnement</CardTitle>
        <CardDescription>Dit abonnementsdetaljer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 mb-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        
        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-700 ease-in-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-32" />
        </div>
        
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          Indlæser abonnementsinformation...
        </p>
      </CardContent>
    </Card>
  );
};

export default SubscriptionLoading;
