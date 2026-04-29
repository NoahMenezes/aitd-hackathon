"use client";

import React from "react";
import {
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ShoppingCart,
  CreditCard,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useDashboard, type SelectedPlan } from "@/lib/DashboardContext";
import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// ─── Plan Definitions ────────────────────────────────────────────────────────

const PLANS: SelectedPlan[] = [
  {
    key: "easy",
    label: "Easy",
    steps: [
      "Reduce food orders by 2/week",
      "Cancel 1 unused subscription",
      "Limit weekend shopping to ₹2,000",
    ],
    yearlySavings: 18000,
    feasibility: "High chance you'll follow this",
    effort: "easy",
    startedAt: "",
  },
  {
    key: "moderate",
    label: "Moderate",
    steps: [
      "Reduce food orders by 4/week",
      "Cancel all unused subscriptions",
      "Set ₹1,200 weekly shopping cap",
    ],
    yearlySavings: 30000,
    feasibility: "Good chance you'll follow this",
    effort: "moderate",
    startedAt: "",
  },
  {
    key: "hard",
    label: "Hard",
    steps: [
      "Cook at home — limit dining out to 1x/week",
      "Cancel all non-essential subscriptions",
      "No impulse purchases — 24hr rule",
    ],
    yearlySavings: 48000,
    feasibility: "Requires strong discipline",
    effort: "hard",
    startedAt: "",
  },
];

const BEST_PLAN = PLANS[0]; // Easy plan is recommended based on behavioral analysis

const EFFORT_COLOR: Record<string, string> = {
  easy: "text-emerald-700 bg-emerald-50 border-emerald-200",
  moderate: "text-amber-700 bg-amber-50 border-amber-200",
  hard: "text-red-700 bg-red-50 border-red-200",
};

const STEP_ICONS = [ShoppingCart, CreditCard, ShoppingBag];

