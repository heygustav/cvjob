
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import DanishCVGenerator from "@/components/resume/DanishCVGenerator";
import { Resume } from "@/types/resume";
import { Download, Copy, FileText } from "lucide-react";

const DanishResume: React.FC = () => {
  const [resumeData, setResumeData] = useState<Resume>({
    name: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    structuredExperience: [],
    structuredEducation: [],
    structuredSkills: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user) {
          console.log("Bruger ikke autentificeret, bruger eksempeldata");
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Fejl ved hentning af profil:", error);
          toast({
            title: "Kunne ikke indlæse profildata",
            description: "Udfyld venligst dine profiloplysninger først.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (data) {
          const profileData: Resume = {
            name: data.name || "",
            email: user.email || "",
            phone: data.phone || "",
            address: data.address || "",
            summary: data.summary || "",
            experience: data.experience || "",
            education: data.education || "",
            skills: data.skills || "",
            structuredExperience: data.structuredExperience || [],
            structuredEducation: data.structuredEducation || [],
            structuredSkills: data.structuredSkills || [],
          };

          setResumeData(profileData);
        }
      } catch (err) {
        console.error("Uventet fejl ved hentning af profil:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, toast]);

  const handleCopyToClipboard = () => {
    // Fjern HTML-tags for at få rent tekst til udklipsholder
    const tempElement = document.createElement('div');
    tempElement.innerHTML = document.querySelector('.danish-cv')?.innerHTML || '';
    const textContent = tempElement.textContent || tempElement.innerText || '';
    
    navigator.clipboard.writeText(textContent).then(() => {
      toast({
        title: "Kopieret til udklipsholder",
        description: "Dit CV er nu kopieret og klar til at blive indsat.",
      });
    }).catch(err => {
      console.error('Kunne ikke kopiere tekst: ', err);
      toast({
        title: "Fejl ved kopiering",
        description: "Der opstod en fejl. Prøv venligst igen.",
        variant: "destructive",
      });
    });
  };

  const handleDownloadAsHTML = () => {
    const htmlContent = document.querySelector('.danish-cv')?.outerHTML || '';
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.name.replace(/\s+/g, '_')}_CV.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "CV downloadet",
      description: "Dit CV er blevet downloadet som HTML-fil.",
    });
  };

  const handleDownloadAsText = () => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = document.querySelector('.danish-cv')?.innerHTML || '';
    const textContent = tempElement.textContent || tempElement.innerText || '';
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.name.replace(/\s+/g, '_')}_CV.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "CV downloadet",
      description: "Dit CV er blevet downloadet som tekstfil.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingSpinner message="Indlæser dine profildata..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dansk CV Generator</h1>
            <p className="text-muted-foreground">Opret et professionelt dansk CV baseret på dine profiloplysninger</p>
          </header>

          <div className="mb-6 flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Kopier til udklipsholder
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadAsHTML}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download som HTML
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadAsText}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Download som tekst
            </Button>
          </div>

          <div className="bg-white rounded-md shadow-sm border p-4">
            <DanishCVGenerator data={resumeData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DanishResume;
