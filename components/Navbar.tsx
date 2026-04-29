"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageContext';
import { Languages } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isDashboard = pathname === '/dashboard';

  return (
    <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-6">
      <nav className="flex items-center justify-between w-full max-w-7xl px-8 py-4 bg-white/90 backdrop-blur-md rounded-full border border-black/5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl font-bold tracking-tighter text-black">
              ✦ FinPilot
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-1 bg-black/5 p-1 rounded-full border border-black/5">
          <Link 
            href="/" 
            className={`text-[13px] font-semibold px-6 py-2 rounded-full transition-all ${
              isHome 
                ? "bg-white text-black shadow-sm" 
                : "text-black/60 hover:text-black hover:bg-white/50"
            }`}
          >
            {t.navbar.home}
          </Link>
          <Link 
            href="/dashboard" 
            className={`text-[13px] font-semibold px-6 py-2 rounded-full transition-all ${
              isDashboard 
                ? "bg-white text-black shadow-sm" 
                : "text-black/60 hover:text-black hover:bg-white/50"
            }`}
          >
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-2 text-[13px] font-medium text-black/60 hover:text-black transition-all px-4 py-2 rounded-full hover:bg-black/5"
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">{language === 'en' ? 'English' : 'हिंदी'}</span>
          </button>

          <Link href="/dashboard">
            <Button variant="default" className="rounded-full px-6 py-5 text-xs font-bold bg-black text-white hover:bg-black/80 shadow-lg transition-transform hover:scale-105 active:scale-95">
              {t.navbar.getStarted}
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
};
