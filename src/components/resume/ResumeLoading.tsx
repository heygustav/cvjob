
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ResumeLoading: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-10/12" />
      
      <div className="pt-4">
        <Skeleton className="h-6 w-32 mb-3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12 mt-2" />
      </div>
      
      <div className="pt-4">
        <Skeleton className="h-6 w-32 mb-3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12 mt-2" />
      </div>
      
      <div className="pt-4">
        <Skeleton className="h-6 w-32 mb-3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12 mt-2" />
      </div>
    </div>
  );
};

export default ResumeLoading;
