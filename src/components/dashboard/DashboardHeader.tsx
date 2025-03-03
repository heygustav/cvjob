
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";

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
  return (
    <div className="mb-8 space-y-6">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Administrer dine jobopslag og ansøgninger
        </p>
      </div>

      {subscriptionStatus && subscriptionStatus.freeGenerationsUsed >= subscriptionStatus.freeGenerationsAllowed && !subscriptionStatus.canGenerate && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangleIcon className="h-4 w-4 mr-2" />
          <AlertDescription>
            Du har brugt dit gratis forsøg. Opret et abonnement på din profil for at generere flere ansøgninger.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DashboardHeader;
