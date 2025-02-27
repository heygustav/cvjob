
import "https://deno.land/x/xhr@0.1.0/mod.ts"; // Required for OpenAI API
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
    // Only process POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Received request to extract resume data");
    
    // Parse the multipart form data to get the PDF file
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'No PDF file found in request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing PDF file: ${file.name}, size: ${file.size} bytes`);
    
    // Convert the file to base64
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const base64 = btoa(String.fromCharCode(...bytes));
    
    console.log("File converted to base64");

    // Create a sample response with extracted data
    // In production, this would call OpenAI's API to analyze the PDF content
    const sampleExtractedData = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+45 11 22 33 44",
      address: "Norregade 45, 2100 Copenhagen",
      experience: "Senior Developer at ABC Company (2018-Present)\nBackend Developer at XYZ Corp (2015-2018)",
      education: "MSc Computer Science, University of Copenhagen, 2015\nBSc Software Engineering, Technical University of Denmark, 2013",
      skills: "React, Node.js, TypeScript, Python, AWS, Docker, Kubernetes, CI/CD, Agile"
    };

    // Return the extracted data
    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedData: sampleExtractedData 
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error("Error processing PDF:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process PDF' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
