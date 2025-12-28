
import { PriceData, MarketStats } from '../types';

const BASE_URL = 'https://api.binance.com/api/v3';

export const fetchKlines = async (symbol: string = 'BTCUSDT', interval: string = '1m', limit: number = 100): Promise<PriceData[]> => {
  try {
    const response = await fetch(`${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
    const data = await response.json();
    return data.map((d: any) => ({
      time: d[0],
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
      volume: parseFloat(d[5]),
    }));
  } catch (error) {
    console.error('Error fetching klines:', error);
    return [];
  }
};

export const fetchMarketStats = async (symbol: string = 'BTCUSDT'): Promise<MarketStats | null> => {
  try {
    const response = await fetch(`${BASE_URL}/ticker/24hr?symbol=${symbol}`);
    const data = await response.json();
    return {
      price: parseFloat(data.lastPrice),
      change24h: parseFloat(data.priceChangePercent),
      high24h: parseFloat(data.highPrice),
      low24h: parseFloat(data.lowPrice),
      volume24h: parseFloat(data.quoteVolume),
    };
  } catch (error) {
    console.error('Error fetching market stats:', error);
    return null;
  }
};
