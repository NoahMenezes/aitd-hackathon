"use client";

import React from "react";
import {
  Zap,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useDashboard } from "@/lib/DashboardContext";
import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";

export default function RecommendationsPage() {
  const { t } = useLanguage();
  const { setIsChatOpen, setChatMessages } = useDashboard();

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
      desc: "Your shopping spikes on weekends — a small cap helps",
      impact: "Saves ₹4,800/year",
      query: "How did you detect my weekend shopping pattern and what limit do you suggest?",
      response: "Your transaction history shows 70% of non-essential shopping happens on Saturday afternoons. We suggest a ₹2,000 weekly limit to keep your 'fun fund' healthy while meeting your savings goals.",
    },
  ];

  const handleAskAI = (rec: typeof recommendations[0]) => {
    setIsChatOpen(true);
    setChatMessages([
      { role: "user", content: rec.query },
      { role: "bot", content: rec.response },
    ]);
  };

  return (
    <main className="h-screen flex flex-col pt-24 px-6 pb-10 overflow-hidden font-body bg-transparent relative">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header matched to Homepage Hero style */}
        <header className="flex flex-col gap-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-xs text-muted-foreground font-medium w-fit">
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
            <div className="bg-white border border-border rounded-2xl shadow-sm relative overflow-hidden flex flex-col h-full min-h-0">
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
                    <div key={rec.rank} className="flex items-center gap-6 py-8 px-6 hover:bg-slate-50 transition-colors group rounded-xl">
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

          {/* RIGHT: Summary Box */}
          <section className="flex flex-col min-h-0 gap-6">
            <div className="bg-white border border-border p-10 flex flex-col items-center justify-center text-center relative overflow-hidden flex-grow shrink-0 rounded-2xl shadow-sm">
              <BorderBeam colorFrom="#000" colorTo="#000" size={300} duration={8} />
              
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6 relative z-10">
                Potential Annual Gain
              </h3>
              
              <div className="space-y-1 relative z-10">
                <h2 className="text-7xl font-semibold text-foreground tracking-tighter">
                  ₹30,000
                </h2>
                <p className="text-xs font-medium text-muted-foreground">
                  Total Projected Savings
                </p>
              </div>

              <div className="mt-8 px-10 py-5 bg-secondary rounded-2xl border border-border relative z-10">
                <p className="text-muted-foreground text-xs font-medium leading-relaxed italic">
                  "That's enough for a <span className="text-foreground font-semibold">luxury 4-day trip</span> to Goa or a <span className="text-foreground font-semibold">high-yield portfolio</span> boost."
                </p>
              </div>

              <button className="mt-10 w-full max-w-sm bg-foreground text-background font-semibold py-5 rounded-full uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:opacity-90 transition-all shadow-xl active:scale-[0.98] relative z-10">
                Commit to Plan
                <Sparkles size={16} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
