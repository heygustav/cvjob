
/**
 * Validates the request data for cover letter generation
 * Throws an error if validation fails
 */
export function validateRequestData(requestData: any): { jobInfo: any, userInfo: any } {
  if (!requestData) {
    throw new Error('Missing request data');
  }
  
  const { jobInfo, userInfo } = requestData;
  
  if (!jobInfo) {
    throw new Error('Missing job information');
  }
  
  if (!userInfo) {
    throw new Error('Missing user information');
  }
  
  if (!jobInfo.title) {
    throw new Error('Missing job title');
  }
  
  if (!jobInfo.company) {
    throw new Error('Missing company name');
  }
  
  return { jobInfo, userInfo };
}

/**
 * Creates a truncated log payload to avoid logging large descriptions
 */
export function createLogPayload(requestData: any): any {
  if (!requestData) return null;
  
  const truncateText = (text: string, maxLength = 50) => {
    if (!text) return undefined;
    return text.length > maxLength ? `${text.substring(0, maxLength)}... (truncated)` : text;
  };
  
  return {
    ...requestData,
    jobInfo: requestData.jobInfo ? {
      ...requestData.jobInfo,
      description: truncateText(requestData.jobInfo.description)
    } : undefined,
    userInfo: requestData.userInfo ? {
      ...requestData.userInfo,
      education: truncateText(requestData.userInfo.education),
      experience: truncateText(requestData.userInfo.experience),
      skills: truncateText(requestData.userInfo.skills)
    } : undefined
  };
}
