/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // pg uses native Node.js modules — keep it server-side only
  serverExternalPackages: ['pg', 'pg-native'],
  // Ensure env vars are available server-side only (not leaked to client)
  env: {},
}

module.exports = nextConfig
