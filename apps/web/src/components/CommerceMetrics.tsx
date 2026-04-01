'use client';

import { useEffect, useState } from 'react';

interface CommerceMetrics {
  totalOrders: number;
  totalRevenue: string;
  avgOrderValue: string;
  ordersToday: number;
  revenueToday: string;
  topProducts: Array<{ name: string; sales: number }>;
}

export function CommerceMetrics() {
  const [data, setData] = useState<CommerceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommerceData() {
      try {
        const response = await fetch('/api/analytics/commerce');
        if (!response.ok) throw new Error('Failed to fetch commerce data');
        const metrics = await response.json();
        setData(metrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchCommerceData();
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
        <h3 className="text-glitch-red font-display">Commerce Error</h3>
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  const maxSales = Math.max(...data.topProducts.map((p) => p.sales));

  return (
    <div className="brutalist-border p-6 bg-gray-900">
      <h3 className="text-2xl font-display text-shit-yellow mb-6">💰 COMMERCE</h3>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-800 rounded-sm">
          <div className="text-gray-400 text-xs font-body uppercase">Total Orders</div>
          <div className="text-shit-yellow font-display font-bold text-2xl mt-1">
            {data.totalOrders.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-sm">
          <div className="text-gray-400 text-xs font-body uppercase">Revenue</div>
          <div className="text-shit-yellow font-display font-bold text-2xl mt-1">
            {data.totalRevenue}
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-sm">
          <div className="text-gray-400 text-xs font-body uppercase">Avg Order</div>
          <div className="text-industrial-orange font-display font-bold text-2xl mt-1">
            {data.avgOrderValue}
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-sm">
          <div className="text-gray-400 text-xs font-body uppercase">Today</div>
          <div className="text-toxic-green font-display font-bold text-lg mt-1">
            <div>{data.ordersToday} orders</div>
            <div className="text-sm">{data.revenueToday}</div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-6">
        <h4 className="text-sm font-display text-gray-400 uppercase mb-4">Top Products</h4>
        <div className="space-y-3">
          {data.topProducts.map((product, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300 font-body text-sm">{product.name}</span>
                <span className="text-shit-yellow font-display font-bold">{product.sales}</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-sm overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-shit-yellow to-industrial-orange"
                  style={{
                    width: `${(product.sales / maxSales) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
