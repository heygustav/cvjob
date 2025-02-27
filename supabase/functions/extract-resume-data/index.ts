
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

      // Check if we have an OpenAI API key
      const apiKey = Deno.env.get("OPENAI_API_KEY");
      if (!apiKey) {
        console.error("Missing OpenAI API key in environment variables");
        return new Response(
          JSON.stringify({ error: "Server configuration error: Missing API key" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Read the file as a buffer
      const fileBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(fileBuffer);
      
      // Convert to base64
      const base64 = btoa(String.fromCharCode(...pdfBytes));
      
      console.log("PDF converted to base64, length:", base64.length);
      
      // Use a simpler prompt with the GPT-4o-mini model
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are an AI assistant that extracts information from resumes. Extract the following fields when present: experience, education, skills. Return only a JSON object."
              },
              {
                role: "user",
                content: [
                  { 
                    type: "text", 
                    text: "Here is a resume in PDF format. Extract the experience, education, and skills information from it. Return the data in JSON format with these fields." 
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:application/pdf;base64,${base64}`
                    }
                  }
                ]
              }
            ],
            max_tokens: 800
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("OpenAI API error:", errorText);
          throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("OpenAI API response received");

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error("Unexpected API response format");
        }

        const content = data.choices[0].message.content;
        console.log("Response content:", content);

        // Extract JSON from the content
        try {
          // Try to find JSON in the content using regex
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          let extractedData;
          
          if (jsonMatch) {
            extractedData = JSON.parse(jsonMatch[0]);
          } else {
            // If no JSON object is found, create a simple object with the content
            extractedData = {
              experience: content.includes("experience") ? content : "",
              education: content.includes("education") ? content : "",
              skills: content.includes("skills") ? content : ""
            };
          }

          return new Response(
            JSON.stringify({
              extractedData,
              message: "Resume data extracted successfully"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          throw new Error("Could not parse the extracted data");
        }
      } catch (openaiError) {
        console.error("OpenAI processing error:", openaiError);
        return new Response(
          JSON.stringify({ error: `Error analyzing PDF: ${openaiError.message}` }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
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
