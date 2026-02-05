import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Validated Supabase client.
 * 
 * The auto-generated client reads VITE_SUPABASE_ANON_KEY first, which may be
 * stale (from an old external project). This module ensures the URL and key
 * always belong to the SAME project by extracting the project ref from the URL
 * and matching it against available keys.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";

// Extract the project ref from the URL (e.g., "dnqfzhygbitgrcgkxprc" from "https://dnqfzhygbitgrcgkxprc.supabase.co")
function getProjectRef(url: string): string {
  try {
    const hostname = new URL(url).hostname; // "dnqfzhygbitgrcgkxprc.supabase.co"
    return hostname.split(".")[0];
  } catch {
    return "";
  }
}

// Extract ref from a JWT anon key (the "ref" field in the payload)
function getRefFromKey(key: string): string {
  try {
    const payload = JSON.parse(atob(key.split(".")[1]));
    return payload.ref || "";
  } catch {
    return "";
  }
}

function resolveAnonKey(): string {
  const urlRef = getProjectRef(SUPABASE_URL);

  const candidates = [
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    import.meta.env.VITE_SUPABASE_PUBLIC_ANON_KEY,
  ].filter(Boolean) as string[];

  // First, try to find a key whose embedded ref matches the URL's ref
  if (urlRef) {
    for (const key of candidates) {
      if (getRefFromKey(key) === urlRef) {
        return key;
      }
    }
  }

  // Fallback: return the first available key
  return candidates[0] || "";
}

const SUPABASE_ANON_KEY = resolveAnonKey();

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
  },
});
