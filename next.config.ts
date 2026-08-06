import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/questionarios/farmacia",
        destination: "https://forms.gle/mxBAdMZnVALTVk6D7",
        permanent: false,
      },
      {
        source: "/:lang(pt|en)/questionarios/farmacia",
        destination: "https://forms.gle/mxBAdMZnVALTVk6D7",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

