"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { setToken, setUserId } from "@/lib/auth";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Loader2,
  CheckCircle2,
} from "lucide-react";

type Step = 1 | 2;

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserIdState] = useState("");
  const [otp, setOtp] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      // Backend returns { status: "pending_2fa", user_id: "..." }
      setUserIdState(data.user_id);
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter a 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login/2fa", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, otp_code: otp }),
      });
      setToken(data.access_token);
      setUserId(userId);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error("Invalid code. Try again.");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-slate-50 border border-black/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-slate-300 font-medium";

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-transparent font-body">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white border border-black/8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-3xl p-10 space-y-6">

          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-black flex items-center justify-center text-white">
                <span className="text-lg font-black tracking-tighter">F</span>
              </div>
              <span className="text-xl font-black tracking-[0.2em] text-black uppercase">FinPilot</span>
            </Link>
          </div>

          {/* STEP 1 — Credentials */}
          {step === 1 && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-center mb-2">
                <h1 className="text-2xl font-black tracking-tight text-black">Welcome Back</h1>
                <p className="text-xs text-slate-400 font-medium mt-1">Sign in to your FinPilot account</p>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>Continue <ArrowRight size={16} /></>}
              </button>

              <p className="text-center text-xs text-slate-400">
                Don't have an account?{" "}
                <Link href="/register" className="text-black font-black hover:underline">Create one</Link>
              </p>
            </form>
          )}

          {/* STEP 2 — OTP */}
          {step === 2 && (
            <form onSubmit={handleVerify2FA} className="space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-slate-50 border border-black/8 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone size={24} className="text-black" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-black mb-1">Two-Factor Auth</h2>
                <p className="text-xs text-slate-400 font-medium">Enter the code from Google Authenticator</p>
              </div>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                autoFocus
                className="w-full text-center text-3xl font-black tracking-[0.5em] border-2 border-black/10 rounded-xl py-5 focus:outline-none focus:border-black transition-all bg-slate-50"
              />

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-black text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg disabled:opacity-40"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={16} /> Sign In</>}
              </button>

              <button type="button" onClick={() => { setStep(1); setOtp(""); }} className="w-full text-xs text-slate-400 font-medium hover:text-black transition-colors">
                ← Back to email
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <ShieldCheck size={12} />
            256-bit encrypted · RBI AA compliant
          </div>
        </div>
      </div>
    </main>
  );
}
