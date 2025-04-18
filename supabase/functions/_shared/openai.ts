import { corsHeaders } from "./cors.ts";

/**
 * Calls the OpenAI API to generate content with the provided prompts
 */
export async function callOpenAI(systemPrompt: string, userPrompt: string) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.error('OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }

  console.log('Calling OpenAI API with model: gpt-4.1-nano');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "gpt-4.1-nano",
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error('Invalid response from OpenAI:', JSON.stringify(data));
    throw new Error('Invalid response from OpenAI');
  }

  return data.choices[0].message.content;
}

/**
 * Creates an error response with CORS headers
 */
export function createErrorResponse(error: Error, status = 500) {
  console.error('Error in function:', error);
  return new Response(
    JSON.stringify({ 
      error: error.message,
      details: 'An unexpected error occurred'
    }),
    { 
      status: status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    }
  );
}
