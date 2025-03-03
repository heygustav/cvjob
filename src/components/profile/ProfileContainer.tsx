
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "./ProfileHeader";
import ProfilePersonalInfo from "./ProfilePersonalInfo";
import ProfileAccountSettings from "./ProfileAccountSettings";
import SubscriptionInfo from "./SubscriptionInfo";
import { useAuth } from "@/components/AuthProvider";
import { User } from "@/lib/types";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoFormState } from "@/pages/Profile";

interface ProfileContainerProps {
  formData: PersonalInfoFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setFormData: React.Dispatch<React.SetStateAction<PersonalInfoFormState>>;
  isLoading: boolean;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
  formData,
  handleChange,
  handleSubmit,
  setFormData,
  isLoading
}) => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal-info");
  
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
    <div className="container mx-auto px-4 max-w-4xl">
      <ProfileHeader 
        title="Min Profil" 
        subtitle="Administrer dine personoplysninger og indstillinger" 
      />

      <Tabs 
        defaultValue="personal-info" 
        value={activeTab}
        onValueChange={setActiveTab}
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
              />
            </TabsContent>
            
            <TabsContent value="subscription" className="m-0 p-8">
              <SubscriptionInfo user={appUser} />
            </TabsContent>
            
            <TabsContent value="account" className="m-0">
              <ProfileAccountSettings />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default ProfileContainer;
