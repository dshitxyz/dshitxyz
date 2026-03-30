'use client';

import Link from 'next/link';

export default function GalleryPage() {
  // Phase 0: Placeholder
  // Phase 2: Meme gallery with wallet integration
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b-4 border-yellow-400 p-6 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-3xl font-bold text-yellow-400 cursor-pointer">
            D-SHIT™
          </h1>
        </Link>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-4xl font-bold text-yellow-400 mb-12">MEME GALLERY</h2>

        <div className="rounded border-4 border-yellow-400 p-8 bg-gray-800">
          <p className="text-gray-300 mb-4">Gallery features coming in Phase 2 (Frontend & Memes).</p>
          <p className="text-gray-400 text-sm">
            Phase 0 focuses on: Monorepo setup, CI/CD pipelines, code quality tools, and foundational scaffolding.
          </p>
        </div>
      </div>
    </main>
  );
}
