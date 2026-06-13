import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side client (Server Components, Server Actions, Route Handlers).
// Reads/writes the auth session from secure httpOnly cookies.
export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component (read-only cookies) — safe to ignore;
            // the middleware refreshes the session.
          }
        },
      },
    },
  );
}
