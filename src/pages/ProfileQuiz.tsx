
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import ProfileQuizContent from "@/components/profile/quiz/ProfileQuiz";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const ProfileQuiz: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("has_completed_onboarding")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error checking onboarding status:", error);
          throw error;
        }

        // If the user has already completed onboarding or we couldn't find their profile,
        // redirect them to the dashboard
        if (data?.has_completed_onboarding) {
          setHasCompletedOnboarding(true);
          navigate("/dashboard");
        } else {
          setHasCompletedOnboarding(false);
        }
      } catch (error) {
        console.error("Error in onboarding check:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Indlæser..." />
      </div>
    );
  }

  // Show the quiz only for users who haven't completed onboarding
  if (hasCompletedOnboarding === false) {
    return <ProfileQuizContent />;
  }

  return null; // This will not render as the user will be redirected
};

export default ProfileQuiz;
