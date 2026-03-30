'use client';

import { StatBox } from '@dshit/ui';

export const DashboardStats = () => {
  const stats = [
    {
      number: '$4.2B',
      label: 'Total Value Dumped',
      subLabel: '+$145M this week',
      accentColor: 'yellow' as const,
    },
    {
      number: '847K',
      label: 'Degens in the Bowl',
      subLabel: '+23K active today',
      accentColor: 'red' as const,
    },
    {
      number: '69M',
      label: 'Turds Minted',
      subLabel: '+2.1M since yesterday',
      accentColor: 'green' as const,
    },
    {
      number: '0',
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
