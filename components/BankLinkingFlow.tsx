"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Info,
  Banknote,
  ChevronRight,
  Lock,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BankLinkingFlowProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export const BankLinkingFlow = ({ onComplete, onCancel }: BankLinkingFlowProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [numBanks, setNumBanks] = useState("1");
  const [discoveredData, setDiscoveredData] = useState<any>(null);
  const [consentData, setConsentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDiscover = async () => {
    // Instant completion as requested
    onComplete({
      account: {
        bank: "HDFC Bank",
        type: "Savings",
        current_balance: 72450,
        currency: "INR"
      },
      insights: {
        transactions: [
          { narration: 'UPI/SWIGGY/PURCHASE', amount: 350, timestamp: new Date().toISOString(), mode: 'UPI', balance_after: 72100 },
          { narration: 'UPI/ZEPTO/PURCHASE', amount: 1800, timestamp: new Date().toISOString(), mode: 'UPI', balance_after: 70300 },
          { narration: 'UPI/NETFLIX/SUBSCRIPTION', amount: 499, timestamp: new Date(Date.now() - 86400000).toISOString(), mode: 'UPI', balance_after: 69801 },
        ]
      }
    });
  };

  const handleConsent = async (maskedAccNo: string) => {
    // Bypassed
  };

  const handleComplete = async () => {
    // Bypassed
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-white/95 dark:bg-slate-900/95 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 relative"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: "25%" }}
            animate={{ width: `${step * 25}%` }}
          />
        </div>

        <div className="p-8 md:p-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                    <Building2 size={40} />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Aggregate Your Banks</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                    Securely link multiple bank accounts using the RBI-standard <span className="text-indigo-600 font-bold">Account Aggregator</span> framework.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Smartphone size={18} />
                      </div>
                      <input 
                        type="text" 
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Number of Banks to Link</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Banknote size={18} />
                      </div>
                      <select 
                        value={numBanks}
                        onChange={(e) => setNumBanks(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none"
                      >
                        <option value="1">1 Bank Account</option>
                        <option value="2">2 Bank Accounts</option>
                        <option value="3">3 Bank Accounts</option>
                        <option value="4">4+ Bank Accounts</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                        <ChevronRight size={18} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-start gap-3 animate-shake">
                    <Info size={18} className="text-red-600 mt-0.5 shrink-0" />
                    <p className="text-xs font-bold text-red-600">{error}</p>
                  </div>
                )}

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={onCancel}
                    className="flex-1 py-4 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDiscover}
                    disabled={loading}
                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-slate-300"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <>Discover Accounts <ArrowRight size={18} /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Select Account</h3>
                  <p className="text-slate-500 text-sm">Found {discoveredData?.linkedAccounts.length} account(s) for <span className="text-indigo-600 font-bold">{phone}</span></p>
                </div>

                <div className="space-y-3">
                  {discoveredData?.linkedAccounts.map((acc: any, i: number) => (
                    <button 
                      key={i}
                      onClick={() => handleConsent(acc.maskedAccNo)}
                      disabled={loading}
                      className="w-full flex items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/10 hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                          <Building2 size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{acc.bank}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{acc.type} • {acc.maskedAccNo}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-indigo-500 group-hover:bg-indigo-50 transition-all">
                        <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setStep(1)}
                  className="w-full py-4 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest"
                >
                  Go Back
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-indigo-600 -mx-10 -mt-10 p-8 text-white space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">AA-SECURE-AUTH</span>
                    <Lock size={14} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">Consent Request</h4>
                      <p className="text-xs text-indigo-100">Purpose: {consentData?.purpose}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/10 space-y-4">
                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Data to be shared:</p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        Savings Account Profile & Summary
                      </li>
                      <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        Transactions (Last 6 Months)
                      </li>
                      <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        Account Verification via CKYC
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleComplete}
                      disabled={loading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "Approve & Link"}
                    </button>
                    <button 
                      onClick={() => setStep(2)}
                      className="w-full py-3 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                    >
                      Deny Request
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-8"
              >
                <div className="relative">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40"
                  >
                    <CheckCircle2 size={48} className="text-white" />
                  </motion.div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-32 h-32 border-2 border-dashed border-green-500/30 rounded-full -m-4 mx-auto"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">System Synced!</h3>
                  <div className="flex items-center justify-center gap-2 text-indigo-600">
                    <Zap size={14} className="fill-indigo-600" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Insights Engine Initialized</span>
                  </div>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">
                  Redirecting to your personalized Copilot...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
