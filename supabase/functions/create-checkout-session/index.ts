
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get request payload
    const { userId, returnUrl, cancelUrl, paymentMethod, promoCode } = await req.json()

    if (!userId || !returnUrl || !cancelUrl || !paymentMethod) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Creating checkout session for user: ${userId}, payment method: ${paymentMethod}`)

    // For now, we'll mock the return URL since we don't have real Stripe integration yet
    const checkoutUrl = promoCode 
      ? `${returnUrl}?promo=${promoCode}&payment=${paymentMethod}` 
      : `${returnUrl}?payment=${paymentMethod}`

    return new Response(JSON.stringify({ url: checkoutUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
