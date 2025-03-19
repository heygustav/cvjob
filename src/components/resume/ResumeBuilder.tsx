
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeHeader from "./ResumeHeader";
import ResumePreview from "./ResumePreview";
import ResumeTemplateSelector from "./ResumeTemplateSelector";
import ResumeSectionEditor from "./ResumeSectionEditor";
import { PersonalInfoFormState } from "@/pages/Profile";
import { useToast } from "@/hooks/use-toast";
import { Download, ArrowLeft, Save } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const ResumeBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState("template");
  const [profileData, setProfileData] = useState<PersonalInfoFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState<PersonalInfoFormState | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        toast({
          title: "Ikke logget ind",
          description: "Du skal være logget ind for at bygge et CV",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          const profileFormData: PersonalInfoFormState = {
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            experience: data.experience || "",
            education: data.education || "",
            skills: data.skills || ""
          };
          
          setProfileData(profileFormData);
          setResumeData(profileFormData);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Fejl ved indlæsning",
          description: "Der opstod en fejl ved indlæsning af dine profiloplysninger.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, toast, navigate]);

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setActiveTab("edit");
  };

  const handleSaveResume = () => {
    // This would save the resume to the database in a future implementation
    toast({
      title: "CV gemt",
      description: "Dit CV er blevet gemt.",
    });
  };

  const handleDownloadResume = () => {
    // This would generate and download the resume in a future implementation
    toast({
      title: "CV downloadet",
      description: "Dit CV er blevet downloadet.",
    });
  };

  const handleUpdateSection = (section: keyof PersonalInfoFormState, value: string) => {
    if (resumeData) {
      setResumeData({
        ...resumeData,
        [section]: value
      });
    }
  };

  const handleBack = () => {
    navigate("/profile");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <Card>
          <CardContent className="p-8 flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Indlæser profiloplysninger...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profileData || Object.values(profileData).every(val => !val)) {
    return (
      <div className="container mx-auto py-16 px-4">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Din profil er ikke komplet</h2>
            <p className="mb-6 text-muted-foreground">
              For at bygge et CV skal du først udfylde din profil med de nødvendige oplysninger.
            </p>
            <Button onClick={() => navigate("/profile")}>Gå til profil</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Tilbage til profil
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveResume} className="gap-2">
            <Save className="h-4 w-4" />
            Gem CV
          </Button>
          <Button onClick={handleDownloadResume} className="gap-2">
            <Download className="h-4 w-4" />
            Download CV
          </Button>
        </div>
      </div>

      <ResumeHeader 
        title="CV Builder" 
        subtitle="Byg dit professionelle CV baseret på din profil" 
      />

      <Tabs 
        defaultValue="template" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-8"
      >
        <TabsList className="grid grid-cols-2 w-full mb-8">
          <TabsTrigger value="template">Vælg Skabelon</TabsTrigger>
          <TabsTrigger value="edit">Tilpas & Forhåndsvis</TabsTrigger>
        </TabsList>

        <Card className="border shadow-sm">
          <CardContent className="p-0">
            <TabsContent value="template" className="m-0">
              <ResumeTemplateSelector 
                selectedTemplate={selectedTemplate}
                onSelectTemplate={handleTemplateSelect}
              />
            </TabsContent>
            
            <TabsContent value="edit" className="m-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 border-r">
                  {resumeData && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">Tilpas dit CV</h3>
                      <ResumeSectionEditor 
                        title="Personlige oplysninger"
                        sections={[
                          { key: "name", label: "Navn", value: resumeData.name },
                          { key: "email", label: "Email", value: resumeData.email },
                          { key: "phone", label: "Telefon", value: resumeData.phone },
                          { key: "address", label: "Adresse", value: resumeData.address }
                        ]}
                        onUpdate={handleUpdateSection}
                      />
                      <ResumeSectionEditor 
                        title="Erfaring"
                        sections={[
                          { key: "experience", label: "Arbejdserfaring", value: resumeData.experience, multiline: true }
                        ]}
                        onUpdate={handleUpdateSection}
                      />
                      <ResumeSectionEditor 
                        title="Uddannelse"
                        sections={[
                          { key: "education", label: "Uddannelse", value: resumeData.education, multiline: true }
                        ]}
                        onUpdate={handleUpdateSection}
                      />
                      <ResumeSectionEditor 
                        title="Kompetencer"
                        sections={[
                          { key: "skills", label: "Kompetencer", value: resumeData.skills, multiline: true }
                        ]}
                        onUpdate={handleUpdateSection}
                      />
                    </div>
                  )}
                </div>
                <div className="p-6 bg-gray-50 rounded-r-lg">
                  <h3 className="text-lg font-medium mb-4">Forhåndsvisning</h3>
                  {resumeData && (
                    <ResumePreview 
                      data={resumeData}
                      template={selectedTemplate}
                    />
                  )}
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
