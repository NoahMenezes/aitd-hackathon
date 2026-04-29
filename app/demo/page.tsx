"use client";

import React, { useState } from 'react';
import { MerchantApp } from '@/components/demo/MerchantApp';
import { CopilotDashboard } from '@/components/demo/CopilotDashboard';
import { BankLinkModal } from '@/components/demo/BankLinkModal';
import { Navbar } from '@/components/Navbar';
import { BackgroundVideo } from '@/components/BackgroundVideo';
import { Sparkles, Terminal, Smartphone, LayoutDashboard, Share2 } from 'lucide-react';

export default function DemoPage() {
  const [isLinked, setIsLinked] = useState(false);
  const [showModal, setShowModal] = useState(true);

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <BackgroundVideo />
      <Navbar />
      
      {showModal && (
        <BankLinkModal 
          onComplete={() => {
            setIsLinked(true);
            setShowModal(false);
          }} 
        />
      )}

      <div className="relative z-10 pt-32 pb-20 px-6 max-w-[1600px] mx-auto h-screen flex flex-col">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
              <Terminal size={12} />
              Hackathon Live Demo Pipeline
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold italic tracking-tighter">
              The "Secret Sauce" Simulator
            </h1>
            <p className="text-white/60 text-lg max-w-2xl font-medium">
              Watch how <span className="text-white italic">FinPilot</span> reacts instantly to real-world transactions via the Account Aggregator framework.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {!isLinked && (
              <button 
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
              >
                Reset Bank Link
              </button>
            )}
            <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
              <Share2 size={16} className="text-white/40" />
              <span className="text-xs font-bold text-white/60">Share Demo URL</span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden min-h-0">
          
          {/* Left Side: Merchant Site */}
          <div className="w-full lg:w-[450px] flex flex-col space-y-4">
            <div className="flex items-center gap-2 px-4">
              <Smartphone className="text-indigo-400" size={20} />
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">User's Device (Swiggy)</h2>
            </div>
            <div className="flex-1 flex items-center justify-center bg-white/5 rounded-[3rem] border border-white/10 p-6 backdrop-blur-sm relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]" />
              <MerchantApp />
            </div>
          </div>

          {/* Right Side: Copilot Dashboard */}
          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex items-center gap-2 px-4">
              <LayoutDashboard className="text-indigo-400" size={20} />
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">FinPilot AI Copilot</h2>
            </div>
            <div className="flex-1 bg-white rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden relative group">
                {!isLinked && (
                    <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center space-y-6">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                            <Sparkles className="text-indigo-400" size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-display font-bold">Dashboard Locked</h3>
                            <p className="text-sm text-white/60 max-w-xs">
                                Please link your bank account using the simulator on the left to see live insights.
                            </p>
                        </div>
                    </div>
                )}
                <CopilotDashboard />
            </div>
          </div>

        </div>

        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
           <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> AA Protocol Active</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> ReBIT G02 Compliant</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" /> AI Insights Ready</span>
           </div>
           <div>© 2026 FinPilot Hackathon Environment</div>
        </div>
      </div>
    </main>
  );
}
