
import { GoogleGenAI, Type } from "@google/genai";
import { PriceData, PredictionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getPrediction = async (history: PriceData[]): Promise<PredictionResult | null> => {
  const model = "gemini-3-pro-preview";
  
  // Format history for prompt
  const recentData = history.slice(-30).map(d => ({
    p: d.close,
    v: d.volume,
    t: new Date(d.time).toLocaleTimeString()
  }));

  const prompt = `Bạn là một chuyên gia Quant Trader hàng đầu thế giới chuyên về Hợp đồng tương lai Bitcoin trên sàn Binance.
Dựa trên dữ liệu 1 phút gần nhất của BTC/USDT (giá đóng cửa và khối lượng): ${JSON.stringify(recentData)}.

Hãy thực hiện:
1. Tính toán các chỉ số kỹ thuật: RSI(14), EMA(7), EMA(25), MACD.
2. Phân tích xu hướng dòng tiền (Order Flow) và áp lực mua bán.
3. Dự đoán biến động giá trong 1 PHÚT TIẾP THEO (Tăng, Giảm hay Đi ngang).
4. Đưa ra mức giá mục tiêu và độ tin cậy.

Yêu cầu giải thích chi tiết lý do dựa trên hành động giá (Price Action) và các chỉ báo.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            direction: { type: Type.STRING, description: "UP, DOWN, or STABLE" },
            targetPrice: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER, description: "Percentage from 0 to 100" },
            reasoning: { type: Type.STRING },
            indicators: {
              type: Type.OBJECT,
              properties: {
                rsi: { type: Type.NUMBER },
                ema7: { type: Type.NUMBER },
                ema25: { type: Type.NUMBER },
                macd: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.NUMBER },
                    signal: { type: Type.NUMBER },
                    histogram: { type: Type.NUMBER }
                  },
                  required: ["value", "signal", "histogram"]
                }
              },
              required: ["rsi", "ema7", "ema25", "macd"]
            }
          },
          required: ["direction", "targetPrice", "confidence", "reasoning", "indicators"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as PredictionResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};
