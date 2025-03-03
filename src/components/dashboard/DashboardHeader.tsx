
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="mb-8 space-y-6">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Administrer dine jobopslag og ansøgninger
        </p>
      </div>

      {subscriptionStatus && subscriptionStatus.freeGenerationsUsed >= subscriptionStatus.freeGenerationsAllowed && !subscriptionStatus.canGenerate && (
        <Alert variant="destructive" className="mt-4 bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4 mr-2 text-amber-800" />
          <AlertDescription className="flex justify-between items-center">
            <span>Du har brugt dit gratis forsøg. Opret et abonnement for at generere flere ansøgninger.</span>
            <Button 
              size="sm" 
              onClick={() => navigate('/profile')}
              className="ml-4"
            >
              Opret abonnement
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DashboardHeader;
