
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeHeader from "./ResumeHeader";
import ResumeSectionEditor from "./ResumeSectionEditor";
import ResumePreview from "./ResumePreview";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoFormState } from "@/pages/Profile";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Resume templates
const TEMPLATES = ["modern", "classic", "creative"];

const ResumeBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState<PersonalInfoFormState>({
    name: "",
    email: "",
    phone: "",
    address: "",
    education: "",
    experience: "",
    skills: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

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
            title: "Could not load profile data",
            description: "Please complete your profile information first.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (data) {
          console.log("Profile data fetched successfully:", data);
          
          // Transform the data to match PersonalInfoFormState
          // Fixed: Using 'name' instead of 'full_name' to match the actual property in the profiles table
          const profileData: PersonalInfoFormState = {
            name: data.name || "",
            email: user.email || "",
            phone: data.phone || "",
            address: data.address || "",
            education: data.education || "",
            experience: data.experience || "",
            skills: data.skills || "",
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

  const handleUpdateSection = (section: keyof PersonalInfoFormState, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const handleExport = () => {
    // For testing only - log the data that would be exported
    console.log("Exporting resume with data:", resumeData);
    console.log("Selected template:", selectedTemplate);
    
    toast({
      title: "Resume Export",
      description: "Your resume would be exported here. This is a test message.",
    });
    
    // In a real implementation, this would generate and download the PDF
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your profile data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <ResumeHeader 
            title="CV Generator" 
            subtitle="Create a professional resume from your profile information" 
          />

          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Template Style</h4>
            <div className="flex space-x-2">
              {TEMPLATES.map((template) => (
                <Button
                  key={template}
                  variant={selectedTemplate === template ? "default" : "outline"}
                  onClick={() => setSelectedTemplate(template)}
                  className="capitalize"
                >
                  {template}
                </Button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="edit">Edit Content</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ResumeSectionEditor
                  title="Personal Information"
                  sections={[
                    { key: "name", label: "Full Name", value: resumeData.name },
                    { key: "email", label: "Email", value: resumeData.email },
                    { key: "phone", label: "Phone", value: resumeData.phone || "" },
                    { key: "address", label: "Address", value: resumeData.address || "" },
                  ]}
                  onUpdate={handleUpdateSection}
                />
                
                <ResumeSectionEditor
                  title="Professional Experience"
                  sections={[
                    { 
                      key: "experience", 
                      label: "Experience", 
                      value: resumeData.experience || "", 
                      multiline: true 
                    },
                  ]}
                  onUpdate={handleUpdateSection}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <ResumeSectionEditor
                  title="Education"
                  sections={[
                    { 
                      key: "education", 
                      label: "Education", 
                      value: resumeData.education || "", 
                      multiline: true 
                    },
                  ]}
                  onUpdate={handleUpdateSection}
                />
                
                <ResumeSectionEditor
                  title="Skills"
                  sections={[
                    { 
                      key: "skills", 
                      label: "Skills", 
                      value: resumeData.skills || "", 
                      multiline: true 
                    },
                  ]}
                  onUpdate={handleUpdateSection}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setActiveTab("preview")}>
                  Preview Resume
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <ResumePreview 
                data={resumeData} 
                template={selectedTemplate as "modern" | "classic" | "creative"} 
              />
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("edit")}>
                  Back to Edit
                </Button>
                <Button onClick={handleExport}>
                  Download Resume
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeBuilder;
