
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import Stripe from 'https://esm.sh/stripe@12.6.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { userId, promoCode, returnUrl, cancelUrl, paymentMethod } = await req.json()
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify user exists
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId)
    if (authError || !authUser.user) {
      return new Response(JSON.stringify({ error: 'Invalid user' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Set default price
    let unitAmount = 9900 // 99 DKK in øre
    let discountPercent = 0
    
    // Check if promo code is valid
    if (promoCode) {
      const { data: promoData, error: promoError } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode)
        .single()
      
      if (!promoError && promoData) {
        // Validate promo code
        const now = new Date()
        const isValid = 
          (!promoData.valid_until || new Date(promoData.valid_until) > now) &&
          (!promoData.max_uses || promoData.current_uses < promoData.max_uses)
        
        if (isValid) {
          discountPercent = promoData.discount_percent
          
          // Apply discount
          if (promoData.discount_percent > 0) {
            unitAmount = Math.round(unitAmount * (1 - (promoData.discount_percent / 100)))
          }
          
          if (promoData.discount_amount > 0) {
            unitAmount = Math.max(0, unitAmount - (promoData.discount_amount * 100))
          }
          
          // Update promo code usage
          await supabase
            .from('promo_codes')
            .update({ 
              current_uses: promoData.current_uses + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', promoData.id)
        }
      }
    }
    
    let session
    
    if (paymentMethod === 'mobilepay') {
      // For MobilePay, we'll create a custom checkout with different payment methods
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'customer_balance'],
        line_items: [
          {
            price_data: {
              currency: 'dkk',
              product_data: {
                name: 'Ubegrænset ansøgninger',
                description: 'Månedligt abonnement på 99 DKK',
              },
              unit_amount: unitAmount,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        client_reference_id: userId,
        customer_email: authUser.user.email,
        mode: 'subscription',
        success_url: `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        payment_method_options: {
          customer_balance: {
            funding_type: 'bank_transfer',
            bank_transfer: {
              type: 'eu_bank_transfer',
            },
          },
        },
        custom_text: {
          submit: {
            message: 'Vi vil guide dig gennem betalingsprocessen',
          },
        },
        // Add metadata about discount if applicable
        ...(discountPercent > 0 && {
          metadata: {
            promo_code: promoCode,
            discount_percent: discountPercent.toString(),
          }
        })
      })
    } else {
      // Default to Stripe
      session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'dkk',
              product_data: {
                name: 'Ubegrænset ansøgninger',
                description: 'Månedligt abonnement på 99 DKK',
              },
              unit_amount: unitAmount,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        client_reference_id: userId,
        customer_email: authUser.user.email,
        mode: 'subscription',
        success_url: `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        // Add metadata about discount if applicable
        ...(discountPercent > 0 && {
          metadata: {
            promo_code: promoCode,
            discount_percent: discountPercent.toString(),
          }
        })
      })
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
