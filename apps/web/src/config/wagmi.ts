import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'dshit.xyz',
  projectId: 'DSHITXYZ_PROJECT_ID',
  chains: [baseSepolia],
  ssr: true,
});

export function getConfig() {
  return config;
}
