import type { Metadata } from "next";
import { Bebas_Neue, Space_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-body",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-accent",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dshit.xyz - Decentralized Meme Warfare",
  description: "The protocol for meme commerce, governance, and chaos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${spaceMono.variable} ${permanentMarker.variable}`}>
      <body className="bg-bg-raw text-text-shit font-body">{children}</body>
    </html>
  );
}
