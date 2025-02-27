
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import "https://deno.land/x/xhr@0.2.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Edge function received request");
    const requestData = await req.json();
    
    // Log the request payload without large description fields
    const logPayload = requestData ? {
      ...requestData,
      jobInfo: requestData.jobInfo ? {
        ...requestData.jobInfo,
        description: requestData.jobInfo.description ? 
          `${requestData.jobInfo.description.substring(0, 50)}... (truncated)` : undefined
      } : undefined
    } : null;
    
    console.log("Request payload (truncated):", JSON.stringify(logPayload));
    
    // Handle different action types
    if (requestData.action === "extract_job_info") {
      return handleExtractJobInfo(requestData.text);
    }
    
    // Default action: generate cover letter
    const { jobInfo, userInfo } = requestData;

    // Enhanced validation
    if (!jobInfo) {
      console.error("Missing job information");
      throw new Error('Missing job information');
    }
    
    if (!userInfo) {
      console.error("Missing user information");
      throw new Error('Missing user information');
    }
    
    if (!jobInfo.title) {
      console.error("Missing job title");
      throw new Error('Missing job title');
    }
    
    if (!jobInfo.company) {
      console.error("Missing company name");
      throw new Error('Missing company name');
    }

    console.log(`Generating cover letter for ${jobInfo.title} at ${jobInfo.company}`);

    // Get user's locale or default to Danish
    const locale = requestData.locale || "da-DK";
    
    // Generate a simple cover letter template
    const today = new Date().toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const content = `${today}

Kære ${jobInfo.contactPerson || 'Rekrutteringsansvarlig'},

Jeg skriver for at ansøge om stillingen som ${jobInfo.title} hos ${jobInfo.company}.

Med baggrund i min erfaring inden for ${jobInfo.title.toLowerCase()} og min passion for branchen, er jeg overbevist om, at jeg kan bidrage betydeligt til ${jobInfo.company}.

${userInfo && userInfo.experience ? `\nMin erfaring omfatter:\n${userInfo.experience}\n` : ''}
${userInfo && userInfo.skills ? `\nMine relevante kompetencer inkluderer:\n${userInfo.skills}\n` : ''}
${userInfo && userInfo.education ? `\nMin uddannelsesmæssige baggrund:\n${userInfo.education}\n` : ''}

Jeg ser frem til muligheden for at uddybe mine kvalifikationer ved en personlig samtale.

Med venlig hilsen,
${userInfo && userInfo.name ? userInfo.name : 'Dit navn'}${userInfo && userInfo.phone ? '\n' + userInfo.phone : ''}
${userInfo && userInfo.email ? userInfo.email : 'Din e-mail'}${userInfo && userInfo.address ? '\n' + userInfo.address : ''}`;

    console.log("Cover letter generated successfully");
    
    return new Response(
      JSON.stringify({
        content: content,
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-cover-letter function:', error);
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});

// Helper function to extract job information from text
function handleExtractJobInfo(text: string) {
  console.log("Extracting job info from text");
  
  if (!text) {
    return new Response(
      JSON.stringify({ error: "No text provided" }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  // Extract job title
  let title = "";
  const titlePatterns = [
    /(?:stilling|job|rolle)(?:\s+som|\:)\s+["']?([^"'\n,\.]{3,50})["']?/i,
    /søger\s+(?:en\s+)?["']?([^"'\n,\.]{3,50})["']?/i,
    /(?:position|vacancy|job opening|job title)\:?\s+["']?([^"'\n,\.]{3,50})["']?/i,
  ];
  
  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      title = match[1].trim();
      break;
    }
  }

  // Extract company name
  let company = "";
  const companyPatterns = [
    /(?:hos|ved|for|i)\s+["']?([^"'\n,\.]{2,40})(?:\s+(?:A\/S|ApS|I\/S))?["']?/i,
    /(?:virksomhed|firma)\s+["']?([^"'\n,\.]{2,40})["']?/i,
    /(?:company|organization|employer)\:?\s+["']?([^"'\n,\.]{2,40})["']?/i,
  ];
  
  for (const pattern of companyPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      company = match[1].trim();
      break;
    }
  }

  // Extract contact person
  let contact_person = "";
  const contactPatterns = [
    /(?:kontakt|henvendelse til)\s+["']?([^"'\n,\.]{2,40})["']?/i,
    /(?:spørgsmål|information)(?:\s+til)?\s+["']?([^"'\n,\.]{2,40})["']?/i,
    /(?:contact person|contact|questions to|apply to)\:?\s+["']?([^"'\n,\.]{2,40})["']?/i,
  ];
  
  for (const pattern of contactPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      contact_person = match[1].trim();
      break;
    }
  }

  // Extract URL
  let url = "";
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?/g;
  const urls = text.match(urlPattern);
  if (urls && urls.length > 0) {
    url = urls[0];
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
  }

  console.log("Extraction results:", { title, company, contact_person, url });

  return new Response(
    JSON.stringify({
      title,
      company,
      contact_person,
      url
    }),
    { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      } 
    }
  );
}
