
import { useState, useEffect } from "react";

const useKeywords = () => {
  const [savedKeywords, setSavedKeywords] = useState<string[]>([]);

  // Load saved keywords on mount
  useEffect(() => {
    const keywords = JSON.parse(localStorage.getItem('selectedKeywords') || '[]');
    setSavedKeywords(keywords);
  }, []);

  const insertKeyword = (keyword: string, setContent: React.Dispatch<React.SetStateAction<string>>) => {
    const textarea = document.getElementById('letter-content') as HTMLTextAreaElement;
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, cursorPos);
      const textAfter = textarea.value.substring(cursorPos);
      
      setContent(`${textBefore}${keyword}${textAfter}`);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(cursorPos + keyword.length, cursorPos + keyword.length);
      }, 0);
    } else {
      setContent(prev => `${prev} ${keyword}`);
    }
  };

  const removeKeyword = (keyword: string) => {
    const updatedKeywords = savedKeywords.filter(k => k !== keyword);
    setSavedKeywords(updatedKeywords);
    localStorage.setItem('selectedKeywords', JSON.stringify(updatedKeywords));
  };

  return {
    savedKeywords,
    insertKeyword,
    removeKeyword
  };
};

export default useKeywords;
