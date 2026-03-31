'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CommerceData {
  totalOrders: number;
  totalRevenue: string;
  avgOrderValue: string;
  ordersToday: number;
  revenueToday: string;
  topProducts: Array<{ name: string; sales: number }>;
}

const CommerceChart: React.FC<{ data: CommerceData }> = ({ data }) => {
  // Create pie chart data from top products
  const chartData = (data.topProducts || []).slice(0, 4).map((product) => ({
    name: product.name.length > 20 ? product.name.substring(0, 17) + '...' : product.name,
    value: product.sales,
  }));

  const COLORS = ['#F4D03F', '#FF6600', '#FF0000', '#39FF14'];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A1A1A',
            border: '2px solid #F4D03F',
            borderRadius: '4px',
          }}
          labelStyle={{ color: '#F4D03F' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CommerceChart;
