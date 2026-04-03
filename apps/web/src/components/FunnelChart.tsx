'use client';

import { useEffect, useState } from 'react';

interface FunnelMetrics {
  visitors: number;
  lurkers: number;
  natives: number;
  conversionRates: {
    visitorToLurker: string;
    lurkerToNative: string;
    visitorToNative: string;
  };
}

export function FunnelChart() {
  const [data, setData] = useState<FunnelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFunnelData() {
      try {
        const response = await fetch('/api/analytics/funnel');
        if (!response.ok) throw new Error('Failed to fetch funnel data');
        const metrics = await response.json();
        setData(metrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchFunnelData();
  }, []);

  if (loading) {
    return (
      <div className="brutalist-border p-8 bg-gray-900 animate-pulse">
        <h2 className="text-2xl font-display text-shit-yellow mb-6">VLN FUNNEL</h2>
        <div className="h-64 bg-gray-800 rounded"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="brutalist-border p-8 bg-gray-900 border-glitch-red">
        <h2 className="text-2xl font-display text-glitch-red">Error loading funnel</h2>
        <p className="text-gray-400 mt-2">{error}</p>
      </div>
    );
  }

  const maxValue = data.visitors;
  const visitorWidth = 100;
  const lurkerWidth = (data.lurkers / data.visitors) * 100;
  const nativeWidth = (data.natives / data.visitors) * 100;

  return (
    <div className="brutalist-border p-8 bg-gray-900">
      <h2 className="text-2xl font-display text-shit-yellow mb-8">
        VLN FUNNEL • Visitor → Lurker → Native
      </h2>

      <div className="space-y-8">
        {/* Visitors */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <span className="text-shit-yellow font-display text-xl">▼</span>
              <span className="font-body text-white font-bold">VISITORS</span>
            </div>
            <span className="text-shit-yellow font-display font-bold text-lg">
              {data.visitors.toLocaleString()}
            </span>
          </div>
          <div className="h-12 bg-gradient-to-r from-shit-yellow to-shit-brown rounded-sm overflow-hidden">
            <div className="w-full h-full flex items-center px-4">
              <span className="text-gray-900 font-bold text-sm">100%</span>
            </div>
          </div>
        </div>

        {/* Lurkers */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <span className="text-industrial-orange font-display text-xl">▼</span>
              <span className="font-body text-white font-bold">LURKERS</span>
            </div>
            <div className="text-right">
              <div className="text-industrial-orange font-display font-bold text-lg">
                {data.lurkers.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm font-body">
                {data.conversionRates.visitorToLurker} conversion
              </div>
            </div>
          </div>
          <div
            className="h-12 bg-gradient-to-r from-industrial-orange to-shit-brown rounded-sm overflow-hidden"
            style={{ width: `${lurkerWidth}%` }}
          >
            <div className="h-full flex items-center px-4">
              <span className="text-gray-900 font-bold text-sm">{lurkerWidth.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Natives */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <span className="text-toxic-green font-display text-xl">▼</span>
              <span className="font-body text-white font-bold">NATIVES</span>
            </div>
            <div className="text-right">
              <div className="text-toxic-green font-display font-bold text-lg">
                {data.natives.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm font-body">
                {data.conversionRates.lurkerToNative} lurker→native
              </div>
            </div>
          </div>
          <div
            className="h-12 bg-gradient-to-r from-toxic-green to-industrial-orange rounded-sm overflow-hidden"
            style={{ width: `${nativeWidth}%` }}
          >
            <div className="h-full flex items-center px-4">
              <span className="text-gray-900 font-bold text-sm">{nativeWidth.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Summary */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800 rounded-sm border-l-4 border-shit-yellow">
          <div className="text-gray-400 text-sm font-body">Visitor → Lurker</div>
          <div className="text-shit-yellow font-display font-bold text-2xl">
            {data.conversionRates.visitorToLurker}
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-sm border-l-4 border-industrial-orange">
          <div className="text-gray-400 text-sm font-body">Lurker → Native</div>
          <div className="text-industrial-orange font-display font-bold text-2xl">
            {data.conversionRates.lurkerToNative}
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-sm border-l-4 border-toxic-green">
          <div className="text-gray-400 text-sm font-body">Visitor → Native</div>
          <div className="text-toxic-green font-display font-bold text-2xl">
            {data.conversionRates.visitorToNative}
          </div>
        </div>
      </div>
    </div>
  );
}
