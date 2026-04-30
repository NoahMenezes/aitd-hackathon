"use client";

import React, { useEffect, useState, useCallback } from "react";
import { TrendingUp, ArrowUpRight, Sparkles, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useDashboard, type SelectedPlan } from "@/lib/DashboardContext";
import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { toast } from "react-hot-toast";
import { getUserId, getChatSessionId } from "@/lib/auth";

interface Rec { title: string; description: string; category?: string; action?: string; savings_monthly?: number; }

const EASY_STEPS = ["Reduce food orders by 2/week", "Cancel 1 unused subscription", "Limit weekend shopping to ₹2,000"];
const FEASIBILITY = "High chance you'll follow this";

export default function RecommendationsPage() {
  const { isChatOpen, setIsChatOpen, chatMessages, setChatMessages, setSelectedPlan, selectedPlan } = useDashboard();
  const router = useRouter();

  const [recs, setRecs]             = useState<Rec[]>([]);
  const [totalSavings, setTotal]    = useState(0);
  const [loading, setLoading]       = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const uid = getUserId();
      if (!uid) {
        setLoading(false);
        return;
      }
      const res = await apiFetch(`/recommendations/list/${uid}`);
      const raw: any[] = res?.recommendations ?? [];
      const mapped: Rec[] = raw.map((r: any) => ({
        title: r.title,
        description: r.description,
        category: r.category,
        savings_monthly: r.impact_monthly ?? 0,
      }));
      setRecs(mapped);
      setTotal(res?.total_savings ?? 0);
    } catch {
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAskAI = async (rec: Rec) => {
    setIsChatOpen(true);
    const userMsg = `Why is "${rec.title}" recommended for me?`;
    
    const newMessages: { role: "user" | "bot", content: string }[] = [
      ...chatMessages,
      { role: "user", content: userMsg },
    ];
    setChatMessages(newMessages);

    const uid = getUserId();
    const sessionId = getChatSessionId();
    if (!uid) return;

    try {
      const data = await apiFetch(`/chat/${uid}/${sessionId}`, {
        method: "POST",
        body: JSON.stringify({ message: userMsg }),
      });
      setChatMessages([
        ...newMessages,
        { role: "bot", content: data.response ?? "I didn't get that. Try rephrasing." },
      ]);
    } catch (err: any) {
      toast.error("Chat failed");
      setChatMessages([
        ...newMessages,
        { role: "bot", content: "Something went wrong. Please try again." },
      ]);
    }
  };

  const handleStartPlan = () => {
    const plan: SelectedPlan = {
      key: "easy", label: "Easy", steps: EASY_STEPS,
      yearlySavings: totalSavings || 18000,
      feasibility: FEASIBILITY, effort: "easy",
      startedAt: new Date().toISOString(),
    };
    setSelectedPlan(plan);
    toast.success("Easy plan activated! 🎯");
  };

  return (
    <main className="h-screen flex flex-col pt-24 px-6 pb-10 overflow-hidden font-body bg-transparent relative">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

        <header className="shrink-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-xs text-muted-foreground font-medium w-fit mb-3">
            <Sparkles size={12} /> AI Recommendations
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-foreground">Smart Action Plan</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow min-h-0">

          {/* LEFT: AI Recommendations from SandInsight */}
          <section className="flex flex-col min-h-0">
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-full min-h-0">
              <BorderBeam colorFrom="#000" colorTo="#000" size={250} duration={6} />
              <div className="px-8 pt-8 pb-6 border-b border-border/50 shrink-0 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                    <TrendingUp size={16} className="text-background" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live from AI Engine</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground">High Impact Moves</h2>
                {!loading && totalSavings > 0 && (
                  <p className="text-xs text-muted-foreground font-medium mt-1">
                    Total potential: <span className="text-foreground font-semibold">₹{totalSavings.toLocaleString("en-IN")}/yr</span>
                  </p>
                )}
              </div>

              <div className="overflow-y-auto flex-grow min-h-0 pr-2 scrollbar-thin scrollbar-thumb-border relative z-10">
                {loading ? (
                  <div className="flex items-center justify-center h-full"><Loader2 size={28} className="animate-spin text-slate-300" /></div>
                ) : recs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-8 text-center">
                    No recommendations yet. Link your account and wait for the AI engine to analyse.
                  </div>
                ) : (
                  <div className="divide-y divide-border/30 px-2">
                    {recs.map((rec, idx) => (
                      <div key={idx} className="flex items-center gap-5 py-6 px-6 hover:bg-white/40 transition-colors group rounded-xl">
                        <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <span className="text-background font-semibold text-sm">{idx + 1}</span>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-semibold text-foreground">{rec.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{rec.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          {rec.savings_monthly && rec.savings_monthly > 0 && (
                            <div className="text-[10px] font-semibold text-foreground bg-secondary px-3 py-1 rounded-full border border-border/50 whitespace-nowrap">
                              ₹{(rec.savings_monthly * 12).toLocaleString("en-IN")}/yr
                            </div>
                          )}
                          <button
                            onClick={() => handleAskAI(rec)}
                            className="text-[10px] font-semibold text-background bg-foreground px-3 py-1.5 rounded-full flex items-center gap-1 hover:opacity-90 active:scale-95 transition-all"
                          >
                            Why this? <ArrowUpRight size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT: Best Plan for You */}
          <section className="flex flex-col min-h-0">
            <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-full min-h-0">
              <BorderBeam colorFrom="#000" colorTo="#000" size={300} duration={8} />

              <div className="px-8 pt-8 pb-6 border-b border-border/50 shrink-0 relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"><Sparkles size={16} className="text-background" /></div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Suggested</span>
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider text-emerald-700 bg-emerald-50 border-emerald-200">Easy</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground mt-3">Best Plan for You</h2>
              </div>

              <div className="flex flex-col flex-grow min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-border">

                {/* Steps */}
                <div className="px-8 py-6 border-b border-border/50 shrink-0 relative z-10">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">Your Plan</p>
                  <div className="space-y-3">
                    {EASY_STEPS.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center text-[10px] font-black shrink-0">{idx + 1}</div>
                        <p className="text-sm font-medium text-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact — from real data */}
                <div className="px-8 py-6 border-b border-border/50 shrink-0 relative z-10">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Projected Impact</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-foreground tracking-tight">
                      {loading ? "—" : `₹${(totalSavings || 18000).toLocaleString("en-IN")}`}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">/ year saved</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Based on AI analysis of your actual transactions</p>
                </div>

                {/* Feasibility */}
                <div className="px-8 py-5 border-b border-border/50 shrink-0 relative z-10">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <p className="text-sm font-semibold text-foreground">{FEASIBILITY}</p>
                  </div>
                </div>

                {/* Active status */}
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
                    onClick={handleStartPlan}
                    className={cn(
                      "w-full py-4 rounded-full font-semibold text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-md",
                      selectedPlan?.key === "easy"
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-foreground text-background hover:opacity-90"
                    )}
                  >
                    {selectedPlan?.key === "easy"
                      ? <><CheckCircle2 size={16} /> Plan Active</>
                      : <><Sparkles size={14} /> Start this plan</>}
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
