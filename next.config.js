/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "v0.blob.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "backend-project-r734.onrender.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "teal-parrot.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
    domains: ["placeholder.pics", "via.placeholder.com", "placehold.co"],
  },
  experimental: {
    // Keep optimizeCss but ensure we have the dependency
    disableOptimizedLoading: true,
    disableServerComponents: false,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Ensure output is compatible with Vercel deployment
  output: "export",
}

module.exports = nextConfig
