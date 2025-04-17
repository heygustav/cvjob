
import React from "react";
import { CoverLetter } from "@/lib/types";
import LetterContent from "./content/LetterContent";

interface CoverLetterGeneratorProps {
  data: CoverLetter;
  jobTitle?: string;
  company?: string;
  contactPerson?: string;
  userInfo?: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ 
  data, 
  jobTitle, 
  company,
  userInfo = { name: "", email: "" }
}) => {
  if (!data?.content) {
    return <div>Ingen ansøgningstekst tilgængelig</div>;
  }

  return (
    <div className="cover-letter">
      <LetterContent
        content={data.content}
        jobTitle={jobTitle}
        company={company}
        userInfo={userInfo}
      />
    </div>
  );
};

export default CoverLetterGenerator;
