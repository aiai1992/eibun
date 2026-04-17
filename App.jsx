import React, { useMemo, useState } from "react";
import { Check, Copy, Languages, Sparkles, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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

const examples = {
  etsy: {
    title: "ショップメッセージ / 商品説明",
    hint: "例：この商品は1980年代頃の日本製ヴィンテージブラウスです。小さなシミがありますが、全体として雰囲気のある一着です。",
  },
  ebay: {
    title: "出品文 / 購入者メッセージ",
    hint: "例：80sの日本製ヴィンテージTシャツです。薄い使用感はありますが、目立つダメージはありません。",
  },
  general: {
    title: "英文メッセージ全般",
    hint: "例：まとめ買いありがとうございます。発送は2営業日以内を予定しています。",
  },
};

function buildPrompt({ jp, tone, marketplace, preferences }) {
  const toneMap = {
    natural: "natural, simple, fluent English",
    warm: "warm, friendly, approachable English",
    polite: "polite and professional English",
    salesy: "conversion-aware English that still sounds human",
    vintage: "tasteful English suitable for vintage goods",
    firm: "clear, concise, boundary-setting English",
  };

  const marketMap = {
    etsy: "Optimize for Etsy listings or customer messages. Keep it natural, trustworthy, and handmade/vintage-friendly when relevant.",
    ebay: "Optimize for eBay listings or buyer communication. Keep it clear, practical, and search/listing friendly.",
    general: "Optimize for general English rewriting with clean, natural phrasing.",
  };

  const preferenceLines = preferences.length
    ? preferences.map((item) => `- ${item}`).join("
")
    : "- Keep the English intuitive and easy to read.";

  return `Rewrite the following Japanese into ${toneMap[tone]}. ${marketMap[marketplace]}

Requirements:
- Do not overtranslate.
- Keep the original meaning.
- Avoid awkward AI-sounding phrasing.
- If the text is for a product, prioritize clarity, condition, and trust.
- Output only the final English text.

Style preferences:
${preferenceLines}

Japanese:
${jp}`;
}

function buildPreview({ jp, tone, marketplace }) {
  if (!jp.trim()) return "";

  const prefix = marketplace === "etsy"
    ? "[Etsy-optimized output preview]"
    : marketplace === "ebay"
    ? "[eBay-optimized output preview]"
    : "[General output preview]";

  const toneLabel = toneOptions.find((t) => t.value === tone)?.label ?? "そのままで自然";

  return `${prefix}\nトーン: ${toneLabel}\n\nここに最終の英文を入れます。あとでAPI接続すれば自動化できます。`;
}

const quickActions = [
  { label: "商品説明", value: "商品説明" },
  { label: "購入者返信", value: "購入者への返信" },
  { label: "おまとめ交渉", value: "まとめ買いの交渉文" },
  { label: "注意書き", value: "ヴィンテージ商品の注意書き" },
];

const preferenceOptions = [
  { id: "easy", label: "直感的にわかりやすい英語" },
  { id: "short", label: "長すぎない" },
  { id: "natural", label: "不自然すぎない" },
  { id: "readable", label: "海外のお客さんが読みやすい" },
  { id: "trust", label: "安心感が伝わる" },
  { id: "condition", label: "状態が伝わりやすい" },
];

export default function EnglishRewriterMiniTool() {
  const [japaneseText, setJapaneseText] = useState("");
  const [tone, setTone] = useState("natural");
  const [marketplace, setMarketplace] = useState("etsy");
  const [englishOutput, setEnglishOutput] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState(["easy", "short", "natural", "readable"]);

  const selectedPreferenceLabels = useMemo(
    () => preferenceOptions
      .filter((option) => selectedPreferences.includes(option.id))
      .map((option) => option.label),
    [selectedPreferences]
  );

  const prompt = useMemo(
    () => buildPrompt({ jp: japaneseText, tone, marketplace, preferences: selectedPreferenceLabels }),
    [japaneseText, tone, marketplace, selectedPreferenceLabels]
  );

  const preview = useMemo(
    () => buildPreview({ jp: japaneseText, tone, marketplace }),
    [japaneseText, tone, marketplace]
  );

  const currentExample = examples[marketplace];

  const copyPrompt = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1400);
  };

  const copyOutput = async () => {
    if (!englishOutput) return;
    await navigator.clipboard.writeText(englishOutput);
    setCopiedOutput(true);
    window.setTimeout(() => setCopiedOutput(false), 1400);
  };

  const togglePreference = (id) => {
    setSelectedPreferences((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#fde68a_18%,_#fce7f3_42%,_#eef2ff_72%,_#f8fafc_100%)] p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full border-0 bg-amber-400 px-3 py-1 text-neutral-900 hover:bg-amber-400">English helper</Badge>
                <Badge variant="outline" className="rounded-full border-fuchsia-200 bg-white/80 px-3 py-1 text-fuchsia-700">JP → EN</Badge>
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">English Rewriter</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                  日本語を入れて、雰囲気を選んで、Etsy / eBay 向けの英文に整えるミニツール。
                  ボタン名も見た瞬間に迷わないように変えてあります。
                </p>
              </div>
            </div>

            </div>
        </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[28px] border-white/60 bg-white/75 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-2xl text-neutral-900">使い方</CardTitle>
              </div>
              <div className="rounded-[24px] bg-gradient-to-r from-amber-50 via-rose-50 to-violet-50 p-5 ring-1 ring-amber-100">
                <div className="space-y-3 text-sm leading-6 text-neutral-700 md:text-base">
                  <p><span className="font-semibold text-neutral-900">① 日本語で商品説明を埋める</span></p>
                  <p><span className="font-semibold text-neutral-900">② 英文の雰囲気を選ぶ</span></p>
                  <p><span className="font-semibold text-neutral-900">③ どこで使う？</span></p>
                  <p><span className="font-semibold text-neutral-900">④ こだわりを入れる</span><br />直感的にわかりやすい英語で、長すぎず、不自然すぎず、海外のお客さんが読みやすい形に整える。</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="jp" className="text-sm font-medium text-neutral-800">① 日本語で商品説明を埋める</Label>
                <Textarea
                  id="jp"
                  placeholder={currentExample.hint}
                  value={japaneseText}
                  onChange={(e) => setJapaneseText(e.target.value)}
                  className="min-h-[240px] rounded-[24px] border-white bg-white/95 text-base shadow-inner placeholder:text-neutral-400"
                />
                <p className="text-xs text-neutral-500">{currentExample.title}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-neutral-800">② 英文の雰囲気を選ぶ</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="rounded-[20px] border-white bg-white/95 h-12">
                      <SelectValue placeholder="雰囲気を選ぶ" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-neutral-800">③ どこで使う？</Label>
                  <Select value={marketplace} onValueChange={setMarketplace}>
                    <SelectTrigger className="rounded-[20px] border-white bg-white/95 h-12">
                      <SelectValue placeholder="用途を選ぶ" />
                    </SelectTrigger>
                    <SelectContent>
                      {marketplaceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-neutral-800">④ こだわりを入れる</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {preferenceOptions.map((option) => {
                    const checked = selectedPreferences.includes(option.id);
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-[20px] px-4 py-3 transition ${
                          checked
                            ? "bg-amber-50 ring-1 ring-amber-200"
                            : "bg-white/90 ring-1 ring-neutral-200"
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => togglePreference(option.id)}
                        />
                        <span className="text-sm text-neutral-800">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Button
                  className="h-14 rounded-[20px] bg-neutral-900 text-base font-medium text-white shadow-lg shadow-neutral-900/15 hover:bg-neutral-800"
                  onClick={() => setEnglishOutput(preview)}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  英文のたたき台を入れる
                </Button>
                <Button
                  variant="outline"
                  className="h-14 rounded-[20px] border-0 bg-gradient-to-r from-amber-300 via-orange-300 to-fuchsia-300 text-base font-medium text-neutral-900 shadow-lg shadow-orange-200/50 hover:opacity-95"
                  onClick={copyPrompt}
                >
                  <Languages className="mr-2 h-4 w-4" />
                  {copiedPrompt ? "プロンプトをコピーした" : "AIに投げる文をコピー"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="rounded-[28px] border-white/60 bg-white/75 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl text-neutral-900">AIに投げる文</CardTitle>
                <CardDescription>
                  Claude / ChatGPT / Gemini にそのまま貼る用。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-[22px] bg-neutral-900 p-4 text-sm leading-6 text-neutral-100 whitespace-pre-wrap shadow-inner">
                  {prompt || "ここにAIへ渡す文が出ます。まず左側に日本語を入れてください。"}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-white/60 bg-white/75 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-3">
                <div>
                  <CardTitle className="text-xl text-neutral-900">完成した英文</CardTitle>
                  <CardDescription>
                    出てきた英文をここに置いて、すぐコピーできるようにする。
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-0 bg-emerald-100 px-4 text-emerald-700 hover:bg-emerald-200"
                  onClick={copyOutput}
                >
                  {copiedOutput ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copiedOutput ? "コピー完了" : "英文をコピー"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={englishOutput}
                  onChange={(e) => setEnglishOutput(e.target.value)}
                  placeholder="ここに英文を入れる"
                  className="min-h-[240px] rounded-[24px] border-white bg-white/95 text-base shadow-inner placeholder:text-neutral-400"
                />
                <div className="rounded-[20px] bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-100">
                  今はフロントだけ。次にAPIをつなげると、この画面だけで自動英訳できます。
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
