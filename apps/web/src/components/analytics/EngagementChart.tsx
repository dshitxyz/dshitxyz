'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EngagementData {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  avgSessionDuration: string;
  bounceRate: string;
  returnVisitors: string;
}

const EngagementChart: React.FC<{ data: EngagementData }> = ({ data }) => {
  // Simulate weekly active user trends
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    week: `W${i + 1}`,
    active: Math.floor(data.weeklyActiveUsers / 7) + Math.floor(Math.random() * 500),
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#39FF14" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#8B4513" />
        <XAxis dataKey="week" stroke="#CCCCCC" />
        <YAxis stroke="#CCCCCC" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A1A1A',
            border: '2px solid #F4D03F',
            borderRadius: '4px',
          }}
          labelStyle={{ color: '#F4D03F' }}
        />
        <Area
          type="monotone"
          dataKey="active"
          stroke="#39FF14"
          fillOpacity={1}
          fill="url(#colorActive)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EngagementChart;
