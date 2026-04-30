"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDashboard } from "@/lib/DashboardContext";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import {
  Building2,
  ArrowRightLeft,
  ShieldCheck,
  RefreshCcw,
  Zap,
  Target,
  ChevronRight,
  Loader2,
  BellDot,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Activity,
  User,
  Smartphone,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { apiFetch } from "@/lib/api";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { getUserId } from "@/lib/auth";
import { X, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// No mock data or constants in production
type AAStep = "idle" | "discovering" | "consenting" | "completing" | "done";

interface MonthlyData {
  month: string;
  total_spent: number;
  total_earned: number;
}
interface Alert {
  type: string;
  title: string;
  description: string;
}
interface TodayData {
  total_spent: number;
  top_category: string;
  yesterday_total?: number;
  comparison?: string;
}
interface IncomeData {
  stability_score: number;
  monthly_avg: number;
}
interface CashflowData {
  savings_rate: number;
  net_flow: number;
}

export default function DashboardPage() {
  const { isLinked, setIsLinked, selectedPlan, checkingLink } = useDashboard();
  const { t } = useLanguage();

  // ── AA linking state ──────────────────────────────────────────────────────
  const [aaStep, setAaStep] = useState<AAStep>("idle");
  const [aaStatus, setAaStatus] = useState("");

  // ── Dashboard data ────────────────────────────────────────────────────────
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [holderName, setHolder] = useState("User");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [today, setToday] = useState<TodayData | null>(null);
  const [income, setIncome] = useState<IncomeData | null>(null);
  const [cashflow, setCashflow] = useState<CashflowData | null>(null);
  const [yearlySpent, setYearlySpent] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [weeklySpent, setWeeklySpent] = useState(0);
  const [topCategory, setTopCategory] = useState({ name: "Food & Dining", amount: 0 });
  const [showCalendar, setShowCalendar] = useState(false);
  const [dailySpendData, setDailySpendData] = useState<{ date: string; amount: number; top_category: string }[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  // ── Fetch real data from SandInsight ─────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const uid = getUserId();
      if (!uid) {
        setLoading(false);
        return;
      }

      const [summaryRes, trendRes, alertsRes, breakdownRes] = await Promise.all([
        apiFetch(`/dashboard/summary/${uid}`),
        apiFetch(`/dashboard/spending-trend/${uid}?view=monthly`),
        apiFetch(`/dashboard/alerts/${uid}`),
        apiFetch(`/insights/category-breakdown/${uid}?period=2026-04`),
      ]);

      let highestCategoryName = "Food & Dining";
      let highestCategoryAmount = 0;

      if (breakdownRes?.categories && breakdownRes.categories.length > 0) {
        // Find highest spending category
        const sorted = [...breakdownRes.categories].sort((a, b) => b.amount - a.amount);
        highestCategoryName = sorted[0].name;
        highestCategoryAmount = sorted[0].amount;
      }

      if (summaryRes) {
        setHolder(summaryRes.user?.name ?? "User");
        setBalance(summaryRes.user?.balance ?? 0);

        setYearlySpent(summaryRes.spending?.year?.total_spent ?? 0);
        setMonthlySpent(summaryRes.spending?.month?.total_spent ?? 0);
        setWeeklySpent(summaryRes.spending?.week?.total_spent ?? 0);

        setTopCategory({ name: highestCategoryName, amount: highestCategoryAmount });

        setIncome({
          stability_score: summaryRes.user?.stability_score ?? 88,
          monthly_avg: summaryRes.user?.income ?? 0,
        });

        setCashflow({
          savings_rate: summaryRes.spending?.month?.savings_rate ?? 0,
          net_flow: summaryRes.spending?.month?.savings ?? 0,
        });
      }

      if (trendRes?.data) {
        const monthlyMap: Record<string, number> = {};
        trendRes.data.forEach((item: any) => {
          if (item.date) {
            const month = item.date.substring(0, 7);
            monthlyMap[month] = (monthlyMap[month] || 0) + item.amount;
          }
        });
        const mappedMonthly = Object.entries(monthlyMap)
          .map(([month, amount]) => ({
            month,
            total_spent: amount,
            total_earned: 0,
          }))
          .sort((a, b) => a.month.localeCompare(b.month));
        setMonthly(mappedMonthly);

        // For "Today's Spend", we can use the last item in trendRes
        const lastItem = trendRes.data[trendRes.data.length - 1];
        const prevItem = trendRes.data[trendRes.data.length - 2];
        if (lastItem) {
          setToday({
            total_spent: lastItem.amount,
            top_category: "Mixed",
            yesterday_total: prevItem?.amount ?? 0,
          });
        }
      }

      if (alertsRes?.alerts) {
        setAlerts(
          alertsRes.alerts.map((a: any) => ({
            type: a.type || "warning",
            title: a.title,
            description: a.message || a.description,
          })),
        );
      }
    } catch (err: any) {
      toast.error("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDailyList = async () => {
    setCalendarLoading(true);
    try {
      const uid = getUserId();
      if (!uid) return;
      const res = await apiFetch(`/dashboard/daily-list/${uid}`);
      console.log("Daily List Response:", res);
      if (res?.status === "error") {
        toast.error(res.message || "Failed to load data");
      } else if (res?.days) {
        setDailySpendData(res.days);
      }
    } catch (err) {
      console.error("Calendar Fetch Error:", err);
      toast.error("Failed to load daily data");
    } finally {
      setCalendarLoading(false);
    }
  };

  useEffect(() => {
    if (isLinked) fetchData();
  }, [isLinked, fetchData]);

  // ── Guard: show spinner while sessionStorage is being checked ─────────────
  // (must be AFTER all hooks to comply with Rules of Hooks)
  if (checkingLink) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-slate-300" />
      </main>
    );
  }

  const handleLinkBank = async () => {
    setAaStep("completing");
    setAaStatus("Linking accounts & syncing real financial data...");
    try {
      const uid = getUserId();
      if (!uid) throw new Error("User not logged in");
      
      // We use the seed API to simulate fetching full history from the aggregator
      await apiFetch(`/seed/${uid}`, { method: "POST" });
      
      setAaStep("done");
      setAaStatus("Account linked! Loading your insights…");
      setIsLinked(true);
      toast.success("Account linked successfully! 🎉");
      
      // Refresh dashboard data
      fetchData();
    } catch (err: any) {
      setAaStep("idle");
      setAaStatus("");
      toast.error("Linking failed: " + err.message);
    }
  };

  // ── Aggregate metrics ─────────────────────────────────────────────────────
  // Computed vars removed

  const stepLabels: Record<AAStep, string> = {
    idle: "Link via Account Aggregator",
    discovering: "Step 1/3 — Discovering accounts…",
    consenting: "Step 2/3 — Creating consent…",
    completing: "Step 3/3 — Running AI engine…",
    done: "Linked!",
  };

  // ── Unauthenticated / unlinked state ─────────────────────────────────────
  if (!isLinked) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 pt-28 font-sans">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white p-10 space-y-8 relative overflow-hidden animate-in fade-in zoom-in duration-500">
          <BorderBeam colorFrom="#000" colorTo="#000" size={200} />

          <div className="text-center space-y-3 relative z-10">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-black/8">
              <Building2 className="w-8 h-8 text-slate-700" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-black">
              {t.dashboardAuth.connectYourWealth}
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              {t.dashboardAuth.finPilotUsesAA}
            </p>
          </div>

          {/* AA Step Progress */}
          {aaStep !== "idle" && (
            <div className="bg-slate-50 border border-black/8 rounded-xl p-4 space-y-2 relative z-10">
              {["discovering", "consenting", "completing"].map((s, idx) => (
                <div
                  key={s}
                  className={cn(
                    "flex items-center gap-3 text-xs font-semibold transition-all",
                    aaStep === s
                      ? "text-black"
                      : ["discovering", "consenting", "completing"].indexOf(
                            aaStep,
                          ) > idx
                        ? "text-emerald-600"
                        : "text-slate-300",
                  )}
                >
                  {["discovering", "consenting", "completing"].indexOf(aaStep) >
                  idx ? (
                    <CheckCircle2 size={14} />
                  ) : aaStep === s ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
                  )}
                  {idx === 0 && "Discover linked accounts"}
                  {idx === 1 && "Create AA consent"}
                  {idx === 2 && "AI engine processes data"}
                </div>
              ))}
              {aaStatus && (
                <p className="text-[10px] text-slate-400 font-medium pt-1 uppercase tracking-wider">
                  {aaStatus}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3 relative z-10">
            <button
              onClick={handleLinkBank}
              disabled={aaStep !== "idle" && aaStep !== "done"}
              className="w-full bg-black text-white font-black py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95 disabled:opacity-60 text-sm"
            >
              {aaStep !== "idle" && aaStep !== "done" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {stepLabels[aaStep]}
                </>
              ) : (
                <>
                  {stepLabels.idle} <ArrowRightLeft className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {t.dashboardAuth.rbiBothCompliant}
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Dashboard with real data ───────────────────────────────────────────────
  return (
    <main className="min-h-screen flex flex-col pt-32 px-6 pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-black/8 text-slate-600 text-[10px] font-black uppercase tracking-widest">
              <Zap size={11} /> {t.dashboard.overview.subtitle}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight">
              Welcome, {holderName.split(" ")[0]}
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Balance: ₹{balance.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              AA Linked · Live Data
            </div>
          </div>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/80 rounded-2xl border border-white shadow-xl p-10 min-h-[200px] animate-pulse flex items-center justify-center"
                  >
                    <Loader2
                      size={24}
                      className="text-slate-200 animate-spin"
                    />
                  </div>
                ))
            : [
                {
                  label: "Yearly Spent",
                  value: `₹${yearlySpent.toLocaleString("en-IN")}`,
                  sub: "Total this year",
                  Icon: Calendar,
                  color: "text-violet-600",
                  bg: "bg-violet-50",
                  onClick: () => {
                    setShowCalendar(true);
                    fetchDailyList();
                  },
                },
                {
                  label: "Monthly Spent",
                  value: `₹${monthlySpent.toLocaleString("en-IN")}`,
                  sub: "Latest month",
                  Icon: Clock,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Weekly Est.",
                  value: `₹${weeklySpent.toLocaleString("en-IN")}`,
                  sub: "This week (est.)",
                  Icon: Activity,
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
              ].map(({ label, value, sub, Icon, color, bg, onClick }, idx) => (
                <div
                  key={idx}
                  className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-xl p-10 flex flex-col justify-between min-h-[200px] overflow-hidden group hover:shadow-2xl transition-all"
                >
                  <BorderBeam
                    colorFrom="#000"
                    colorTo="#000"
                    size={150}
                    duration={8}
                    delay={idx * 2}
                  />
                  <div className="flex items-center justify-between relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {label}
                    </p>
                    <div
                      onClick={onClick}
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                        bg,
                        color,
                        onClick && "cursor-pointer hover:scale-110 active:scale-95"
                      )}
                    >
                      <Icon size={16} />
                    </div>
                  </div>
                  <div className="relative z-10 mt-4">
                    <p className="text-4xl font-black text-black tracking-tighter mb-2">
                      {value}
                    </p>
                    <span
                      className={cn(
                        "text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest",
                        bg,
                        color,
                      )}
                    >
                      {sub}
                    </span>
                  </div>
                </div>
              ))}
        </div>

        {/* Highest Spending & Consequences Cards */}
        {!loading && topCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Highest Spending Detected */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <span className="text-xl">☕</span>
                  </div>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                    Highest Spending Detected
                  </p>
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-4">
                  Category: {topCategory.name.toUpperCase()}
                </h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed mb-6">
                  Your {topCategory.name.toLowerCase()} spending is the highest this month, currently at ₹{topCategory.amount.toLocaleString("en-IN")}.
                </p>
              </div>
              <Link href="/dashboard/recommendations">
                <button className="bg-black text-white px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all w-fit flex items-center gap-2">
                  Get Recommendations <ArrowRightLeft size={12} />
                </button>
              </Link>
            </div>

            {/* Potential Consequences */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <span className="text-red-600">!</span>
                  </div>
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                    Potential Consequences
                  </p>
                </div>
                <p className="text-lg font-bold text-slate-800 leading-relaxed mt-4 mb-6">
                  At this rate, you will spend ₹{(topCategory.amount * 12).toLocaleString("en-IN")} per year on {topCategory.name.toLowerCase()} alone.
                </p>
              </div>
              <Link href={`/dashboard/simulation?category=${encodeURIComponent(topCategory.name)}`}>
                <button className="bg-black text-white px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all w-full flex items-center justify-center gap-2">
                  Redirect to Simulation <ArrowRightLeft size={12} />
                </button>
              </Link>
            </div>
          </div>
        )}


        {/* Active Plan Strip */}
        {selectedPlan && (
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BorderBeam
              colorFrom="#000"
              colorTo="#000"
              size={200}
              duration={12}
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Target size={20} className="text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      Active Plan
                    </p>
                  </div>
                  <p className="text-base font-black text-black">
                    {selectedPlan.label} Savings Plan
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    Started{" "}
                    {new Date(selectedPlan.startedAt).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "short" },
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-grow md:max-w-xs">
                <div className="space-y-1">
                  {selectedPlan.steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <ChevronRight
                        size={11}
                        className="text-slate-400 shrink-0"
                      />
                      <p className="text-xs font-medium text-slate-600">{s}</p>
                    </div>
                  ))}
                </div>
                
                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Current Progress</p>
                    <p className="text-[10px] font-black text-emerald-600">
                      {(() => {
                        const start = new Date(selectedPlan.startedAt).getTime();
                        const now = new Date().getTime();
                        const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
                        const prog = Math.min(90, 5 + (diffDays * 1));
                        return `${prog}%`;
                      })()}
                    </p>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                      style={{ 
                        width: `${Math.min(90, 5 + (Math.floor((new Date().getTime() - new Date(selectedPlan.startedAt).getTime()) / (1000 * 60 * 60 * 24)) * 1))}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Savings Target
                </p>
                <p className="text-3xl font-black text-black">
                  ₹{selectedPlan.yearlySavings.toLocaleString("en-IN")}
                  <span className="text-sm text-slate-400">/yr</span>
                </p>
                <Link href="/dashboard/simulation">
                  <button className="text-[10px] font-black text-slate-400 hover:text-black flex items-center gap-1 transition-colors uppercase tracking-widest">
                    Change plan <ChevronRight size={10} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Daily Spending Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Activity Heatmap</p>
                <h3 className="text-2xl font-black text-black tracking-tight">Spending Calendar</h3>
              </div>
              <button 
                onClick={() => setShowCalendar(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-black transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {calendarLoading ? (
                <div className="h-[400px] flex flex-col items-center justify-center gap-4 text-slate-300">
                  <Loader2 size={32} className="animate-spin" />
                  <p className="text-xs font-black uppercase tracking-widest">Crunching daily records…</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-black">April 2026</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm bg-slate-50 border border-slate-100" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase">None</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm bg-violet-600/60" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase">High</span>
                      </div>
                    </div>
                  </div>

                  <TooltipProvider>
                    <div className="grid grid-cols-7 gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                        <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase py-2">
                          {d}
                        </div>
                      ))}
                      
                      {/* Empty padding for April 2026 (Starts on Wed) */}
                      <div className="aspect-square" />
                      <div className="aspect-square" />

                      {dailySpendData.map((day) => {
                        const dateObj = new Date(day.date);
                        const dayNum = dateObj.getDate();
                        const amount = day.amount;
                        
                        // Determine opacity based on amount (normalized roughly)
                        let opacity = 0.05;
                        if (amount > 5000) opacity = 0.9;
                        else if (amount > 2000) opacity = 0.6;
                        else if (amount > 500) opacity = 0.3;
                        else if (amount > 0) opacity = 0.15;

                        return (
                          <Tooltip key={day.date}>
                            <TooltipTrigger asChild>
                              <div 
                                className="aspect-square rounded-lg flex items-center justify-center text-[11px] font-black transition-all hover:scale-110 cursor-pointer border border-slate-100"
                                style={{ 
                                  backgroundColor: amount > 0 ? `rgba(124, 58, 237, ${opacity})` : 'transparent',
                                  color: amount > 0 ? (opacity > 0.5 ? 'white' : 'rgb(124, 58, 237)') : '#cbd5e1'
                                }}
                              >
                                {dayNum}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-black text-white border-none p-3 rounded-xl shadow-2xl">
                              <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                  {dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                                </p>
                                <p className="text-sm font-black">₹{amount.toLocaleString('en-IN')}</p>
                                {day.top_category && (
                                  <p className="text-[9px] font-bold text-violet-400 uppercase tracking-wider bg-violet-400/10 px-1.5 py-0.5 rounded-sm w-fit">
                                    {day.top_category}
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
