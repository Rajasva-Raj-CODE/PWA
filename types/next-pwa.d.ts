declare module 'next-pwa' {
  import type { NextConfig } from 'next';
  type PWAOptions = {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    buildExcludes?: Array<RegExp>;
  };
  const withPWA: (config?: PWAOptions) => (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
}


