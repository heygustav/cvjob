
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.13.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Get request body
  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error('Error parsing request body:', error);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const { userId } = body;
  if (!userId) {
    console.error('Missing userId in request body');
    return new Response(JSON.stringify({ error: 'User ID is required' }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  console.log(`Incrementing generation count for user: ${userId}`);

  // Initialize Supabase client with service role key for admin access
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // Try direct DB operation if RPC fails
    try {
      console.log('Attempting to call increment_user_generation_count RPC');
      const { error } = await supabaseAdmin.rpc(
        'increment_user_generation_count',
        { user_id: userId }
      );

      if (error) {
        console.error('Error calling RPC:', error);
        throw error;
      }
    } catch (rpcError) {
      console.error('RPC failed, falling back to direct operation:', rpcError);
      
      // Check if user has a record
      const { data: existingRecord, error: checkError } = await supabaseAdmin
        .from('user_generation_counts')
        .select('free_generations_used')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking for existing record:', checkError);
        throw checkError;
      }
      
      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabaseAdmin
          .from('user_generation_counts')
          .update({ 
            free_generations_used: existingRecord.free_generations_used + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
          
        if (updateError) {
          console.error('Error updating generation count:', updateError);
          throw updateError;
        }
      } else {
        // Create new record
        const { error: insertError } = await supabaseAdmin
          .from('user_generation_counts')
          .insert({ 
            user_id: userId, 
            free_generations_used: 1
          });
          
        if (insertError) {
          console.error('Error inserting generation count:', insertError);
          throw insertError;
        }
      }
    }

    console.log(`Successfully incremented generation count for user: ${userId}`);
    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error incrementing generation count:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
