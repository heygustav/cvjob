
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import QuizSlide from "./QuizSlide";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const ProfileQuiz: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || "",
    phone: "",
    address: "",
    summary: "",
    experience: "",
    education: "",
    skills: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Save the profile data
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
          summary: profileData.summary,
          experience: profileData.experience,
          education: profileData.education,
          skills: profileData.skills,
          has_completed_onboarding: true,
        });

      if (error) throw error;
      
      toast({
        title: "Profil oprettet",
        description: "Din profil er blevet opdateret med dine svar."
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Fejl",
        description: "Der opstod en fejl. Prøv igen senere.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const slides = [
    // Name slide
    {
      title: "Hvad er dit navn?",
      description: "Fortæl os dit fulde navn, så vi kan personliggøre din oplevelse.",
      content: (
        <div className="space-y-4">
          <Input
            name="name"
            placeholder="Indtast dit fulde navn"
            value={profileData.name}
            onChange={handleChange}
            className="w-full"
          />
        </div>
      )
    },
    // Contact information slide
    {
      title: "Kontaktoplysninger",
      description: "Hvordan kan arbejdsgivere kontakte dig?",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefonnummer
            </label>
            <Input
              name="phone"
              placeholder="Indtast dit telefonnummer"
              value={profileData.phone}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <Input
              name="address"
              placeholder="Indtast din adresse"
              value={profileData.address}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>
      )
    },
    // Summary slide
    {
      title: "Kort beskrivelse",
      description: "Fortæl lidt om dig selv med få ord.",
      content: (
        <div>
          <Textarea
            name="summary"
            placeholder="En kort beskrivelse om dig selv..."
            value={profileData.summary}
            onChange={handleChange}
            rows={3}
            className="w-full"
          />
          <p className="mt-2 text-sm text-gray-500">
            En kort beskrivelse der vil vises under dit navn i dit CV.
          </p>
        </div>
      )
    },
    // Experience slide
    {
      title: "Erhvervserfaring",
      description: "Fortæl om din arbejdserfaring.",
      content: (
        <div>
          <Textarea
            name="experience"
            placeholder="Beskriv din erhvervserfaring..."
            value={profileData.experience}
            onChange={handleChange}
            rows={4}
            className="w-full"
          />
          <p className="mt-2 text-sm text-gray-500">
            Inkluder dine jobtitler, virksomheder du har arbejdet for og hovedansvarsområder.
          </p>
        </div>
      )
    },
    // Education slide
    {
      title: "Uddannelse",
      description: "Fortæl om din uddannelsesbaggrund.",
      content: (
        <div>
          <Textarea
            name="education"
            placeholder="Beskriv din uddannelse..."
            value={profileData.education}
            onChange={handleChange}
            rows={4}
            className="w-full"
          />
          <p className="mt-2 text-sm text-gray-500">
            List dine grader, institutioner og afgangsår.
          </p>
        </div>
      )
    },
    // Skills slide
    {
      title: "Kompetencer",
      description: "Hvilke kompetencer og kvalifikationer har du?",
      content: (
        <div>
          <Textarea
            name="skills"
            placeholder="List dine relevante kompetencer og kvalifikationer..."
            value={profileData.skills}
            onChange={handleChange}
            rows={4}
            className="w-full"
          />
          <p className="mt-2 text-sm text-gray-500">
            Inkluder tekniske færdigheder, certificeringer, sprog og andre relevante kvalifikationer.
          </p>
        </div>
      )
    }
  ];

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Fuldfør din profil</h1>
          <p className="mt-2 text-gray-600">
            Lad os hjælpe dig med at oprette din profil. Du kan springe over alle trin, hvis du ønsker det.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentSlide ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <QuizSlide
          title={currentSlideData.title}
          description={currentSlideData.description}
          onNext={handleNext}
          onSkip={handleSkip}
          isLast={currentSlide === slides.length - 1}
        >
          {currentSlideData.content}
        </QuizSlide>
      </div>
    </div>
  );
};

export default ProfileQuiz;
