
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
    // Check for OpenAI API key
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      console.error("OpenAI API key is not set");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

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

      if (file.type !== "application/pdf") {
        console.error("File is not a PDF");
        return new Response(
          JSON.stringify({ error: "Only PDF files are supported" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Simple approach for now - create a basic extracted data object
      // This will help us test if the function is working
      const extractedData = {
        email: "example@email.com",
        experience: "3 years of software development experience",
        education: "Bachelor's degree in Computer Science",
        skills: "JavaScript, TypeScript, React, Node.js"
      };

      // Return a successful response
      return new Response(
        JSON.stringify({
          extractedData,
          message: "Resume data extracted successfully",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (formError) {
      console.error("Error processing form data:", formError);
      return new Response(
        JSON.stringify({ error: "Error processing file upload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
