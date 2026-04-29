"use client";

import React, { useState } from "react";
import { useDashboard } from "@/lib/DashboardContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Zap, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SimulationPage() {
  const { foodSpend } = useDashboard();
  const { t } = useLanguage();
  const [reduction, setReduction] = useState(20);

  const monthlySave = Math.round((foodSpend * reduction) / 100 / 100) * 100;
  const yearlySave = monthlySave * 12;

  const plans = [
    {
      tag: "Easy",
      saving: "₹9k/yr",
      cut: "10% cut",
      prob: "90%",
      color: "bg-emerald-500",
      width: "w-[90%]",
    },
    {
      tag: "Best fit",
      saving: "₹18k/yr",
      cut: "20% cut",
      prob: "65%",
      color: "bg-blue-500",
      width: "w-[65%]",
      highlight: true,
    },
    {
      tag: "Hard",
      saving: "₹27k/yr",
      cut: "30% cut",
      prob: "25%",
      color: "bg-orange-500",
      width: "w-[25%]",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col pt-32 px-6 pb-20 overflow-x-hidden font-sans">
      <div className="max-w-[1400px] mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest w-fit">
            <Zap size={12} className="fill-indigo-600" />
            {t.dashboard.simulation.simulator}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            {t.dashboard.simulation.title}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white p-10 border border-border shadow-sm space-y-10 border-beam">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {t.dashboard.simulation.question}
                </h3>
                <div className="space-y-6 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">
                      {t.dashboard.simulation.reduceBy}
                    </span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {reduction}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={reduction}
                    onChange={(e) => setReduction(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>5%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-border flex justify-between items-center hover:scale-[1.01] transition-transform">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    {t.dashboard.simulation.monthlySaving}
                  </span>
                  <span className="text-2xl font-black text-black">
                    ₹{monthlySave.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="bg-white p-6 border border-border flex justify-between items-center hover:scale-[1.01] transition-transform">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    {t.dashboard.simulation.yearlySaving}
                  </span>
                  <span className="text-2xl font-black text-black">
                    ₹{yearlySave.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {t.dashboard.simulation.comparePlans}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.tag}
                      className={cn(
                        "p-8 border transition-all hover:scale-[1.02] hover:border-black text-center space-y-4",
                        plan.highlight
                          ? "border-black bg-white shadow-lg"
                          : "border-border bg-white",
                      )}
                    >
                      <span className="text-[10px] font-black px-3 py-1 border border-black uppercase tracking-widest">
                        {plan.tag}
                      </span>
                      <div className="text-2xl font-black text-black tracking-tighter">
                        {plan.saving}
                      </div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        {plan.cut}
                      </div>
                      <div className="space-y-2">
                        <div className="h-1 bg-slate-100 overflow-hidden">
                          <div className={cn("h-full bg-black", plan.width)} />
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {plan.prob} {t.dashboard.simulation.likely}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 border border-black/5 flex items-center gap-6">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center shrink-0 border-beam">
                  <Sparkles size={24} />
                </div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed">
                  {t.dashboard.simulation.advice}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-white border border-border p-10 space-y-8 shadow-sm hover:shadow-xl transition-all border-beam">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-black">
                  {t.dashboard.simulation.impactTitle}
                </h3>
              </div>
              <p className="text-slate-500 text-[13px] font-bold leading-relaxed uppercase tracking-wide">
                {t.dashboard.simulation.impactBody}
              </p>
              <div className="pt-8 border-t border-border">
                <button className="w-full bg-black text-white font-black py-4 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]">
                  {t.dashboard.simulation.commitGoal}
                  <CheckCircle2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
