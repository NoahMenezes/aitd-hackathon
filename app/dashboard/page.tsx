"use client";

import React, { useState } from "react";
import { useDashboard } from "@/lib/DashboardContext";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Building2,
  Wallet,
  ArrowRightLeft,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Zap,
  ArrowDownRight,
  ShoppingCart,
  Coffee,
  ShieldCheck,
  RefreshCcw,
  Lightbulb,
  Calendar,
  Clock,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const {
    isLinked,
    setIsLinked,
    balance,
    transactions,
    foodSpend,
    handlePurchase,
  } = useDashboard();
  const { t } = useLanguage();
  const [isLinking, setIsLinking] = useState(false);

  const handleLinkBank = () => {
    setIsLinking(true);
    setTimeout(() => {
      setIsLinked(true);
      setIsLinking(false);
    }, 1500);
  };

  if (!isLinked) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans pt-20">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-md w-full bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 p-10 text-center space-y-8 relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner transition-all duration-500 hover:scale-105">
            <Building2 className="w-10 h-10 text-indigo-600" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {t.dashboardAuth.connectYourWealth}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed px-4 font-medium">
              {t.dashboardAuth.finPilotUsesAA}
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <button
              onClick={handleLinkBank}
              disabled={isLinking}
              className="w-full bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-300"
            >
              {isLinking ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                  {t.dashboardAuth.requestingConsent}
                </>
              ) : (
                <>
                  {t.dashboardAuth.linkViaAccountAggregator}
                  <ArrowRightLeft className="w-4 h-4" />
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 py-2">
              <ShieldCheck size={14} className="text-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {t.dashboardAuth.rbiBothCompliant}
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col pt-32 px-6 pb-20 overflow-x-hidden font-sans">
      <div className="max-w-[1400px] mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
              <Zap size={12} className="fill-indigo-600" />
              {t.dashboard.overview.subtitle}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              {t.dashboard.overview.title}
            </h1>
          </div>
          <div className="bg-white/70 backdrop-blur-xl px-6 py-4 rounded-[2rem] text-xs font-bold flex items-center gap-4 border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>{t.dashboard.overview.aaStatus}</span>
            </div>
          </div>
        </header>

        {/* Metrics Row - Refined with Glassmorphism and better alignment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 border border-white shadow-xl shadow-slate-200/20 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {t.dashboard.overview.yearlySpending}
              </p>
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Calendar size={18} />
              </div>
            </div>
            <div>
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter mb-2">
                ₹6,42,800
              </h2>
              <span className="text-[11px] font-black bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md tracking-widest uppercase">
                {t.dashboard.overview.perYear}
              </span>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 border border-white shadow-xl shadow-slate-200/20 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {t.dashboard.overview.monthlySpending}
              </p>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Clock size={18} />
              </div>
            </div>
            <div>
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter mb-2">
                ₹{(foodSpend + 13900).toLocaleString("en-IN")}
              </h2>
              <span className="text-[11px] font-black bg-green-50 text-green-600 px-3 py-1.5 rounded-md tracking-widest uppercase">
                {t.dashboard.overview.perMonth}
              </span>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 border border-white shadow-xl shadow-slate-200/20 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {t.dashboard.overview.weeklySpending}
              </p>
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Activity size={18} />
              </div>
            </div>
            <div>
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter mb-2">
                ₹18,400
              </h2>
              <span className="text-[11px] font-black bg-orange-50 text-orange-600 px-3 py-1.5 rounded-md tracking-widest uppercase">
                {t.dashboard.overview.perWeek}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Highest Spending Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-10 border border-white shadow-2xl shadow-slate-200/30 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 group-hover:opacity-[0.07] transition-all duration-700">
              <Coffee size={200} />
            </div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
                  <Coffee size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">
                    {t.dashboard.overview.warningTitle}
                  </p>
                  <p className="text-lg font-black text-slate-900 tracking-tight uppercase">
                    {t.dashboard.overview.warningAnalysis}
                  </p>
                </div>
              </div>

              <p className="text-xl font-bold text-slate-600 leading-relaxed mb-10">
                {t.dashboard.overview.warningBody.replace("{amount}", foodSpend.toLocaleString("en-IN"))}
              </p>

              <div className="mt-auto">
                <Link href="/dashboard/recommendations">
                  <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3">
                    {t.dashboard.overview.viewRecommendations} <ArrowRightLeft size={16} />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Potential Consequences Card */}
          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] border border-white shadow-xl shadow-slate-200/20 flex flex-col justify-between group">
            <div className="flex flex-col h-full">
              <div className="flex items-start gap-5 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 shadow-inner shrink-0">
                  <AlertCircle size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-red-900 uppercase tracking-widest mb-1">
                    {t.dashboard.overview.consequencesTitle}
                  </p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    {t.dashboard.overview.consequencesBody}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-10">
                <Link href="/dashboard/simulation" className="w-full">
                  <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20">
                    {t.dashboard.overview.redirectSimulation}
                    <ArrowRightLeft size={16} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
