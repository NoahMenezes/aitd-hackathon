"use client";

import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Building2, Smartphone, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BankLinkModal = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const startLinking = async () => {
    setLoading(true);
    try {
      // Step 1: Initiate Consent
      const res = await fetch('http://localhost:8000/create-consent', { method: 'POST' });
      const data = await res.json();
      
      if (data.status === "success") {
        setStep(2);
      }
    } catch (e) {
      alert("Error initiating consent. Is the backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  const approveConsent = async () => {
    setLoading(true);
    try {
      // Step 2: Simulate Webhook Approve
      const res = await fetch('http://localhost:8000/webhook', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: "FI_READY" })
      });
      const data = await res.json();
      
      if (data.status === "success") {
        setStep(3);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } catch (e) {
      alert("Error approving consent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {step === 1 && (
          <div className="p-8 space-y-6 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-indigo-600" size={40} />
            </div>
            <h3 className="text-2xl font-display font-bold italic tracking-tight">Connect Your Wealth</h3>
            <p className="text-sm text-muted-foreground leading-relaxed px-4">
              FinPilot uses the <span className="font-bold text-indigo-600">Account Aggregator (AA)</span> framework to securely analyze your bank data.
            </p>
            <div className="space-y-3 pt-4">
              <button 
                onClick={startLinking}
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:bg-muted"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Link via Account Aggregator"}
                <ArrowRight size={18} />
              </button>
              <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldCheck size={12} className="text-green-600" />
                RBI Compliant • 256-bit Encrypted • Zero Data Storage
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col h-[500px]">
             {/* Fake AA UI */}
             <div className="bg-indigo-700 p-4 flex items-center justify-between text-white">
                <span className="text-xs font-bold tracking-widest uppercase">AA-SANDBOX-AUTH</span>
                <ShieldCheck size={16} />
             </div>
             <div className="flex-1 p-8 space-y-6 overflow-y-auto">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                        <Smartphone className="text-slate-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Linked Mobile</p>
                        <p className="text-sm font-bold">+91 99999 99999</p>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-800 italic">FinPilot is requesting permission to:</p>
                    <ul className="text-xs space-y-2 text-muted-foreground">
                        <li className="flex gap-2"><span>•</span> Read Savings Account Transactions</li>
                        <li className="flex gap-2"><span>•</span> Analyze Spending Categories</li>
                        <li className="flex gap-2"><span>•</span> Generate Financial Simulation</li>
                    </ul>
                </div>

                <div className="pt-8 space-y-3">
                    <button 
                        onClick={approveConsent}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Approve Data Sharing"}
                    </button>
                    <button className="w-full py-3 text-xs font-bold text-muted-foreground hover:text-red-600 transition-colors">
                        Deny Request
                    </button>
                </div>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="text-green-600" size={50} />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-green-600 italic">Account Linked!</h3>
                <p className="text-sm text-muted-foreground font-medium">
                    Webhook received: <span className="text-indigo-600 font-bold">FI_READY</span>
                </p>
             </div>
             <div className="pt-4">
                <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold animate-bounce">
                    <Smartphone size={16} />
                    <span className="text-xs uppercase tracking-widest">Redirecting to Copilot...</span>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
