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
    navigate("/generator");
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Din Jobportal</h1>
          <p className="text-muted-foreground">
            Administrer dine jobopslag og ansøgninger
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Ny ansøgning
        </Button>
      </div>

      {subscriptionStatus && subscriptionStatus.freeGenerationsUsed >= subscriptionStatus.freeGenerationsAllowed && !subscriptionStatus.canGenerate && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            Du har brugt dit gratis forsøg. Opret et abonnement på din profil for at generere flere ansøgninger.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex justify-start space-x-4">
          <TabsTrigger value="jobs">Jobopslag ({jobCount})</TabsTrigger>
          <TabsTrigger value="letters">Ansøgninger ({letterCount})</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DashboardHeader;
