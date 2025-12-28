
import React from 'react';
import { AreaChart, Area, XValue, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, XAxis } from 'recharts';
import { PriceData } from '../types';

interface MainChartProps {
  data: PriceData[];
}

const MainChart: React.FC<MainChartProps> = ({ data }) => {
  const chartData = data.slice(-50).map(d => ({
    time: new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    price: d.close,
  }));

  const minPrice = Math.min(...chartData.map(d => d.price)) * 0.9999;
  const maxPrice = Math.max(...chartData.map(d => d.price)) * 1.0001;

  return (
    <div className="h-[400px] w-full bg-zinc-900 border-glass rounded-xl p-4">
      <h3 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
        <i className="fa-solid fa-chart-line text-blue-500"></i>
        Biểu đồ giá 1 Phút (Live)
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#4b5563" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            domain={[minPrice, maxPrice]} 
            stroke="#4b5563" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            orientation="right"
            tickFormatter={(val) => `$${val.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
            itemStyle={{ color: '#3b82f6' }}
            labelStyle={{ color: '#a1a1aa' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MainChart;
