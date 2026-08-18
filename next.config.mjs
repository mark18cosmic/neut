/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle — this is what the Docker/OrbStack image runs.
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
