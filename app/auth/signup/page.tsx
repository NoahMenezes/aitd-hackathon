"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { User, Mail, Lock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-transparent text-slate-900 dark:text-white relative flex items-center justify-center p-6 overflow-hidden transition-colors duration-300">
      <Navbar />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Left Side: Brand Value */}
        <div className="hidden lg:flex flex-col space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest w-fit">
            <Sparkles size={12} />
            Join the 1%
          </div>
          <h1 className="text-6xl font-bold tracking-tighter leading-[0.9] italic">
            Start your <br />
            <span className="text-indigo-600 dark:text-indigo-500">Financial</span> <br />
            Simulation.
          </h1>
          <p className="text-slate-600 dark:text-white/60 text-lg max-w-md font-medium leading-relaxed">
            Gain unfair advantages with AI-driven insights that anticipate market movements and optimize your wealth.
          </p>
          
          <div className="space-y-4 pt-4">
            <FeatureItem text="Real-time ReBIT Data Integration" />
            <FeatureItem text="AI Scenario Simulation Engine" />
            <FeatureItem text="Ranked Financial Suggestions" />
            <FeatureItem text="256-bit Bank Grade Encryption" />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/40 dark:border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 space-y-8">
          
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter italic">Create Account</h2>
            <p className="text-slate-500 dark:text-white/60 text-sm font-medium">Get started with FinPilot in 2 minutes</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 ml-4">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 dark:text-white/40 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 ml-4">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 dark:text-white/40 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 ml-4">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 dark:text-white/40 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="Create a strong password" 
                  className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-white/20"
                />
              </div>
            </div>
          </div>

          <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-all active:scale-[0.98] group">
            Build My Copilot
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-center text-xs text-slate-500 dark:text-white/60">
            Already a member? {' '}
            <Link href="/auth/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Sign In</Link>
          </p>

          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-300 dark:text-white/20 uppercase tracking-[0.2em]">
            <ShieldCheck size={12} />
            Encrypted Onboarding
          </div>

        </div>
      </div>
    </main>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-indigo-100 dark:bg-indigo-500/20 p-1 rounded-full text-indigo-600 dark:text-indigo-400">
        <CheckCircle2 size={16} />
      </div>
      <span className="text-sm font-semibold text-slate-700 dark:text-white/80">{text}</span>
    </div>
  );
}
