
import React from "react";

interface SectionHeaderProps {
  title: string;
  description: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description }) => (
  <div className="text-left mb-4">
    <h2 className="text-lg font-medium text-gray-900">{title}</h2>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

export default SectionHeader;
