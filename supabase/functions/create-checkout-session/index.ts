
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.13.1'
import Stripe from 'https://esm.sh/stripe@12.7.0?target=deno'

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
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const { userId, returnUrl, cancelUrl, paymentMethod, promoCode } = body;
  
  if (!userId || !returnUrl || !cancelUrl || !paymentMethod) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Initialize Supabase client with service role key for admin access
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Initialize Stripe
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2023-10-16',
  });

  try {
    // Get user details
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError || !userData.user) {
      console.error('Error fetching user:', userError);
      throw new Error('User not found');
    }

    const userEmail = userData.user.email;
    
    // Get subscription plan
    const { data: planData, error: planError } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('active', true)
      .single();
    
    if (planError || !planData) {
      console.error('Error fetching plan:', planError);
      throw new Error('Subscription plan not found');
    }

    // Apply promo code discount if available
    let discountAmount = 0;
    if (promoCode) {
      const { data: promoData, error: promoError } = await supabaseAdmin.rpc(
        'validate_promo_code',
        { code_to_validate: promoCode }
      );

      if (promoError) {
        console.error('Error validating promo code:', promoError);
      } else if (promoData && promoData.length > 0 && promoData[0].is_valid) {
        const promo = promoData[0];
        if (promo.discount_percent > 0) {
          discountAmount = Math.round((planData.amount * promo.discount_percent) / 100);
        } else {
          discountAmount = promo.discount_amount;
        }
      }
    }

    // Find or create Stripe customer
    let customerId;
    
    const { data: customerData, error: customerError } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (customerError) {
      console.error('Error fetching customer:', customerError);
    }

    if (customerData?.stripe_customer_id) {
      customerId = customerData.stripe_customer_id;
    } else {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          user_id: userId
        }
      });
      customerId = customer.id;
    }

    // Determine payment method settings
    const payment_method_types = paymentMethod === 'mobilepay' 
      ? ['mobilepay']
      : ['card'];

    // Create price for session - this allows for applying discounts
    const unitAmount = Math.max(0, planData.amount - discountAmount);
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: planData.currency.toLowerCase(),
            product_data: {
              name: planData.name,
              description: planData.description,
            },
            unit_amount: unitAmount * 100, // Convert to cents
            recurring: {
              interval: planData.interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: returnUrl,
      cancel_url: cancelUrl,
      payment_method_types,
      metadata: {
        user_id: userId,
        promo_code: promoCode || null,
      },
    });

    // If using promo code, increment its usage
    if (promoCode && session) {
      await supabaseAdmin.rpc('increment_promo_code_usage', { 
        code_to_increment: promoCode 
      });
    }

    // Return checkout URL
    return new Response(JSON.stringify({ url: session.url }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
