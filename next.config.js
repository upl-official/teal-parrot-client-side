/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "v0.blob.com",
      "images.unsplash.com",
      "plus.unsplash.com",
      "backend-project-r734.onrender.com",
      "localhost",
    ],
    remotePatterns: [
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
    ],
  },
  experimental: {
    // Keep optimizeCss but ensure we have the dependency
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
}

module.exports = nextConfig
