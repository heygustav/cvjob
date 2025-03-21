import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Building, Loader2, ArrowLeft } from "lucide-react";

const CompanyForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    notes: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch company data if editing
  useEffect(() => {
    const fetchCompany = async () => {
      if (!isEditing || !user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            website: data.website || "",
            contact_person: data.contact_person || "",
            contact_email: data.contact_email || "",
            contact_phone: data.contact_phone || "",
            notes: data.notes || "",
          });
        }
      } catch (err) {
        console.error('Error fetching company:', err);
        setError('Kunne ikke hente virksomhedsdata. Prøv igen senere.');
        toast({
          title: "Fejl",
          description: "Kunne ikke hente virksomhedsdata. Prøv igen senere.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompany();
  }, [isEditing, id, user, supabase, toast]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Fejl",
        description: "Du skal være logget ind for at gemme virksomheder.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "Manglende information",
        description: "Virksomhedsnavn er påkrævet.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Prepare data
      const companyData = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };
      
      if (isEditing) {
        // Update existing company
        const { error } = await supabase
          .from('companies')
          .update(companyData)
          .eq('id', id)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        toast({
          title: "Succes",
          description: "Virksomheden blev opdateret.",
        });
      } else {
        // Create new company
        const { error } = await supabase
          .from('companies')
          .insert({
            ...companyData,
            created_at: new Date().toISOString(),
          });
          
        if (error) throw error;
        
        toast({
          title: "Succes",
          description: "Virksomheden blev oprettet.",
        });
      }
      
      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving company:', err);
      setError('Kunne ikke gemme virksomheden. Prøv igen senere.');
      toast({
        title: "Fejl",
        description: "Kunne ikke gemme virksomheden. Prøv igen senere.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Page title based on action
  const pageTitle = isEditing ? "Rediger virksomhed" : "Tilføj ny virksomhed";
  
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Tilbage til dashboard
      </Button>
      
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" aria-hidden="true" />
            {pageTitle}
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? "Rediger information om virksomheden" 
              : "Tilføj en ny virksomhed til dit dashboard"}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Company name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Virksomhedsnavn *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="F.eks. ACME A/S"
                    required
                    className="w-full"
                  />
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Beskrivelse
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Kort beskrivelse af virksomheden..."
                    rows={3}
                    className="w-full resize-y"
                  />
                </div>
                
                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">
                    Hjemmeside
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full"
                  />
                </div>
                
                {/* Contact person */}
                <div className="space-y-2">
                  <Label htmlFor="contact_person" className="text-sm font-medium">
                    Kontaktperson
                  </Label>
                  <Input
                    id="contact_person"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    placeholder="Navn på kontaktperson"
                    className="w-full"
                  />
                </div>
                
                {/* Contact details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="contact_email"
                      name="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={handleChange}
                      placeholder="kontakt@example.com"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone" className="text-sm font-medium">
                      Telefon
                    </Label>
                    <Input
                      id="contact_phone"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleChange}
                      placeholder="+45 12345678"
                      className="w-full"
                    />
                  </div>
                </div>
                
                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Noter
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Eventuelle noter om virksomheden..."
                    rows={3}
                    className="w-full resize-y"
                  />
                </div>
              </>
            )}
            
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">
                {error}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              disabled={isSaving}
            >
              Annuller
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading || isSaving}
              className="bg-primary hover:bg-primary-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Gemmer...
                </>
              ) : isEditing ? (
                "Opdater virksomhed"
              ) : (
                "Opret virksomhed"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CompanyForm; 