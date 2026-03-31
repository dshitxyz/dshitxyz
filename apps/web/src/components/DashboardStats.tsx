'use client';

import { StatBox } from '@dshit/ui';
import { useEffect, useState } from 'react';

interface DashboardStatsData {
  totalValueDumped: string;
  weeklyChange: string;
  activeUsers: string;
  activeToday: string;
  totalMinted: string;
  mintedToday: string;
  auditsPasssed: number;
}

export const DashboardStats = () => {
  const [data, setData] = useState<DashboardStatsData | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/dashboard');
        if (response.ok) {
          const stats = await response.json();
          setData(stats);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const displayData = data || {
    totalValueDumped: '$4.2B',
    weeklyChange: '+$145M this week',
    activeUsers: '847K',
    activeToday: '+23K active today',
    totalMinted: '69M',
    mintedToday: '+2.1M since yesterday',
    auditsPasssed: 0,
  };

  const stats = [
    {
      number: displayData.totalValueDumped,
      label: 'Total Value Dumped',
      subLabel: displayData.weeklyChange,
      accentColor: 'yellow' as const,
    },
    {
      number: displayData.activeUsers,
      label: 'Degens in the Bowl',
      subLabel: displayData.activeToday,
      accentColor: 'red' as const,
    },
    {
      number: displayData.totalMinted,
      label: 'Turds Minted',
      subLabel: displayData.mintedToday,
      accentColor: 'green' as const,
    },
    {
      number: displayData.auditsPasssed.toString(),
      label: 'Audits Passed',
      subLabel: 'We move fast',
      accentColor: 'purple' as const,
    },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-3xl md:text-4xl font-display text-shit-yellow mb-8 font-bold">
        PROTOCOL DASHBOARD
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatBox
            key={stat.label}
            number={stat.number}
            label={stat.label}
            subLabel={stat.subLabel}
            accentColor={stat.accentColor}
          />
        ))}
      </div>
    </section>
  );
};
