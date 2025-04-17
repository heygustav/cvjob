
import React from "react";
import CommonLayout from "@/components/ui/CommonLayout";
import ContentFormatter from "./ContentFormatter";

interface LetterContentProps {
  content: string;
  jobTitle?: string;
  company?: string;
  userInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

const LetterContent: React.FC<LetterContentProps> = ({
  content,
  jobTitle,
  company,
  userInfo
}) => {
  return (
    <CommonLayout
      name={userInfo.name}
      title={`Ansøgning: ${jobTitle || 'Stilling'} - ${company || 'Virksomhed'}`}
      bodyContent={<ContentFormatter content={content} />}
      contactInfo={{
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address
      }}
    />
  );
};

export default LetterContent;
