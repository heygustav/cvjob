
/**
 * Gets the CSS class for a specific resume template
 */
export const getTemplateClass = (template: string): string => {
  switch (template) {
    case "modern":
      return "bg-white";
    case "classic":
      return "bg-slate-50";
    case "creative":
      return "bg-gradient-to-br from-blue-50 to-indigo-50";
    default:
      return "bg-white";
  }
};
