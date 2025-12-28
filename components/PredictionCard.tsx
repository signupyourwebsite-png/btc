
import React from 'react';
import { PredictionResult } from '../types';

interface PredictionCardProps {
  prediction: PredictionResult | null;
  loading: boolean;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, loading }) => {
  if (loading) {
    return (
      <div className="bg-zinc-900 border-glass rounded-xl p-8 flex flex-col items-center justify-center space-y-4 min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fa-solid fa-brain text-blue-500"></i>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-white">Đang tính toán...</h3>
          <p className="text-zinc-400 text-sm mt-1">Gemini AI đang phân tích hàng triệu điểm dữ liệu kỹ thuật.</p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="bg-zinc-900 border-glass rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
        <i className="fa-solid fa-robot text-4xl text-zinc-700 mb-4"></i>
        <h3 className="text-zinc-500 font-medium">Nhấn nút bên dưới để bắt đầu dự đoán</h3>
      </div>
    );
  }

  const directionColor = prediction.direction === 'UP' ? 'text-green-500' : prediction.direction === 'DOWN' ? 'text-red-500' : 'text-zinc-400';
  const bgColor = prediction.direction === 'UP' ? 'bg-green-500/10' : prediction.direction === 'DOWN' ? 'bg-red-500/10' : 'bg-zinc-800/50';

  return (
    <div className="bg-zinc-900 border-glass rounded-xl overflow-hidden shadow-2xl h-full flex flex-col">
      <div className={`p-6 ${bgColor} border-b border-glass flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${prediction.direction === 'UP' ? 'bg-green-500' : 'bg-red-500'}`}>
            <i className={`fa-solid ${prediction.direction === 'UP' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-white`}></i>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Dự đoán tiếp theo</h3>
            <p className={`text-2xl font-black ${directionColor}`}>
              {prediction.direction === 'UP' ? 'TĂNG GIÁ' : prediction.direction === 'DOWN' ? 'GIẢM GIÁ' : 'ĐI NGANG'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-400 mb-1">Độ tin cậy</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-mono font-bold">{prediction.confidence}%</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-grow overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
            <p className="text-xs text-zinc-500 mb-1">Giá mục tiêu (1m)</p>
            <p className="text-lg font-mono font-bold text-blue-400">${prediction.targetPrice.toLocaleString()}</p>
          </div>
          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
            <p className="text-xs text-zinc-500 mb-1">Chỉ số RSI</p>
            <p className="text-lg font-mono font-bold text-orange-400">{prediction.indicators.rsi.toFixed(2)}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <i className="fa-solid fa-magnifying-glass-chart text-blue-500"></i>
            Phân tích chuyên sâu
          </h4>
          <p className="text-sm text-zinc-300 leading-relaxed italic">
            "{prediction.reasoning}"
          </p>
        </div>

        <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-500 uppercase">Chỉ báo kỹ thuật Quantum</h4>
            <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] font-mono border border-zinc-700">EMA7: {prediction.indicators.ema7.toFixed(1)}</span>
                <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] font-mono border border-zinc-700">EMA25: {prediction.indicators.ema25.toFixed(1)}</span>
                <span className={`px-2 py-1 rounded text-[10px] font-mono border ${prediction.indicators.macd.histogram > 0 ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
                    MACD Hist: {prediction.indicators.macd.histogram.toFixed(4)}
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
