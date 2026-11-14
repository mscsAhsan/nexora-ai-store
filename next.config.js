/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: { serverComponentsExternalPackages: ["@libsql/client", "libsql", "bcryptjs"] },
};
