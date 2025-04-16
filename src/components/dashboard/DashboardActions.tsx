
import React from "react";
import { Button } from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { Link } from "react-router-dom";
import { Plus, RefreshCw, Loader2 } from "lucide-react";

interface DashboardActionsProps {
  activeTab: "letters" | "jobs" | "companies";
  isRefreshing: boolean;
  onRefresh: () => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({
  activeTab,
  isRefreshing,
  onRefresh,
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-start mb-2">
      <IconButton 
        variant="outline" 
        size="sm" 
        onClick={onRefresh} 
        disabled={isRefreshing}
        icon={isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        title="Opdater data"
        aria-label="Opdater data"
        aria-busy={isRefreshing}
      >
        Opdater
      </IconButton>
      
      {activeTab === "jobs" ? (
        <IconButton 
          variant="default" 
          size="sm" 
          asChild
          icon={<Plus className="h-4 w-4" />}
          title="Tilføj jobopslag"
        >
          <Link to="/job/new">
            Tilføj jobopslag
          </Link>
        </IconButton>
      ) : activeTab === "companies" ? (
        <IconButton 
          variant="default" 
          size="sm" 
          asChild
          icon={<Plus className="h-4 w-4" />}
          title="Tilføj virksomhed"
        >
          <Link to="/company/new">
            Tilføj virksomhed
          </Link>
        </IconButton>
      ) : (
        <IconButton 
          variant="default" 
          size="sm" 
          asChild
          icon={<Plus className="h-4 w-4" />}
          title="Opret ny ansøgning"
        >
          <Link to="/ansoegning">
            Opret ny ansøgning
          </Link>
        </IconButton>
      )}
    </div>
  );
};

export default DashboardActions;
