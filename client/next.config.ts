import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  api: {
    bodyParser: false,
  },
  typescript:{
    ignoreBuildErrors:true
  }
};

export default nextConfig;