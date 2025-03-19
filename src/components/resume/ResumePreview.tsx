
import React from "react";
import { PersonalInfoFormState } from "@/pages/Profile";
import { Card } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, CheckSquare } from "lucide-react";

interface ResumePreviewProps {
  data: PersonalInfoFormState;
  template: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
  const formatContent = (content: string) => {
    if (!content) return null;
    
    return content.split('\n').map((line, i) => (
      <p key={i} className="mb-1">
        {line}
      </p>
    ));
  };

  const renderModernTemplate = () => (
    <div className="text-sm">
      <div className="bg-primary text-white p-6">
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <div className="flex flex-wrap gap-3 mt-2 text-primary-foreground/80">
          {data.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{data.phone}</span>
            </div>
          )}
          {data.address && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{data.address}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {data.experience && (
          <div>
            <h2 className="text-lg font-semibold text-primary flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4" />
              Erfaring
            </h2>
            <div className="ml-6">{formatContent(data.experience)}</div>
          </div>
        )}
        
        {data.education && (
          <div>
            <h2 className="text-lg font-semibold text-primary flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4" />
              Uddannelse
            </h2>
            <div className="ml-6">{formatContent(data.education)}</div>
          </div>
        )}
        
        {data.skills && (
          <div>
            <h2 className="text-lg font-semibold text-primary flex items-center gap-2 mb-2">
              <CheckSquare className="w-4 h-4" />
              Kompetencer
            </h2>
            <div className="ml-6">{formatContent(data.skills)}</div>
          </div>
        )}
      </div>
    </div>
  );

  const renderClassicTemplate = () => (
    <div className="text-sm p-6 border-t-8 border-gray-700">
      <div className="mb-6 pb-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">{data.name}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
          {data.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{data.phone}</span>
            </div>
          )}
          {data.address && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{data.address}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        {data.experience && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
              ERFARING
            </h2>
            <div>{formatContent(data.experience)}</div>
          </div>
        )}
        
        {data.education && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
              UDDANNELSE
            </h2>
            <div>{formatContent(data.education)}</div>
          </div>
        )}
        
        {data.skills && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
              KOMPETENCER
            </h2>
            <div>{formatContent(data.skills)}</div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCreativeTemplate = () => (
    <div className="text-sm">
      <div className="flex">
        <div className="w-1/3 bg-purple-700 text-white p-6 space-y-6">
          <div className="mb-8">
            <div className="inline-block rounded-full bg-white p-2 mb-3">
              <User className="w-10 h-10 text-purple-700" />
            </div>
            <h1 className="text-xl font-bold">{data.name}</h1>
          </div>
          
          <div className="space-y-2">
            {data.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{data.phone}</span>
              </div>
            )}
            {data.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{data.address}</span>
              </div>
            )}
          </div>
          
          {data.skills && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2 border-b border-white/30 pb-1">
                Kompetencer
              </h2>
              <div>{formatContent(data.skills)}</div>
            </div>
          )}
        </div>
        
        <div className="w-2/3 p-6 space-y-6">
          {data.experience && (
            <div>
              <h2 className="text-lg font-semibold text-purple-700 flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4" />
                Erfaring
              </h2>
              <div className="ml-6">{formatContent(data.experience)}</div>
            </div>
          )}
          
          {data.education && (
            <div>
              <h2 className="text-lg font-semibold text-purple-700 flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4" />
                Uddannelse
              </h2>
              <div className="ml-6">{formatContent(data.education)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const getTemplateRenderer = () => {
    switch (template) {
      case "modern":
        return renderModernTemplate();
      case "classic":
        return renderClassicTemplate();
      case "creative":
        return renderCreativeTemplate();
      default:
        return renderModernTemplate();
    }
  };

  return (
    <Card className="overflow-hidden border shadow-sm max-h-[600px] overflow-y-auto bg-white scale-90 origin-top">
      {getTemplateRenderer()}
    </Card>
  );
};

export default ResumePreview;
