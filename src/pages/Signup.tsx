
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupProps {
  onSignup: (userId: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Adgangskode fejl",
        description: "Adgangskoderne stemmer ikke overens",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Adgangskode fejl",
        description: "Adgangskoden skal være mindst 8 tegn",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate signup process
      setTimeout(() => {
        // In a real app, this would send data to a server to create an account
        const newUserId = "new-user-" + Date.now();
        onSignup(newUserId);
        
        toast({
          title: "Konto oprettet",
          description: "Din konto er blevet oprettet med succes!",
        });
        
        navigate("/dashboard");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Oprettelse mislykkedes",
        description: "Der opstod en fejl under oprettelse af kontoen",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const { password } = formData;
    if (!password) return 0;
    if (password.length < 8) return 1;
    if (/^[a-zA-Z0-9]*$/.test(password)) return 2;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return 4;
    return 3;
  };

  const getPasswordStrengthText = () => {
    const strength = passwordStrength();
    if (strength === 0) return "";
    if (strength === 1) return "Svag";
    if (strength === 2) return "Rimelig";
    if (strength === 3) return "God";
    return "Stærk";
  };

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength();
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-green-400";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              Opret din konto
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Har du allerede en konto?{" "}
              <Link
                to="/login"
                className="font-medium text-black hover:text-gray-800"
              >
                Log ind
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Fulde navn
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                  placeholder="Anders Andersen"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-mailadresse
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                  placeholder="dig@eksempel.dk"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Adgangskode
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength() * 25}%` }}
                      ></div>
                    </div>
                    <span className="text-xs ml-2 text-gray-600 min-w-[50px]">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li className="flex items-center">
                      <Check
                        className={`h-3 w-3 mr-1 ${
                          formData.password.length >= 8
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                      Mindst 8 tegn
                    </li>
                    <li className="flex items-center">
                      <Check
                        className={`h-3 w-3 mr-1 ${
                          /[A-Z]/.test(formData.password)
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                      Mindst et stort bogstav
                    </li>
                    <li className="flex items-center">
                      <Check
                        className={`h-3 w-3 mr-1 ${
                          /[0-9]/.test(formData.password)
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                      Mindst et tal
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Bekræft adgangskode
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              {formData.password && formData.confirmPassword && (
                <p
                  className={`mt-2 text-xs ${
                    formData.password === formData.confirmPassword
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formData.password === formData.confirmPassword
                    ? "Adgangskoderne stemmer overens"
                    : "Adgangskoderne stemmer ikke overens"}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                Jeg accepterer{" "}
                <a
                  href="#"
                  className="font-medium text-black hover:text-gray-800"
                >
                  Brugsbetingelserne
                </a>{" "}
                og{" "}
                <a
                  href="#"
                  className="font-medium text-black hover:text-gray-800"
                >
                  Privatlivspolitikken
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
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
                    Opretter konto...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Opret konto
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
