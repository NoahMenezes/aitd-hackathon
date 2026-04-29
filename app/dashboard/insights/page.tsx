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
    <main className="h-screen flex flex-col pt-8 px-6 pb-10 overflow-hidden font-body bg-transparent">
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
          {/* Main Chart Card */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-0">
            <div className="bg-white/80 backdrop-blur-md p-8 border border-border shadow-sm relative overflow-hidden flex flex-col h-full min-h-0">
              <BorderBeam colorFrom="#000" colorTo="#000" size={300} duration={6} />
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-8 border-b border-border/50 relative z-10 shrink-0">
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Your Spendings
                  </h3>
                  <div className="relative inline-block group">
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value as Timeframe)}
                      className="appearance-none bg-foreground text-background font-semibold text-sm px-6 py-3 pr-12 rounded-full hover:opacity-90 transition-all cursor-pointer focus:outline-none border-none shadow-md"
                    >
                      <option value="yearly">Yearly View</option>
                      <option value="monthly">Monthly View</option>
                      <option value="weekly">Weekly View</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-background transition-colors" />
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Total Spending
                  </p>
                  <h2 className="text-5xl font-semibold text-foreground tracking-tighter">
                    ₹{timeframeData.reduce((acc, cat) => acc + cat.amount, 0).toLocaleString("en-IN")}
                  </h2>
                </div>
              </div>

              <div className="space-y-4 relative z-10 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent flex-grow min-h-0">
                {timeframeData.map((cat) => (
                  <div key={cat.name} className="group/item py-5 px-6 border border-border bg-white/50 backdrop-blur-sm rounded-xl transition-all duration-300 hover:bg-white hover:shadow-md relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 relative z-10">
                      {/* Category Label */}
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center text-white transition-transform group-hover/item:scale-110",
                          cat.color
                        )}>
                          {cat.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground tracking-tight mb-1">
                            {cat.name}
                          </p>
                          <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {cat.percentage} of total
                          </span>
                        </div>
                      </div>
                      
                      {/* Centered Amount */}
                      <div className="text-center">
                        <span className="text-xl font-semibold text-foreground tracking-tight">
                          ₹{cat.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      
                      {/* Right Aligned Button */}
                      <div className="flex justify-end">
                        <Link href={`/dashboard/simulation?category=${encodeURIComponent(cat.name)}`}>
                          <button className="px-6 py-2 bg-foreground text-background rounded-full text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm active:scale-95">
                            Simulate <TrendingUp size={14} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between text-muted-foreground relative z-10 shrink-0">
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
