"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Zap, TrendingUp, TrendingDown, ChevronRight, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useDashboard, type SelectedPlan, type PlanKey } from "@/lib/DashboardContext";
import { apiFetch } from "@/lib/api";
import { toast } from "react-hot-toast";
import { getUserId } from "@/lib/auth";

const PLAN_DEFS: Record<PlanKey, { label: string; steps: string[]; feasibility: string; cutPct: number }> = {
  easy:     { label: "Easy",     steps: ["Reduce food orders by 2/week", "Cancel 1 unused subscription", "Limit weekend shopping to ₹2,000"], feasibility: "High chance you'll follow this", cutPct: 10 },
  moderate: { label: "Moderate", steps: ["Reduce food orders by 4/week", "Cancel all unused subscriptions", "Set ₹1,200 weekly shopping cap"],   feasibility: "Good chance you'll follow this", cutPct: 20 },
  hard:     { label: "Hard",     steps: ["Cook at home — limit dining out to 1×/week", "Cancel all non-essential subs", "24hr rule on impulse buys"], feasibility: "Requires strong discipline", cutPct: 30 },
};
const EFFORT_COLOR: Record<string, string> = {
  easy: "text-emerald-700 bg-emerald-50 border-emerald-200",
  moderate: "text-amber-700 bg-amber-50 border-amber-200",
  hard: "text-red-700 bg-red-50 border-red-200",
};
const ADHERENCE = { easy: 88, moderate: 62, hard: 29 };

function SimulationContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { selectedPlan, setSelectedPlan } = useDashboard();

  const [catTotals, setCatTotals]   = useState<Record<string, number>>({});
  const [totalMonthly, setTotal]    = useState(0);
  const [loading, setLoading]       = useState(true);

  const [baseMonthly, setBaseMonthly] = useState(0);
  const [baseYearly, setBaseYearly] = useState(0);
  const [base3yr, setBase3yr] = useState(0);
  const [simLoading, setSimLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const uid = getUserId();
      if (!uid) {
        setLoading(false);
        return;
      }
      const res = await apiFetch(`/insights/category-breakdown/${uid}`);
      const totals: Record<string, number> = {};
      (res?.categories || []).forEach((c: any) => { totals[c.name] = c.amount; });
      setCatTotals(totals);
      
      const tMonthly = Object.values(totals).reduce((s, v) => s + v, 0);
      setTotal(tMonthly);

      const bMonthly = categoryParam ? (totals[categoryParam] ?? 0) : tMonthly;
      setBaseMonthly(bMonthly);
      setBaseYearly(bMonthly * 12);
      setBase3yr(bMonthly * 36);
    } catch {
      toast.error("Could not load spending data");
    } finally {
      setLoading(false);
    }
  }, [categoryParam]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFollowPlan = async (key: PlanKey) => {
    const def = PLAN_DEFS[key];
    const uid = getUserId();
    if (!uid) return;

    setSimLoading(true);
    try {
      let yearlySave = Math.round(baseMonthly * def.cutPct / 100) * 12;

      // Only hit the API if simulating a specific category
      if (categoryParam) {
        const res = await apiFetch(`/simulation/run/${uid}`, {
          method: "POST",
          body: JSON.stringify({
            category: categoryParam,
            target_reduction: def.cutPct,
            time_horizon_months: 12
          })
        });
        if (res.total_projected_savings) {
          yearlySave = res.total_projected_savings;
        }
      }

      const plan: SelectedPlan = {
        key, label: def.label, steps: def.steps,
        yearlySavings: yearlySave, feasibility: def.feasibility,
        effort: key, startedAt: new Date().toISOString(),
      };
      setSelectedPlan(plan);
      toast.success(`${def.label} plan activated! 🎯`);
    } catch (err: any) {
      toast.error(err.message || "Simulation failed");
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col pt-24 px-6 pb-10 overflow-hidden font-body bg-transparent">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

        <header className="shrink-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-xs text-muted-foreground font-medium w-fit mb-3">
            <Zap size={12} /> Spending Simulator
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-foreground">
            {categoryParam ? <><span>Simulation: </span><span className="text-muted-foreground">{categoryParam}</span></> : "Overall Simulation"}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow min-h-0">

          {/* LEFT: Baseline */}
          <section className="flex flex-col min-h-0">
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-full min-h-0">
              <BorderBeam colorFrom="#000" colorTo="#000" size={250} duration={6} />
              <div className="px-8 pt-8 pb-6 border-b border-border/50 shrink-0 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"><TrendingUp size={16} className="text-background" /></div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Pace</span>
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Baseline Projection</h2>
              </div>

              {!categoryParam && (
                <div className="grid grid-cols-3 divide-x divide-border/50 border-b border-border/50 shrink-0 relative z-10">
                  {[["Per Month", `₹${baseMonthly.toLocaleString("en-IN")}`], ["Per Year", `₹${baseYearly.toLocaleString("en-IN")}`], ["3-Year", `₹${base3yr.toLocaleString("en-IN")}`]].map(([l, v]) => (
                    <div key={l} className="px-6 py-5 text-center">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{l}</p>
                      <p className="text-xl font-semibold text-foreground">{loading ? "—" : v}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="overflow-y-auto flex-grow min-h-0 relative z-10 scrollbar-thin scrollbar-thumb-border">
                {loading ? (
                  <div className="flex items-center justify-center h-full"><Loader2 size={28} className="animate-spin text-slate-300" /></div>
                ) : (
                  <div className="divide-y divide-border/30">
                    {Object.entries(catTotals)
                      .filter(([name]) => !categoryParam || name === categoryParam)
                      .sort(([, a], [, b]) => b - a)
                      .map(([name, amt]) => (
                        <div key={name} className="grid grid-cols-[2fr_1fr_1fr] items-center gap-4 px-8 py-5 hover:bg-white/40 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-[10px] font-black group-hover:scale-105 transition-transform">
                              {name.slice(0, 2).toUpperCase()}
                            </div>
                            <p className="text-sm font-semibold text-foreground">{name}</p>
                          </div>
                          <p className="text-sm font-semibold text-foreground">₹{Math.round(amt).toLocaleString("en-IN")}<span className="text-[10px] text-muted-foreground ml-1">/mo</span></p>
                          <p className="text-sm font-semibold text-foreground text-right">₹{Math.round(amt * 12).toLocaleString("en-IN")}<span className="text-[10px] text-muted-foreground ml-1">/yr</span></p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT: Plans */}
          <section className="flex flex-col min-h-0">
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-full min-h-0">
              <BorderBeam colorFrom="#000" colorTo="#000" size={250} duration={6} />
              <div className="px-8 pt-8 pb-6 border-b border-border/50 shrink-0 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"><TrendingDown size={16} className="text-background" /></div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Choose Your Plan</span>
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Improvement Options</h2>
                {selectedPlan && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-xs font-semibold text-emerald-700">Active: {selectedPlan.label} Plan</p>
                  </div>
                )}
              </div>

              <div className="overflow-y-auto flex-grow min-h-0 scrollbar-thin scrollbar-thumb-border relative z-10">
                {(["easy", "moderate", "hard"] as PlanKey[]).map((key) => {
                  const def = PLAN_DEFS[key];
                  const yearlySave = Math.round(baseMonthly * def.cutPct / 100) * 12;
                  const isActive = selectedPlan?.key === key;
                  return (
                    <div key={key} className={cn("px-8 py-6 border-b border-border/30 hover:bg-white/40 transition-colors", isActive && "bg-emerald-50/40")}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {isActive && <CheckCircle2 size={15} className="text-emerald-600" />}
                          <span className="text-sm font-semibold text-foreground">{def.label}</span>
                          {key === "easy" && <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">Recommended</span>}
                        </div>
                        <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider", EFFORT_COLOR[key])}>{def.label}</span>
                      </div>
                      <div className="space-y-1.5 mb-4">
                        {def.steps.map((s, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <ChevronRight size={12} className="text-muted-foreground shrink-0" />
                            <p className="text-xs font-medium text-muted-foreground">{s}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Annual Savings</p>
                          <p className="text-xl font-semibold text-foreground">{loading ? "—" : `₹${yearlySave.toLocaleString("en-IN")}`}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Adherence</p>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-foreground rounded-full" style={{ width: `${ADHERENCE[key]}%` }} />
                            </div>
                            <span className="text-xs font-bold">{ADHERENCE[key]}%</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollowPlan(key)}
                        className={cn("w-full py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                          isActive ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-foreground text-background hover:opacity-90 shadow-sm"
                        )}
                      >
                        {isActive ? <><CheckCircle2 size={14} /> Following this plan</> : <><Sparkles size={13} /> Follow this plan</>}
                      </button>
                    </div>
                  );
                })}
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
    <Suspense fallback={<main className="h-screen flex items-center justify-center"><Loader2 size={28} className="animate-spin text-muted-foreground" /></main>}>
      <SimulationContent />
    </Suspense>
  );
}
