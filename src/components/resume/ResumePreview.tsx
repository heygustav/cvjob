
import React from "react";
import { PersonalInfoFormState } from "@/pages/Profile";
import { Card, CardContent } from "@/components/ui/card";

interface ResumePreviewProps {
  data: PersonalInfoFormState & { photo?: string };
  template: "modern" | "classic" | "creative";
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
  // Check if we have the minimum required data
  const isDataComplete = !!data.name && !!data.email;
  
  if (!isDataComplete) {
    return (
      <div className="p-8 bg-muted rounded-md text-center">
        <h3 className="text-lg font-semibold mb-2">Incomplete Resume</h3>
        <p className="text-muted-foreground">
          Please provide at least your name and email in the edit section.
        </p>
      </div>
    );
  }

  // Render template based on selection
  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardContent className={`p-6 ${getTemplateClass(template)}`}>
        {template === "modern" && <ModernTemplate data={data} />}
        {template === "classic" && <ClassicTemplate data={data} />}
        {template === "creative" && <CreativeTemplate data={data} />}
      </CardContent>
    </Card>
  );
};

// Template-specific styling
const getTemplateClass = (template: string): string => {
  switch (template) {
    case "modern":
      return "bg-white";
    case "classic":
      return "bg-slate-50";
    case "creative":
      return "bg-gradient-to-br from-blue-50 to-indigo-50";
    default:
      return "bg-white";
  }
};

// Template Components
const ModernTemplate: React.FC<{ data: PersonalInfoFormState & { photo?: string } }> = ({ data }) => (
  <div className="font-serif">
    <div className="border-b pb-4 mb-6">
      <div className="flex items-start gap-4">
        {data.photo && (
          <img 
            src={data.photo} 
            alt="Profilbillede" 
            className="w-24 h-24 object-cover rounded-md"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
          <div className="mt-2 text-gray-600 flex flex-wrap gap-x-4">
            {data.email && <div>{data.email}</div>}
            {data.phone && <div>{data.phone}</div>}
            {data.address && <div>{data.address}</div>}
          </div>
        </div>
      </div>
    </div>
    
    {data.experience && (
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Experience</h2>
        <div className="whitespace-pre-line text-gray-700">{data.experience}</div>
      </div>
    )}
    
    {data.education && (
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Education</h2>
        <div className="whitespace-pre-line text-gray-700">{data.education}</div>
      </div>
    )}
    
    {data.skills && (
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">Skills</h2>
        <div className="whitespace-pre-line text-gray-700">{data.skills}</div>
      </div>
    )}
  </div>
);

const ClassicTemplate: React.FC<{ data: PersonalInfoFormState & { photo?: string } }> = ({ data }) => (
  <div className="font-serif">
    <div className="text-center mb-6">
      {data.photo && (
        <div className="flex justify-center mb-3">
          <img 
            src={data.photo} 
            alt="Profilbillede" 
            className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
          />
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
      <div className="mt-2 text-gray-600">
        {data.email && <div>{data.email}</div>}
        {data.phone && <div>{data.phone}</div>}
        {data.address && <div>{data.address}</div>}
      </div>
    </div>
    
    {data.experience && (
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2 border-b pb-1">
          Professional Experience
        </h2>
        <div className="whitespace-pre-line text-gray-700 mt-3">{data.experience}</div>
      </div>
    )}
    
    {data.education && (
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2 border-b pb-1">
          Education
        </h2>
        <div className="whitespace-pre-line text-gray-700 mt-3">{data.education}</div>
      </div>
    )}
    
    {data.skills && (
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2 border-b pb-1">
          Skills
        </h2>
        <div className="whitespace-pre-line text-gray-700 mt-3">{data.skills}</div>
      </div>
    )}
  </div>
);

const CreativeTemplate: React.FC<{ data: PersonalInfoFormState & { photo?: string } }> = ({ data }) => (
  <div className="font-sans">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3 bg-indigo-100 p-4 rounded-lg">
        {data.photo && (
          <div className="mb-4 flex justify-center">
            <img 
              src={data.photo} 
              alt="Profilbillede" 
              className="w-28 h-28 object-cover rounded-full border-2 border-indigo-300"
            />
          </div>
        )}
        <h1 className="text-xl font-bold text-indigo-900 mb-4">{data.name}</h1>
        <div className="text-indigo-800 space-y-2">
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.address && <div>{data.address}</div>}
        </div>
        
        {data.skills && (
          <div className="mt-6">
            <h2 className="text-lg font-medium text-indigo-900 mb-2">Skills</h2>
            <div className="whitespace-pre-line text-indigo-800">{data.skills}</div>
          </div>
        )}
      </div>
      
      <div className="md:w-2/3">
        {data.experience && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Experience</h2>
            <div className="whitespace-pre-line text-gray-700">{data.experience}</div>
          </div>
        )}
        
        {data.education && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Education</h2>
            <div className="whitespace-pre-line text-gray-700">{data.education}</div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ResumePreview;
