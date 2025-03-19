
import React from "react";

interface ResumeHeaderProps {
  title: string;
  subtitle: string;
}

const ResumeHeader: React.FC<ResumeHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8 text-center md:text-left">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default ResumeHeader;
