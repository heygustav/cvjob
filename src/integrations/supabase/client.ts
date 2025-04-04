
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zfyzkiseykwvpckavbxd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmeXpraXNleWt3dnBja2F2YnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NTkwNzUsImV4cCI6MjA1NjIzNTA3NX0.0rRP9DivmbBLv9f0ZM90BUy7j_LQ5dTvxY1dJ5FGWXM";

// Determine the site URL based on environment
const getSiteUrl = () => {
  // In production, use the deployed URL or a custom domain
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  // In development, use localhost with the correct port
  return 'http://localhost:3000';
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'implicit', // Use implicit flow to avoid CAPTCHA issues
      storage: localStorage
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web/2.x'
      },
    },
  }
);

// Configure redirect URL for authentication
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    console.log('Auth state changed:', event);
  }
});

// Initialize with the correct redirect URL
const redirectTo = `${getSiteUrl()}/auth/callback`;
console.log('Setting redirect URL to:', redirectTo);
