/** @type {import('next').NextConfig} */
const nextConfig = {
  // Autorise les images locales /public
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
    ],
  },
  // Désactive les suggestions ESLint qui bloquent le build
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
