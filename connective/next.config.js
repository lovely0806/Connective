/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["connective-data.s3.amazonaws.com", "avatars.dicebear.com"],
  },
};

module.exports = nextConfig;
