/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pg', 'pg-native'],
  env: {},
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
        destination: 'https://www.plumajoinery.com/:path*',
        permanent: true,
      },
    ]
  },
}
module.exports = nextConfig
