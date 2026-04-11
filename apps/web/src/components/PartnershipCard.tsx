'use client';

import Link from 'next/link';

interface PartnershipCardProps {
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

const typeConfig = {
  memecoin: { label: 'Memecoin', color: '#F4D03F' },
  ecosystem: { label: 'Ecosystem', color: '#FF6600' },
  aggregator: { label: 'Aggregator', color: '#39FF14' },
  community: { label: 'Community', color: '#BF00FF' },
};

export function PartnershipCard({ id, name, logo, description, type, website, metrics }: PartnershipCardProps) {
  const config = typeConfig[type];

  return (
    <div className="partnership-card">
      <style jsx>{`
        .partnership-card {
          border: 4px solid var(--shit-yellow);
          background: var(--bg-waste);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.2s ease;
          box-shadow: 8px 8px 0px rgba(139, 69, 19, 0.5);
        }

        .partnership-card:hover {
          transform: translate(-4px, -4px);
          box-shadow: 12px 12px 0px rgba(139, 69, 19, 0.8);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .card-logo {
          width: 80px;
          height: 80px;
          border-radius: 4px;
          border: 2px solid var(--shit-brown);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-raw);
          flex-shrink: 0;
        }

        .card-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 2px;
        }

        .card-title-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card-name {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--text-shit);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .type-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 2px;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
          border: 2px solid;
          width: fit-content;
          background: rgba(0, 0, 0, 0.3);
        }

        .card-description {
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: var(--text-dim);
          line-height: 1.5;
          margin: 0;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.4);
          border: 2px dashed var(--shit-brown);
          border-radius: 2px;
        }

        .metric-item {
          text-align: left;
        }

        .metric-label {
          font-family: var(--font-body);
          font-size: 0.7rem;
          color: var(--text-dim);
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .metric-value {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: var(--toxic-green);
          font-weight: bold;
        }

        .card-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          padding-top: 1rem;
          border-top: 2px dashed var(--shit-brown);
        }

        .btn {
          padding: 0.75rem 1rem;
          border: 2px solid var(--shit-yellow);
          background: var(--bg-raw);
          color: var(--text-shit);
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: bold;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          text-align: center;
          transition: all 0.2s ease;
          border-radius: 2px;
        }

        .btn:hover {
          background: var(--shit-yellow);
          color: var(--bg-raw);
          text-decoration: none;
        }

        .btn-primary {
          background: var(--shit-yellow);
          color: var(--bg-raw);
        }

        .btn-primary:hover {
          background: var(--shit-yellow-dark);
          border-color: var(--shit-yellow-dark);
        }

        @media (max-width: 768px) {
          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .card-logo {
            width: 60px;
            height: 60px;
          }

          .card-name {
            font-size: 1.1rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .card-footer {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="card-header">
        <div className="card-logo">
          <img src={logo} alt={name} />
        </div>
        <div className="card-title-section">
          <h3 className="card-name">{name}</h3>
          <div
            className="type-badge"
            style={{
              borderColor: config.color,
              color: config.color,
            }}
          >
            {config.label}
          </div>
        </div>
      </div>

      <p className="card-description">{description}</p>

      <div className="metrics-grid">
        <div className="metric-item">
          <div className="metric-label">Monthly Reach</div>
          <div className="metric-value">{(metrics.reach / 1000).toFixed(0)}K</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">Conversions</div>
          <div className="metric-value">{metrics.conversions}</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">Conv. Rate</div>
          <div className="metric-value">{metrics.conversionRate.toFixed(1)}%</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">Revenue</div>
          <div className="metric-value">${(metrics.totalRevenue / 1000).toFixed(0)}K</div>
        </div>
      </div>

      <div className="card-footer">
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className="btn">
            Visit
          </a>
        )}
        <button className="btn btn-primary">Learn More</button>
      </div>
    </div>
  );
}
