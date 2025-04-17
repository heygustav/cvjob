
import React from "react";

interface ContentFormatterProps {
  content: string;
}

const ContentFormatter: React.FC<ContentFormatterProps> = ({ content }) => {
  const paragraphs = content.split('\n');
  
  return (
    <div className="whitespace-pre-wrap">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={paragraph.trim() === '' ? 'mt-4' : ''}>
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default ContentFormatter;
