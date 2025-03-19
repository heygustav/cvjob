
import React, { useState, useEffect, useRef } from "react";
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
import { Loader2, Upload, X } from "lucide-react";
import { useDownloadErrorHandler } from "@/utils/download/downloadErrorHandler";
import { getTextContent } from "@/utils/download/contentExtractor";
import { jsPDF } from "jspdf";

// Resume templates
const TEMPLATES = ["modern", "classic", "creative"];

const ResumeBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState<PersonalInfoFormState & { photo?: string }>({
    name: "",
    email: "",
    phone: "",
    address: "",
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          
          // Transform the data to match PersonalInfoFormState
          // Using 'name' property from the profiles table
          const profileData = {
            name: data.name || "",
            email: user.email || "",
            phone: data.phone || "",
            address: data.address || "",
            education: data.education || "",
            experience: data.experience || "",
            skills: data.skills || "",
            photo: data.photo || undefined,
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fejl ved upload",
        description: "Billedet må ikke overstige 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setResumeData(prev => ({
          ...prev,
          photo: event.target.result as string
        }));

        toast({
          title: "Billede uploadet",
          description: "Dit foto er blevet tilføjet til CV'et.",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setResumeData(prev => ({
      ...prev,
      photo: undefined
    }));
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast({
      title: "Billede fjernet",
      description: "Dit foto er blevet fjernet fra CV'et.",
    });
  };

  const handleExport = async () => {
    try {
      setIsDownloading(true);
      
      // For logging only - log the data that would be exported
      console.log("Exporting resume with data:", resumeData);
      console.log("Selected template:", selectedTemplate);
      
      // Create a PDF document with jsPDF
      const doc = new jsPDF();
      
      // Set font to Times New Roman
      doc.setFont("times", "normal");
      
      // Add title
      doc.setFontSize(20);
      doc.text("Curriculum Vitae", 105, 15, { align: "center" });
      
      // Add photo if available
      let contentStartY = 30;
      if (resumeData.photo) {
        try {
          doc.addImage(resumeData.photo, 'JPEG', 20, 20, 30, 30);
          contentStartY = 60; // Move content down if photo is present
        } catch (err) {
          console.error("Error adding image to PDF:", err);
        }
      }
      
      // Add personal info section
      doc.setFontSize(16);
      doc.text("Personlige Oplysninger", resumeData.photo ? 60 : 20, 30);
      doc.setFontSize(12);
      doc.text(`Navn: ${resumeData.name}`, resumeData.photo ? 60 : 20, 40);
      doc.text(`Email: ${resumeData.email}`, resumeData.photo ? 60 : 20, 45);
      if (resumeData.phone) doc.text(`Telefon: ${resumeData.phone}`, resumeData.photo ? 60 : 20, 50);
      if (resumeData.address) doc.text(`Adresse: ${resumeData.address}`, resumeData.photo ? 60 : 20, 55);
      
      // Add experience section
      doc.setFontSize(16);
      doc.text("Erhvervserfaring", 20, contentStartY);
      doc.setFontSize(12);
      if (resumeData.experience) {
        const experienceLines = doc.splitTextToSize(getTextContent(resumeData.experience), 170);
        doc.text(experienceLines, 20, contentStartY + 10);
      } else {
        doc.text("Ingen erhvervserfaring angivet.", 20, contentStartY + 10);
      }
      
      // Add education section
      const educationYPos = resumeData.experience ? contentStartY + 40 : contentStartY + 10;
      doc.setFontSize(16);
      doc.text("Uddannelse", 20, educationYPos);
      doc.setFontSize(12);
      if (resumeData.education) {
        const educationLines = doc.splitTextToSize(getTextContent(resumeData.education), 170);
        doc.text(educationLines, 20, educationYPos + 10);
      } else {
        doc.text("Ingen uddannelse angivet.", 20, educationYPos + 10);
      }
      
      // Add skills section
      const skillsYPos = resumeData.education ? educationYPos + 40 : educationYPos + 10;
      doc.setFontSize(16);
      doc.text("Færdigheder", 20, skillsYPos);
      doc.setFontSize(12);
      if (resumeData.skills) {
        const skillsLines = doc.splitTextToSize(getTextContent(resumeData.skills), 170);
        doc.text(skillsLines, 20, skillsYPos + 10);
      } else {
        doc.text("Ingen færdigheder angivet.", 20, skillsYPos + 10);
      }
      
      // Save the PDF with the new filename
      doc.save("Ansoegning.pdf");
      
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

          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Skabelon</h4>
            <div className="flex space-x-2">
              {TEMPLATES.map((template) => (
                <Button
                  key={template}
                  variant={selectedTemplate === template ? "default" : "outline"}
                  onClick={() => setSelectedTemplate(template)}
                  className="capitalize"
                >
                  {template === "modern" ? "Moderne" : 
                   template === "classic" ? "Klassisk" : 
                   template === "creative" ? "Kreativ" : template}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Profilbillede (valgfrit)</h4>
            <div className="flex items-center space-x-4">
              {resumeData.photo ? (
                <div className="relative inline-block">
                  <img 
                    src={resumeData.photo} 
                    alt="Profilbillede" 
                    className="w-16 h-16 object-cover rounded-full border"
                  />
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    aria-label="Fjern billede"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload billede
                </Button>
              )}
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <span className="text-xs text-muted-foreground">
                Billedet vil blive vist i øverste venstre hjørne af dit CV
              </span>
            </div>
          </div>

          <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="edit">Rediger Indhold</TabsTrigger>
              <TabsTrigger value="preview">Forhåndsvisning</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ResumeSectionEditor
                  title="Personlige Oplysninger"
                  sections={[
                    { key: "name", label: "Fulde Navn", value: resumeData.name },
                    { key: "email", label: "Email", value: resumeData.email },
                    { key: "phone", label: "Telefon", value: resumeData.phone || "" },
                    { key: "address", label: "Adresse", value: resumeData.address || "" },
                  ]}
                  onUpdate={handleUpdateSection}
                />
                
                <ResumeSectionEditor
                  title="Erhvervserfaring"
                  sections={[
                    { 
                      key: "experience", 
                      label: "Erfaring", 
                      value: resumeData.experience || "", 
                      multiline: true 
                    },
                  ]}
                  onUpdate={handleUpdateSection}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <ResumeSectionEditor
                  title="Uddannelse"
                  sections={[
                    { 
                      key: "education", 
                      label: "Uddannelse", 
                      value: resumeData.education || "", 
                      multiline: true 
                    },
                  ]}
                  onUpdate={handleUpdateSection}
                />
                
                <ResumeSectionEditor
                  title="Færdigheder"
                  sections={[
                    { 
                      key: "skills", 
                      label: "Færdigheder", 
                      value: resumeData.skills || "", 
                      multiline: true 
                    },
                  ]}
                  onUpdate={handleUpdateSection}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setActiveTab("preview")}>
                  Forhåndsvis CV
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
                  Tilbage til Redigering
                </Button>
                <Button 
                  onClick={handleExport} 
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Downloader...
                    </>
                  ) : (
                    "Download CV"
                  )}
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

