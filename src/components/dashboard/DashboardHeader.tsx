
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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

  const remainingGenerations = subscriptionStatus ? 
    subscriptionStatus.freeGenerationsAllowed - subscriptionStatus.freeGenerationsUsed : 0;

  return (
    <div className="mb-8 space-y-6">
      <div className="text-left"> 
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Administrer dine jobopslag og ansøgninger
        </p>
        
        {/* Add a quick summary of available items */}
        <div className="mt-4 flex flex-wrap gap-4" aria-live="polite">
          <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-md border border-blue-200">
            <span className="font-semibold">{letterCount}</span> ansøgning{letterCount !== 1 ? 'er' : ''}
          </div>
          <div className="bg-indigo-50 text-indigo-800 px-4 py-2 rounded-md border border-indigo-200">
            <span className="font-semibold">{jobCount}</span> jobopslag
          </div>
        </div>
      </div>

      {subscriptionStatus && !subscriptionStatus.canGenerate && subscriptionStatus.freeGenerationsUsed >= subscriptionStatus.freeGenerationsAllowed ? (
        <Alert variant="destructive" className="mt-4 bg-amber-50 border-amber-200 text-amber-800" role="alert">
          <AlertCircle className="h-4 w-4 mr-2 text-amber-800" aria-hidden="true" />
          <AlertDescription className="flex justify-between items-center flex-wrap gap-4">
            <span>Du har brugt dit gratis forsøg. Opret et abonnement for at generere flere ansøgninger.</span>
            <Button 
              size="sm" 
              onClick={() => navigate('/profile')}
              className="ml-auto bg-primary hover:bg-primary-700 text-white transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Opret abonnement
            </Button>
          </AlertDescription>
        </Alert>
      ) : subscriptionStatus && !subscriptionStatus.canGenerate && remainingGenerations > 0 ? (
        <Alert className="mt-4 bg-blue-50 border-blue-200 text-blue-800" role="status">
          <AlertCircle className="h-4 w-4 mr-2 text-blue-800" aria-hidden="true" />
          <AlertDescription>
            Du har <span className="font-bold">{remainingGenerations}</span> gratis generering{remainingGenerations !== 1 ? 'er' : ''} tilbage.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
};

export default DashboardHeader;
