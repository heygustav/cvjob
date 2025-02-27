
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log("Function started");
    const { jobDescription } = await req.json();
    console.log(`Received job description (${jobDescription?.length || 0} chars)`);

    if (!jobDescription) {
      return new Response(JSON.stringify({ error: 'Missing job description' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error("OpenAI API key not found");
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use a more detailed system prompt to improve extraction
    const systemPrompt = `
Du er en AI-assistent, der er ekspert i at analysere danske jobopslag.
Din opgave er at finde og udtrække følgende information fra jobopslaget:

1. Jobtitlen (title): Den specifikke titel på stillingen, f.eks. "Digital Marketing Manager", "Frontend Udvikler", osv.
2. Virksomhedens navn (company): Navnet på den virksomhed, der annoncerer jobbet.
3. Kontaktperson (contact_person): Navn på den person, der er angivet som kontaktperson (hvis tilgængelig).
4. URL (url): Enhver webadresse eller link der er nævnt i forbindelse med jobbet eller ansøgningsprocessen.`;

    // Call OpenAI API to extract job information
    console.log("Calling OpenAI API");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',  // Updated to newer model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this job posting and extract the title, company, contact person, and URL. Return only a JSON object with keys: title, company, contact_person, and url. If any information is missing, use an empty string.\n\n${jobDescription}` }
        ],
        temperature: 0.1 // Lower temperature for more focused extraction
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`OpenAI API error: ${response.status}`, errorData);
      return new Response(JSON.stringify({ 
        error: `OpenAI API error: ${response.status}`,
        details: errorData
      }), {
        status: 200, // Return 200 even on API error to prevent client-side errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log("Received response from OpenAI");
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid OpenAI response format:", JSON.stringify(data));
      return new Response(JSON.stringify({ 
        title: "",
        company: "",
        contact_person: "",
        url: ""
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const content = data.choices[0].message.content;
    let extractedData;
    
    try {
      // Try to extract JSON from the response, which might be in a code block
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                      content.match(/{[\s\S]*}/);
                      
      const jsonString = jsonMatch ? jsonMatch[0].replace(/```json|```/g, '') : content;
      extractedData = JSON.parse(jsonString);
      console.log("Successfully parsed OpenAI response:", JSON.stringify(extractedData));
    } catch (e) {
      console.error("Failed to parse OpenAI response as JSON:", content);
      // Instead of failing, try to extract with regex
      const title = content.match(/title["\s:]+([^"}\n,]+)/i)?.[1] || "";
      const company = content.match(/company["\s:]+([^"}\n,]+)/i)?.[1] || "";
      const contact = content.match(/contact_person["\s:]+([^"}\n,]+)/i)?.[1] || "";
      const url = content.match(/url["\s:]+([^"}\n,]+)/i)?.[1] || "";
      
      extractedData = {
        title: title.trim(),
        company: company.trim(),
        contact_person: contact.trim(),
        url: url.trim()
      };
    }

    // Make sure each expected field exists
    const result = {
      title: extractedData.title || "",
      company: extractedData.company || "",
      contact_person: extractedData.contact_person || "",
      url: extractedData.url || ""
    };

    console.log("Returning extracted data:", JSON.stringify(result));
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Function error:", error);
    // Always return a 200 response to avoid client-side errors
    return new Response(JSON.stringify({ 
      title: "",
      company: "",
      contact_person: "",
      url: ""
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
