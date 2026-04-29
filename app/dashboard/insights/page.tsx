"use client";

import React, { useState } from "react";
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
  ChevronDown,
  Clock,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BorderBeam } from "@/components/magicui/border-beam";

type Timeframe = "yearly" | "monthly" | "weekly";

export default function InsightsPage() {
  const { foodSpend } = useDashboard();
  const { t } = useLanguage();
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");

  const dataMap = {
    monthly: [
      { name: "Food & Dining", amount: foodSpend, color: "bg-black", icon: <ShoppingBag size={14} />, percentage: "35%" },
      { name: "Shopping", amount: 4900, color: "bg-slate-600", icon: <ShoppingBag size={14} />, percentage: "22%" },
      { name: "Transport", amount: 2800, color: "bg-slate-400", icon: <Truck size={14} />, percentage: "12%" },
      { name: "Subscriptions", amount: 2100, color: "bg-slate-300", icon: <Calendar size={14} />, percentage: "8%" },
      { name: "Others", amount: 1400, color: "bg-slate-200", icon: <MoreHorizontal size={14} />, percentage: "5%" },
    ],
    yearly: [
      { name: "Food & Dining", amount: foodSpend * 12, color: "bg-black", icon: <ShoppingBag size={14} />, percentage: "38%" },
      { name: "Shopping", amount: 58000, color: "bg-slate-600", icon: <ShoppingBag size={14} />, percentage: "20%" },
      { name: "Transport", amount: 33600, color: "bg-slate-400", icon: <Truck size={14} />, percentage: "11%" },
      { name: "Subscriptions", amount: 25200, color: "bg-slate-300", icon: <Calendar size={14} />, percentage: "9%" },
      { name: "Others", amount: 16800, color: "bg-slate-200", icon: <MoreHorizontal size={14} />, percentage: "6%" },
    ],
    weekly: [
      { name: "Food & Dining", amount: Math.round(foodSpend / 4), color: "bg-black", icon: <ShoppingBag size={14} />, percentage: "32%" },
      { name: "Shopping", amount: 1225, color: "bg-slate-600", icon: <ShoppingBag size={14} />, percentage: "24%" },
      { name: "Transport", amount: 700, color: "bg-slate-400", icon: <Truck size={14} />, percentage: "13%" },
      { name: "Subscriptions", amount: 525, color: "bg-slate-300", icon: <Calendar size={14} />, percentage: "7%" },
      { name: "Others", amount: 350, color: "bg-slate-200", icon: <MoreHorizontal size={14} />, percentage: "4%" },
    ],
  };

  const timeframeData = dataMap[timeframe];

  const spendingPatterns = [
    {
      title: "Late Night Impulse",
      body: "35% of your food spend occurs after 10 PM. Consider earlier meal planning.",
      type: "warn",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      title: "Weekend Spend Surge",
      body: "Spending increases by 140% on Saturdays compared to your weekday average.",
      type: "warn",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      title: "Merchant Loyalty",
      body: "You spend 60% of your shopping budget at just 2 recurring merchants.",
      type: "info",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      title: "Subscription Efficiency",
      body: "You have 4 active subscriptions with consistent, healthy usage patterns.",
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
            <div className="bg-white p-10 border border-black shadow-sm relative overflow-hidden">
              <BorderBeam colorFrom="#000" colorTo="#000" size={300} />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 pb-12 border-b border-slate-50 relative z-10">
                <div>
                  <h3 className="text-[11px] font-black text-slate-400 tracking-[0.3em] uppercase mb-4">
                    Your Spendings
                  </h3>
                  <div className="relative inline-block group">
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value as Timeframe)}
                      className="appearance-none bg-black text-white font-black text-sm uppercase tracking-[0.2em] px-8 py-4 pr-14 hover:bg-slate-900 transition-all cursor-pointer focus:outline-none border-none shadow-xl"
                    >
                      <option value="yearly">Yearly View</option>
                      <option value="monthly">Monthly View</option>
                      <option value="weekly">Weekly View</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white transition-colors" />
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
                    Total Spending
                  </p>
                  <h2 className="text-6xl font-black text-black tracking-tighter">
                    ₹{timeframeData.reduce((acc, cat) => acc + cat.amount, 0).toLocaleString("en-IN")}
                  </h2>
                </div>
              </div>

              <div className="space-y-2 relative z-10 h-[250px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-black scrollbar-track-slate-50 mt-4">
                {timeframeData.map((cat) => (
                  <div key={cat.name} className="group/item py-4 px-6 border border-black bg-white transition-all duration-300 hover:scale-[1.01] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative overflow-hidden">
                    <BorderBeam colorFrom="#000" colorTo="#000" size={100} duration={8} />
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 relative z-10">
                      {/* Category Label */}
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 flex items-center justify-center text-white transition-transform group-hover/item:scale-110 shadow-lg",
                            cat.color,
                          )}
                        >
                          {cat.icon}
                        </div>
                        <div>
                          <p className="text-[12px] font-black text-black uppercase tracking-widest mb-1">
                            {cat.name}
                          </p>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-sm">
                            {cat.percentage}
                          </span>
                        </div>
                      </div>
                      
                      {/* Centered Amount */}
                      <div className="text-center">
                        <span className="text-xl font-black text-black tracking-tighter">
                          ₹{cat.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      
                      {/* Right Aligned Button */}
                      <div className="flex justify-end">
                        <Link href="/dashboard/simulation">
                          <button className="px-6 py-2 bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95">
                            Simulate <TrendingUp size={12} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between text-slate-400 relative z-10">
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

          {/* Spending Patterns Side Cards */}
          <div className="lg:col-span-4 space-y-6 h-[450px] flex flex-col">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-4 mb-4 shrink-0">
              Spending Patterns
            </h3>
            <div className="space-y-2 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-black scrollbar-track-slate-50 pb-6">
              {spendingPatterns.map((pattern, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-black flex gap-4 transition-all hover:scale-[1.02] hover:border-black bg-white group shadow-sm relative overflow-hidden shrink-0"
                >
                  <BorderBeam colorFrom="#000" colorTo="#000" size={80} duration={10} />
                  <div className="w-10 h-10 border border-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all relative z-10">
                    {pattern.icon}
                  </div>
                  <div className="relative z-10">
                    <h4 className="font-black text-[11px] tracking-widest uppercase mb-1 text-black">
                      {pattern.title}
                    </h4>
                    <p className="text-[11px] font-bold leading-tight text-slate-500 uppercase tracking-wide">
                      {pattern.body}
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
