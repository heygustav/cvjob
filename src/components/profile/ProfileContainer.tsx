
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "./ProfileHeader";
import ProfilePersonalInfo from "./ProfilePersonalInfo";
import ProfileAccountSettings from "./ProfileAccountSettings";
import SubscriptionInfo from "./subscription/SubscriptionInfo";
import { useAuth } from "@/components/AuthProvider";
import { User } from "@/lib/types";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoFormState } from "@/pages/Profile";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";

interface ProfileContainerProps {
  formData: PersonalInfoFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setFormData: React.Dispatch<React.SetStateAction<PersonalInfoFormState>>;
  isLoading: boolean;
  validationErrors?: Record<string, string>;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
  formData,
  handleChange,
  handleSubmit,
  setFormData,
  isLoading,
  validationErrors = {}
}) => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal-info");
  
  // Monitor component performance
  const { logTiming } = usePerformanceMonitoring({
    componentName: "ProfileContainer",
    logUpdate: true
  });
  
  // For cross-browser testing
  useEffect(() => {
    const startTime = logTiming("Initial render started");
    
    console.log("ProfileContainer rendered in browser:", navigator.userAgent);
    console.log("Viewport dimensions:", window.innerWidth, "x", window.innerHeight);
    
    // For end-to-end testing - track if component is fully mounted
    if (window.Cypress) {
      // @ts-ignore - For Cypress testing
      window.profileContainerReady = true;
    }
    
    logTiming("Initial render completed");
    
    // Record page visit - for testing persistence between refreshes
    const visitCount = parseInt(localStorage.getItem('profileVisitCount') || '0', 10);
    localStorage.setItem('profileVisitCount', (visitCount + 1).toString());
    console.log(`This is visit #${visitCount + 1} to the profile page`);
    
    return () => {
      logTiming("Component unmount");
    };
  }, [logTiming]);
  
  // Check for subscription success in URL
  useEffect(() => {
    const subscriptionParam = searchParams.get("subscription");
    if (subscriptionParam === "success") {
      toast({
        title: "Abonnement oprettet",
        description: "Dit abonnement er blevet oprettet. Du har nu adgang til at generere ubegrænset ansøgninger.",
      });
      setActiveTab("subscription");
    }
  }, [searchParams, toast]);

  // Memoize the tab change handler to prevent unnecessary recreations
  const handleTabChange = useCallback((value: string) => {
    logTiming(`Tab changed to ${value}`);
    setActiveTab(value);
  }, [logTiming]);

  if (!user) {
    return null;
  }

  // Convert from auth user to our app's User type
  const appUser: User = {
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.name || "",
    profileComplete: false
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl text-left">
      <ProfileHeader 
        title="Profil" 
        subtitle="Administrer dine personoplysninger og indstillinger" 
      />

      <Tabs 
        defaultValue="personal-info" 
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full mt-8"
      >
        <TabsList className="grid grid-cols-3 mb-8 w-full">
          <TabsTrigger value="personal-info">Personlig information</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          <TabsTrigger value="account">Kontoindstillinger</TabsTrigger>
        </TabsList>

        <Card className="border shadow-sm">
          <CardContent className="p-0">
            <TabsContent value="personal-info" className="m-0">
              <ProfilePersonalInfo 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                setFormData={setFormData}
                isLoading={isLoading}
                validationErrors={validationErrors}
              />
            </TabsContent>
            
            <TabsContent value="subscription" className="m-0 p-8 text-left">
              <SubscriptionInfo user={appUser} />
            </TabsContent>
            
            <TabsContent value="account" className="m-0 text-left">
              <ProfileAccountSettings />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default React.memo(ProfileContainer);
