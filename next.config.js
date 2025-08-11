/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const isDev = false;

const env = {
  IS_DEV: isDev ? 'true' : 'false',
};

module.exports = {
  nextConfig,
  env,
};
