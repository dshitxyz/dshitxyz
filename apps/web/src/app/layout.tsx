import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSHIT.XYZ - Decentralized Meme Protocol",
  description: "The protocol for meme culture and decentralized rewards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
