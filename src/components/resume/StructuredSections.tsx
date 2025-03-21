import React from "react";
import StructuredRowEditor from "./StructuredRowEditor";
import { generateUUID } from "@/utils/uuid";
import { ExperienceEntry, EducationEntry, SkillEntry } from "@/types/resume";

interface ExperienceEditorProps {
  experiences: ExperienceEntry[];
  onUpdate: (experiences: ExperienceEntry[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
  experiences,
  onUpdate,
}) => {
  const createExperience = (): ExperienceEntry => ({
    id: generateUUID(),
    position: "",
    organization: "",
    fromDate: "",
    toDate: "",
    bulletPoints: [],
  });

  return (
    <StructuredRowEditor
      title="Erhvervserfaring"
      entries={experiences}
      columns={[
        { key: "position", label: "Stilling", type: "text" },
        { key: "organization", label: "Organisation", type: "text" },
        { key: "fromDate", label: "Fra", type: "date" },
        { key: "toDate", label: "Til", type: "date" },
      ]}
      onUpdate={onUpdate}
      createEntry={createExperience}
    />
  );
};

interface EducationEditorProps {
  educations: EducationEntry[];
  onUpdate: (educations: EducationEntry[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({
  educations,
  onUpdate,
}) => {
  const createEducation = (): EducationEntry => ({
    id: generateUUID(),
    education: "",
    school: "",
    fromDate: "",
    toDate: "",
    bulletPoints: [],
  });

  return (
    <StructuredRowEditor
      title="Uddannelse"
      entries={educations}
      columns={[
        { key: "education", label: "Uddannelse", type: "text" },
        { key: "school", label: "Skole", type: "text" },
        { key: "fromDate", label: "Fra", type: "date" },
        { key: "toDate", label: "Til", type: "date" },
      ]}
      onUpdate={onUpdate}
      createEntry={createEducation}
    />
  );
};

interface SkillEditorProps {
  skills: SkillEntry[];
  onUpdate: (skills: SkillEntry[]) => void;
}

export const SkillEditor: React.FC<SkillEditorProps> = ({
  skills,
  onUpdate,
}) => {
  const createSkill = (): SkillEntry => ({
    id: generateUUID(),
    skill: "",
    years: "",
    bulletPoints: [],
  });

  return (
    <StructuredRowEditor
      title="Kompetencer"
      entries={skills}
      columns={[
        { key: "skill", label: "Kompetence", type: "text" },
        { key: "years", label: "År", type: "text" },
      ]}
      onUpdate={onUpdate}
      createEntry={createSkill}
    />
  );
}; 