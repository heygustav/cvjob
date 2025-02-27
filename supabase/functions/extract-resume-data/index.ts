
// Follow this Deno deployment checklist: https://deno.com/deploy/docs/deployctl
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Set up CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log("Resume extraction function called");
    
    // Get the PDF file from the request
    try {
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file || !(file instanceof File)) {
        console.error("No file provided or invalid file");
        return new Response(
          JSON.stringify({ error: "No valid file provided" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Processing file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

      // For now, return some dummy data to test the connection
      // In a real implementation, we'd extract text from the PDF and analyze it
      const mockExtractedData = {
        email: "example@email.com",
        experience: "Over 5 years of experience in software development with focus on frontend technologies.",
        education: "Bachelor's degree in Computer Science from University of Copenhagen, 2018.",
        skills: "JavaScript, TypeScript, React, Node.js, HTML/CSS, UI/UX Design, Project Management",
      };

      console.log("Returning mock extracted data for testing");
      
      return new Response(
        JSON.stringify({
          extractedData: mockExtractedData,
          message: "Resume data extracted successfully (test data)",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (formError) {
      console.error("Error processing form data:", formError);
      return new Response(
        JSON.stringify({ error: "Error processing file upload: " + formError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred: " + error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
