'use client';

import { Card } from '@dshit/ui';

interface DropItem {
  title: string;
  description: string;
  tag: {
    text: string;
    type: 'yellow' | 'red' | 'green' | 'purple' | 'orange' | 'brown';
  };
  featured?: boolean;
}

export const DashboardDrops = () => {
  const drops: DropItem[] = [
    {
      title: 'TURD SEASON 3: THE GREAT DUMP',
      description: 'The most anticipated drop of the season. Limited supply, unlimited potential.',
      tag: { text: 'FEATURED', type: 'yellow' },
      featured: true,
    },
    {
      title: 'SKIDMARK PROTOCOL V2',
      description: 'Enhanced version with 2x rewards and new mechanics. Hot drop alert.',
      tag: { text: 'HOT', type: 'red' },
    },
    {
      title: 'FLOATER YIELD FARM',
      description: 'Stake and earn. Currently yielding 847% APY. Yes, really.',
      tag: { text: 'LIVE', type: 'green' },
    },
    {
      title: 'CORN REPORT',
      description: 'Deep dive analysis and market research from our team.',
      tag: { text: 'RESEARCH', type: 'purple' },
    },
    {
      title: 'DOUBLE FLUSH EVENT',
      description: 'Partnership collaboration with another protocol. 2x points this week.',
      tag: { text: 'COLLAB', type: 'orange' },
    },
    {
      title: 'GHOST WIPE',
      description: 'Historical protocol that went silent. Educational value only.',
      tag: { text: 'RUGGED', type: 'brown' },
    },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-display text-shit-yellow mb-8 font-bold">
        FRESH DROPS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drops.map((drop) => (
          <Card
            key={drop.title}
            variant={drop.featured ? 'featured' : 'default'}
            tag={drop.tag}
            title={drop.title}
            body={drop.description}
            className={drop.featured ? 'lg:col-span-2' : ''}
          />
        ))}
      </div>
    </section>
  );
};
