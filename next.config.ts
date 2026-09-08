import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.2"],
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
