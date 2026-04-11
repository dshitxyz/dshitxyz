'use client';

import { useState, useEffect } from 'react';
import { PartnershipGrid } from '@/components/PartnershipGrid';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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

interface StatsResponse {
  stats: {
    activePartners: number;
    totalPartners: number;
    totalReach: number;
    totalConversions: number;
    totalRevenue: number;
    avgConversionRate: number;
  };
}

type PartnershipType = 'all' | 'memecoin' | 'ecosystem' | 'aggregator' | 'community';

export default function PartnershipsPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [stats, setStats] = useState<StatsResponse['stats'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<PartnershipType>('all');

  useEffect(() => {
    const fetchPartnerships = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/partnerships');
        const data = await response.json();
        setPartnerships(data.data || []);
      } catch (error) {
        console.error('Failed to fetch partnerships:', error);
        setPartnerships([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/partnerships/stats/overview');
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchPartnerships();
    fetchStats();
  }, []);

  const typeOptions: { value: PartnershipType; label: string }[] = [
    { value: 'all', label: 'All Partners' },
    { value: 'memecoin', label: 'Memecoins' },
    { value: 'ecosystem', label: 'Ecosystem' },
    { value: 'aggregator', label: 'Aggregators' },
    { value: 'community', label: 'Communities' },
  ];

  return (
    <div className="partnerships-page">
      <style jsx>{`
        .partnerships-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg-raw) 0%, var(--bg-dirty) 100%);
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 3rem 1rem;
        }

        .hero-section {
          margin-bottom: 3rem;
          text-align: center;
          padding: 2rem;
          border: 4px solid var(--shit-yellow);
          background: rgba(244, 208, 63, 0.05);
          box-shadow: 8px 8px 0px rgba(139, 69, 19, 0.3);
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 8vw, 3.5rem);
          color: var(--shit-yellow);
          text-transform: uppercase;
          margin: 0 0 0.5rem 0;
          letter-spacing: 2px;
          text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.5);
        }

        .hero-subtitle {
          font-family: var(--font-body);
          font-size: 1.1rem;
          color: var(--text-dim);
          margin: 0 0 1.5rem 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: var(--bg-waste);
          padding: 1rem;
          border: 2px solid var(--shit-brown);
          border-radius: 2px;
        }

        .stat-label {
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: var(--text-dim);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-family: var(--font-display);
          font-size: 1.8rem;
          color: var(--toxic-green);
          font-weight: bold;
        }

        .filter-section {
          margin-bottom: 2rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
        }

        .filter-label {
          font-family: var(--font-display);
          color: var(--text-shit);
          text-transform: uppercase;
          font-size: 0.9rem;
          font-weight: bold;
        }

        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 2px solid var(--shit-brown);
          background: var(--bg-waste);
          color: var(--text-shit);
          font-family: var(--font-body);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 2px;
          text-transform: uppercase;
          font-weight: bold;
        }

        .filter-btn:hover {
          border-color: var(--shit-yellow);
          background: var(--bg-dirty);
        }

        .filter-btn.active {
          background: var(--shit-yellow);
          color: var(--bg-raw);
          border-color: var(--shit-yellow);
        }

        .apply-section {
          margin: 3rem 0;
          padding: 2rem;
          background: var(--bg-waste);
          border: 4px dashed var(--industrial-orange);
          border-radius: 2px;
          text-align: center;
        }

        .apply-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--industrial-orange);
          text-transform: uppercase;
          margin: 0 0 1rem 0;
        }

        .apply-description {
          font-family: var(--font-body);
          color: var(--text-dim);
          margin-bottom: 1.5rem;
        }

        .apply-button {
          display: inline-block;
          padding: 1rem 2rem;
          background: var(--industrial-orange);
          color: var(--bg-raw);
          border: 2px solid var(--industrial-orange);
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: bold;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .apply-button:hover {
          background: transparent;
          color: var(--industrial-orange);
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 2rem 1rem;
          }

          .hero-section {
            padding: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .filter-section {
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-buttons {
            width: 100%;
          }

          .filter-btn {
            flex: 1;
            min-width: 120px;
          }
        }
      `}</style>

      <Header />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">Partnership Ecosystem</h1>
          <p className="hero-subtitle">Join dshit.xyz and collaborate with leading projects in Web3</p>

          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Active Partners</div>
                <div className="stat-value">{stats.activePartners}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Reach</div>
                <div className="stat-value">{(stats.totalReach / 1000000).toFixed(1)}M</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Conversions</div>
                <div className="stat-value">{stats.totalConversions}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Revenue Generated</div>
                <div className="stat-value">${(stats.totalRevenue / 1000000).toFixed(1)}M</div>
              </div>
            </div>
          )}
        </section>

        {/* Filter Section */}
        <section className="filter-section">
          <span className="filter-label">Filter by Type:</span>
          <div className="filter-buttons">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                className={`filter-btn ${selectedType === option.value ? 'active' : ''}`}
                onClick={() => setSelectedType(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {/* Partnerships Grid */}
        <PartnershipGrid partnerships={partnerships} loading={loading} selectedType={selectedType} />

        {/* Call to Action */}
        <section className="apply-section">
          <h2 className="apply-title">🤝 Become a Partner</h2>
          <p className="apply-description">
            Want to collaborate with dshit.xyz? We're looking for creative partners to help grow the ecosystem.
          </p>
          <button className="apply-button">Apply for Partnership</button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
