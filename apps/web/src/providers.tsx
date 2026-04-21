import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const ProvidersClient = dynamic(
  () => import('./providers-client').then(mod => mod.ProvidersClient),
  { ssr: false }
);

export function Providers({ children }: { children: ReactNode }) {
  return <ProvidersClient>{children}</ProvidersClient>;
}
