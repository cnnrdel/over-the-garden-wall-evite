import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow loading the dev server from other devices on the LAN (e.g. testing on a phone)
  allowedDevOrigins: ["10.0.0.203"],
};

export default nextConfig;
