/** @type {import('next').NextConfig} */

const nextConfig = {
	basePath: process.env.NODE_ENV == 'production' ? '/nmea-dashboard' : '',
	reactStrictMode: true,
	sassOptions: {},
	swcMinify: false,
	experimental: {
		appDir: true,
	},
	webpack: (config, options) => {
		config.module.rules.push({
			test: /plugins\/.*\.ts?|plugins\/.*\.tsx?/,
			use: [options.defaultLoaders.babel],
		});

		return config;
	},
};

export default nextConfig;
