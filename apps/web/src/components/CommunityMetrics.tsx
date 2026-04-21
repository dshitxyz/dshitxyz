'use client';

import { useEffect, useState } from 'react';

interface CommunityMetrics {
  totalMemesCreated: number;
  totalVotes: number;
  avgVotesPerMeme: number;
  activeCreators: number;
  contestEntries: number;
  contestVoteTotal: number;
}

export function CommunityMetrics() {
  const [data, setData] = useState<CommunityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommunityData() {
      try {
        const response = await fetch('/api/analytics/community');
        if (!response.ok) throw new Error('Failed to fetch community data');
        const metrics = await response.json();
        setData(metrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchCommunityData();
  }, []);

  if (loading) {
    return (
      <div className="brutalist-border p-6 bg-gray-900 animate-pulse">
        <div className="h-64 bg-gray-800 rounded"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="brutalist-border p-6 bg-gray-900 border-glitch-red">
        <h3 className="text-glitch-red font-display">Community Error</h3>
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="brutalist-border p-6 bg-gray-900">
      <h3 className="text-2xl font-display text-toxic-green mb-6">🎨 COMMUNITY</h3>

      {/* Main Metrics */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-sm">
          <span className="text-gray-400 font-body">Total Memes Created</span>
          <span className="text-toxic-green font-display font-bold text-xl">
            {data.totalMemesCreated.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-sm">
          <span className="text-gray-400 font-body">Total Votes Cast</span>
          <span className="text-industrial-orange font-display font-bold text-xl">
            {data.totalVotes.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-800 rounded-sm">
          <span className="text-gray-400 font-body">Avg Votes per Meme</span>
          <span className="text-shit-yellow font-display font-bold text-xl">
            {data.avgVotesPerMeme.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Active Creators & Contests */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-sm border border-toxic-green border-opacity-30">
          <div className="text-gray-400 text-xs font-body uppercase mb-1">Active Creators</div>
          <div className="text-toxic-green font-display font-bold text-2xl">
            {data.activeCreators.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-sm border border-shit-yellow border-opacity-30">
          <div className="text-gray-400 text-xs font-body uppercase mb-1">Contest Entries</div>
          <div className="text-shit-yellow font-display font-bold text-2xl">
            {data.contestEntries.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Contest Voting */}
      <div className="mt-4 p-4 bg-gray-800 rounded-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-industrial-orange text-lg">🏆</span>
          <span className="text-gray-400 font-body text-sm uppercase">Contest Votes</span>
        </div>
        <div className="text-industrial-orange font-display font-bold text-2xl">
          {data.contestVoteTotal.toLocaleString()}
        </div>
        <div className="text-gray-500 text-xs mt-2">
          Avg per entry: {(data.contestVoteTotal / data.contestEntries).toFixed(1)}
        </div>
      </div>
    </div>
  );
}
