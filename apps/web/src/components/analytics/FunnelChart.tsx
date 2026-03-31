'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FunnelData {
  visitors: number;
  lurkers: number;
  natives: number;
  conversionRates: {
    visitorToLurker: string;
    lurkerToNative: string;
    visitorToNative: string;
  };
}

const FunnelChart: React.FC<{ data: FunnelData }> = ({ data }) => {
  const chartData = [
    {
      stage: 'Visitors',
      count: data.visitors,
      fill: '#FF6600',
    },
    {
      stage: 'Lurkers',
      count: data.lurkers,
      fill: '#F4D03F',
    },
    {
      stage: 'Natives',
      count: data.natives,
      fill: '#39FF14',
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#8B4513" />
        <XAxis dataKey="stage" stroke="#CCCCCC" />
        <YAxis stroke="#CCCCCC" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A1A1A',
            border: '2px solid #F4D03F',
            borderRadius: '4px',
          }}
          labelStyle={{ color: '#F4D03F' }}
        />
        <Bar dataKey="count" fill="#F4D03F" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FunnelChart;
