"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { Languages, LogOut, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated, clearAuth, getUserId } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const check = () => {
      setAuthed(isAuthenticated());
      setUid(getUserId());
    };
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    setAuthed(false);
    setShowUserMenu(false);
    router.push("/");
  };

  const isDashboard = pathname === "/dashboard" || pathname === "/demo";
  const isInsights = pathname === "/dashboard/insights";
  const isSimulation = pathname === "/dashboard/simulation";
  const isRecommendations = pathname === "/dashboard/recommendations";
  const isHome = pathname === "/";

  const navLink = (href: string, active: boolean, label: string) => (
    <Link
      href={href}
      className={`text-[11px] font-black px-5 py-2 transition-all duration-500 uppercase tracking-widest ${
        active ? "bg-black text-white" : "text-slate-400 hover:text-black hover:bg-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-8 px-6 pointer-events-none">
      <nav className="flex items-center justify-between w-full max-w-7xl px-8 py-4 bg-white border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] pointer-events-auto transition-all duration-500 hover:border-black/10">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white">
              <span className="text-lg font-black tracking-tighter">F</span>
            </div>
            <span className="text-xl font-black tracking-[0.2em] text-black uppercase group-hover:opacity-80 transition-opacity">
              FinPilot
            </span>
          </Link>
        </div>

        {/* Nav Links — only after mount to avoid hydration mismatch */}
        {mounted && authed && (
          <div className="hidden md:flex items-center gap-1 bg-slate-50 p-1 border border-black/5">
            {navLink("/", isHome, t.navbar.home)}
            {navLink("/dashboard", isDashboard, t.navbar.dashboard)}
            {navLink("/dashboard/insights", isInsights, t.navbar.insights)}
            {navLink("/dashboard/recommendations", isRecommendations, t.navbar.recommendations)}
            {navLink("/dashboard/simulation", isSimulation, t.navbar.simulation)}
          </div>
        )}

        {/* Right controls — render placeholder during SSR, real UI after mount */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="hidden lg:flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-black transition-all px-4 py-2 border border-transparent hover:border-black/5 uppercase tracking-widest"
          >
            <Languages className="h-3 w-3" />
            <span>{t.navbar.languageToggle}</span>
          </button>

          {/* Stable placeholder until JS loads — prevents hydration mismatch */}
          {!mounted ? (
            <div className="w-24 h-9 bg-slate-100 animate-pulse" />
          ) : authed ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 border border-black/10 text-[11px] font-black uppercase tracking-widest hover:border-black/30 transition-all"
              >
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <User size={12} className="text-white" />
                </div>
                <span className="text-slate-700">{uid ? `UID: ${uid.slice(0, 6)}…` : "Account"}</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-black/10 shadow-xl z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={13} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-0">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="px-6 h-10 text-[11px] font-black text-slate-400 hover:text-black hidden sm:flex items-center gap-2 transition-all uppercase tracking-widest"
                >
                  {t.navbar.login}
                </Button>
              </Link>
              <Link href="/register">
                <Button className="px-8 h-10 text-[11px] font-black bg-black text-white hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest">
                  {t.navbar.getStartedButton}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};
