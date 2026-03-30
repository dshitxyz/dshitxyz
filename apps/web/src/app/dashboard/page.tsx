'use client';

import { useAccount } from 'wagmi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardStats } from '@/components/DashboardStats';
import { DashboardDrops } from '@/components/DashboardDrops';
import { FlushMeter } from '@/components/FlushMeter';
import { Newsletter } from '@/components/Newsletter';

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
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <h1 className="text-3xl font-bold font-display text-shit-yellow cursor-pointer">
              D-SHIT™
            </h1>
          </Link>
          <div className="text-right hidden sm:block">
            <p className="text-gray-400 text-sm">Wallet</p>
            <p className="text-shit-yellow font-mono text-sm">
              {address?.slice(0, 10)}...{address?.slice(-8)}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Dashboard Stats Section */}
        <DashboardStats />

        {/* Fresh Drops Section */}
        <DashboardDrops />

        {/* Flush Meter Section */}
        <FlushMeter />

        {/* Newsletter Section */}
        <Newsletter />

        {/* User Status Card */}
        <section className="mb-12">
          <div className="brutalist-border p-6 md:p-8 bg-gray-900">
            <h3 className="text-xl font-display text-shit-yellow mb-6 font-bold">YOUR STATUS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300 font-body">
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <span className="text-toxic-green font-bold">✓</span>
                  <span>Wallet Connected</span>
                </p>
                <p className="text-xs text-gray-500 ml-6">{address}</p>
              </div>
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <span className="text-toxic-green font-bold">✓</span>
                  <span>Signature Verified</span>
                </p>
                <p className="text-xs text-gray-500 ml-6">On-chain authentication active</p>
              </div>
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <span className="text-toxic-green font-bold">✓</span>
                  <span>Profile Created</span>
                </p>
                <p className="text-xs text-gray-500 ml-6">Anonymous identity active</p>
              </div>
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <span className="text-gray-500 font-bold">○</span>
                  <span>Email Verified</span>
                </p>
                <p className="text-xs text-gray-500 ml-6">Optional - join newsletter above</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
