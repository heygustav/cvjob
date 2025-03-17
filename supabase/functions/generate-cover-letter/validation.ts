
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
  
  return {
    ...requestData,
    jobInfo: requestData.jobInfo ? {
      ...requestData.jobInfo,
      description: requestData.jobInfo.description ? 
        `${requestData.jobInfo.description.substring(0, 50)}... (truncated)` : undefined
    } : undefined
  };
}
