
import { Route, Routes } from "react-router-dom";
import './App.css';
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import JobForm from "./pages/JobForm";
import { AuthProvider } from "./components/AuthProvider";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import CoverLetterGenerator from "./pages/CoverLetterGenerator";
import Auth from "./pages/Auth";

function App() {
  // Handler for login/signup that can be passed to components
  const handleUserAuth = (userId: string) => {
    console.log("User authenticated:", userId);
    // This function would typically set the user's auth state
    // But that's likely handled in AuthProvider now
  };

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login onLogin={handleUserAuth} />} />
        <Route path="/signup" element={<Signup onSignup={handleUserAuth} />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/job/new" element={<JobForm />} />
        <Route path="/job/:id" element={<JobForm />} />
        <Route path="/cover-letter" element={<CoverLetterGenerator />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
