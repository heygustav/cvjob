
import React from "react";
import { Resume } from "@/types/resume";

interface ModernTemplateProps {
  data: Resume;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => (
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
          {data.summary && (
            <p className="mt-2 text-gray-700 italic">{data.summary}</p>
          )}
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
        <h2 className="text-lg font-medium text-gray-900 mb-2 border-b border-gray-900 pb-1">Experience</h2>
        <div className="whitespace-pre-line text-gray-700">{data.experience}</div>
      </div>
    )}
    
    {data.education && (
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2 border-b border-gray-900 pb-1">Education</h2>
        <div className="whitespace-pre-line text-gray-700">{data.education}</div>
      </div>
    )}
    
    {data.skills && (
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2 border-b border-gray-900 pb-1">Kompetencer</h2>
        <div className="whitespace-pre-line text-gray-700">{data.skills}</div>
      </div>
    )}
  </div>
);

export default ModernTemplate;
