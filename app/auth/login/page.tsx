"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { BackgroundVideo } from '@/components/BackgroundVideo';
import { Mail, Lock, ArrowRight, ShieldCheck, Github, Globe } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white relative flex items-center justify-center p-6 overflow-hidden">
      <BackgroundVideo />
      <Navbar />

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/20 shadow-2xl p-10 space-y-8">
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-display font-bold italic tracking-tighter">Welcome Back</h1>
            <p className="text-white/60 text-sm font-medium">Continue your financial simulation journey</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-white/40 group-focus-within:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Password</label>
                <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-white/40 group-focus-within:text-white transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
                />
              </div>
            </div>
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] group">
            Sign In to Copilot
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center px-2">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative bg-transparent px-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-2xl transition-all">
              <Github size={18} />
              <span className="text-xs font-bold">GitHub</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-2xl transition-all">
              <Globe size={18} />
              <span className="text-xs font-bold">Google</span>
            </button>
          </div>

          <p className="text-center text-xs text-white/60">
            Don't have an account? {' '}
            <Link href="/auth/signup" className="text-indigo-400 font-bold hover:underline">Create Account</Link>
          </p>

          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            <ShieldCheck size={12} />
            Secure Authentication
          </div>

        </div>
      </div>
    </main>
  );
}
