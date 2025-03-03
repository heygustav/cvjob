
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusIcon, AlertTriangleIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardHeaderProps {
  jobCount: number;
  letterCount: number;
  activeTab: 'jobs' | 'letters';
  setActiveTab: (tab: 'jobs' | 'letters') => void;
  isLoading: boolean;
  subscriptionStatus?: {
    canGenerate: boolean;
    freeGenerationsUsed: number;
    freeGenerationsAllowed: number;
  };
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  jobCount,
  letterCount,
  activeTab,
  setActiveTab,
  isLoading,
  subscriptionStatus,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateNew = () => {
    if (subscriptionStatus && !subscriptionStatus.canGenerate) {
      toast({
        title: "Abonnement påkrævet",
        description: "Du har brugt dit frie forsøg. Opret et abonnement for at fortsætte.",
        variant: "destructive",
      });
      navigate("/profile");
      return;
    }
    navigate("/ansoegning");
  };

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Din Jobportal</h1>
          <p className="text-muted-foreground mt-1">
            Administrer dine jobopslag og ansøgninger
          </p>
        </div>
        <Button onClick={handleCreateNew} size="default" className="whitespace-nowrap">
          <PlusIcon className="h-4 w-4 mr-2" />
          Ny ansøgning
        </Button>
      </div>

      {subscriptionStatus && subscriptionStatus.freeGenerationsUsed >= subscriptionStatus.freeGenerationsAllowed && !subscriptionStatus.canGenerate && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangleIcon className="h-4 w-4 mr-2" />
          <AlertDescription>
            Du har brugt dit gratis forsøg. Opret et abonnement på din profil for at generere flere ansøgninger.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'jobs' | 'letters')} className="w-full">
        <TabsList className="w-full md:w-auto flex justify-start">
          <TabsTrigger value="jobs" className="flex-1 md:flex-initial">Jobopslag ({jobCount})</TabsTrigger>
          <TabsTrigger value="letters" className="flex-1 md:flex-initial">Ansøgninger ({letterCount})</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DashboardHeader;
