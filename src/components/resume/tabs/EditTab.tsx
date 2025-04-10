
import React from "react";
import ResumeSectionEditor from "../ResumeSectionEditor";
import { ExperienceEditor, EducationEditor, SkillEditor } from "../StructuredSections";
import { Resume, ExperienceEntry, EducationEntry, SkillEntry } from "@/types/resume";

interface EditTabProps {
  resumeData: Resume;
  handleUpdateSection: (section: keyof Resume, value: string) => void;
  handleUpdateStructuredExperience: (experiences: ExperienceEntry[]) => void;
  handleUpdateStructuredEducation: (educations: EducationEntry[]) => void;
  handleUpdateStructuredSkills: (skills: SkillEntry[]) => void;
}

const EditTab: React.FC<EditTabProps> = ({
  resumeData,
  handleUpdateSection,
  handleUpdateStructuredExperience,
  handleUpdateStructuredEducation,
  handleUpdateStructuredSkills
}) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <ResumeSectionEditor
          title="Personlige Oplysninger"
          sections={[
            { key: "name", label: "Fulde Navn", value: resumeData.name },
            { key: "email", label: "Email", value: resumeData.email },
            { key: "phone", label: "Telefon", value: resumeData.phone || "" },
            { key: "address", label: "Adresse", value: resumeData.address || "" },
            { 
              key: "summary", 
              label: "Kort beskrivelse", 
              value: resumeData.summary || "", 
              multiline: true 
            },
          ]}
          onUpdate={handleUpdateSection}
        />
      </div>

      <div className="space-y-6">
        <ExperienceEditor 
          experiences={resumeData.structuredExperience || []}
          onUpdate={handleUpdateStructuredExperience}
        />
      </div>

      <div className="space-y-6">
        <EducationEditor
          educations={resumeData.structuredEducation || []}
          onUpdate={handleUpdateStructuredEducation}
        />
      </div>

      <div className="space-y-6">
        <SkillEditor
          skills={resumeData.structuredSkills || []}
          onUpdate={handleUpdateStructuredSkills}
        />
      </div>
    </div>
  );
};

export default EditTab;
