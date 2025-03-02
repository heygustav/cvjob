
import React from "react";

interface PreviewFooterProps {
  wordCount: number;
}

const PreviewFooter: React.FC<PreviewFooterProps> = ({ wordCount }) => {
  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
      <p>
        {wordCount} {wordCount === 1 ? "ord" : "ord"}
      </p>
      <p>
        {/* Additional footer content can be added here if needed */}
      </p>
    </div>
  );
};

export default PreviewFooter;
