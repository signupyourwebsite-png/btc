
export interface PriceData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PredictionResult {
  direction: 'UP' | 'DOWN' | 'STABLE';
  targetPrice: number;
  confidence: number;
  reasoning: string;
  indicators: {
    rsi: number;
    ema7: number;
    ema25: number;
    macd: {
      value: number;
      signal: number;
      histogram: number;
    };
  };
}

export interface MarketStats {
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}
