
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, RefreshCw, Loader2 } from "lucide-react";

interface DashboardActionsProps {
  activeTab: "letters" | "jobs";
  isRefreshing: boolean;
  onRefresh: () => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({
  activeTab,
  isRefreshing,
  onRefresh,
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-start">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh} 
        disabled={isRefreshing}
        className="flex items-center gap-2 whitespace-nowrap"
      >
        {isRefreshing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        Opdater
      </Button>
      
      {activeTab === "jobs" ? (
        <Button 
          variant="default" 
          size="sm" 
          asChild 
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Link to="/job/new">
            <Plus className="h-4 w-4" />
            Tilføj jobopslag
          </Link>
        </Button>
      ) : (
        <Button 
          variant="default" 
          size="sm" 
          asChild 
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Link to="/ansoegning">
            <Plus className="h-4 w-4" />
            Opret ny ansøgning
          </Link>
        </Button>
      )}
    </div>
  );
};

export default DashboardActions;
