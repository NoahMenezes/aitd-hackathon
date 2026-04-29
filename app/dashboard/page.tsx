"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Building2,
  Wallet,
  ArrowRightLeft,
  TrendingDown,
  AlertCircle,
  Coffee,
  ShoppingCart,
  Lightbulb,
  CheckCircle2,
  RefreshCcw,
  Sparkles,
  Zap,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

// Standard ReBIT JSON Structure (Mock for Demo)
const INITIAL_REBIT_DATA = {
  fipID: "FIP-BANK-001",
  account: {
    type: "SAVINGS",
    maskedAccNo: "XXXXXX1234",
    summary: {
      currentBalance: 52450.00,
      currency: "INR",
      exchgeRate: "1",
      openingDate: "2020-01-15",
    },
    transactions: {
      startDate: "2026-01-01",
      endDate: "2026-04-29",
      transaction: [
        {
          type: "DEBIT",
          mode: "UPI",
          amount: 450.00,
          currentBalance: 52000.00,
          transactionTimestamp: "2026-04-28T14:20:00Z",
          narration: "UPI/ZOMATO/TXN123456789",
          reference: "9876543210",
        },
        {
          type: "DEBIT",
          mode: "UPI",
          amount: 1200.00,
          currentBalance: 50800.00,
          transactionTimestamp: "2026-04-25T11:10:00Z",
          narration: "UPI/AMAZON/ORDER-992",
          reference: "1122334455",
        },
      ],
    },
  },
};

