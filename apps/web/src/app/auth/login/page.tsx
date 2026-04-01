'use client';

import { WalletLoginForm } from '@/components/auth/WalletLoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Login Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-display text-gray-200">ENTER THE CHAOS</h2>
          </div>

          {/* Login Card */}
          <div className="brutalist-border p-8 mb-6">
            <WalletLoginForm />
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 text-sm font-body">
            <p>By connecting, you agree to our</p>
            <p className="text-gray-500">
              No wallet? No problem. We verify everything on-chain.
            </p>
          </div>
        </div>
      </main>
  );
}
