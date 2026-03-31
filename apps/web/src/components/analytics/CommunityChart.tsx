'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CommunityData {
  totalMemesCreated: number;
  totalVotes: number;
  avgVotesPerMeme: number;
  activeCreators: number;
  contestEntries: number;
  contestVoteTotal: number;
}

const CommunityChart: React.FC<{ data: CommunityData }> = ({ data }) => {
  // Simulate community growth over days
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    memes: Math.floor(data.totalMemesCreated / 7) + Math.floor(Math.random() * 50),
    votes: Math.floor(data.totalVotes / 7) + Math.floor(Math.random() * 1000),
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#8B4513" />
        <XAxis dataKey="day" stroke="#CCCCCC" />
        <YAxis stroke="#CCCCCC" yAxisId="left" />
        <YAxis stroke="#CCCCCC" yAxisId="right" orientation="right" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A1A1A',
            border: '2px solid #F4D03F',
            borderRadius: '4px',
          }}
          labelStyle={{ color: '#F4D03F' }}
        />
        <Line yAxisId="left" type="monotone" dataKey="memes" stroke="#F4D03F" strokeWidth={2} />
        <Line yAxisId="right" type="monotone" dataKey="votes" stroke="#39FF14" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CommunityChart;
