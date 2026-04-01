'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b-4 border-shit-yellow p-6 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-3xl font-bold font-display text-shit-yellow cursor-pointer">
            D-SHIT™
          </h1>
        </Link>
        <ConnectButton />
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-4xl font-display text-shit-yellow mb-12">MEME GALLERY</h2>

        <div className="text-center text-gray-400 py-24">
          <p className="text-xl font-body">Gallery coming soon...</p>
          <p className="text-sm text-gray-500 mt-4">Be the first to submit your masterpiece.</p>
        </div>

        <div className="text-center mt-12">
          <Link href="/auth/login">
            <button className="shit-button">Start Creating</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
