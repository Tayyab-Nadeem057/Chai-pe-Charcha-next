/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't let lint style-warnings fail the production build. Type checking stays on.
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Allow images served from Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  async headers() {
    const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isDev = process.env.NODE_ENV !== "production";
    // Content Security Policy — restricts where scripts, styles, images and
    // network calls may come from. Dev mode needs 'unsafe-eval' (hot reload);
    // production stays strict. 'unsafe-inline' is needed for Next.js hydration.
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co",
      "font-src 'self' data:",
      `connect-src 'self' ${supabase} https://*.supabase.co`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};
export default nextConfig;
