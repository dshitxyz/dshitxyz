'use client';

import { PartnershipCard } from './PartnershipCard';

interface Partnership {
  id: string;
  name: string;
  logo: string;
  description: string;
  type: 'memecoin' | 'ecosystem' | 'aggregator' | 'community';
  website?: string;
  twitterHandle?: string;
  metrics: {
    reach: number;
    conversions: number;
    conversionRate: number;
    totalRevenue: number;
  };
}

interface PartnershipGridProps {
  partnerships: Partnership[];
  loading?: boolean;
  selectedType?: string;
}

export function PartnershipGrid({ partnerships, loading = false, selectedType }: PartnershipGridProps) {
  const filtered =
    selectedType && selectedType !== 'all'
      ? partnerships.filter((p) => p.type === selectedType)
      : partnerships;

  return (
    <div className="partnership-grid-container">
      <style jsx>{`
        .partnership-grid-container {
          width: 100%;
        }

        .grid-header {
          margin-bottom: 2rem;
        }

        .grid-title {
          font-family: var(--font-display);
          font-size: 2rem;
          color: var(--text-shit);
          text-transform: uppercase;
          margin: 0 0 0.5rem 0;
          letter-spacing: 2px;
        }

        .grid-subtitle {
          font-family: var(--font-body);
          color: var(--text-dim);
          font-size: 0.95rem;
        }

        .results-count {
          font-family: var(--font-display);
          font-size: 0.9rem;
          color: var(--toxic-green);
          margin-top: 1rem;
          text-transform: uppercase;
        }

        .partnership-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .loading-text {
          font-family: var(--font-display);
          color: var(--shit-yellow);
          font-size: 1.2rem;
          text-transform: uppercase;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          border: 4px dashed var(--shit-yellow);
          background: rgba(244, 208, 63, 0.05);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--text-shit);
          text-transform: uppercase;
          margin: 0 0 0.5rem 0;
        }

        .empty-text {
          font-family: var(--font-body);
          color: var(--text-dim);
          margin: 0;
        }

        @media (max-width: 1024px) {
          .partnership-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1rem;
          }
        }

        @media (max-width: 640px) {
          .partnership-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .grid-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="grid-header">
        <h2 className="grid-title">Active Partnerships</h2>
        <p className="grid-subtitle">Collaborate with leading projects in the dshit.xyz ecosystem</p>
        {filtered.length > 0 && <div className="results-count">{filtered.length} partnership(s)</div>}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-text">Loading partnerships...</div>
        </div>
      ) : filtered.length > 0 ? (
        <div className="partnership-grid">
          {filtered.map((partnership) => (
            <PartnershipCard key={partnership.id} {...partnership} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🤷</div>
          <h3 className="empty-title">No Partnerships Found</h3>
          <p className="empty-text">Try selecting a different partnership type or check back soon</p>
        </div>
      )}
    </div>
  );
}
