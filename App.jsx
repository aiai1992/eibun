import React, { useState } from "react";
import { Wand2, Languages, Copy, Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const toneOptions = [
  { value: "natural", label: "そのままで自然" },
  { value: "warm", label: "やわらかく親しみ" },
  { value: "polite", label: "丁寧できちんと" },
  { value: "vintage", label: "ヴィンテージっぽく" }
];

export default function App() {
  const [jp, setJp] = useState("");
  const [tone, setTone] = useState("natural");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRewrite = async () => {
    if (!jp) return;
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Rewrite this Japanese into ${tone} English for an Etsy/eBay listing. Output ONLY the English text: ${jp}`;
      const result = await model.generateContent(prompt);
      setOutput(result.response.text());
    } catch (e) {
      setOutput("エラー：APIキーの設定を確認してください。");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <h1 className="text-2xl font-bold mb-2">English Rewriter</h1>
          <textarea 
            className="w-full h-48 p-4 border rounded-2xl mb-4 bg-slate-50"
            placeholder="日本語を入力..."
            value={jp}
            onChange={(e) => setJp(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4 mb-6">
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="p-3 border rounded-xl">
              {toneOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button 
              onClick={handleRewrite}
              disabled={loading}
              className="bg-black text-white rounded-xl font-bold hover:opacity-80 disabled:bg-slate-300"
            >
              {loading ? "翻訳中..." : "英訳する"}
            </button>
          </div>
          {output && (
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-amber-800">完成した英文</span>
                <button onClick={() => {navigator.clipboard.writeText(output); alert("コピーしました！")}} className="text-amber-800"><Copy size={16}/></button>
              </div>
              <p className="text-slate-800 leading-relaxed">{output}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
