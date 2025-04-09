import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ResumeHeader from "./ResumeHeader";
import ResumeEditorTabs from "./ResumeEditorTabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useDownloadErrorHandler } from "@/utils/download/downloadErrorHandler";
import TemplateSelector from "./TemplateSelector";
import PhotoUploader from "./PhotoUploader";
import { exportResume, ResumeFormat } from "@/utils/resume/pdfExporter";
import { Resume, ExperienceEntry, EducationEntry, SkillEntry } from "@/types/resume";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { v4 as uuidv4 } from "uuid";
import { Profile } from "@/lib/types";

const ResumeBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState<Resume>({
    name: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    photo: undefined,
    structuredExperience: [],
    structuredEducation: [],
    structuredSkills: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { handleDownloadError } = useDownloadErrorHandler();

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
          
          // Cast data to Profile type to get TypeScript support for the structured fields
          const profileData = data as Profile;
          
          // Handle structured fields with fallbacks
          let structuredExperience: ExperienceEntry[] = [];
          let structuredEducation: EducationEntry[] = [];
          let structuredSkills: SkillEntry[] = [];

          // Check if these fields exist in data and are arrays
          if (profileData.structuredExperience && Array.isArray(profileData.structuredExperience)) {
            structuredExperience = profileData.structuredExperience;
          }
          
          if (profileData.structuredEducation && Array.isArray(profileData.structuredEducation)) {
            structuredEducation = profileData.structuredEducation;
          }
          
          if (profileData.structuredSkills && Array.isArray(profileData.structuredSkills)) {
            structuredSkills = profileData.structuredSkills;
          }
          
          const resumeDataFromProfile: Resume = {
            name: profileData.name || "",
            email: user.email || "",
            phone: profileData.phone || "",
            address: profileData.address || "",
            summary: profileData.summary || "",
            experience: profileData.experience || "",
            education: profileData.education || "",
            skills: profileData.skills || "",
            photo: undefined,
            structuredExperience,
            structuredEducation,
            structuredSkills,
          };

          setResumeData(resumeDataFromProfile);
          
          const hasRequiredFields = resumeDataFromProfile.name && resumeDataFromProfile.email;
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

  const handleUpdateStructuredExperience = (experiences: ExperienceEntry[]) => {
    setResumeData(prev => ({
      ...prev,
      structuredExperience: experiences
    }));
  };

  const handleUpdateStructuredEducation = (educations: EducationEntry[]) => {
    setResumeData(prev => ({
      ...prev,
      structuredEducation: educations
    }));
  };

  const handleUpdateStructuredSkills = (skills: SkillEntry[]) => {
    setResumeData(prev => ({
      ...prev,
      structuredSkills: skills
    }));
  };

  const handlePhotoChange = (photo?: string) => {
    setResumeData(prev => ({
      ...prev,
      photo
    }));
  };

  const handleExport = async (format: ResumeFormat) => {
    try {
      setIsDownloading(true);
      
      await exportResume(resumeData, format);
      
      toast({
        title: "CV Downloadet",
        description: `Dit CV er blevet downloadet som ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error("Error exporting resume:", error);
      handleDownloadError(error, format.toUpperCase());
    } finally {
      setIsDownloading(false);
    }
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
            handleUpdateStructuredExperience={handleUpdateStructuredExperience}
            handleUpdateStructuredEducation={handleUpdateStructuredEducation}
            handleUpdateStructuredSkills={handleUpdateStructuredSkills}
            handleExport={handleExport}
            isDownloading={isDownloading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeBuilder;
