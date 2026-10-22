import type { NextConfig } from "next";

// Static export so the site can be hosted on Vercel or GitHub Pages.
// For a GitHub Pages project site, set NEXT_PUBLIC_BASE_PATH="/<repo-name>".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactCompiler: true,
};

export default nextConfig;
