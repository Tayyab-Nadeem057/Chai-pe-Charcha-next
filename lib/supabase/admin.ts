import "server-only";
import { createClient } from "@supabase/supabase-js";

// SERVICE-ROLE client — bypasses RLS. NEVER import this in a Client Component.
// The `server-only` import above makes the build fail if it's ever used on the client.
// Use sparingly: storage uploads, trusted admin operations.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
