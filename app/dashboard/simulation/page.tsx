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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/magicui/border-beam";

// ─── Hardcoded data — swap with real backend responses later ────────────────

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

const PLAN_META = {
  easy: { label: "Easy", description: "Small painless changes. Reduce discretionary spend slightly." },
  moderate: { label: "Moderate", description: "Balanced reductions. Noticeable impact with manageable effort." },
  hard: { label: "Hard", description: "Aggressive cuts. Maximum savings, requires strict discipline." },
};

type PlanKey = "easy" | "moderate" | "hard";

function SimulationContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("moderate");

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

  const cutPct = planCuts[selectedPlan];
  const monthlySave = Math.round((paceMonthly * cutPct) / 100);
  const yearlySave = monthlySave * 12;
  const adherence = ADHERENCE[selectedPlan];

  const improvementRows = isCategory
    ? null
    : ALL_CATEGORIES.map((cat) => {
      const pct = CATEGORY_PLANS[cat.name]?.[selectedPlan] ?? 10;
      const save = Math.round((cat.monthly * pct) / 100);
      return { ...cat, cut_pct: pct, monthly_save: save, yearly_save: save * 12 };
    });

  return (
    <main className="h-screen flex flex-col pt-24 px-6 pb-10 overflow-hidden font-body bg-transparent">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Header matched to Homepage Hero style */}
        <header className="flex flex-col gap-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-xs text-muted-foreground font-medium w-fit">
            <Zap size={12} className="text-foreground" />
            Spending Simulator
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
            {isCategory
              ? <>Simulation: <span className="text-muted-foreground">{catData!.name}</span></>
              : <>Simulation: <span className="text-muted-foreground">Overall Spending</span></>}
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

          {/* RIGHT: Improvement Plan */}
          <section className="flex flex-col min-h-0">
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-full min-h-0">
              <BorderBeam colorFrom="#000" colorTo="#000" size={250} duration={6} />

              <div className="px-8 pt-8 pb-6 border-b border-border/50 shrink-0 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                    <TrendingDown size={16} className="text-background" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Optimization
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
                  Improvement Plan
                </h2>

                <div className="grid grid-cols-3 gap-2">
                  {(["easy", "moderate", "hard"] as PlanKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPlan(key)}
                      className={cn(
                        "py-2.5 px-4 rounded-full text-xs font-semibold transition-all border",
                        selectedPlan === key
                          ? "bg-foreground text-background border-foreground shadow-sm"
                          : "bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {PLAN_META[key].label}
                    </button>
                  ))}
                </div>
              </div>

              {isCategory && (
                <div className="grid grid-cols-2 divide-x divide-border/50 border-b border-border/50 shrink-0 relative z-10">
                  <div className="px-8 py-4"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Plan Metric</p></div>
                  <div className="px-8 py-4"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Value</p></div>
                </div>
              )}

              <div className="px-8 py-5 border-b border-border/30 shrink-0 relative z-10">
                <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                  {PLAN_META[selectedPlan].description}
                </p>
              </div>

              <div className="px-8 py-6 border-b border-border/50 shrink-0 relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">How likely you follow this plan</span>
                  <span className="text-sm font-bold text-foreground">{adherence}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full w-full overflow-hidden">
                  <div className="h-full bg-foreground transition-all duration-700 rounded-full" style={{ width: `${adherence}%` }} />
                </div>
              </div>

              <div className="overflow-y-auto flex-grow min-h-0 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent relative z-10">
                {isCategory ? (
                  <div className="divide-y divide-border/30">
                    {[
                      { metric: "Category", value: catData!.name, highlight: false },
                      { metric: "Reduction Target", value: `-${cutPct}%`, highlight: true },
                      { metric: "Monthly Saving", value: `₹${monthlySave.toLocaleString("en-IN")}`, highlight: false },
                      { metric: "Yearly Saving", value: `₹${yearlySave.toLocaleString("en-IN")}`, highlight: false },
                    ].map((row) => (
                      <div key={row.metric} className="grid grid-cols-2 divide-x divide-border/30 hover:bg-white/40 transition-colors">
                        <div className="px-8 py-5 text-sm font-medium text-muted-foreground">{row.metric}</div>
                        <div className="px-8 py-5">
                          <span className={row.highlight
                            ? "text-xs font-bold text-foreground bg-secondary px-3 py-1 rounded-full border border-border/50"
                            : row.metric === "Category"
                              ? "text-sm font-semibold text-foreground uppercase"
                              : "text-2xl font-semibold text-foreground tracking-tight"
                          }>{row.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-border/30">
                    {improvementRows!.map((row) => (
                      <div key={row.name} className="grid grid-cols-[1.5fr_1fr_1fr_0.5fr] items-center gap-4 px-8 py-5 hover:bg-white/40 transition-colors group rounded-xl">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-semibold text-foreground tracking-tight">{row.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-foreground bg-secondary px-1.5 py-0.5 rounded-sm">-{row.cut_pct}%</span>
                            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">target</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-base font-semibold text-foreground tracking-tight">
                            ₹{row.monthly_save.toLocaleString("en-IN")}
                            <span className="text-[10px] text-muted-foreground font-medium ml-1 whitespace-nowrap">save/mo</span>
                          </p>
                        </div>
                        <div className="text-right px-4">
                          <p className="text-base font-semibold text-foreground tracking-tight">
                            ₹{row.yearly_save.toLocaleString("en-IN")}
                            <span className="text-[10px] text-muted-foreground font-medium ml-1 whitespace-nowrap">save/yr</span>
                          </p>
                        </div>
                        <div className="flex justify-end">
                          <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
