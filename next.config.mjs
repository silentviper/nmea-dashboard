/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: process.env == 'production' ? '/nmea-dashboard' : '',
    reactStrictMode: true,
    sassOptions: {
    },
};

export default nextConfig;
