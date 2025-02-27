
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
    const { jobInfo, userInfo, model = "gpt-4o" } = requestData;

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

    console.log(`Generating cover letter for ${jobInfo.title} at ${jobInfo.company} using model: ${model}`);

    // Ensure we use OpenAI for generation
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get user's locale or default to Danish
    const locale = requestData.locale || "da-DK";
    
    // Create a more detailed prompt for better cover letter generation
    const systemPrompt = `
Du er en professionel karrierevejleder, der specialiserer sig i at skrive personlige og effektive jobansøgninger på dansk.
Din opgave er at generere en overbevisende ansøgning til en ${jobInfo.title} stilling hos ${jobInfo.company} baseret på følgende information.

Følg disse retningslinjer:
1. Brug en formel men personlig tone
2. Fremhæv ansøgerens relevante erfaringer og kompetencer
3. Relatér til virksomhedens behov og jobbets krav
4. Inkluder standardoplysninger som dato, indledning, afslutning og kontaktoplysninger
5. Vær konkret omkring, hvorfor ansøgeren er et godt match til stillingen
6. Hold længden på mellem 300-500 ord
7. Vær professionel, men undgå klichéer og tom floskelsnak
8. Læg vægt på ansøgerens motivation og hvorfor netop denne virksomhed og stilling er interessant`;

    const userPrompt = `
JOBTITEL: ${jobInfo.title}
VIRKSOMHED: ${jobInfo.company}
JOBBESKRIVELSE:
${jobInfo.description}

ANSØGERS INFORMATION:
Navn: ${userInfo.name}
Email: ${userInfo.email}
Telefon: ${userInfo.phone}
Adresse: ${userInfo.address}

ERFARING:
${userInfo.experience}

UDDANNELSE:
${userInfo.education}

KOMPETENCER:
${userInfo.skills}

KONTAKTPERSON: ${jobInfo.contactPerson || 'Rekrutteringsansvarlig'}

Generer nu en komplet ansøgning på dansk til denne stilling baseret på ovenstående information.`;

    console.log("Calling OpenAI API...");

    // Call OpenAI for cover letter generation
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model, // Using the explicitly requested model (defaults to gpt-4o)
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7, // Slightly higher temperature for creativity in the cover letter
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response from OpenAI:', JSON.stringify(data));
      throw new Error('Invalid response from OpenAI');
    }

    const content = data.choices[0].message.content;
    console.log(`Generated content length: ${content.length} characters`);

    // Format today's date according to locale
    const today = new Date().toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    console.log("Cover letter generated successfully");
    
    return new Response(
      JSON.stringify({
        content: content,
        date: today
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
function handleExtractJobInfo(text) {
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

  console.log("Extraction results:", { title, company, contact_person });

  return new Response(
    JSON.stringify({
      title,
      company,
      contact_person
    }),
    { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      } 
    }
  );
}
