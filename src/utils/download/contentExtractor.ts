
/**
 * Helper to safely get text content from possible HTML
 */
export const getTextContent = (htmlString: string): string => {
  // Create a temporary div element
  const tempDiv = document.createElement('div');
  // Set the HTML content of the div
  tempDiv.innerHTML = htmlString;
  // Return the text content of the div
  return tempDiv.textContent || tempDiv.innerText || '';
};
