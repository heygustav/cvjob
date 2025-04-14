
import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CompanyFormHeader from "@/components/company/CompanyFormHeader";
import CompanyFormFields from "@/components/company/CompanyFormFields";
import CompanyFormActions from "@/components/company/CompanyFormActions";
import { useCompanyForm } from "@/components/company/useCompanyForm";

const CompanyForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    formData,
    isLoading,
    isSaving,
    error,
    handleChange,
    handleSubmit
  } = useCompanyForm(user?.id);

  const handleCancel = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2"
        onClick={handleCancel}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Tilbage til dashboard
      </Button>
      
      <Card>
        <CompanyFormHeader isEditing={isEditing} />
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 p-6">
            <CompanyFormFields
              formData={formData}
              onChange={handleChange}
              isLoading={isLoading}
            />
            
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">
                {error}
              </div>
            )}
          </div>
          
          <div className="p-6 pt-0">
            <CompanyFormActions
              isEditing={isEditing}
              isSaving={isSaving}
              onCancel={handleCancel}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CompanyForm;
