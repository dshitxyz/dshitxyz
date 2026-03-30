'use client';

import Link from 'next/link';

export default function DashboardPage() {
  // Phase 0: Placeholder
  // Phase 2: Full wallet integration and dashboard
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b-4 border-yellow-400 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <h1 className="text-3xl font-bold text-yellow-400 cursor-pointer">
              D-SHIT™
            </h1>
          </Link>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Dashboard</p>
            <p className="text-yellow-400">Phase 0 Scaffold</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="rounded border-4 border-yellow-400 p-8 bg-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Dashboard Coming in Phase 2</h2>
          <p className="text-gray-300 mb-6">
            Wallet integration and dashboard features will be available in Phase 2 (Frontend).
          </p>
          <p className="text-gray-400 text-sm">
            Phase 0 focuses on infrastructure: monorepo setup, CI/CD, tooling, and foundational scaffolding.
          </p>
        </div>
      </div>
    </main>
  );
}
