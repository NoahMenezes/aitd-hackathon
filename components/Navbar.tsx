"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { Languages, UserPlus, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isDashboard = pathname === "/dashboard" || pathname === "/demo";
  const isInsights = pathname === "/dashboard/insights";
  const isSimulation = pathname === "/dashboard/simulation";
  const isRecommendations = pathname === "/dashboard/recommendations";

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-8 px-6 pointer-events-none">
      <nav className="flex items-center justify-between w-full max-w-7xl px-8 py-4 bg-white border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] pointer-events-auto transition-all duration-500 hover:border-black/10 border-beam">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white transition-all duration-500 ease-out">
              <span className="text-lg font-black tracking-tighter">F</span>
            </div>
            <span className="text-xl font-black tracking-[0.2em] text-black uppercase group-hover:opacity-80 transition-opacity">
              FinPilot
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-slate-50 p-1 border border-black/5">
          <Link
            href="/"
            className={`text-[11px] font-black px-5 py-2 transition-all duration-500 uppercase tracking-widest ${
              isHome
                ? "bg-black text-white"
                : "text-slate-400 hover:text-black hover:bg-white"
            }`}
          >
            {t.navbar.home}
          </Link>
          <Link
            href="/dashboard"
            className={`text-[11px] font-black px-5 py-2 transition-all duration-500 uppercase tracking-widest ${
              isDashboard
                ? "bg-black text-white"
                : "text-slate-400 hover:text-black hover:bg-white"
            }`}
          >
            {t.navbar.dashboard}
          </Link>
          <Link
            href="/dashboard/insights"
            className={`text-[11px] font-black px-5 py-2 transition-all duration-500 uppercase tracking-widest ${
              isInsights
                ? "bg-black text-white"
                : "text-slate-400 hover:text-black hover:bg-white"
            }`}
          >
            {t.navbar.insights}
          </Link>
          <Link
            href="/dashboard/simulation"
            className={`text-[11px] font-black px-5 py-2 transition-all duration-500 uppercase tracking-widest ${
              isSimulation
                ? "bg-black text-white"
                : "text-slate-400 hover:text-black hover:bg-white"
            }`}
          >
            {t.navbar.simulation}
          </Link>
          <Link
            href="/dashboard/recommendations"
            className={`text-[11px] font-black px-5 py-2 transition-all duration-500 uppercase tracking-widest ${
              isRecommendations
                ? "bg-black text-white"
                : "text-slate-400 hover:text-black hover:bg-white"
            }`}
          >
            {t.navbar.recommendations}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="hidden lg:flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-black transition-all px-4 py-2 border border-transparent hover:border-black/5 uppercase tracking-widest"
          >
            <Languages className="h-3 w-3" />
            <span>{t.navbar.languageToggle}</span>
          </button>

          <div className="flex items-center gap-0">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="px-6 h-10 text-[11px] font-black text-slate-400 hover:text-black hidden sm:flex items-center gap-2 transition-all uppercase tracking-widest"
              >
                {t.navbar.login}
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="px-8 h-10 text-[11px] font-black bg-black text-white hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest">
                {t.navbar.getStartedButton}
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};
