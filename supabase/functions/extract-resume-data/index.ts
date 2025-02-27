
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
    // Get the OpenAI API key from environment variables
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      console.error("OPENAI_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Read the FormData from the request
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: "No file provided or invalid file format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
      return new Response(
        JSON.stringify({ error: "Only PDF files are supported" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Processing PDF file:", file.name, "Size:", file.size);

    // Extract text sample for debugging
    const sampleBytes = new Uint8Array(await file.slice(0, 100).arrayBuffer());
    const sampleText = Array.from(sampleBytes)
      .map((byte) => String.fromCharCode(byte))
      .join("");
    console.log("Sample of extracted text:", sampleText);

    // Mock response for testing - return some basic extracted data
    // This will help determine if the issue is with the OpenAI API or elsewhere
    const mockExtractedData = {
      name: "Test Navn",
      email: "test@example.com",
      experience: "Erfaring med softwareudvikling og projektledelse.",
      education: "Bachelor i datalogi",
      skills: "Programmering, analyse, kommunikation"
    };

    return new Response(
      JSON.stringify({
        extractedData: mockExtractedData,
        message: "Resume data extracted successfully (test mode)",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred: " + error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
