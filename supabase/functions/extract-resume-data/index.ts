
// Required for fetch in Deno
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

  console.log("Received request to extract-resume-data");

  try {
    // Check request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Only POST requests are allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the form data
    let formData;
    try {
      formData = await req.formData();
    } catch (error) {
      console.error("Error parsing form data:", error);
      return new Response(
        JSON.stringify({ error: "Invalid form data: " + error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the file from form data
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      console.error("No file in request");
      return new Response(
        JSON.stringify({ error: "No file found in the request" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`File received: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    // Extract text from the file - simple approach just reading as text
    let fileText = "";
    try {
      fileText = await file.text();
      console.log(`Extracted text length: ${fileText.length} characters`);
      
      // If extracted text is very short, this might not be proper text extraction
      if (fileText.length < 100) {
        console.warn("Extracted text is suspiciously short, might not be properly extracted");
      }
    } catch (error) {
      console.error("Error reading file:", error);
      return new Response(
        JSON.stringify({ error: "Error reading file: " + error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For debugging, log a sample of the extracted text
    console.log("Sample of extracted text:", fileText.substring(0, 200) + "...");

    if (!openAIApiKey) {
      console.error("OpenAI API key not found");
      return new Response(
        JSON.stringify({ error: "OpenAI API key is not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Calling OpenAI API...");
    
    // Create the prompt for OpenAI
    const prompt = `
    Please extract the following information from this resume/CV text:
    
    Resume text:
    ${fileText}
    
    Extract these fields in JSON format:
    - name: The person's full name
    - email: Their email address
    - phone: Their phone number
    - address: Their physical address
    - experience: Their work experience (as a formatted text with positions, companies, dates)
    - education: Their educational background (as formatted text with institutions, degrees, dates)
    - skills: Their skills and competencies (as a comma-separated list)
    
    Return ONLY a valid JSON object with these fields and nothing else.
    `;
    
    // Call OpenAI API
    let openAIResponse;
    try {
      openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that extracts structured information from resumes/CVs. Return only valid JSON."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2,
        })
      });
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return new Response(
        JSON.stringify({ error: "Failed to call OpenAI API: " + error.message }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check the response status
    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error(`OpenAI API returned status ${openAIResponse.status}:`, errorText);
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API returned error: ${openAIResponse.status}`,
          details: errorText
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the OpenAI response
    let openAIData;
    try {
      openAIData = await openAIResponse.json();
      console.log("Received response from OpenAI");
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      return new Response(
        JSON.stringify({ error: "Invalid response from OpenAI: " + error.message }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate OpenAI response structure
    if (!openAIData.choices || !openAIData.choices[0] || !openAIData.choices[0].message) {
      console.error("Invalid OpenAI response format:", openAIData);
      return new Response(
        JSON.stringify({ 
          error: "Invalid response format from OpenAI", 
          details: JSON.stringify(openAIData)
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the content from OpenAI response
    const content = openAIData.choices[0].message.content;
    console.log("OpenAI content:", content);

    // Parse the JSON from the content
    let extractedData;
    try {
      // Find JSON in the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in OpenAI response");
      }
      
      console.log("Successfully parsed extracted data:", extractedData);
    } catch (error) {
      console.error("Error parsing JSON from OpenAI response:", error);
      
      // Create a fallback object with basic structure
      extractedData = {
        name: "",
        email: "",
        phone: "",
        address: "",
        experience: "",
        education: "",
        skills: ""
      };
      
      // Try to extract data with regex
      try {
        // Helper function to extract field with regex
        const extractField = (fieldName) => {
          const regex = new RegExp(`["']?${fieldName}["']?\\s*:\\s*["']([^"']*)["']`, "i");
          const match = content.match(regex);
          return match ? match[1].trim() : "";
        };
        
        extractedData.name = extractField("name");
        extractedData.email = extractField("email");
        extractedData.phone = extractField("phone");
        extractedData.address = extractField("address");
        extractedData.experience = extractField("experience");
        extractedData.education = extractField("education");
        extractedData.skills = extractField("skills");
        
        console.log("Created fallback data with regex:", extractedData);
      } catch (regexError) {
        console.error("Error extracting data with regex:", regexError);
      }
    }

    // Return successful response with extracted data
    return new Response(
      JSON.stringify({
        success: true,
        extractedData: extractedData
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Unhandled error in extract-resume-data:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error: " + error.message,
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
