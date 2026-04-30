"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Zap, TrendingUp, BarChart3, Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { BorderBeam } from "@/components/magicui/border-beam";
import { apiFetch } from "@/lib/api";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { getUserId } from "@/lib/auth";

type Timeframe = "monthly" | "weekly" | "yearly";

interface CategoryRow { name: string; amount: number; pct: number; }
interface Observation { title: string; description: string; }

const COLORS = ["bg-black","bg-slate-700","bg-slate-500","bg-slate-400","bg-slate-300","bg-slate-200"];

interface IncomeStats { stability_score: number; monthly_avg: number; }
interface CashflowStats { savings_rate: number; net_flow: number; }

export default function InsightsPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [incomeStats, setIncomeStats] = useState<IncomeStats | null>(null);
  const [cashflowStats, setCashflowStats] = useState<CashflowStats | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const uid = getUserId();
      if (!uid) {
        setLoading(false);
        return;
      }

      const [breakdownRes, obsRes, summaryRes] = await Promise.all([
        apiFetch(`/insights/category-breakdown/${uid}`),
        apiFetch(`/insights/ai-observations/${uid}`),
        apiFetch(`/dashboard/summary/${uid}`),
      ]);

      if (breakdownRes?.categories) {
        const total = breakdownRes.categories.reduce((s: number, c: any) => s + c.amount, 0);
        const rows: CategoryRow[] = breakdownRes.categories.map((c: any) => ({
          name: c.name,
          amount: c.amount,
          pct: c.percentage
        })).sort((a: CategoryRow, b: CategoryRow) => b.amount - a.amount);
        setCategories(rows);
        setTotalSpent(total);
      }

      if (obsRes?.observations) {
        const obs: Observation[] = obsRes.observations.map((o: any) => ({
          title: o.title,
          description: o.description
        }));
        setObservations(obs.slice(0, 6));
      }

      if (summaryRes) {
        setIncomeStats({
          stability_score: 85,
          monthly_avg: summaryRes.user?.income ?? 0
        });
        setCashflowStats({
          savings_rate: summaryRes.spending?.month?.savings_rate ?? 0,
          net_flow: summaryRes.spending?.month?.savings ?? 0
        });
      }

    } catch {
      toast.error("Failed to load insights");
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <main className="h-screen flex flex-col pt-24 px-6 pb-10 overflow-hidden font-body bg-transparent">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

        <header className="shrink-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-xs text-muted-foreground font-medium w-fit mb-3">
            <Zap size={12} /> AI Insights Engine
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-5xl font-semibold tracking-tight text-foreground">Spending Insights</h1>
            {!loading && (incomeStats || cashflowStats) && (
              <div className="flex items-center gap-3 mb-1">
                {incomeStats && (
                  <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 rounded-full px-4 py-1.5 text-xs font-semibold">
                    <TrendingUp size={12} />
                    Income Stability: {incomeStats.stability_score}/100
                  </div>
                )}
                {cashflowStats && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full px-4 py-1.5 text-xs font-semibold">
                    Savings Rate: {cashflowStats.savings_rate.toFixed(1)}%
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow min-h-0">

          {/* Main Table */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-0">
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-full min-h-0">
              <BorderBeam colorFrom="#000" colorTo="#000" size={300} duration={6} />

              <div className="px-8 pt-8 pb-6 border-b border-border/50 shrink-0 relative z-10">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                      <BarChart3 size={16} className="text-background" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live from SandInsight</span>
                  </div>
                  <div className="relative">
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value as Timeframe)}
                      className="appearance-none bg-secondary/50 text-foreground font-semibold text-xs uppercase tracking-wider px-4 py-2 pr-10 rounded-full focus:outline-none border border-border/50 cursor-pointer"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <h2 className="text-2xl font-semibold text-foreground">Category Breakdown</h2>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Total</p>
                    <p className="text-3xl font-semibold tracking-tighter">{loading ? "—" : `₹${totalSpent.toLocaleString("en-IN")}`}</p>
                  </div>
                </div>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[2fr_1fr_1fr_0.5fr] divide-x divide-border/50 border-b border-border/50 shrink-0 relative z-10 bg-secondary/10">
                {["Category","Amount","Share","Simulate"].map(h => (
                  <div key={h} className="px-8 py-3">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-y-auto flex-grow min-h-0 relative z-10 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {loading ? (
                  <div className="flex items-center justify-center h-full"><Loader2 size={28} className="animate-spin text-slate-300" /></div>
                ) : categories.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No data. Link your account first.</div>
                ) : (
                  <div className="divide-y divide-border/30">
                    {categories.map((cat, idx) => (
                      <div key={cat.name} className="grid grid-cols-[2fr_1fr_1fr_0.5fr] items-center px-8 py-5 hover:bg-white/40 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0 group-hover:scale-105 transition-transform", COLORS[idx % COLORS.length])}>
                            {cat.name.slice(0, 2).toUpperCase()}
                          </div>
                          <p className="text-sm font-semibold text-foreground">{cat.name}</p>
                        </div>
                        <p className="text-sm font-semibold text-foreground">₹{cat.amount.toLocaleString("en-IN")}</p>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-foreground rounded-full" style={{ width: `${cat.pct}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground">{cat.pct.toFixed(0)}%</span>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Link href={`/dashboard/simulation?category=${encodeURIComponent(cat.name)}`}>
                            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all">
                              <TrendingUp size={13} />
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Observations */}
          <div className="lg:col-span-4 flex flex-col h-full min-h-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4 shrink-0">AI Observations</h3>
            <div className="space-y-3 overflow-y-auto flex-grow min-h-0 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pb-6">
              {loading ? (
                Array(4).fill(0).map((_, i) => <div key={i} className="h-20 rounded-2xl border border-border/50 bg-white/60 animate-pulse" />)
              ) : observations.length === 0 ? (
                <p className="text-xs text-muted-foreground px-2">No observations yet.</p>
              ) : (
                observations.map((obs, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-border/50 bg-white/60 hover:bg-white hover:shadow-sm transition-all relative overflow-hidden shrink-0">
                    <BorderBeam colorFrom="#000" colorTo="#000" size={100} duration={10} />
                    <div className="flex items-start gap-3 relative z-10">
                      <div className="w-7 h-7 rounded-lg bg-black text-white text-[10px] font-black flex items-center justify-center shrink-0">{idx + 1}</div>
                      <div>
                        <p className="text-xs font-bold text-foreground mb-0.5">{obs.title}</p>
                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">{obs.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
