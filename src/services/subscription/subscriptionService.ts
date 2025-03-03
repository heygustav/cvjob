
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
    // Use a direct query instead of rpc since the rpc is not in the TypeScript types
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code)
      .lte('valid_from', new Date().toISOString())
      .gte('valid_until', new Date().toISOString())
      .maybeSingle();
    
    if (error) {
      console.error('Error validating promo code:', error);
      return { 
        isValid: false, 
        message: 'Der opstod en fejl ved validering af kampagnekoden' 
      };
    }
    
    if (data) {
      // Check if max_uses is defined and if current uses has exceeded it
      if (data.max_uses !== null && data.current_uses >= data.max_uses) {
        return {
          isValid: false,
          message: 'Kampagnekoden er blevet anvendt for mange gange'
        };
      }
      
      return {
        isValid: true,
        discountPercent: data.discount_percent
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
