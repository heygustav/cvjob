
import React, { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { fetchUserProfile } from "@/services/coverLetter/userOperations";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ResumeViewer from "@/components/resume/ResumeViewer";
import ResumeOptionsPanel from "@/components/resume/ResumeOptions";
import ResumeLoading from "@/components/resume/ResumeLoading";
import { UserProfile } from "@/services/coverLetter/types";

export type ResumeFont = "TimesNewRoman" | "Arial";
export type ResumeOptions = {
  font: ResumeFont;
  includePhoto: boolean;
};

const ResumeBuilder = () => {
  const { session } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [options, setOptions] = useState<ResumeOptions>({
    font: "TimesNewRoman",
    includePhoto: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const loadUserProfile = async () => {
      if (!session?.user) return;

      try {
        setIsLoading(true);
        const profile = await fetchUserProfile(session.user.id);
        setProfileData(profile);
      } catch (error) {
        console.error("Error loading profile data:", error);
        toast({
          title: "Fejl ved indlæsning",
          description: "Der opstod en fejl ved indlæsning af din profil.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [session?.user, toast]);

  const updateOptions = (newOptions: Partial<ResumeOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">ATS-optimeret CV Generator</h1>
      <p className="text-lg text-gray-700 mb-8">
        Opret et professionelt CV ud fra dine profiloplysninger. Vælg font og formateringsindstillinger.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>CV Indstillinger</CardTitle>
              <CardDescription>
                Tilpas dit CV's udseende og format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeOptionsPanel 
                options={options} 
                onChange={updateOptions} 
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>CV Forhåndsvisning</CardTitle>
              <CardDescription>
                Se hvordan dit CV vil se ud
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <ResumeLoading />
              ) : (
                profileData && (
                  <ResumeViewer 
                    profile={profileData} 
                    options={options} 
                  />
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
