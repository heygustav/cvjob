
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

const ProfileContainer: React.FC = () => {
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
    <div className="container mx-auto p-4 max-w-4xl">
      <ProfileHeader />

      <Tabs 
        defaultValue="personal-info" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mt-6"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="personal-info">Personlig information</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          <TabsTrigger value="account">Kontoindstillinger</TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="p-0">
            <TabsContent value="personal-info" className="m-0">
              <ProfilePersonalInfo />
            </TabsContent>
            
            <TabsContent value="subscription" className="m-0 p-6">
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
