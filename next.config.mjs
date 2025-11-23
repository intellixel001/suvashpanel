/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL: "https://suvashedu.com/api",
    // NEXT_PUBLIC_API_BASE_URL: "http://localhost:8000/api",
    NEXT_PUBLIC_API_BASE_URL_SOCKET: "https://suvashedu.com",
    // NEXT_PUBLIC_API_BASE_URL_SOCKET: "http://localhost:8000",
    // NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
  },
  images: {
    domains: [],
  },
};

export default nextConfig;