export default function DashboardPage() {
  const [isLinked, setIsLinked] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [insight, setInsight] = useState<{ title: string; desc: string; rec: string } | null>(null);

  // Track food spend to trigger our AI insight
  const [foodSpend, setFoodSpend] = useState(450);
  const FOOD_BUDGET = 2000;

  const handleLinkBank = () => {
    setIsLinking(true);
    // Simulate AA Consent Flow
    setTimeout(() => {
      setBalance(INITIAL_REBIT_DATA.account.summary.currentBalance);
      setTransactions(INITIAL_REBIT_DATA.account.transactions.transaction);
      setIsLinked(true);
      setIsLinking(false);
    }, 1500);
  };

  const handlePurchase = (merchant: string, amount: number, category: string) => {
    const newBalance = balance - amount;
    const newTxn = {
      type: "DEBIT",
      mode: "UPI",
      amount: amount,
      currentBalance: newBalance,
      transactionTimestamp: new Date().toISOString(),
      narration: `UPI/${merchant.toUpperCase()}/TXN${Math.floor(Math.random() * 100000)}`,
      reference: Math.floor(Math.random() * 10000000000).toString(),
    };

    setBalance(newBalance);
    setTransactions((prev) => [newTxn, ...prev]);

    // Simple AI Copilot Logic
    if (category === "Food") {
      const newFoodSpend = foodSpend + amount;
      setFoodSpend(newFoodSpend);

      if (newFoodSpend > FOOD_BUDGET) {
        setInsight({
          title: "Budget Exceeded!",
          desc: `Food budget exceeded by ₹${newFoodSpend - FOOD_BUDGET}.`,
          rec: "Switch to home cooking for the next 2 days to save ₹800 and stay on track for your Goa trip goal.",
        });
      } else {
        setInsight({
          title: "Smart Insight",
          desc: `You spent ₹${amount} on food.`,
          rec: `You have ₹${FOOD_BUDGET - newFoodSpend} left in your food budget.`,
        });
      }
    }
  };

  if (!isLinked) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <Navbar />
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-md w-full bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-white/50 p-10 text-center space-y-8 relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner rotate-3 hover:rotate-0 transition-transform duration-500">
            <Building2 className="w-12 h-12 text-indigo-600" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tighter italic">Connect Your Wealth</h1>
            <p className="text-slate-500 text-sm leading-relaxed px-4 font-medium">
              Securely connect your bank via the <span className="text-indigo-600 font-bold">Account Aggregator (AA)</span> framework to unlock your personalized AI Copilot.
            </p>
          </div>
          
          <div className="pt-4 space-y-4">
            <button
              onClick={handleLinkBank}
              disabled={isLinking}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 px-6 rounded-[2rem] shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-400 group"
            >
              {isLinking ? (
                <>
                  <RefreshCcw className="w-6 h-6 animate-spin" />
                  Awaiting AA Consent...
                </>
              ) : (
                <>
                  Link via Account Aggregator
                  <ArrowRightLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 py-2">
              <CheckCircle2 size={12} className="text-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">RBI Compliant Protocol</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-32 px-6 pb-20 overflow-x-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest border border-indigo-200">
              <Zap size={12} className="fill-indigo-600" />
              Live Simulation Mode
            </div>
            <h1 className="text-5xl font-display font-bold text-slate-900 tracking-tighter italic flex items-center gap-3">
              SandInsight Copilot
            </h1>
            <p className="text-slate-500 font-medium italic">ReBIT-Standard Financial Insights Engine v1.0</p>
          </div>
          <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full text-xs font-bold flex items-center gap-3 border border-green-200 shadow-sm transition-all hover:scale-105">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            AA Linked: HDFC Bank (XX1234)
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-0">

          {/* LEFT PANEL: Copilot Dashboard */}
          <div className="lg:col-span-8 space-y-8">

            {/* Balance Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] p-10 border border-white/50 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Wallet size={80} className="text-indigo-600" />
              </div>
              <div className="flex items-center gap-3 text-slate-400 mb-4 font-bold uppercase tracking-widest text-[11px]">
                <LayoutDashboard size={14} />
                <span>Mercury Balance (Savings)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-slate-400">₹</span>
                <h2 className="text-6xl font-display font-bold text-slate-900 tracking-tighter italic">
                  {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </h2>
              </div>
              <div className="mt-8 flex gap-3">
                <span className="bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
                  REF: XXXXXX1234
                </span>
                <span className="bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
                  FIP: BANK-001
                </span>
              </div>
            </div>

            {/* AI Insights Engine (The "Magic") */}
            <div className={cn(
                "rounded-[3rem] p-10 border shadow-2xl transition-all duration-700 relative overflow-hidden",
                insight?.title === 'Budget Exceeded!' 
                    ? 'bg-red-50/50 border-red-200 text-red-900 shadow-red-200/20' 
                    : insight 
                        ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 shadow-indigo-200/20' 
                        : 'bg-white border-white/50'
            )}>
              <div className="flex items-center gap-3 mb-8">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                    insight?.title === 'Budget Exceeded!' ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'
                )}>
                    <Lightbulb className="w-6 h-6 fill-current" />
                </div>
                <h3 className="text-2xl font-display font-bold italic tracking-tight">Smart Recommendation</h3>
              </div>

              {insight ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-start gap-4">
                    <AlertCircle className={cn("w-6 h-6 mt-1 flex-shrink-0", insight.title === 'Budget Exceeded!' ? 'text-red-600' : 'text-indigo-600')} />
                    <div>
                      <h4 className="text-xl font-bold tracking-tight">
                        {insight.title}
                      </h4>
                      <p className="text-lg mt-2 font-medium opacity-80 leading-relaxed italic">
                        {insight.desc}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/80 p-8 rounded-[2.5rem] border border-white shadow-xl mt-6 backdrop-blur-md group hover:scale-[1.02] transition-transform">
                    <p className="text-slate-800 font-bold text-xl leading-relaxed italic">
                        {insight.rec}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
                        Ranked Suggestion #1 • Actionable Insight
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 flex flex-col items-center justify-center py-10">
                  <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 shadow-inner animate-pulse">
                    <Sparkles className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest">AI Engine listening for transactions...</p>
                </div>
              )}
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-[3rem] p-10 border border-white/50 shadow-2xl overflow-hidden">
              <h3 className="text-2xl font-display font-bold mb-8 flex items-center gap-3 italic tracking-tight">
                <ArrowRightLeft className="w-6 h-6 text-indigo-600" />
                Recent History
              </h3>
              <div className="space-y-4">
                {transactions.map((txn, idx) => (
                  <div key={idx} className="flex justify-between items-center p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group cursor-default">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-red-500 border border-slate-100 group-hover:bg-red-50 transition-colors">
                        <TrendingDown className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-slate-900 tracking-tight">{txn.narration.split('/')[1]}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            {new Date(txn.transactionTimestamp).toLocaleDateString()} • {txn.mode}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-display font-bold text-slate-900 tracking-tighter italic">-₹{txn.amount}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Bal: ₹{txn.currentBalance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Live Demo Trigger (The "Merchant") */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
                <div className="bg-slate-950 text-white rounded-[3rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-slate-800 relative overflow-hidden group">
                    {/* Decorative Blur */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                    
                    <div className="mb-8 relative z-10">
                        <h3 className="text-2xl font-display font-bold flex items-center gap-3 italic tracking-tight">
                        <ShoppingCart className="w-6 h-6 text-indigo-400" />
                        Merchant Site
                        </h3>
                        <p className="text-sm text-slate-400 mt-4 font-medium italic leading-relaxed">
                        Click below to trigger a live webhook event. Watch the Copilot react instantly.
                        </p>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <button
                        onClick={() => handlePurchase('Swiggy', 350, 'Food')}
                        className="w-full bg-slate-900 hover:bg-white hover:text-black border border-slate-800 hover:border-white transition-all p-6 rounded-[2rem] flex items-center justify-between group/btn"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-800 p-3 rounded-2xl group-hover/btn:bg-slate-100 transition-colors">
                                <Coffee className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                <p className="font-bold text-lg tracking-tight">Buy Lunch</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Swiggy • Food Delivery</p>
                                </div>
                            </div>
                            <span className="font-display font-bold text-xl italic group-hover/btn:scale-110 transition-transform">₹350</span>
                        </button>

                        <button
                        onClick={() => handlePurchase('Zepto', 1800, 'Food')}
                        className="w-full bg-slate-900 hover:bg-white hover:text-black border border-slate-800 hover:border-white transition-all p-6 rounded-[2rem] flex items-center justify-between group/btn"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-800 p-3 rounded-2xl group-hover/btn:bg-slate-100 transition-colors">
                                <ShoppingCart className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                <p className="font-bold text-lg tracking-tight">Groceries</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Zepto • Hyperlocal</p>
                                </div>
                            </div>
                            <span className="font-display font-bold text-xl italic group-hover/btn:scale-110 transition-transform">₹1,800</span>
                        </button>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-800 relative z-10">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <RefreshCcw size={12} className="animate-spin-slow" />
                            Live System Logs
                        </h4>
                        <div className="bg-black/50 rounded-2xl p-5 font-mono text-[10px] text-green-400 space-y-3 h-40 overflow-hidden shadow-inner">
                        <p className="opacity-50 tracking-tighter">[{new Date().toLocaleTimeString()}] INF Listening for FI_READY...</p>
                        {insight && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-indigo-400">[{new Date().toLocaleTimeString()}] WEB Webhook: FI_NOTIFICATION_READY</p>
                                <p className="text-yellow-400">[{new Date().toLocaleTimeString()}] SYS Parsing ReBIT Standard JSON...</p>
                                <p className="text-green-400">[{new Date().toLocaleTimeString()}] AI Running Scenario Simulation...</p>
                                <p className="text-white bg-indigo-600/20 px-2 py-0.5 rounded-md">[{new Date().toLocaleTimeString()}] OUT Copilot Recommendation Generated</p>
                            </div>
                        )}
                        </div>
                    </div>
                </div>

                {/* Copilot Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-white/50 shadow-xl">
                        <TrendingUp className="text-green-500 mb-2" size={20} />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Savings Rate</p>
                        <p className="text-2xl font-display font-bold text-slate-900 italic tracking-tight">42.8%</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] border border-white/50 shadow-xl">
                        <AlertCircle className="text-indigo-500 mb-2" size={20} />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget Utilization</p>
                        <p className="text-2xl font-display font-bold text-slate-900 italic tracking-tight">88.2%</p>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
