import { baseSepolia } from 'wagmi/chains';

let cachedConfig: any = null;

export function getConfig() {
  // Only initialize wagmi on the client side
  if (typeof window === 'undefined') {
    return null;
  }

  if (!cachedConfig) {
    const { getDefaultConfig } = require('@rainbow-me/rainbowkit');
    cachedConfig = getDefaultConfig({
      appName: 'dshit.xyz',
      projectId: 'DSHITXYZ_PROJECT_ID',
      chains: [baseSepolia],
      ssr: false,
    });
  }

  return cachedConfig;
}
