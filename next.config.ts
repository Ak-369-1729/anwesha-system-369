import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  // Bound export concurrency for Windows file systems and small CI runners.
  experimental: {
    cpus: 2,
    staticGenerationMaxConcurrency: 1,
    staticGenerationRetryCount: 2,
  },
};
export default config;
