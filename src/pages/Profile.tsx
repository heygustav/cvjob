
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface PersonalInfoFormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  education: string;
  skills: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PersonalInfoFormState>({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    experience: "",
    education: "",
    skills: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setIsProfileLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setFormData({
          name: data.name || "",
          email: data.email || user?.email || "",
          phone: data.phone || "",
          address: data.address || "",
          experience: data.experience || "",
          education: data.education || "",
          skills: data.skills || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Fejl ved indlæsning af profil",
        description: "Der opstod en fejl under indlæsning af din profil. Prøv venligst igen.",
        variant: "destructive",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Profil opdateret",
        description: "Dine profiloplysninger er blevet gemt.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Fejl ved opdatering",
        description: "Der opstod en fejl under opdatering af din profil. Prøv venligst igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Profil
            </h1>
            <p className="mt-1 text-lg text-gray-600">
              Administrer dine personlige oplysninger
            </p>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fulde navn
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    E-mailadresse
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Telefonnummer
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Adresse
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Erhvervserfaring
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="experience"
                      name="experience"
                      rows={4}
                      value={formData.experience}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      placeholder="Beskriv din erhvervserfaring..."
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Inkluder dine jobtitler, virksomheder du har arbejdet for og hovedansvarsområder.
                  </p>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="education"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Uddannelse
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="education"
                      name="education"
                      rows={3}
                      value={formData.education}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      placeholder="Beskriv din uddannelsesmæssige baggrund..."
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Angiv dine uddannelser, institutioner og dimissionsår.
                  </p>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="skills"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Kompetencer & kvalifikationer
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="skills"
                      name="skills"
                      rows={3}
                      value={formData.skills}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      placeholder="Angiv dine relevante kompetencer og kvalifikationer..."
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Inkluder tekniske kompetencer, certificeringer, sprog og andre relevante kvalifikationer.
                  </p>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Gemmer...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Gem profil
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Kontoindstillinger</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Adgangskode</h3>
                  <p className="text-sm text-gray-500">Opdater din adgangskode</p>
                </div>
                <button className="text-sm font-medium text-black hover:text-gray-800">
                  Ændre
                </button>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">E-mailnotifikationer</h3>
                  <p className="text-sm text-gray-500">Administrer dine e-mailpræferencer</p>
                </div>
                <button className="text-sm font-medium text-black hover:text-gray-800">
                  Administrer
                </button>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Slet konto</h3>
                  <p className="text-sm text-gray-500">Slet permanent din konto og alle data</p>
                </div>
                <button className="text-sm font-medium text-red-600 hover:text-red-800">
                  Slet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
