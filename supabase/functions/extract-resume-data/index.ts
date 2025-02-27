
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

      // For now, simply return some sample data to test the connection
      // This demonstrates that the function can receive the file and return a response
      const sampleExtractedData = {
        education: "Dette er et eksempel på uddannelsesinformation der blev fundet i CV'et.",
        experience: "Dette er et eksempel på erhvervserfaring der blev fundet i CV'et.",
        skills: "Dette er et eksempel på kompetencer der blev fundet i CV'et."
      };

      return new Response(
        JSON.stringify({
          extractedData: sampleExtractedData,
          message: "Resume data extracted successfully"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (formError) {
      console.error("Error processing form data:", formError);
      return new Response(
        JSON.stringify({ error: `Error processing file upload: ${formError.message}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error in function:", error);
    return new Response(
      JSON.stringify({ error: `An unexpected error occurred: ${error.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
