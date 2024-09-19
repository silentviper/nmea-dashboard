/** @type {import('next').NextConfig} */

const nextConfig = {
	output: 'export',
	basePath: process.env.NODE_ENV == 'production' ? '/nmea-dashboard' : '',
	reactStrictMode: true,
	sassOptions: {},
	swcMinify: false,
	experimental: {
		appDir: true,
	},
};

export default nextConfig;
