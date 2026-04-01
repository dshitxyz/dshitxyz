'use client';

import { useEffect, useState } from 'react';

interface EngagementMetrics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  avgSessionDuration: string;
  bounceRate: string;
  returnVisitors: string;
}

export function EngagementMetrics() {
  const [data, setData] = useState<EngagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEngagementData() {
      try {
        const response = await fetch('/api/analytics/engagement');
        if (!response.ok) throw new Error('Failed to fetch engagement data');
        const metrics = await response.json();
        setData(metrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchEngagementData();
  }, []);

  if (loading) {
    return (
      <div className="brutalist-border p-8 bg-gray-900 animate-pulse">
        <div className="h-64 bg-gray-800 rounded"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="brutalist-border p-8 bg-gray-900 border-glitch-red">
        <h3 className="text-glitch-red font-display">Engagement Error</h3>
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="brutalist-border p-8 bg-gray-900">
      <h3 className="text-2xl font-display text-shit-yellow mb-8">📊 ENGAGEMENT METRICS</h3>

      {/* Daily / Weekly / Monthly Active Users */}
      <div className="mb-8">
        <h4 className="text-sm font-display text-gray-400 uppercase mb-4">Active Users</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* DAU */}
          <div className="p-6 bg-gradient-to-br from-shit-yellow via-gray-800 to-gray-900 rounded-sm border-l-4 border-shit-yellow">
            <div className="text-gray-400 text-xs font-body uppercase mb-2">Daily Active</div>
            <div className="text-shit-yellow font-display font-bold text-3xl">
              {data.dailyActiveUsers.toLocaleString()}
            </div>
            <div className="text-gray-500 text-xs mt-2">DAU</div>
          </div>

          {/* WAU */}
          <div className="p-6 bg-gradient-to-br from-industrial-orange via-gray-800 to-gray-900 rounded-sm border-l-4 border-industrial-orange">
            <div className="text-gray-400 text-xs font-body uppercase mb-2">Weekly Active</div>
            <div className="text-industrial-orange font-display font-bold text-3xl">
              {data.weeklyActiveUsers.toLocaleString()}
            </div>
            <div className="text-gray-500 text-xs mt-2">WAU</div>
          </div>

          {/* MAU */}
          <div className="p-6 bg-gradient-to-br from-toxic-green via-gray-800 to-gray-900 rounded-sm border-l-4 border-toxic-green">
            <div className="text-gray-400 text-xs font-body uppercase mb-2">Monthly Active</div>
            <div className="text-toxic-green font-display font-bold text-3xl">
              {data.monthlyActiveUsers.toLocaleString()}
            </div>
            <div className="text-gray-500 text-xs mt-2">MAU</div>
          </div>
        </div>
      </div>

      {/* Engagement Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Session Duration */}
        <div className="p-6 bg-gray-800 rounded-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⏱️</span>
            <span className="text-gray-400 text-xs font-body uppercase">Avg Session</span>
          </div>
          <div className="text-shit-yellow font-display font-bold text-2xl">
            {data.avgSessionDuration}
          </div>
          <div className="text-gray-500 text-xs mt-2">minutes</div>
        </div>

        {/* Bounce Rate */}
        <div className="p-6 bg-gray-800 rounded-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📉</span>
            <span className="text-gray-400 text-xs font-body uppercase">Bounce Rate</span>
          </div>
          <div className="text-glitch-red font-display font-bold text-2xl">
            {data.bounceRate}
          </div>
          <div className="text-gray-500 text-xs mt-2">one-page sessions</div>
        </div>

        {/* Return Visitors */}
        <div className="p-6 bg-gray-800 rounded-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔄</span>
            <span className="text-gray-400 text-xs font-body uppercase">Returning</span>
          </div>
          <div className="text-toxic-green font-display font-bold text-2xl">
            {data.returnVisitors}
          </div>
          <div className="text-gray-500 text-xs mt-2">of total visitors</div>
        </div>
      </div>

      {/* Engagement Health */}
      <div className="mt-8 p-6 bg-gray-800 rounded-sm">
        <h4 className="text-sm font-display text-gray-400 uppercase mb-4">Engagement Health</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-sm">User Retention</span>
              <span className="text-toxic-green text-sm font-bold">
                {(
                  (data.weeklyActiveUsers / data.monthlyActiveUsers) *
                  100
                ).toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-gray-700 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-toxic-green to-industrial-orange"
                style={{
                  width: `${(data.weeklyActiveUsers / data.monthlyActiveUsers) * 100}%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-sm">Daily Consistency</span>
              <span className="text-shit-yellow text-sm font-bold">
                {(
                  (data.dailyActiveUsers / data.weeklyActiveUsers) *
                  100
                ).toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-gray-700 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-shit-yellow to-industrial-orange"
                style={{
                  width: `${(data.dailyActiveUsers / data.weeklyActiveUsers) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
