'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import FunnelChart from '@/components/analytics/FunnelChart';
import CommerceChart from '@/components/analytics/CommerceChart';
import CommunityChart from '@/components/analytics/CommunityChart';
import EngagementChart from '@/components/analytics/EngagementChart';
import styles from './analytics.module.css';

interface AnalyticsData {
  funnel?: any;
  commerce?: any;
  community?: any;
  engagement?: any;
  summary?: any;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [data, setData] = useState<AnalyticsData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchAnalytics();
    }
  }, [user, isAuthLoading]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [funnelRes, commerceRes, communityRes, engagementRes] = await Promise.all([
        fetch('/api/analytics/funnel').then((r) => r.json()),
        fetch('/api/analytics/commerce').then((r) => r.json()),
        fetch('/api/analytics/community').then((r) => r.json()),
        fetch('/api/analytics/engagement').then((r) => r.json()),
      ]);

      setData({
        funnel: funnelRes.metrics,
        commerce: commerceRes.metrics,
        community: communityRes.metrics,
        engagement: engagementRes.metrics,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      console.error('Analytics fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
        <button onClick={fetchAnalytics} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>📊 Platform Analytics</h1>
        <div className={styles.controls}>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={styles.periodSelect}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all-time">All Time</option>
          </select>
          <button onClick={fetchAnalytics} className={styles.refreshButton}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className={styles.metricsRow}>
        {data.summary && (
          <>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Total Users</div>
              <div className={styles.metricValue}>{data.summary.funnel?.natives || 0}</div>
              <div className={styles.metricSubtext}>Active Natives</div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Total Orders</div>
              <div className={styles.metricValue}>{data.summary.commerce?.totalOrders || 0}</div>
              <div className={styles.metricSubtext}>All Time</div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Total Revenue</div>
              <div className={styles.metricValue}>{data.summary.commerce?.totalRevenue || '0 DSHIT'}</div>
              <div className={styles.metricSubtext}>Platform Generated</div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Daily Active Users</div>
              <div className={styles.metricValue}>{data.summary.engagement?.dailyActiveUsers || 0}</div>
              <div className={styles.metricSubtext}>Past 24 Hours</div>
            </div>
          </>
        )}
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        {/* VLN Funnel Chart */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>VLN Funnel Conversion</h2>
          <div className={styles.chartContainer}>
            {data.funnel && <FunnelChart data={data.funnel} />}
          </div>
          <div className={styles.chartStats}>
            <p>Visitor → Lurker: {data.funnel?.conversionRates?.visitorToLurker}</p>
            <p>Lurker → Native: {data.funnel?.conversionRates?.lurkerToNative}</p>
          </div>
        </div>

        {/* Commerce Revenue Chart */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Commerce Performance</h2>
          <div className={styles.chartContainer}>
            {data.commerce && <CommerceChart data={data.commerce} />}
          </div>
          <div className={styles.chartStats}>
            <p>Avg Order Value: {data.commerce?.avgOrderValue}</p>
            <p>Orders Today: {data.commerce?.ordersToday}</p>
          </div>
        </div>

        {/* Community Engagement */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Community Activity</h2>
          <div className={styles.chartContainer}>
            {data.community && <CommunityChart data={data.community} />}
          </div>
          <div className={styles.chartStats}>
            <p>Active Creators: {data.community?.activeCreators}</p>
            <p>Avg Votes per Meme: {data.community?.avgVotesPerMeme}</p>
          </div>
        </div>

        {/* User Engagement */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>User Engagement Metrics</h2>
          <div className={styles.chartContainer}>
            {data.engagement && <EngagementChart data={data.engagement} />}
          </div>
          <div className={styles.chartStats}>
            <p>Monthly Active: {data.engagement?.monthlyActiveUsers}</p>
            <p>Return Rate: {data.engagement?.returnVisitors}</p>
          </div>
        </div>
      </div>

      {/* Top Products */}
      {data.commerce?.topProducts && (
        <div className={styles.topProductsCard}>
          <h2 className={styles.chartTitle}>Top Selling Products</h2>
          <div className={styles.productsList}>
            {data.commerce.topProducts.map((product: any, idx: number) => (
              <div key={idx} className={styles.productItem}>
                <span className={styles.productRank}>#{idx + 1}</span>
                <span className={styles.productName}>{product.name}</span>
                <span className={styles.productSales}>{product.sales} sales</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
