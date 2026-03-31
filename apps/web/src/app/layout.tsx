import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'dshit.xyz',
  description: 'Decentralized meme platform powered by DSHIT token',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
