
import React from "react";
import ResumeBuilder from "@/components/resume/ResumeBuilder";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Flag } from "lucide-react";

const Resume: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <header className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">CV Builder</h1>
            <p className="text-muted-foreground">Opret et professionelt CV, der hjælper dig med at skille dig ud</p>
          </div>
          
          <Link to="/resume/dk">
            <Button variant="outline" className="gap-2">
              <Flag className="h-4 w-4" />
              Skift til Dansk CV
            </Button>
          </Link>
        </header>
        
        <main>
          <ResumeBuilder />
        </main>
      </div>
    </div>
  );
};

export default Resume;
