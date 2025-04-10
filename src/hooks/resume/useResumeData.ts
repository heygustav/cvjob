
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Resume } from "@/types/resume";
import { Profile } from "@/lib/types";

export function useResumeData() {
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
  const { toast } = useToast();
  const { user } = useAuth();

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
          let structuredExperience = profileData.structuredExperience || [];
          let structuredEducation = profileData.structuredEducation || [];
          let structuredSkills = profileData.structuredSkills || [];

          // Ensure these are arrays even if they're not in the database
          if (!Array.isArray(structuredExperience)) structuredExperience = [];
          if (!Array.isArray(structuredEducation)) structuredEducation = [];
          if (!Array.isArray(structuredSkills)) structuredSkills = [];
          
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

  const handleUpdateStructuredExperience = (experiences: Resume['structuredExperience']) => {
    setResumeData(prev => ({
      ...prev,
      structuredExperience: experiences
    }));
  };

  const handleUpdateStructuredEducation = (educations: Resume['structuredEducation']) => {
    setResumeData(prev => ({
      ...prev,
      structuredEducation: educations
    }));
  };

  const handleUpdateStructuredSkills = (skills: Resume['structuredSkills']) => {
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

  return {
    resumeData,
    isLoading,
    handleUpdateSection,
    handleUpdateStructuredExperience,
    handleUpdateStructuredEducation,
    handleUpdateStructuredSkills,
    handlePhotoChange
  };
}
