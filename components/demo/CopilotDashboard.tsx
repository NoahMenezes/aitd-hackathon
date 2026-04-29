"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  TrendingUp, 
  AlertCircle, 
  Lightbulb, 
  ArrowRight,
  TrendingDown,
  Activity,
  Sparkles,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export const CopilotDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/analytics/today');
      const json = await response.json();
      if (json.status === "success") {
        setData(json.data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll for updates every 3 seconds for the "Live" feel
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground italic">Initializing Copilot...</div>;

  const summary = data?.summary || { total_spent: 0, yesterday_spent: 0, trend: "0%" };
  const insights = data?.insights || [];
  const recommendations = data?.recommendations || [];

  return (
    <div className="w-full h-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
      {/* Copilot Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="text-indigo-600" />
            Financial Copilot
          </h2>
          <p className="text-sm text-muted-foreground italic">Real-time spending analysis powered by AI</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-border shadow-sm">
          <Activity size={14} className="text-green-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Live Feed</span>
          <span className="text-[10px] font-medium opacity-50">Last: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Spending Card */}
        <Card className="md:col-span-2 bg-white/70 backdrop-blur-md border-white/50 shadow-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-widest">Today's Total Spend</CardDescription>
            <CardTitle className="text-5xl font-display font-bold tracking-tighter">
              ₹{summary.total_spent?.toLocaleString() || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <div className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full font-bold",
                summary.total_spent > summary.yesterday_spent ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
              )}>
                {summary.total_spent > summary.yesterday_spent ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {summary.trend}
              </div>
              <span className="text-muted-foreground font-medium italic">vs Yesterday (₹{summary.yesterday_spent?.toLocaleString() || 0})</span>
            </div>
            
            {/* Visualizer */}
            <div className="mt-8 h-32 w-full bg-gradient-to-t from-indigo-50 to-transparent rounded-2xl relative overflow-hidden flex items-end">
                <div className="absolute top-4 right-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500/20" />
                    ))}
                </div>
                <div className="w-full flex items-end justify-between px-6 pb-2 h-full">
                    {[20, 45, 30, 60, 40, 85, 50, 70, 90, 65].map((h, i) => (
                        <div 
                            key={i} 
                            style={{ height: `${h}%` }} 
                            className="w-2 md:w-4 bg-indigo-600/10 hover:bg-indigo-600/30 rounded-t-lg transition-all duration-500 cursor-pointer"
                        />
                    ))}
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Panel */}
        <div className="space-y-4">
          <Card className="bg-indigo-600 text-white border-none shadow-indigo-200/50 shadow-2xl rounded-[2rem]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Zap size={20} className="fill-white" />
                <span className="text-[10px] font-bold uppercase border border-white/20 px-2 py-1 rounded-full">Simulation</span>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="text-lg font-bold italic mb-1">AI Projection</h4>
              <p className="text-[11px] opacity-80 leading-relaxed font-medium">
                Based on today's orders, you are trending 15% higher than your monthly average.
              </p>
              <button className="mt-4 w-full bg-white text-indigo-600 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2">
                Simulate Impact <ArrowRight size={14} />
              </button>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 border-white/50 backdrop-blur-md rounded-[2rem] shadow-lg">
             <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <TrendingUp size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Top Category</p>
                        <p className="text-sm font-bold">{data?.top_category || "Food & Dining"}</p>
                    </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Copilot Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insights List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <AlertCircle size={18} className="text-indigo-600" />
            <h3 className="font-bold tracking-tight italic">System Insights</h3>
          </div>
          {insights.length > 0 ? insights.map((insight: string, i: number) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-border/50 shadow-sm flex gap-4 items-start group hover:border-indigo-200 transition-colors">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
              <p className="text-sm font-medium leading-relaxed italic">{insight}</p>
            </div>
          )) : (
            <div className="bg-white p-8 rounded-3xl border border-dashed border-muted-foreground/20 text-center italic text-muted-foreground text-sm">
                Waiting for data notification (Webhook FI_READY)...
            </div>
          )}
        </div>

        {/* Smart Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Lightbulb size={18} className="text-indigo-600" />
            <h3 className="font-bold tracking-tight italic">Copilot Recommendations</h3>
          </div>
          {recommendations.length > 0 ? recommendations.map((rec: string, i: number) => (
            <div key={i} className="bg-indigo-50/50 p-6 rounded-[2.5rem] border border-indigo-100 shadow-sm flex gap-4 items-start relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles size={40} className="text-indigo-600" />
              </div>
              <div className="bg-indigo-600 text-white p-2 rounded-xl mt-1">
                <Lightbulb size={16} />
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Ranked Suggestion #{i+1}</h5>
                <p className="text-sm font-semibold leading-relaxed text-indigo-900 drop-shadow-sm italic">
                  {rec}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase hover:underline cursor-pointer">
                    Apply this recommendation <ArrowRight size={10} />
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white p-8 rounded-3xl border border-dashed border-muted-foreground/20 text-center italic text-muted-foreground text-sm">
                Recommendations will appear once spending patterns are detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
