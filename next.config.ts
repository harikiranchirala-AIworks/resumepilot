import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@cursor/sdk", "unpdf", "pdf-parse-fork", "mammoth"],
  transpilePackages: ["latex.js"],
};

export default nextConfig;
