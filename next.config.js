/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "/main/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
