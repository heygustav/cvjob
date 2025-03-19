
import React from "react";
import { Resume } from "@/types/resume";

interface ClassicTemplateProps {
  data: Resume;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data }) => (
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
      {data.summary && (
        <p className="mt-2 text-gray-700 italic max-w-lg mx-auto">{data.summary}</p>
      )}
      <div className="mt-2 text-gray-600">
        {data.email && <div>{data.email}</div>}
        {data.phone && <div>{data.phone}</div>}
        {data.address && <div>{data.address}</div>}
      </div>
    </div>
    
    {data.experience && (
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2 border-b border-gray-900 pb-1">
          Professional Experience
        </h2>
        <div className="whitespace-pre-line text-gray-700 mt-3">{data.experience}</div>
      </div>
    )}
    
    {data.education && (
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2 border-b border-gray-900 pb-1">
          Education
        </h2>
        <div className="whitespace-pre-line text-gray-700 mt-3">{data.education}</div>
      </div>
    )}
    
    {data.skills && (
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2 border-b border-gray-900 pb-1">
          Kompetencer
        </h2>
        <div className="whitespace-pre-line text-gray-700 mt-3">{data.skills}</div>
      </div>
    )}
  </div>
);

export default ClassicTemplate;
