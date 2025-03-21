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
        <div className="w-full">
          <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
          <div className="mt-2 text-gray-600 flex flex-wrap gap-x-4">
            {data.email && <div>{data.email}</div>}
            {data.phone && <div>{data.phone}</div>}
            {data.address && <div>{data.address}</div>}
          </div>
        </div>
      </div>
      
      {data.summary && (
        <div className="mt-4">
          <h2 className="text-base font-medium uppercase text-gray-900 mb-1">PROFESSIONAL PROFILE</h2>
          <p className="text-gray-700">{data.summary}</p>
        </div>
      )}
    </div>
    
    {((data.structuredExperience && data.structuredExperience.length > 0) || data.experience) && (
      <div className="mb-6">
        <h2 className="text-lg font-medium uppercase text-gray-900 mb-2 pb-1">WORK EXPERIENCE</h2>
        <div className="border-t border-black pt-2 mt-1 mb-3"></div>
        
        {data.structuredExperience && data.structuredExperience.length > 0 ? (
          <div className="space-y-4">
            {data.structuredExperience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex flex-col sm:flex-row justify-between mb-1">
                  <div className="font-bold">{exp.position}</div>
                  <div className="text-sm text-gray-600">
                    {exp.fromDate} - {exp.toDate || 'Present'}
                  </div>
                </div>
                <div className="text-gray-700 font-medium mb-1">{exp.organization}</div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {exp.bulletPoints.map((point, index) => (
                      <li key={index} className="pl-1">{point}</li>
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
        <h2 className="text-lg font-medium uppercase text-gray-900 mb-2 pb-1">EDUCATION</h2>
        <div className="border-t border-black pt-2 mt-1 mb-3"></div>
        
        {data.structuredEducation && data.structuredEducation.length > 0 ? (
          <div className="space-y-4">
            {data.structuredEducation.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex flex-col sm:flex-row justify-between mb-1">
                  <div className="font-bold">{edu.education}</div>
                  <div className="text-sm text-gray-600">
                    {edu.fromDate} - {edu.toDate || 'Present'}
                  </div>
                </div>
                <div className="text-gray-700 font-medium mb-1">{edu.school}</div>
                {edu.bulletPoints && edu.bulletPoints.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {edu.bulletPoints.map((point, index) => (
                      <li key={index} className="pl-1">{point}</li>
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
        <h2 className="text-lg font-medium uppercase text-gray-900 mb-2 pb-1">SKILLS</h2>
        <div className="border-t border-black pt-2 mt-1 mb-3"></div>
        
        {data.structuredSkills && data.structuredSkills.length > 0 ? (
          <div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
              {data.structuredSkills.map((skill) => (
                <div key={skill.id} className="mb-1">
                  <span className="font-medium">{skill.skill}</span>
                  {skill.years && <span className="text-sm text-gray-600 ml-2">({skill.years} years)</span>}
                </div>
              ))}
            </div>
            
            {data.structuredSkills.some(skill => skill.bulletPoints && skill.bulletPoints.length > 0) && (
              <div className="mt-4">
                <h3 className="text-base font-medium text-gray-800 mb-2">Key Skills Detail</h3>
                {data.structuredSkills
                  .filter(skill => skill.bulletPoints && skill.bulletPoints.length > 0)
                  .map(skill => (
                    <div key={`${skill.id}-details`} className="mb-3">
                      <div className="font-medium">{skill.skill}:</div>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {skill.bulletPoints!.map((point, index) => (
                          <li key={index} className="pl-1">{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        ) : (
          <div className="whitespace-pre-line text-gray-700">{data.skills}</div>
        )}
      </div>
    )}
  </div>
);

export default ModernTemplate;
