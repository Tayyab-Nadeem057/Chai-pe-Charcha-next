/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't let lint style-warnings fail the production build. Type checking stays on.
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Allow images served from Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};
export default nextConfig;
