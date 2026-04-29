"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Truck,
  Calendar,
  MoreHorizontal,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useDashboard, type SelectedPlan, type PlanKey } from "@/lib/DashboardContext";

// ─── Data ────────────────────────────────────────────────────────────────────

const ALL_CATEGORIES = [
  { name: "Food & Dining", icon: ShoppingBag, monthly: 7500, yearly: 90000, trend: "+12%" },
  { name: "Shopping", icon: ShoppingBag, monthly: 4900, yearly: 58800, trend: "+8%" },
  { name: "Transport", icon: Truck, monthly: 2800, yearly: 33600, trend: "+3%" },
  { name: "Subscriptions", icon: Calendar, monthly: 2100, yearly: 25200, trend: "+0%" },
  { name: "Others", icon: MoreHorizontal, monthly: 1400, yearly: 16800, trend: "+5%" },
];

const TOTAL_MONTHLY = 18700;
const TOTAL_YEARLY = 224400;
const TOTAL_3YR = 673200;

const CATEGORY_PLANS: Record<string, { easy: number; moderate: number; hard: number }> = {
  "Food & Dining": { easy: 10, moderate: 20, hard: 35 },
  "Shopping": { easy: 8, moderate: 18, hard: 30 },
  "Transport": { easy: 5, moderate: 12, hard: 20 },
  "Subscriptions": { easy: 5, moderate: 15, hard: 25 },
  "Others": { easy: 5, moderate: 10, hard: 20 },
};

const ADHERENCE = { easy: 88, moderate: 62, hard: 29 };

const PLAN_DEFS: Record<PlanKey, { label: string; description: string; steps: string[]; yearlySavings: number; feasibility: string }> = {
  easy: {
    label: "Easy",
    description: "Small painless changes with minimal lifestyle disruption.",
    steps: ["Reduce food orders by 2/week", "Cancel 1 unused subscription", "Limit weekend shopping to ₹2,000"],
    yearlySavings: 18000,
    feasibility: "High chance you'll follow this",
  },
  moderate: {
    label: "Moderate",
    description: "Noticeable impact with consistent, manageable effort.",
    steps: ["Reduce food orders by 4/week", "Cancel all unused subscriptions", "Set ₹1,200 weekly shopping cap"],
    yearlySavings: 30000,
    feasibility: "Good chance you'll follow this",
  },
  hard: {
    label: "Hard",
    description: "Aggressive cuts — maximum savings with strict discipline.",
    steps: ["Cook at home — limit dining out to 1x/week", "Cancel all non-essential subscriptions", "No impulse purchases — 24hr rule"],
    yearlySavings: 48000,
    feasibility: "Requires strong discipline",
  },
};

const EFFORT_COLOR: Record<string, string> = {
  easy: "text-emerald-700 bg-emerald-50 border-emerald-200",
  moderate: "text-amber-700 bg-amber-50 border-amber-200",
  hard: "text-red-700 bg-red-50 border-red-200",
};

// ─── Component ────────────────────────────────────────────────────────────────

function SimulationContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedPlanKey, setSelectedPlanKey] = useState<PlanKey>("moderate");
  const { selectedPlan, setSelectedPlan } = useDashboard();

  const isCategory = !!categoryParam;
  const catData = isCategory
    ? ALL_CATEGORIES.find((c) => c.name === categoryParam) ?? ALL_CATEGORIES[0]
    : null;

  const paceMonthly = isCategory ? catData!.monthly : TOTAL_MONTHLY;
  const paceYearly = isCategory ? catData!.yearly : TOTAL_YEARLY;
  const pace3yr = isCategory ? catData!.yearly * 3 : TOTAL_3YR;
  const paceTrend = isCategory ? catData!.trend : "+7%";

  const planCuts = isCategory
    ? CATEGORY_PLANS[catData!.name] ?? { easy: 10, moderate: 20, hard: 30 }
    : { easy: 10, moderate: 20, hard: 30 };

  const cutPct = planCuts[selectedPlanKey];
  const monthlySave = Math.round((paceMonthly * cutPct) / 100);
  const yearlySave = monthlySave * 12;
  const adherence = ADHERENCE[selectedPlanKey];

  const improvementRows = isCategory
    ? null
    : ALL_CATEGORIES.map((cat) => {
      const pct = CATEGORY_PLANS[cat.name]?.[selectedPlanKey] ?? 10;
      const save = Math.round((cat.monthly * pct) / 100);
      return { ...cat, cut_pct: pct, monthly_save: save, yearly_save: save * 12 };
    });

  const handleFollowPlan = (key: PlanKey) => {
    const def = PLAN_DEFS[key];
    const plan: SelectedPlan = {
      key,
      label: def.label,
      steps: def.steps,
      yearlySavings: def.yearlySavings,
      feasibility: def.feasibility,
      effort: key,
      startedAt: new Date().toISOString(),
    };
    setSelectedPlan(plan);
    setSelectedPlanKey(key);
  };

  return (
    <main className="h-screen flex flex-col pt-24 px-6 pb-10 overflow-hidden font-body bg-transparent">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Header */}
        <header className="flex flex-col gap-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-xs text-muted-foreground font-medium w-fit">
            <Zap size={12} className="text-foreground" />
            Spending Simulator
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
            {isCategory
              ? <><span>Simulation: </span><span className="text-muted-foreground">{catData!.name}</span></>
              : <><span>Simulation: </span><span className="text-muted-foreground">Overall Spending</span></>}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow min-h-0">

          {/* LEFT: Current Pace */}
          <section className="flex flex-col min-h-0">
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-full min-h-0">
              <BorderBeam colorFrom="#000" colorTo="#000" size={250} duration={6} />

              <div className="px-8 pt-8 pb-6 border-b border-border/50 shrink-0 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                    <TrendingUp size={16} className="text-background" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Current Pace
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
                  Baseline Projection
                </h2>
                <p className="text-sm font-medium text-muted-foreground">
                  {isCategory
                    ? <>Based on {catData!.name} spend of <span className="text-foreground font-semibold">₹{paceMonthly.toLocaleString("en-IN")}/mo</span></>
                    : <>Based on total monthly spend of <span className="text-foreground font-semibold">₹{paceMonthly.toLocaleString("en-IN")}</span></>}
                </p>
              </div>

              {!isCategory && (
                <div className="grid grid-cols-3 divide-x divide-border/50 border-b border-border/50 shrink-0 relative z-10">
                  {[
                    { label: "Per Month", value: `₹${paceMonthly.toLocaleString("en-IN")}` },
                    { label: "Per Year", value: `₹${paceYearly.toLocaleString("en-IN")}` },
                    { label: "3-Year", value: `₹${pace3yr.toLocaleString("en-IN")}` },
                  ].map((item) => (
                    <div key={item.label} className="px-6 py-5 text-center">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-xl font-semibold text-foreground tracking-tight">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {isCategory && (
                <div className="grid grid-cols-2 divide-x divide-border/50 border-b border-border/50 shrink-0 relative z-10">
                  <div className="px-8 py-4">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Financial Status</p>
                  </div>
                  <div className="px-8 py-4">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cost</p>
                  </div>
                </div>
              )}

              <div className="overflow-y-auto flex-grow min-h-0 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent relative z-10">
                {isCategory ? (
                  <div className="divide-y divide-border/30">
                    {[
                      { status: "Monthly Spend", cost: `₹${paceMonthly.toLocaleString("en-IN")}` },
                      { status: "Yearly Spend", cost: `₹${paceYearly.toLocaleString("en-IN")}` },
                      { status: "3-Year Projection", cost: `₹${pace3yr.toLocaleString("en-IN")}` },
                      { status: "Monthly Trend", cost: paceTrend, highlight: true },
                    ].map((row) => (
                      <div key={row.status} className="grid grid-cols-2 divide-x divide-border/30 hover:bg-white/40 transition-colors">
                        <div className="px-8 py-5 text-sm font-medium text-muted-foreground">{row.status}</div>
                        <div className="px-8 py-5">
                          <span className={row.highlight
                            ? "text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full"
                            : "text-2xl font-semibold text-foreground tracking-tight"
                          }>{row.cost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-border/30">
                    {ALL_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <div key={cat.name} className="grid grid-cols-[1.5fr_1fr_1fr_0.5fr] items-center gap-4 px-8 py-5 hover:bg-white/40 transition-colors group rounded-xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <Icon size={14} className="text-foreground" />
                            </div>
                            <p className="text-sm font-semibold text-foreground tracking-tight">{cat.name}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-base font-semibold text-foreground tracking-tight">
                              ₹{cat.monthly.toLocaleString("en-IN")}
                              <span className="text-[10px] text-muted-foreground font-medium ml-1">/mo</span>
                            </p>
                          </div>
                          <div className="text-right px-4">
                            <p className="text-base font-semibold text-foreground tracking-tight">
                              ₹{cat.yearly.toLocaleString("en-IN")}
                              <span className="text-[10px] text-muted-foreground font-medium ml-1 whitespace-nowrap">/yr</span>
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                              {cat.trend}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT: Plan Options */}
          <section className="flex flex-col min-h-0">
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-full min-h-0">
              <BorderBeam colorFrom="#000" colorTo="#000" size={250} duration={6} />

              <div className="px-8 pt-8 pb-6 border-b border-border/50 shrink-0 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                    <TrendingDown size={16} className="text-background" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Choose Your Plan
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                  Improvement Options
                </h2>
                {selectedPlan && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-xs font-semibold text-emerald-700">
                      Active: {selectedPlan.label} Plan
                    </p>
                  </div>
                )}
              </div>

              <div className="overflow-y-auto flex-grow min-h-0 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent relative z-10">
                <div className="divide-y divide-border/30">
                  {(["easy", "moderate", "hard"] as PlanKey[]).map((key) => {
                    const def = PLAN_DEFS[key];
                    const cuts = planCuts[key];
                    const monthly = Math.round((paceMonthly * cuts) / 100);
                    const yearly = monthly * 12;
                    const adherenceVal = ADHERENCE[key];
                    const isActive = selectedPlan?.key === key;

                    return (
                      <div
                        key={key}
                        className={cn(
                          "px-8 py-6 hover:bg-white/40 transition-colors group",
                          isActive && "bg-emerald-50/40"
                        )}
                      >
                        {/* Plan Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {isActive && <CheckCircle2 size={16} className="text-emerald-600" />}
                            <span className="text-sm font-semibold text-foreground">{def.label}</span>
                            {key === "easy" && (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Recommended
                              </span>
                            )}
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider",
                            EFFORT_COLOR[key]
                          )}>
                            {def.label}
                          </span>
                        </div>

                        {/* Plan Steps */}
                        <div className="space-y-1.5 mb-4">
                          {def.steps.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <ChevronRight size={12} className="text-muted-foreground shrink-0" />
                              <p className="text-xs font-medium text-muted-foreground">{step}</p>
                            </div>
                          ))}
                        </div>

                        {/* Savings & Adherence */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Annual Savings</p>
                            <p className="text-xl font-semibold text-foreground tracking-tight">
                              ₹{yearly.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Adherence</p>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-foreground rounded-full"
                                  style={{ width: `${adherenceVal}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-foreground">{adherenceVal}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Follow This Plan Button */}
                        <button
                          onClick={() => handleFollowPlan(key)}
                          className={cn(
                            "w-full py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                            isActive
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-foreground text-background hover:opacity-90 shadow-sm"
                          )}
                        >
                          {isActive ? (
                            <><CheckCircle2 size={14} /> Following this plan</>
                          ) : (
                            <><Sparkles size={13} /> Follow this plan</>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function SimulationPage() {
  return (
    <Suspense fallback={
      <main className="h-screen flex items-center justify-center bg-transparent">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground animate-pulse">Loading simulation…</div>
      </main>
    }>
      <SimulationContent />
    </Suspense>
  );
}
