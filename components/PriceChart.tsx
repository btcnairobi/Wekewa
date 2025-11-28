import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MarketStat } from '../types';

interface PriceChartProps {
  data: MarketStat[];
  currentPrice: number;
  priceChange: number;
  selectedRange: string;
  onRangeChange: (range: string) => void;
  isLoading?: boolean;
}

const RANGES = ['1H', '1D', '1W', '1M', '1Y'];

const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  currentPrice, 
  priceChange, 
  selectedRange, 
  onRangeChange,
  isLoading = false
}) => {
  const isPositive = priceChange >= 0;

  return (
    <div className="h-72 sm:h-80 w-full bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">WLD/USD Price</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </p>
              <span className={`text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar">
            {RANGES.map(range => (
              <button
                key={range}
                onClick={() => onRangeChange(range)}
                className={`flex-1 sm:flex-none px-3 py-1 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                  selectedRange === range 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {range}
              </button>
            ))}
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0 relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fill: '#9ca3af'}} 
              dy={10}
              minTickGap={30}
            />
            <YAxis 
              hide={true} 
              domain={['dataMin', 'dataMax']} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#000', fontWeight: 'bold' }}
              formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={isPositive ? "#22c55e" : "#ef4444"} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;