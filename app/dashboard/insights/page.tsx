"use client";

import React from "react";
import { useDashboard } from "@/lib/DashboardContext";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Zap,
  AlertCircle,
  Info,
  CheckCircle2,
  TrendingUp,
  ShoppingBag,
  Truck,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function InsightsPage() {
  const { foodSpend } = useDashboard();
  const { t } = useLanguage();

  const categories = [
    {
      name: "Food & Dining",
      amount: foodSpend,
      color: "bg-black",
      icon: <ShoppingBag size={14} />,
      percentage: "35%",
    },
    {
      name: "Shopping",
      amount: 4900,
      color: "bg-slate-600",
      icon: <ShoppingBag size={14} />,
      percentage: "22%",
    },
    {
      name: "Transport",
      amount: 2800,
      color: "bg-slate-400",
      icon: <Truck size={14} />,
      percentage: "12%",
    },
    {
      name: "Subscriptions",
      amount: 2100,
      color: "bg-slate-300",
      icon: <Calendar size={14} />,
      percentage: "8%",
    },
    {
      name: "Others",
      amount: 1400,
      color: "bg-slate-200",
      icon: <MoreHorizontal size={14} />,
      percentage: "5%",
    },
  ];

  const insights = [
    {
      title: "Weekend food spike",
      body: "You spend 2x more on food on weekends vs weekdays",
      type: "warn",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    {
      title: "Unused Subscriptions",
      body: "3 recurring charges detected with low usage patterns",
      type: "warn",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    {
      title: "Shopping trend rising",
      body: "Up 18% compared to last month average",
      type: "info",
      icon: <Info className="w-5 h-5" />,
    },
    {
      title: "Transport Optimized",
      body: "Steady spend — no action needed here",
      type: "good",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col pt-32 px-6 pb-20 overflow-x-hidden font-sans">
      <div className="max-w-[1400px] mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-black bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] w-fit shadow-sm">
            <Zap size={12} className="fill-white" />
            {t.dashboard.insights.engine}
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
            {t.dashboard.insights.title}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Chart Card */}
          <div className="lg:col-span-8">
            <div className="bg-white p-10 border border-border shadow-sm border-beam">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-2xl font-black text-black tracking-tighter mb-2 uppercase tracking-widest">
                    {t.dashboard.insights.allocation}
                  </h3>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
                    {t.dashboard.insights.distribution}
                  </p>
                </div>
                <div className="w-12 h-12 border border-black flex items-center justify-center text-black">
                  <TrendingUp size={24} />
                </div>
              </div>

              <div className="space-y-8">
                {categories.map((cat) => (
                  <div key={cat.name} className="group/item">
                    <div className="flex justify-between items-end mb-3">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-8 h-8 flex items-center justify-center text-white transition-transform group-hover/item:scale-110",
                            cat.color,
                          )}
                        >
                          {cat.icon}
                        </div>
                        <div>
                          <span className="text-sm font-black text-black uppercase tracking-widest">
                            {cat.name}
                          </span>
                          <span className="ml-3 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-0.5">
                            {cat.percentage}
                          </span>
                        </div>
                      </div>
                      <span className="text-lg font-black text-black tracking-tighter">
                        ₹{cat.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="h-1 bg-slate-100 border border-slate-200">
                      <div
                        className={cn(
                          "h-full transition-all duration-1000 ease-out",
                          cat.color,
                        )}
                        style={{ width: cat.percentage }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between text-slate-400">
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {t.dashboard.insights.synced}
                </p>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Insights Side Cards */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">
              {t.dashboard.insights.observations}
            </h3>
            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-8 border border-border flex gap-6 transition-all hover:scale-[1.02] hover:border-black bg-white group shadow-sm"
                >
                  <div className="w-12 h-12 border border-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all">
                    {insight.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-sm tracking-widest uppercase mb-2 text-black">
                      {insight.title}
                    </h4>
                    <p className="text-[13px] font-bold leading-relaxed text-slate-500 uppercase tracking-wide">
                      {insight.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
