import type { Metadata, Viewport } from 'next';
import './globals.css';
import { InstallPrompt } from '@/components/InstallPrompt';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'dshit.xyz - Meme Commerce & Community',
  description:
    'Decentralized meme commerce platform. Create, vote, and trade memes on Base L2.',
  manifest: '/manifest.json',
  keywords: [
    'meme',
    'defi',
    'cryptocurrency',
    'base',
    'web3',
    'dshit',
    'community',
  ],
  authors: [{ name: 'dshit.xyz' }],
  creator: 'dshit.xyz',
  metadataBase: new URL('https://dshitxyz.vercel.app'),
  openGraph: {
    title: 'dshit.xyz',
    description: 'Decentralized meme commerce platform',
    url: 'https://dshitxyz.vercel.app',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'dshit.xyz',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'dshit.xyz',
    description: 'Decentralized meme commerce platform',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'dshit.xyz',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#F4D03F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F4D03F" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="dshit.xyz" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
        <InstallPrompt />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

function ServiceWorkerRegistration() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(
                function(registration) {
                  console.log('SW registered:', registration);
                },
                function(err) {
                  console.log('SW registration failed:', err);
                }
              );
            });
          }
        `,
      }}
    />
  );
}
