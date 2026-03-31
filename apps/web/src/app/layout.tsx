import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'dshit.xyz - Satirical Meme Coin Protocol',
  description: 'The ultimate decentralized meme warfare platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
