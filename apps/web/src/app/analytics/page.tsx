'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { FunnelChart } from '@/components/FunnelChart';
import { CommerceMetrics } from '@/components/CommerceMetrics';
import { CommunityMetrics } from '@/components/CommunityMetrics';
import { EngagementMetrics } from '@/components/EngagementMetrics';

export default function AnalyticsPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      router.push('/auth/login');
    } else {
      setIsLoading(false);
    }
  }, [isConnected, router]);

  if (!isConnected || isLoading) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold font-display text-shit-yellow mb-2">
              ANALYTICS DASHBOARD
            </h1>
            <p className="text-gray-400 font-body">
              Platform metrics • User funnels • Commerce performance
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* VLN Funnel */}
            <div className="lg:col-span-2">
              <FunnelChart />
            </div>

            {/* Commerce & Community */}
            <CommerceMetrics />
            <CommunityMetrics />

            {/* Engagement */}
            <div className="lg:col-span-2">
              <EngagementMetrics />
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-16 pb-12">
            <p className="text-gray-500 text-sm font-body">
              Analytics data refreshes in real-time from protocol state
            </p>
            <p className="text-gray-600 text-xs mt-2">
              For advanced queries, use the public API: <code className="text-shit-yellow">/api/analytics/*</code>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
