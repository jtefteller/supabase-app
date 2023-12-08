/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
	images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
