// src/config/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Missing Supabase environment variables");
  console.error(
    "Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file"
  );
  throw new Error(
    "Missing Supabase environment variables. Check your .env file."
  );
}

// ✅ Single global client with auto session management
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Saves the session in localStorage
    autoRefreshToken: true, // Automatically refreshes expired access tokens
    detectSessionInUrl: true, // Handles OAuth redirect tokens
  },
});

console.log("✅ Supabase client initialized with session persistence");
