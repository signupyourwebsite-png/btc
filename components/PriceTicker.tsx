
import React from 'react';
import { MarketStats } from '../types';

interface PriceTickerProps {
  stats: MarketStats | null;
}

const PriceTicker: React.FC<PriceTickerProps> = ({ stats }) => {
  if (!stats) return <div className="h-16 animate-pulse bg-zinc-800 rounded-lg"></div>;

  const isPositive = stats.change24h >= 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 p-4 bg-zinc-900 border-glass rounded-xl shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-500/10 rounded-full">
          <i className="fa-brands fa-bitcoin text-3xl text-orange-500"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold">BTC / USDT</h1>
          <p className="text-xs text-zinc-400">Binance Spot</p>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <span className={`text-3xl font-mono font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          ${stats.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
        <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{stats.change24h}%
        </span>
      </div>

      <div className="hidden md:flex gap-8 border-l border-zinc-800 pl-8">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">24h High</p>
          <p className="font-mono text-sm">${stats.high24h.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">24h Low</p>
          <p className="font-mono text-sm">${stats.low24h.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">24h Volume</p>
          <p className="font-mono text-sm">${(stats.volume24h / 1000000).toFixed(2)}M</p>
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;
