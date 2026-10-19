import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old page URLs from before the sidebar was regrouped (2026-10), kept so
  // bookmarks and links in Telegram reports still land somewhere. API routes
  // (/api/tools/...) did not move and aren't affected.
  async redirects() {
    return [
      { source: "/sales/:path*", destination: "/dashboard/:path*", permanent: false },
      { source: "/automations/:path*", destination: "/market-ops/automations/:path*", permanent: false },
      { source: "/tools/:path*", destination: "/market-ops/automations/:path*", permanent: false },
      { source: "/configuration/:path*", destination: "/market-ops/:path*", permanent: false },
      { source: "/communications/:path*", destination: "/others/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
