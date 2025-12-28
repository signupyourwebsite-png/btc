
import React, { useState, useEffect, useCallback } from 'react';
import { fetchKlines, fetchMarketStats } from './services/binanceService';
import { getPrediction } from './services/geminiService';
import { PriceData, MarketStats, PredictionResult } from './types';
import PriceTicker from './components/PriceTicker';
import MainChart from './components/MainChart';
import PredictionCard from './components/PredictionCard';

const App: React.FC = () => {
  const [klines, setKlines] = useState<PriceData[]>([]);
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const refreshData = useCallback(async () => {
    const [newKlines, newStats] = await Promise.all([
      fetchKlines('BTCUSDT', '1m', 100),
      fetchMarketStats('BTCUSDT')
    ]);
    
    if (newKlines.length > 0) setKlines(newKlines);
    if (newStats) setStats(newStats);
    setLastUpdate(new Date());
  }, []);

  const handlePredict = async () => {
    if (klines.length === 0 || isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      const result = await getPrediction(klines);
      setPrediction(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 15000); // Tự động cập nhật mỗi 15 giây
    return () => clearInterval(interval);
  }, [refreshData]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header / Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <i className="fa-solid fa-bolt-lightning text-white"></i>
            </div>
            <span className="font-black text-xl tracking-tighter">QUANTUM<span className="text-blue-500">BTC</span></span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              LIVE BINANCE API
            </span>
            <span className="hidden sm:block">Update: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        {/* Real-time Ticker */}
        <PriceTicker stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            <MainChart data={klines} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-zinc-900/50 border-glass p-4 rounded-xl">
                 <h4 className="text-zinc-500 text-xs uppercase font-bold mb-2">Biến động 24h</h4>
                 <p className={`text-xl font-bold ${stats && stats.change24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats ? `${stats.change24h}%` : '---'}
                 </p>
               </div>
               <div className="bg-zinc-900/50 border-glass p-4 rounded-xl">
                 <h4 className="text-zinc-500 text-xs uppercase font-bold mb-2">Xu hướng thị trường</h4>
                 <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-500 text-[10px] rounded border border-blue-500/30">SCALPING</span>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-500 text-[10px] rounded border border-purple-500/30">AI POWERED</span>
                 </div>
               </div>
               <div className="bg-zinc-900/50 border-glass p-4 rounded-xl">
                 <h4 className="text-zinc-500 text-xs uppercase font-bold mb-2">Độ trễ hệ thống</h4>
                 <p className="text-xl font-bold text-zinc-300">~240ms</p>
               </div>
            </div>
          </div>

          {/* AI Prediction Section */}
          <div className="space-y-6">
            <PredictionCard prediction={prediction} loading={isAnalyzing} />
            
            <button 
              onClick={handlePredict}
              disabled={isAnalyzing}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 
                ${isAnalyzing 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:-translate-y-1'
                }`}
            >
              {isAnalyzing ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Đang phân tích Quantum...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Dự đoán 1 Phút tới
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-zinc-500 px-4 leading-relaxed">
              * Dự báo chỉ mang tính chất tham khảo dựa trên thuật toán AI và phân tích kỹ thuật. Crypto là thị trường rủi ro cao, không phải lời khuyên đầu tư.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 border-t border-zinc-900 py-10 text-center">
        <p className="text-zinc-600 text-sm">Powered by Gemini 3 Pro & Binance Real-time Data</p>
        <div className="flex justify-center gap-6 mt-4 text-zinc-500">
          <i className="fa-brands fa-github hover:text-white cursor-pointer transition-colors"></i>
          <i className="fa-brands fa-twitter hover:text-white cursor-pointer transition-colors"></i>
          <i className="fa-brands fa-discord hover:text-white cursor-pointer transition-colors"></i>
        </div>
      </footer>
    </div>
  );
};

export default App;
