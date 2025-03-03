
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionStatus, CheckoutOptions, PromoCodeValidation } from "./types";

// Check if a user can generate a cover letter
export const checkSubscriptionStatus = async (userId: string): Promise<SubscriptionStatus> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-subscription', {
      body: { userId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    throw error;
  }
}

// Create a checkout session for subscription
export const createCheckoutSession = async (options: CheckoutOptions): Promise<{ url: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: options
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Increment user's generation count
export const incrementGenerationCount = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase.functions.invoke('increment-generation-count', {
      body: { userId }
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing generation count:', error);
    throw error;
  }
}

// Validate a promo code
export const validatePromoCode = async (code: string): Promise<PromoCodeValidation> => {
  try {
    // Since we don't have the promo_codes table yet, we'll return a mock response
    // This will be replaced with actual implementation once the SQL is run
    console.log('Validating promo code:', code);
    
    // Mock implementation until table is created
    if (code === 'WELCOME10') {
      return { 
        isValid: true,
        discountPercent: 10
      };
    } else if (code === 'SUMMER20') {
      return { 
        isValid: true,
        discountPercent: 20
      };
    }
    
    return { 
      isValid: false, 
      message: 'Ugyldig kampagnekode' 
    };
  } catch (error) {
    console.error('Error validating promo code:', error);
    return { 
      isValid: false, 
      message: 'Der opstod en fejl ved validering af kampagnekoden' 
    };
  }
}
