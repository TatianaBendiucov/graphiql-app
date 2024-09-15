import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@codemirror/state'] = path.resolve('./node_modules/@codemirror/state');
    return config;
  },
};

export default nextConfig;