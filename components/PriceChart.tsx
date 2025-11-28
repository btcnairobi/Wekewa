import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MarketStat } from '../types';

interface PriceChartProps {
  data: MarketStat[];
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">WLD/USD Price</h3>
            <p className="text-2xl font-bold text-gray-900">$4.82 <span className="text-green-500 text-sm font-medium ml-2">+2.4%</span></p>
        </div>
        <div className="flex space-x-2">
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded text-gray-600 cursor-pointer">1H</span>
            <span className="px-2 py-1 text-xs font-medium bg-black text-white rounded cursor-pointer">24H</span>
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded text-gray-600 cursor-pointer">1W</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="75%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 12, fill: '#9ca3af'}} 
            dy={10}
          />
          <YAxis 
            hide={true} 
            domain={['dataMin - 0.1', 'dataMax + 0.1']} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            itemStyle={{ color: '#000' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#000000" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;