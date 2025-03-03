
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the request body
    const { userId } = await req.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Incrementing generation count for user: ${userId}`)

    // Check if user exists in user_generations
    const { data: existingData, error: fetchError } = await supabase
      .from('user_generations')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking user generation count:', fetchError)
      throw fetchError
    }

    let result

    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('user_generations')
        .update({
          count: existingData.count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()

      if (error) throw error
      result = data
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('user_generations')
        .insert({
          user_id: userId,
          count: 1
        })
        .select()

      if (error) throw error
      result = data
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Error incrementing generation count:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
