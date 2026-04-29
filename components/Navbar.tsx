"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageContext';
import { Languages, UserPlus, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isDashboard = pathname === '/dashboard' || pathname === '/demo';

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 px-6 pointer-events-none">
      <nav className="flex items-center justify-between w-full max-w-7xl px-8 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[2rem] border border-white dark:border-white/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] pointer-events-auto transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black shadow-lg group-hover:scale-110 transition-all duration-500 ease-out">
              <span className="text-xl font-black">F</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white group-hover:opacity-80 transition-opacity">
              FinPilot
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-white/10 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5">
          <Link 
            href="/" 
            className={`text-sm font-black px-6 py-2.5 rounded-xl transition-all duration-500 ${
              isHome 
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl shadow-slate-200/50 dark:shadow-none scale-[1.02]" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
            }`}
          >
            {t.navbar.home}
          </Link>
          <Link 
            href="/dashboard" 
            className={`text-sm font-black px-6 py-2.5 rounded-xl transition-all duration-500 ${
              isDashboard 
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl shadow-slate-200/50 dark:shadow-none scale-[1.02]" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
            }`}
          >
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="hidden lg:flex items-center gap-2 text-[13px] font-black text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all px-4 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:border-white/10 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
          >
            <Languages className="h-4 w-4" />
            <span className="tracking-widest">{language === 'en' ? 'EN' : 'HI'}</span>
          </button>

          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" className="rounded-xl px-6 h-12 text-sm font-black text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 hidden sm:flex items-center gap-2 transition-all">
                <LogIn size={16} strokeWidth={3} />
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="rounded-xl px-8 h-12 text-sm font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-2xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                <UserPlus size={16} strokeWidth={3} />
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};
