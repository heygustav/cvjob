
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Set up CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple utility to extract text from PDF
// In a production app, we would integrate with a proper PDF parsing library
function extractSimpleTextFromPdf(base64Data: string): string {
  // This is a simple mock implementation - in production use a real PDF library
  // For debugging purposes, we'll just return some mock text
  // The actual implementation would use a PDF parser library
  return "This is a simple CVJob parser that extracts structured data from your PDF resume.";
}

function analyzeCV(text: string) {
  console.log("Analyzing CVJob text, length:", text.length);
  
  // Simple extraction logic - would be more sophisticated in production
  return {
    experience: "Your work experience will be extracted here.",
    education: "Your education details will be extracted here.",
    skills: "Your skills and competencies will be extracted here.",
    email: "email@example.com",
    phone: "+45 12 34 56 78",
    name: "Your Name"
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log("CVJob extraction function started");
    
    try {
      // Get the request body as JSON
      const requestData = await req.json();
      console.log("Request received, processing data");
      
      // Log some basic info about the request but not the full base64 content
      if (requestData && requestData.fileName) {
        console.log(`Processing file: ${requestData.fileName}, type: ${requestData.fileType}`);
      } else {
        console.log("Request doesn't contain expected file information");
      }

      // For debugging, return a valid response structure with mock data
      return new Response(
        JSON.stringify({
          extractedData: analyzeCV("Sample text"),
          message: "CVJob data mock processed successfully for debugging."
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
      
    } catch (jsonError) {
      console.error("Error parsing request JSON:", jsonError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON data in request" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error in function:", error);
    return new Response(
      JSON.stringify({ error: `Der opstod en uventet fejl: ${error.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
