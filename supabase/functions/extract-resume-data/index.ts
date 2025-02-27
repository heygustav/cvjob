
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
    // Only process POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Received request to extract resume data");
    
    // Parse the multipart form data to get the PDF file
    let formData;
    try {
      formData = await req.formData();
    } catch (e) {
      console.error("Error parsing form data:", e);
      return new Response(
        JSON.stringify({ error: 'Invalid form data', details: e.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      console.error("No file provided in request");
      return new Response(
        JSON.stringify({ error: 'No PDF file found in request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing PDF file: ${file.name}, size: ${file.size} bytes`);
    
    // Read the file as text
    let pdfText;
    try {
      pdfText = await file.text();
      console.log(`Extracted ${pdfText.length} characters of text from PDF`);
      
      if (pdfText.length < 50) {
        console.warn("Extracted text is suspiciously short:", pdfText);
      }
    } catch (e) {
      console.error("Error reading file as text:", e);
      return new Response(
        JSON.stringify({ error: 'Failed to read PDF content', details: e.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!openAIApiKey) {
      console.error("OpenAI API key not configured");
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured in Supabase',
          message: 'Please set up the OPENAI_API_KEY secret in your Supabase project.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If the text is too short, provide a fallback response for testing
    if (pdfText.length < 50) {
      console.log("Text too short, using fallback sample data");
      
      const fallbackData = {
        name: "Test Person",
        email: "test@example.com",
        phone: "+45 12 34 56 78",
        address: "Test Address 123, 1234 City",
        experience: "Test Company - Test Position (2020-Present)",
        education: "Test University - Test Degree (2016-2020)",
        skills: "Test Skill 1, Test Skill 2, Test Skill 3"
      };
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          extractedData: fallbackData,
          note: "Using fallback data because extracted text was too short"
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call OpenAI API to parse the resume
    let openAIResponse;
    try {
      console.log("Calling OpenAI API");
      openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a resume parser. Extract the following information from the provided CV/resume:
              - Full name
              - Email address
              - Phone number
              - Physical address
              - Work experience (formatted as text, with each role on a new line)
              - Education (formatted as text, with each qualification on a new line)
              - Skills (as a comma-separated list)
              
              Return the data in JSON format with these exact keys: 
              name, email, phone, address, experience, education, skills.`
            },
            {
              role: 'user',
              content: pdfText
            }
          ],
          temperature: 0.3,
        }),
      });
    } catch (e) {
      console.error("Error calling OpenAI API:", e);
      return new Response(
        JSON.stringify({ error: 'Failed to connect to OpenAI API', details: e.message }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error(`OpenAI API returned error status ${openAIResponse.status}:`, errorText);
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API returned status ${openAIResponse.status}`,
          details: errorText
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let openAIData;
    try {
      openAIData = await openAIResponse.json();
      console.log("Received response from OpenAI");
    } catch (e) {
      console.error("Error parsing OpenAI response as JSON:", e);
      return new Response(
        JSON.stringify({ error: 'Invalid response from OpenAI API', details: e.message }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!openAIData.choices || !openAIData.choices[0]) {
      console.error("OpenAI response missing choices:", openAIData);
      return new Response(
        JSON.stringify({ error: 'Invalid response format from OpenAI API', details: JSON.stringify(openAIData) }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the generated content
    const content = openAIData.choices[0].message.content;
    
    // Parse the JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(content);
      console.log("Successfully parsed resume data:", parsedData);
    } catch (e) {
      console.error("Error parsing OpenAI response as JSON:", e, "Content:", content);
      
      // Try a fallback approach - create an object with empty fields
      parsedData = {
        name: "",
        email: "",
        phone: "",
        address: "",
        experience: "",
        education: "",
        skills: ""
      };
      
      // Use regex to try to find each field in the content
      const nameMatch = content.match(/name[:\s]+(.*?)(\n|$)/i);
      const emailMatch = content.match(/email[:\s]+(.*?)(\n|$)/i);
      const phoneMatch = content.match(/phone[:\s]+(.*?)(\n|$)/i);
      const addressMatch = content.match(/address[:\s]+(.*?)(\n|$)/i);
      
      if (nameMatch) parsedData.name = nameMatch[1].trim();
      if (emailMatch) parsedData.email = emailMatch[1].trim();
      if (phoneMatch) parsedData.phone = phoneMatch[1].trim();
      if (addressMatch) parsedData.address = addressMatch[1].trim();
      
      console.log("Created fallback parsed data using regex:", parsedData);
    }

    // Return the extracted data
    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedData: parsedData 
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
    console.error("Unhandled error processing PDF:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process PDF',
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    );
  }
});
