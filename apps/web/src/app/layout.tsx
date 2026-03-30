import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '💩 PROTOCOL - Decentralized. Degenerate. Deployed.',
  description:
    'The world\'s first fully on-chain fecal finance protocol. We built a DeFi platform that doesn\'t pretend to be clean.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
