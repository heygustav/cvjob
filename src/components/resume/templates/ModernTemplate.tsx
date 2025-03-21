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
            className="w-20 h-20 object-cover rounded-md mt-1"
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
    
    {((data.structuredExperience && data.structuredExperience.length > 0) || data.experience) && (
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2 pb-1">Erhvervserfaring</h2>
        <div className="border-t border-black pt-2 mt-1 mb-3"></div>
        
        {data.structuredExperience && data.structuredExperience.length > 0 ? (
          <div className="space-y-4">
            {data.structuredExperience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex flex-col sm:flex-row justify-between mb-1">
                  <div className="font-medium">{exp.position}</div>
                  <div className="text-sm text-gray-600">
                    {exp.fromDate} - {exp.toDate || 'Nu'}
                  </div>
                </div>
                <div className="text-gray-700 mb-1">{exp.organization}</div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {exp.bulletPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="whitespace-pre-line text-gray-700">{data.experience}</div>
        )}
      </div>
    )}
    
    {((data.structuredEducation && data.structuredEducation.length > 0) || data.education) && (
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2 pb-1">Uddannelse</h2>
        <div className="border-t border-black pt-2 mt-1 mb-3"></div>
        
        {data.structuredEducation && data.structuredEducation.length > 0 ? (
          <div className="space-y-4">
            {data.structuredEducation.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex flex-col sm:flex-row justify-between mb-1">
                  <div className="font-medium">{edu.education}</div>
                  <div className="text-sm text-gray-600">
                    {edu.fromDate} - {edu.toDate || 'Nu'}
                  </div>
                </div>
                <div className="text-gray-700 mb-1">{edu.school}</div>
                {edu.bulletPoints && edu.bulletPoints.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {edu.bulletPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="whitespace-pre-line text-gray-700">{data.education}</div>
        )}
      </div>
    )}
    
    {((data.structuredSkills && data.structuredSkills.length > 0) || data.skills) && (
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2 pb-1">Kompetencer</h2>
        <div className="border-t border-black pt-2 mt-1 mb-3"></div>
        
        {data.structuredSkills && data.structuredSkills.length > 0 ? (
          <div className="space-y-4">
            {data.structuredSkills.map((skill) => (
              <div key={skill.id} className="mb-3">
                <div className="flex flex-col sm:flex-row justify-between mb-1">
                  <div className="font-medium">{skill.skill}</div>
                  <div className="text-sm text-gray-600">{skill.years} år</div>
                </div>
                {skill.bulletPoints && skill.bulletPoints.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {skill.bulletPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="whitespace-pre-line text-gray-700">{data.skills}</div>
        )}
      </div>
    )}
  </div>
);

export default ModernTemplate;
