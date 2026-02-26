'use client';

import { useAccount } from 'wagmi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push('/auth/login');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b-4 border-shit-yellow p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <h1 className="text-3xl font-bold font-display text-shit-yellow cursor-pointer">
              D-SHIT™
            </h1>
          </Link>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Wallet</p>
            <p className="text-shit-yellow font-mono">{address?.slice(0, 10)}...{address?.slice(-8)}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Welcome Card */}
          <div className="brutalist-border p-8">
            <h2 className="text-2xl font-display text-shit-yellow mb-4">Welcome Back</h2>
            <p className="text-gray-300 mb-6">
              You're now in the chaos. Customize your anonymous profile or start creating.
            </p>
            <Link href="/profile">
              <button className="shit-button">Edit Profile</button>
            </Link>
          </div>

          {/* Create Card */}
          <div className="brutalist-border p-8">
            <h2 className="text-2xl font-display text-shit-yellow mb-4">Create Meme</h2>
            <p className="text-gray-300 mb-6">
              Make something ridiculous. Share it. Earn on-chain rewards.
            </p>
            <button className="shit-button opacity-50 cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mt-12 brutalist-border p-6 bg-gray-900">
          <h3 className="text-xl font-display text-shit-yellow mb-4">Status</h3>
          <div className="space-y-2 text-gray-300 font-body">
            <p>✓ Wallet Connected: {address}</p>
            <p>✓ Signature Verified</p>
            <p>✓ Profile Created</p>
            <p>○ Email Verified (Optional)</p>
          </div>
        </div>
      </div>
    </main>
  );
}
