
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ResumeHeader from "./ResumeHeader";
import ResumeEditorTabs from "./ResumeEditorTabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useDownloadErrorHandler } from "@/utils/download/downloadErrorHandler";
import TemplateSelector from "./TemplateSelector";
import PhotoUploader from "./PhotoUploader";
import { exportResumeToPdf } from "@/utils/resume/pdfExporter";
import { Resume } from "@/types/resume";

const ResumeBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState<Resume>({
    name: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    education: "",
    experience: "",
    skills: "",
    photo: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { handleDownloadError } = useDownloadErrorHandler();

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user) {
          console.log("User not authenticated, using sample data");
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        
        console.log("Fetching profile data for user:", user.id);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Kunne ikke indlæse profildata",
            description: "Udfyld venligst dine profiloplysninger først.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (data) {
          console.log("Profile data fetched successfully:", data);
          
          // Transform the data to match Resume type
          const profileData: Resume = {
            name: data.name || "",
            email: user.email || "",
            phone: data.phone || "",
            address: data.address || "",
            // Safely handle summary field which might not exist in the database
            summary: data.summary || "",
            education: data.education || "",
            experience: data.experience || "",
            skills: data.skills || "",
            photo: undefined, // Initialize as undefined since it's not in the database
          };

          setResumeData(profileData);
          
          // Log whether we have complete data
          const hasRequiredFields = profileData.name && profileData.email;
          console.log("Has required profile fields:", hasRequiredFields);
        } else {
          console.log("No profile data found, using empty template");
        }
      } catch (err) {
        console.error("Unexpected error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, toast]);

  const handleUpdateSection = (section: keyof Resume, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const handlePhotoChange = (photo?: string) => {
    setResumeData(prev => ({
      ...prev,
      photo
    }));
  };

  const handleExport = async () => {
    try {
      setIsDownloading(true);
      
      await exportResumeToPdf(resumeData);
      
      toast({
        title: "CV Downloadet",
        description: "Dit CV er blevet downloadet som PDF.",
      });
    } catch (error) {
      console.error("Error exporting resume:", error);
      handleDownloadError(error, "PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Indlæser dine profildata...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <ResumeHeader 
            title="CV Generator" 
            subtitle="Opret et professionelt CV fra dine profiloplysninger" 
          />

          <TemplateSelector 
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
          />

          <PhotoUploader 
            photo={resumeData.photo} 
            onPhotoChange={handlePhotoChange} 
          />

          <ResumeEditorTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
            handleUpdateSection={handleUpdateSection}
            handleExport={handleExport}
            isDownloading={isDownloading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeBuilder;
