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
            <div className="w-px h-4 bg-slate-100" />
            <span className="text-slate-400 font-mono">
              FIP: HDFC-BANK-XX1234
            </span>
          </div>
        </header>

        {/* Metrics Row - Refined with Glassmorphism and better alignment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Total spent
              </p>
              <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <TrendingUp size={14} />
              </div>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
              ₹{(foodSpend + 13900).toLocaleString("en-IN")}
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md tracking-widest uppercase">
                April 2026
              </span>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Potential Savings
              </p>
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Sparkles size={14} />
              </div>
            </div>
            <h2 className="text-4xl font-black text-green-600 tracking-tighter">
              ₹5,200
            </h2>
            <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              per month average
            </p>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Savings rate
              </p>
              <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <TrendingDown size={14} />
              </div>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
              12%
            </h2>
            <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Benchmarked at 20%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Food Warning Card - More professional and actionable */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-10 border border-white shadow-2xl shadow-slate-200/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 group-hover:opacity-[0.07] transition-all duration-700">
                <Coffee size={200} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
                    <Coffee size={28} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Excessive Food Spend Detected
                    </h3>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                      Analysis: 35% above benchmark
                    </p>
                  </div>
                </div>

                <p className="text-lg font-bold text-slate-600 leading-relaxed mb-8 max-w-xl">
                  Your food delivery spending is currently taking up{" "}
                  <span className="text-orange-600 font-black">35%</span> of
                  your monthly budget. Our AI predicts significant long-term
                  impact.
                </p>

                <div className="flex flex-wrap gap-4 mb-10">
                  <Link href="/dashboard/simulation">
                    <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3">
                      View Simulation <ArrowRightLeft size={16} />
                    </button>
                  </Link>
                </div>

                <div className="bg-red-50/50 border border-red-100 rounded-[1.5rem] p-6 flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-red-900 font-black text-[11px] uppercase tracking-widest mb-1">
                      Risk Assessment
                    </p>
                    <p className="text-red-700 font-bold text-sm leading-relaxed">
                      At this rate, you'll spend{" "}
                      <span className="font-black underlineDecoration">
                        ₹2,56,800
                      </span>{" "}
                      on food delivery by year-end.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions - Cleaner, more list-like */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 border border-white shadow-2xl shadow-slate-200/20">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  Recent Activity
                </h3>
                <button className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 px-4 py-2 rounded-lg">
                  View History
                </button>
              </div>
              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.map((txn, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-6 rounded-2xl bg-white border border-slate-50 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 shadow-inner flex items-center justify-center text-red-500 group-hover:bg-red-50 transition-colors">
                          <ArrowDownRight className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900 tracking-tight">
                            {txn.narration.split("/")[1]}
                          </p>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            {new Date(
                              txn.transactionTimestamp,
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-slate-900">
                          -₹{txn.amount.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          Confirmed • {txn.mode}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                      Awaiting new transactions via AA webhook...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-10%] opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-1000">
                  <div className="w-64 h-64 bg-indigo-500 rounded-full blur-[80px]" />
                </div>

                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <ShoppingCart size={20} />
                  </div>
                  Merchant Sandbox
                </h3>

                <div className="space-y-4 relative z-10">
                  <button
                    onClick={() => handlePurchase("Swiggy", 350, "Food")}
                    className="w-full bg-white/5 hover:bg-white hover:text-slate-900 border border-white/10 hover:border-white transition-all p-6 rounded-2xl flex items-center justify-between group/btn"
                  >
                    <div className="flex items-center gap-5">
                      <div className="bg-white/10 p-3 rounded-xl group-hover/btn:bg-slate-100 transition-colors">
                        <Coffee className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-[13px] tracking-tight">
                          Order Lunch
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          Swiggy • Food
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-xl tracking-tighter">
                      ₹350
                    </span>
                  </button>

                  <button
                    onClick={() => handlePurchase("Zepto", 1800, "Food")}
                    className="w-full bg-white/5 hover:bg-white hover:text-slate-900 border border-white/10 hover:border-white transition-all p-6 rounded-2xl flex items-center justify-between group/btn"
                  >
                    <div className="flex items-center gap-5">
                      <div className="bg-white/10 p-3 rounded-xl group-hover/btn:bg-slate-100 transition-colors">
                        <ShoppingCart className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-[13px] tracking-tight">
                          Quick Groceries
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          Zepto • Food
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-xl tracking-tighter">
                      ₹1,800
                    </span>
                  </button>
                </div>

                <div className="mt-10 p-6 bg-black/40 rounded-2xl border border-white/5 font-mono text-[10px] text-green-400 space-y-2 h-32 overflow-hidden shadow-inner relative z-10">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-slate-500 uppercase font-black tracking-widest">
                      FI_READY LISTENER
                    </span>
                  </div>
                  <p className="opacity-40">
                    [{new Date().toLocaleTimeString()}] Waiting for
                    FI_NOTIFICATION...
                  </p>
                  {transactions.length > 0 && (
                    <p className="text-indigo-400 animate-in fade-in slide-in-from-top-2 duration-300">
                      [{new Date().toLocaleTimeString()}] RECEIVED G02 REBIT
                      JSON
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl shadow-slate-200/20 flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-inner">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    ReBIT Protocol
                  </p>
                  <p className="text-sm font-black text-slate-900 tracking-tight">
                    v2.0.0 Standard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
