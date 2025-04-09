
import React from "react";

interface PreviewFooterProps {
  wordCount: number;
  customContent?: React.ReactNode;
}

const PreviewFooter: React.FC<PreviewFooterProps> = ({ wordCount, customContent }) => {
  return (
    <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
      <div>
        {customContent || (
          <span>Antal ord: {wordCount}</span>
        )}
      </div>
      <div>
        Genereret af CVJob.dk
      </div>
    </div>
  );
};

export default PreviewFooter;
