/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "oaidalleapiprodscus.blob.core.windows.net",
      "creative-image-generator.s3.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
