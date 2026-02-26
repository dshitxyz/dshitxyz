import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col justify-center items-center px-4">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold font-display text-shit-yellow">D-SHIT™</h1>
        <ConnectButton />
      </header>

      {/* Hero Section */}
      <section className="text-center max-w-2xl">
        <h2 className="text-6xl md:text-8xl font-bold font-display text-shit-yellow mb-4 glitch-text">
          DELIVERING HONEST FEEDBACK SINCE 2026
        </h2>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 font-body">
          Some messages deserve better delivery.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/auth/login">
            <button className="shit-button">SEND A PACKAGE</button>
          </Link>
          <Link href="/gallery">
            <button className="shit-button">VIEW GALLERY</button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 text-sm font-body">
          <div className="brutalist-border p-4">✔ Wallet Login</div>
          <div className="brutalist-border p-4">✔ Anonymous Profile</div>
          <div className="brutalist-border p-4">✔ On-Chain Signature</div>
          <div className="brutalist-border p-4">✔ Base L2 Verified</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center text-gray-500 text-sm">
        <p>Built on Base L2 • Anonymous-First • No Passwords • No BS</p>
      </footer>
    </main>
  );
}
