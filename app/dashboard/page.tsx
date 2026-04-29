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
  LayoutDashboard,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight
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
      <main className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-300">
        <Navbar />
        {/* Modern Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-md w-full bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 dark:border-white/10 p-10 text-center space-y-8 relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 shadow-inner transition-all duration-500 hover:scale-105">
            <Building2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Connect Your Wealth</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4 font-medium">
              FinPilot uses the <span className="text-indigo-600 dark:text-indigo-400 font-bold">Account Aggregator</span> framework to securely sync your financial data.
            </p>
          </div>
          
          <div className="pt-4 space-y-4">
            <button
              onClick={handleLinkBank}
              disabled={isLinking}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 px-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-300 dark:disabled:bg-slate-700"
            >
              {isLinking ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                  Requesting Consent...
                </>
              ) : (
                <>
                  Link via Account Aggregator
                  <ArrowRightLeft className="w-4 h-4" />
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 py-2">
              <ShieldCheck size={14} className="text-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">RBI Compliant Protocol</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent flex flex-col pt-32 px-6 pb-20 overflow-x-hidden font-sans transition-colors duration-300">
      <Navbar />
      <div className="max-w-[1400px] mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
              <Zap size={12} className="fill-indigo-600 dark:fill-indigo-400" />
              Live Simulation Active
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              SandInsight Copilot
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">ReBIT-Standard Financial Insights Engine v1.0</p>
          </div>
          <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl px-6 py-4 rounded-[2rem] text-xs font-bold flex items-center gap-4 border border-slate-100 dark:border-white/10 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>AA Connection: Stable</span>
            </div>
            <div className="w-px h-4 bg-slate-100 dark:bg-white/10" />
            <span className="text-slate-400 dark:text-slate-500 font-mono">FIP: HDFC-BANK-XX1234</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Insights & Transactions */}
          <div className="lg:col-span-8 space-y-8">

            {/* Stats Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Balance Card */}
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Wallet size={24} />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Savings Account</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">XXXXXX1234</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Available Balance</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-slate-400 dark:text-slate-500">₹</span>
                            <h2 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h2>
                        </div>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-xs font-bold text-green-600">
                        <TrendingUp size={14} />
                        <span>+₹12,450.00 this month</span>
                    </div>
                </div>

                {/* Savings Goal Card (Demo) */}
                <div className="bg-slate-900 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-800 dark:border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={60} className="text-white" />
                    </div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-white/10 dark:bg-white/5 rounded-2xl flex items-center justify-center text-white">
                            <Zap size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Financial Goal</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-white/50 uppercase tracking-widest">Goa Trip 2026</p>
                        <h2 className="text-4xl font-bold text-white tracking-tight">72% <span className="text-lg opacity-40">Complete</span></h2>
                    </div>
                    <div className="mt-8 w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[72%] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    </div>
                </div>
            </div>

            {/* AI Insights & Recommendation */}
            <div className={cn(
                "rounded-[2.5rem] p-8 border shadow-sm transition-all duration-500 backdrop-blur-xl",
                insight?.title === 'Budget Exceeded!' 
                    ? 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20' 
                    : insight 
                        ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/20' 
                        : 'bg-white/70 dark:bg-slate-900/40 border-slate-100 dark:border-white/10'
            )}>
              <div className="flex items-center gap-3 mb-8">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg",
                    insight?.title === 'Budget Exceeded!' ? 'bg-red-500' : 'bg-indigo-600'
                )}>
                    <Lightbulb size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">AI Copilot Logic</h3>
              </div>

              {insight ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={18} className={insight.title === 'Budget Exceeded!' ? 'text-red-500' : 'text-indigo-500'} />
                        <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[11px]">{insight.title}</h4>
                    </div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white/80 tracking-tight leading-tight">
                        {insight.desc}
                    </p>
                  </div>
                  <div className="bg-white/70 dark:bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-white dark:border-white/10 shadow-xl flex flex-col justify-center transition-all">
                    <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-2">Ranked Recommendation</div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed italic">
                        "{insight.rec}"
                    </p>
                    <button className="mt-4 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                        Apply to Budget <RefreshCcw size={10} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600">
                  <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4">
                    <Sparkles size={24} className="opacity-30" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Listening for real-time transaction webhooks...</p>
                </div>
              )}
            </div>

            {/* Transactions List */}
            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <ArrowRightLeft className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Transaction History
                </h3>
                <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">View All</button>
              </div>
              <div className="space-y-3">
                {transactions.map((txn, idx) => (
                  <div key={idx} className="flex justify-between items-center p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/20 border border-slate-50 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800/40 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-red-500 border border-slate-100 dark:border-white/10 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                        <ArrowDownRight className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{txn.narration.split('/')[1]}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                            {new Date(txn.transactionTimestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} • {txn.mode}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-slate-900 dark:text-white">-₹{txn.amount}</p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Bal: ₹{txn.currentBalance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Merchant Simulator */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
                <div className="bg-slate-900 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 dark:border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShoppingCart size={80} className="text-white" />
                    </div>
                    
                    <div className="mb-8 relative z-10">
                        <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                        <ShoppingCart size={20} className="text-indigo-400" />
                        Merchant Sandbox
                        </h3>
                        <p className="text-sm text-slate-400 mt-4 leading-relaxed font-medium">
                        Trigger a live transaction to see how FinPilot parses ReBIT data and generates insights instantly.
                        </p>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <button
                        onClick={() => handlePurchase('Swiggy', 350, 'Food')}
                        className="w-full bg-slate-800 hover:bg-white hover:text-slate-900 border border-slate-700 hover:border-white transition-all p-5 rounded-2xl flex items-center justify-between group/btn"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-700 p-2.5 rounded-xl group-hover/btn:bg-slate-100 transition-colors">
                                <Coffee className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div className="text-left">
                                <p className="font-bold text-sm">Buy Lunch</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Swiggy • Food Delivery</p>
                                </div>
                            </div>
                            <span className="font-bold text-lg">₹350</span>
                        </button>

                        <button
                        onClick={() => handlePurchase('Zepto', 1800, 'Food')}
                        className="w-full bg-slate-800 hover:bg-white hover:text-slate-900 border border-slate-700 hover:border-white transition-all p-5 rounded-2xl flex items-center justify-between group/btn"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-700 p-2.5 rounded-xl group-hover/btn:bg-slate-100 transition-colors">
                                <ShoppingCart className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div className="text-left">
                                <p className="font-bold text-sm">Groceries</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Zepto • Hyperlocal</p>
                                </div>
                            </div>
                            <span className="font-bold text-lg">₹1,800</span>
                        </button>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-800 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <RefreshCcw size={12} className="animate-spin-slow text-green-500" />
                                Live System Logs
                            </h4>
                            <span className="text-[9px] font-bold text-green-500/50 uppercase">FI_READY Listener Active</span>
                        </div>
                        <div className="bg-black/50 rounded-2xl p-5 font-mono text-[10px] text-green-400 space-y-2 h-40 overflow-hidden shadow-inner border border-white/5">
                        <p className="opacity-40">[{new Date().toLocaleTimeString()}] INF Ready to fetch data...</p>
                        {insight && (
                            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-indigo-400">[{new Date().toLocaleTimeString()}] WEB FI_NOTIFICATION_READY</p>
                                <p className="text-yellow-400">[{new Date().toLocaleTimeString()}] SYS Parsing G02 ReBIT JSON...</p>
                                <p className="text-green-300">[{new Date().toLocaleTimeString()}] AI Running Scenario Analysis...</p>
                                <div className="bg-indigo-500/20 text-white px-2 py-1 rounded mt-2 border border-indigo-500/30">
                                    [{new Date().toLocaleTimeString()}] SUCCESS Insight Generated
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                </div>

                {/* Integration Details */}
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/10 flex items-center justify-center text-green-600 dark:text-green-400">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Protocol Version</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">ReBIT-G02-JSON-v2.0.0</p>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
