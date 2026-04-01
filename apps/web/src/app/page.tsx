'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-20 px-6 text-center border-b-4 border-shit-yellow overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255, 102, 0, 0.1), transparent 50%)',
        }}
      >
        {/* SVG Stink Lines (decorative) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-32">
            <path d="M0 50 Q 250 0 500 50 T 1000 50" stroke="var(--industrial-orange)" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Eyebrow Label */}
          <div
            style={{
              fontFamily: 'var(--font-accent)',
              color: 'var(--industrial-orange)',
              fontSize: '1.5rem',
              transform: 'rotate(-2deg)',
              marginBottom: '1rem',
            }}
          >
            WELCOME TO THE DUMP 💩
          </div>

          {/* Hero Title with Glitch Effect */}
          <h1
            className="glitch-text text-6xl md:text-8xl font-bold mb-6"
            data-text="DSHIT.XYZ"
            style={{
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            DSHIT.XYZ
          </h1>

          {/* Subheading */}
          <div
            className="mb-8 pl-4 border-l-4 border-toxic-green"
            style={{ color: 'var(--text-dim)', maxWidth: '500px', margin: '1.5rem auto 1.5rem 1rem' }}
          >
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Decentralized meme platform powered by $DSHIT token. Create, share, sell.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => router.push('/gallery')}
              className="shit-button"
              style={{
                fontFamily: 'var(--font-display)',
              }}
            >
              Explore Memes
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="border-2 border-shit-yellow px-6 py-3 text-shit-yellow hover:bg-shit-yellow hover:text-bg-raw transition-all duration-200"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                boxShadow: '4px 4px 0px var(--shit-brown)',
              }}
            >
              Connect Wallet
            </button>
          </div>

          {/* Live Indicator */}
          <div className="inline-flex items-center justify-center">
            <span style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>Platform Status:</span>
            <span className="live-pill">LIVE</span>
          </div>
        </div>
      </section>

      {/* Stats Grid Section */}
      <section className="py-16 px-6 border-b-4 border-shit-brown" style={{ background: 'var(--bg-dirty)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: '$DSHIT Price', value: 'TBD', color: 'var(--shit-yellow)' },
              { label: 'Total Supply', value: '1B', color: 'var(--toxic-green)' },
              { label: 'Holders', value: '→ Many', color: 'var(--cyber-purple)' },
              { label: 'Volume (24h)', value: 'TBD', color: 'var(--industrial-orange)' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-6 border-t-4 border-shit-brown"
                style={{
                  borderTopColor: stat.color,
                  background: 'rgba(26, 26, 26, 0.5)',
                }}
              >
                <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {stat.label}
                </p>
                <p style={{ color: stat.color, fontSize: '2rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6" style={{ background: 'var(--bg-raw)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '🎨 Create', desc: 'Make memes using our template library' },
              { title: '💰 Sell', desc: 'List prank products for $DSHIT' },
              { title: '🗳️ Vote', desc: 'Govern platform via DAO' },
              { title: '🏆 Compete', desc: 'Win contests with your creations' },
              { title: '🔗 Trade', desc: 'Swap $DSHIT on Base L2' },
              { title: '🔐 Anonymity', desc: 'Keep your identity private' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 border-2 border-shit-brown hover:border-shit-yellow transition-colors"
                style={{
                  background: 'rgba(139, 69, 19, 0.05)',
                }}
              >
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="py-16 px-6 border-t-4 border-shit-yellow" style={{ background: 'var(--bg-dirty)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center mb-8">$DSHIT Tokenomics</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-l-4 border-shit-yellow bg-rgba(244, 208, 63, 0.05)">
              <span>Total Supply</span>
              <strong>1,000,000,000</strong>
            </div>
            <div className="flex items-center justify-between p-4 border-l-4 border-toxic-green">
              <span>Transfer Tax</span>
              <strong>5% → Treasury</strong>
            </div>
            <div className="flex items-center justify-between p-4 border-l-4 border-cyber-purple">
              <span>Token Standard</span>
              <strong>ERC-20 on Base</strong>
            </div>
            <div className="flex items-center justify-between p-4 border-l-4 border-industrial-orange">
              <span>Governance</span>
              <strong>DAO Controlled</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-6 text-center border-t-4 border-shit-brown"
        style={{ background: 'var(--bg-base)' }}
      >
        <p style={{ marginBottom: '1rem', color: 'var(--text-dim)' }}>
          © 2026 dshit.xyz - Decentralized Meme Platform
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>
          Built on Base L2. Not financial advice. Use at your own risk.
        </p>
      </footer>
    </main>
  );
}
