'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { DashboardStats } from '@/components/DashboardStats';
import { DashboardDrops } from '@/components/DashboardDrops';
import { FlushMeter } from '@/components/FlushMeter';
import { Newsletter } from '@/components/Newsletter';
import { Mascot } from '@dshit/ui';

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
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Mascot Hero */}
        <div className="text-center mb-12">
          <Mascot size="md" animated />
          <h1 className="text-5xl font-bold font-display text-shit-yellow mt-4 mb-2">
            PROTOCOL DASHBOARD
          </h1>
          <p className="text-gray-400 font-body">
            if it stinks, it ships. • Powered by the dump
          </p>
        </div>

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
    </>
  );
}
