
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    console.log("Received request to generate-cover-letter function");
    
    // Parse request data
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data parsed successfully");
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Log what we received to help with debugging
    console.log("Request action:", requestData.action);
    
    // Handle action=extract_job_info case (used by JobPostingForm)
    if (requestData.action === "extract_job_info") {
      console.log("Extracting job info from text");
      const text = requestData.text || "";
      
      // Extract info using simple regex patterns
      const extractedInfo = {
        title: extractTitle(text),
        company: extractCompany(text),
        contact_person: extractContactPerson(text),
        url: extractUrl(text)
      };
      
      console.log("Extracted info:", extractedInfo);
      return new Response(JSON.stringify(extractedInfo), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Handle regular cover letter generation
    const { jobInfo, userInfo } = requestData;
    
    if (!jobInfo || !userInfo) {
      console.error("Missing job or user information");
      return new Response(
        JSON.stringify({ 
          content: "Error: Missing required information",
          error: "Missing job or user information" 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log("Processing cover letter for job:", jobInfo?.title || "Unknown job");

    // Generate a basic fallback letter that we can return quickly if needed
    const today = new Date().toLocaleDateString("da-DK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    
    const fallbackContent = `${today}\n\nKære ${jobInfo.contactPerson || 'Rekrutteringsansvarlig'},\n\nJeg skriver for at ansøge om stillingen som ${jobInfo.title} hos ${jobInfo.company}.\n\nJeg mener, at mine kvalifikationer og erfaringer gør mig til et godt match for denne rolle, og jeg ser frem til muligheden for at bidrage til jeres team.\n\nMed venlig hilsen,\n\n${userInfo.name || 'Dit navn'}${userInfo.phone ? '\nTlf: ' + userInfo.phone : ''}\n${userInfo.email}${userInfo.address ? '\n' + userInfo.address : ''}`;
    
    // If no OpenAI API key is configured, return the fallback letter
    if (!openAIApiKey) {
      console.log("No OpenAI API key found, returning fallback letter");
      return new Response(JSON.stringify({ content: fallbackContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a simple letter without calling OpenAI - for testing and to ensure we always respond
    console.log("Returning fallback letter - API integration disabled for testing");
    return new Response(JSON.stringify({ content: fallbackContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

    // Note: OpenAI integration is temporarily disabled to isolate the error
    // We'll add it back once we verify the edge function is working

  } catch (error) {
    console.error('Error in generate-cover-letter function:', error);
    
    // Always return a response, even on error
    const today = new Date().toLocaleDateString("da-DK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    
    const emergencyFallback = `${today}\n\nKære Rekrutteringsansvarlig,\n\nJeg skriver for at ansøge om den annoncerede stilling i jeres virksomhed.\n\nJeg mener, at mine kvalifikationer og erfaringer gør mig til et godt match for denne rolle, og jeg ser frem til muligheden for at bidrage til jeres team.\n\nMed venlig hilsen,\n\nDit navn`;
    
    return new Response(
      JSON.stringify({ 
        content: emergencyFallback,
        error: "Der opstod en fejl under generering af ansøgningen"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper functions for text extraction
function extractTitle(text: string): string {
  const patterns = [
    /(?:stilling|job|rolle)(?:\s+som|\:)\s+["']?([^"'\n,\.]{3,50})["']?/i,
    /søger\s+(?:en\s+)?["']?([^"'\n,\.]{3,50})["']?/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return "";
}

function extractCompany(text: string): string {
  const patterns = [
    /(?:hos|ved|for|i)\s+["']?([^"'\n,\.]{2,40})(?:\s+(?:A\/S|ApS|I\/S))?["']?/i,
    /(?:virksomhed|firma)\s+["']?([^"'\n,\.]{2,40})["']?/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return "";
}

function extractContactPerson(text: string): string {
  const patterns = [
    /(?:kontakt|henvendelse til)\s+["']?([^"'\n,\.]{2,40})["']?/i,
    /(?:spørgsmål|information)(?:\s+til)?\s+["']?([^"'\n,\.]{2,40})["']?/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return "";
}

function extractUrl(text: string): string {
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?/g;
  const urls = text.match(urlPattern);
  if (urls && urls.length > 0) {
    const jobUrl = urls[0];
    if (!jobUrl.startsWith('http')) {
      return 'https://' + jobUrl;
    }
    return jobUrl;
  }
  return "";
}
