"use client";

import React from "react";
import {
  Zap,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

export default function RecommendationsPage() {
  const { t } = useLanguage();
  const recommendations = [
    {
      rank: 1,
      title: "Reduce food ordering",
      desc: "Cut 2 Swiggy/Zomato orders per week",
      impact: "Saves ₹18,000/year",
      color: "bg-orange-100 text-orange-700",
      query:
        "Why is reducing food the top recommendation for my financial profile?",
    },
    {
      rank: 2,
      title: "Cancel unused subscriptions",
      desc: "3 recurring charges with low usage detected",
      impact: "Saves ₹7,200/year",
      color: "bg-blue-100 text-blue-700",
      query: "Which subscriptions should I cancel and how was this detected?",
    },
    {
      rank: 3,
      title: "Set a weekend shopping limit",
      desc: "Your shopping spikes on weekends — a small cap helps",
      impact: "Saves ₹4,800/year",
      color: "bg-emerald-100 text-emerald-700",
      query:
        "How did you detect my weekend shopping pattern and what limit do you suggest?",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col pt-32 px-6 pb-20 overflow-x-hidden font-sans">
      <div className="max-w-[1400px] mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest w-fit">
            <Zap size={12} className="fill-indigo-600" />
            {t.dashboard.recommendations.aiRec}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            {t.dashboard.recommendations.title}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">
              {t.dashboard.recommendations.ranked}
            </p>
            <div className="bg-white p-10 border border-border shadow-sm border-beam">
              <div className="divide-y divide-slate-100">
                {recommendations.map((rec) => (
                  <div
                    key={rec.rank}
                    className="py-8 first:pt-0 last:pb-0 flex items-start gap-6 group"
                  >
                    <div className="w-10 h-10 border border-black flex items-center justify-center font-black shrink-0 mt-1 transition-transform group-hover:scale-110">
                      {rec.rank}
                    </div>
                    <div className="space-y-3 flex-1">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">
                          {rec.title}
                        </h4>
                        <p className="text-slate-500 font-medium">{rec.desc}</p>
                      </div>
                      <div className="text-black font-black text-xs uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={14} />
                        {rec.impact}
                      </div>
                      <button className="text-[10px] font-black text-black border border-black px-5 py-2 uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-2">
                        {t.dashboard.recommendations.whyThis}
                        <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-10 border border-border shadow-sm space-y-8 text-center border-beam">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                {t.dashboard.recommendations.totalPotential}
              </h3>
              <div className="space-y-2">
                <h2 className="text-6xl font-black text-black tracking-tighter">
                  ₹30,000
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t.dashboard.recommendations.perYear}
                </p>
              </div>
              <p className="text-slate-500 text-[13px] font-bold uppercase tracking-wide leading-relaxed px-4">
                {t.dashboard.recommendations.tripAdvice}
              </p>
              <div className="pt-8 border-t border-border">
                <button className="w-full bg-black text-white font-black py-5 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]">
                  {t.dashboard.recommendations.startSaving}
                  <Sparkles size={18} />
                </button>
              </div>
            </div>

            <div className="bg-white border border-black p-10 text-black space-y-6 shadow-xl relative overflow-hidden group border-beam">
              <h3 className="text-xl font-black uppercase tracking-tight relative z-10">
                {t.dashboard.recommendations.smartTracking}
              </h3>
              <p className="text-slate-600 text-[13px] font-bold uppercase tracking-wide leading-relaxed relative z-10">
                {t.dashboard.recommendations.smartBody}
              </p>
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center relative z-10">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
