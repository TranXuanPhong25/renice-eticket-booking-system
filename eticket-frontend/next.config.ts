import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@ant-design/v5-patch-for-react-19'],
};

export default nextConfig;
