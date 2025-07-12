/** @type {import('next').NextConfig} */

const backEnd = new URL(process.env.NEXT_PUBLIC_API_URL);
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: backEnd.hostname,
        pathname: "/uploads/*",
      },
    ],
  },
};

export default nextConfig;