export default function RecommendationsPage() {
  const { t } = useLanguage();
  const { setIsChatOpen, setChatMessages, setSelectedPlan, selectedPlan } = useDashboard();
  const router = useRouter();

  const recommendations = [
    {
      rank: 1,
      title: "Reduce food ordering",
      desc: "Cut 2 Swiggy/Zomato orders per week",
      impact: "Saves ₹18,000/year",
      query: "Why is reducing food the top recommendation for my financial profile?",
      response: "Your food delivery spending has increased by 40% in the last 3 months, mostly during late-night hours. By cutting just 2 orders, you save ₹1,500 monthly, which compounded over a year covers a significant portion of your annual insurance premiums.",
    },
    {
      rank: 2,
      title: "Cancel unused subscriptions",
      desc: "3 recurring charges with low usage detected",
      impact: "Saves ₹7,200/year",
      query: "Which subscriptions should I cancel and how was this detected?",
      response: "We detected zero logins for 'Premium News' and 'Fitness App X' in the last 60 days. Canceling these immediately stops a ₹600/month leak from your account without affecting your lifestyle.",
    },
    {
      rank: 3,
      title: "Set a weekend shopping limit",
      desc: "Your spending spikes 140% on Saturdays",
      impact: "Saves ₹4,800/year",
      query: "How did you detect my weekend shopping pattern and what limit do you suggest?",
      response: "Your transaction history shows 70% of non-essential shopping happens on Saturday afternoons. We suggest a ₹2,000 weekly limit to keep your savings on track.",
    },
  ];

  const handleAskAI = (rec: typeof recommendations[0]) => {
    setIsChatOpen(true);
    setChatMessages([
      { role: "user", content: rec.query },
      { role: "bot", content: rec.response },
    ]);
  };

  const handleStartPlan = (plan: SelectedPlan) => {
    setSelectedPlan({ ...plan, startedAt: new Date().toISOString() });
  };

  return (
    <main className="h-screen flex flex-col pt-24 px-6 pb-10 overflow-hidden font-body bg-transparent relative">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Header */}
        <header className="flex flex-col gap-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-xs text-muted-foreground font-medium w-fit">
            <Sparkles size={12} className="text-foreground" />
            AI Recommendations
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
            Smart Action Plan
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow min-h-0">

          {/* LEFT: Ranked Recommendations */}
          <section className="flex flex-col min-h-0">
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-full min-h-0">
              <BorderBeam colorFrom="#000" colorTo="#000" size={250} duration={6} />

              <div className="px-8 pt-8 pb-6 border-b border-border/50 shrink-0 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                    <TrendingUp size={16} className="text-background" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Prioritized
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-foreground tracking-tight">
                  High Impact Moves
                </h2>
              </div>

              <div className="overflow-y-auto flex-grow min-h-0 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent relative z-10">
                <div className="divide-y divide-border/30 px-2">
                  {recommendations.map((rec) => (
                    <div key={rec.rank} className="flex items-center gap-6 py-8 px-6 hover:bg-white/40 transition-colors group rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <span className="text-background font-semibold text-lg">{rec.rank}</span>
                      </div>

                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-semibold text-foreground tracking-tight uppercase">
                          {rec.title}
                        </h4>
                        <p className="text-xs font-medium text-muted-foreground mt-1 leading-relaxed">
                          {rec.desc}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <div className="flex items-center gap-2 text-foreground font-semibold text-[10px] uppercase tracking-wider border border-border bg-secondary px-3 py-1.5 rounded-full whitespace-nowrap">
                          <TrendingUp size={12} />
                          {rec.impact}
                        </div>
                        <button
                          onClick={() => handleAskAI(rec)}
                          className="text-[10px] font-semibold text-background bg-foreground px-4 py-2 rounded-full flex items-center gap-2 hover:opacity-90 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                        >
                          Why this?
                          <ArrowUpRight size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: Best Plan for You */}
          <section className="flex flex-col min-h-0">
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-full min-h-0">
              <BorderBeam colorFrom="#000" colorTo="#000" size={300} duration={8} />

              {/* Card Header */}
              <div className="px-8 pt-8 pb-6 border-b border-border/50 shrink-0 relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                      <Sparkles size={16} className="text-background" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      AI Suggested
                    </span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider",
                    EFFORT_COLOR[BEST_PLAN.effort]
                  )}>
                    {BEST_PLAN.label}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-foreground tracking-tight mt-3">
                  Best Plan for You
                </h2>
              </div>

              <div className="flex flex-col flex-grow min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">

                {/* Plan Steps */}
                <div className="px-8 py-6 border-b border-border/50 shrink-0 relative z-10">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">Your Plan</p>
                  <div className="space-y-3">
                    {BEST_PLAN.steps.map((step, idx) => {
                      const Icon = STEP_ICONS[idx];
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                            <Icon size={13} className="text-foreground" />
                          </div>
                          <p className="text-sm font-medium text-foreground">{step}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Impact */}
                <div className="px-8 py-6 border-b border-border/50 shrink-0 relative z-10">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Projected Impact</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-foreground tracking-tight">
                      ₹{BEST_PLAN.yearlySavings.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">/ year saved</span>
                  </div>
                </div>

                {/* Feasibility */}
                <div className="px-8 py-5 border-b border-border/50 shrink-0 relative z-10">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <p className="text-sm font-semibold text-foreground">{BEST_PLAN.feasibility}</p>
                  </div>
                </div>

                {/* Selected Plan Status */}
                {selectedPlan && (
                  <div className="px-8 py-4 border-b border-border/50 shrink-0 relative z-10 bg-emerald-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                        Active: {selectedPlan.label} Plan — started {new Date(selectedPlan.startedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="px-8 py-6 flex flex-col gap-3 mt-auto shrink-0 relative z-10">
                  <button
                    onClick={() => handleStartPlan(BEST_PLAN)}
                    className={cn(
                      "w-full py-4 rounded-full font-semibold text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-md",
                      selectedPlan?.key === BEST_PLAN.key
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-foreground text-background hover:opacity-90"
                    )}
                  >
                    {selectedPlan?.key === BEST_PLAN.key ? (
                      <>
                        <CheckCircle2 size={16} /> Plan Active
                      </>
                    ) : (
                      <>
                        Start this plan <Sparkles size={14} />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => router.push("/dashboard/simulation")}
                    className="w-full py-3.5 rounded-full font-semibold text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 flex items-center justify-center gap-2 transition-all"
                  >
                    See more plans <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
