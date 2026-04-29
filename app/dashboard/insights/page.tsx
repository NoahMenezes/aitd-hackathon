"use client";

import React, { useState } from "react";
import { useDashboard } from "@/lib/DashboardContext";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Zap,
  TrendingUp,
  ShoppingBag,
  Truck,
  Calendar,
  MoreHorizontal,
  ChevronDown,
  Clock,
  Building2,
  CheckCircle2,
  BarChart3,
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
  const totalSpend = timeframeData.reduce((acc, cat) => acc + cat.amount, 0);

  const spendingPatterns = [
    {
      title: "Late Night Impulse",
      body: "35% of your food spend occurs after 10 PM. Consider earlier meal planning.",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      title: "Weekend Spend Surge",
      body: "Spending increases by 140% on Saturdays compared to your weekday average.",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      title: "Merchant Loyalty",
      body: "You spend 60% of your shopping budget at just 2 recurring merchants.",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      title: "Subscription Efficiency",
      body: "You have 4 active subscriptions with consistent, healthy usage patterns.",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ];

  return (
    <main className="h-screen flex flex-col pt-24 px-6 pb-10 overflow-hidden font-body bg-transparent">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header matched to Homepage Hero style */}
        <header className="flex flex-col gap-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-xs text-muted-foreground font-medium w-fit">
            <Zap size={12} className="text-foreground" />
            {t.dashboard.insights.engine}
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
            {t.dashboard.insights.title}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow min-h-0">
          {/* Main Chart Card — Matched to Simulation "Current Pace" Template */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-0">
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-full min-h-0">
              <BorderBeam colorFrom="#000" colorTo="#000" size={300} duration={6} />
              
              {/* Refactored Header to match Simulation Template */}
              <div className="px-8 pt-8 pb-6 border-b border-border/50 shrink-0 relative z-10">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                      <BarChart3 size={16} className="text-background" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Spending Analysis
                    </span>
                  </div>
                  
                  {/* Integrated Timeframe Selector */}
                  <div className="relative inline-block group">
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value as Timeframe)}
                      className="appearance-none bg-secondary/50 text-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2 pr-10 rounded-full hover:bg-secondary transition-all cursor-pointer focus:outline-none border border-border/50"
                    >
                      <option value="yearly">Yearly View</option>
                      <option value="monthly">Monthly View</option>
                      <option value="weekly">Weekly View</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-1">
                      Your Spendings
                    </h2>
                    <p className="text-sm font-medium text-muted-foreground">
                      Detailed breakdown of outflows across major categories.
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Total {timeframe}
                    </p>
                    <h2 className="text-4xl font-semibold text-foreground tracking-tighter">
                      ₹{totalSpend.toLocaleString("en-IN")}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Grid Header (Matching Simulation layout) */}
              <div className="grid grid-cols-[1.5fr_1fr_1fr_0.5fr] divide-x divide-border/50 border-b border-border/50 shrink-0 relative z-10 bg-secondary/10">
                <div className="px-8 py-3"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Category</p></div>
                <div className="px-4 py-3 text-center"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Amount</p></div>
                <div className="px-4 py-3 text-center"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Impact</p></div>
                <div className="px-8 py-3 text-right"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Simulation</p></div>
              </div>

              <div className="overflow-y-auto flex-grow min-h-0 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent relative z-10">
                <div className="divide-y divide-border/30">
                  {timeframeData.map((cat) => (
                    <div key={cat.name} className="grid grid-cols-[1.5fr_1fr_1fr_0.5fr] items-center gap-4 px-8 py-5 hover:bg-white/40 transition-colors group">
                      {/* Col 1: Icon + Name */}
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-sm",
                          cat.color
                        )}>
                          {cat.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground tracking-tight">{cat.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Active Stream</p>
                        </div>
                      </div>
                      
                      {/* Col 2: Amount (Centered) */}
                      <div className="text-center">
                        <p className="text-base font-semibold text-foreground tracking-tight">
                          ₹{cat.amount.toLocaleString("en-IN")}
                        </p>
                      </div>
                      
                      {/* Col 3: Impact/Percentage */}
                      <div className="text-center">
                        <span className="text-[10px] font-semibold text-foreground bg-secondary px-3 py-1 rounded-full border border-border/50">
                          {cat.percentage}
                        </span>
                      </div>
                      
                      {/* Col 4: Action Button */}
                      <div className="flex justify-end">
                        <Link href={`/dashboard/simulation?category=${encodeURIComponent(cat.name)}`}>
                          <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all group/btn shadow-sm">
                            <TrendingUp size={14} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto px-8 py-4 border-t border-border/50 flex items-center justify-between text-muted-foreground relative z-10 shrink-0 bg-secondary/5">
                <p className="text-[10px] font-medium uppercase tracking-wider">
                  {t.dashboard.insights.synced}
                </p>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-border" />
                  <div className="w-1.5 h-1.5 rounded-full bg-border" />
                </div>
              </div>
            </div>
          </div>

          {/* Spending Patterns Side Cards */}
          <div className="lg:col-span-4 flex flex-col h-full min-h-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4 shrink-0">
              Spending Patterns
            </h3>
            <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pb-6 flex-grow min-h-0">
              {spendingPatterns.map((pattern, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-border/50 bg-white/60 backdrop-blur-sm flex gap-5 transition-all hover:bg-white hover:shadow-sm group relative overflow-hidden shrink-0"
                >
                  <BorderBeam colorFrom="#000" colorTo="#000" size={100} duration={10} />
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-foreground group-hover:text-background transition-all relative z-10">
                    {pattern.icon}
                  </div>
                  <div className="relative z-10">
                    <h4 className="font-semibold text-sm tracking-tight text-foreground mb-1">
                      {pattern.title}
                    </h4>
                    <p className="text-xs font-medium leading-relaxed text-muted-foreground">
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
