import React, { useMemo, useState } from "react";
import { Check, Copy, Languages, Sparkles, Wand2 } from "lucide-react";

// デザイン部品（CardやButtonなど）を自前で用意
const Card = ({ children, className }) => (
  <div className={`rounded-[28px] border border-white/60 bg-white/75 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur ${className}`}>{children}</div>
);
const Button = ({ children, onClick, className, variant }) => (
  <button onClick={onClick} className={`inline-flex items-center justify-center px-4 py-2 transition ${className}`}>{children}</button>
);

const toneOptions = [
  { value: "natural", label: "そのままで自然" },
  { value: "warm", label: "やわらかく親しみ" },
  { value: "polite", label: "丁寧できちんと" },
  { value: "salesy", label: "売れやすく整える" },
  { value: "vintage", label: "ヴィンテージっぽく" },
  { value: "firm", label: "はっきり簡潔" },
];

const marketplaceOptions = [
  { value: "etsy", label: "Etsy向け" },
  { value: "ebay", label: "eBay向け" },
  { value: "general", label: "ふつうの英文" },
];

export default function App() {
  const [japaneseText, setJapaneseText] = useState("");
  const [tone, setTone] = useState("natural");
  const [marketplace, setMarketplace] = useState("etsy");
  const [englishOutput, setEnglishOutput] = useState("");

  const prompt = `Rewrite the following Japanese into ${tone}. Optimize for ${marketplace}.\n\nJapanese:\n${japaneseText}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="p-6 bg-white rounded-3xl shadow-sm">
          <h1 className="text-2xl font-bold">English Rewriter (mini)</h1>
          <p className="text-gray-500">日本語を海外向け英文に整えるツール</p>
        </header>

        <Card className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">① 日本語を入力</label>
            <textarea 
              className="w-full h-40 p-4 border rounded-2xl bg-white" 
              value={japaneseText} 
              onChange={(e) => setJapaneseText(e.target.value)}
              placeholder="ここに説明文を…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="p-3 border rounded-xl bg-white">
              {toneOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={marketplace} onChange={(e) => setMarketplace(e.target.value)} className="p-3 border rounded-xl bg-white">
              {marketplaceOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => setEnglishOutput("AI連携の準備完了！プロンプトをコピーして使ってください。")} className="flex-1 bg-black text-white rounded-2xl h-12">
              <Wand2 className="mr-2 h-4 w-4" /> プレビュー
            </Button>
            <Button onClick={() => { navigator.clipboard.writeText(prompt); alert("コピーしました！"); }} className="flex-1 bg-amber-400 text-black rounded-2xl h-12">
              <Languages className="mr-2 h-4 w-4" /> AIへ渡す文をコピー
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold mb-4 text-lg">AIに投げる文（プロンプト）</h2>
          <pre className="bg-gray-900 text-amber-200 p-4 rounded-xl text-sm whitespace-pre-wrap">{prompt}</pre>
        </Card>
      </div>
    </div>
  );
}
