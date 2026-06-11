"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { setToken, setUserId } from "@/lib/auth";
import { authApi } from "@/lib/sumo-api";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Check,
} from "lucide-react";

type LoginStep = "credentials" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("credentials");
  const [loading, setLoading] = useState(false);

  // Step 1: Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: OTP
  const [otp, setOtp] = useState("");
  const [userId, setUserIdState] = useState("");

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login({
        email,
        password,
      });

      if (response.status === "pending_2fa" && response.user_id) {
        setUserIdState(response.user_id);
        setStep("otp");
        toast.success("Check your authenticator app for the OTP");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      toast.error(
        err.message || "Login failed. Please check your credentials.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login2fa({
        user_id: userId,
        otp_code: otp,
      });

      if (response.access_token) {
        setToken(response.access_token);
        setUserId(userId);
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "OTP verification failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const inputClass =
    "w-full bg-slate-50 border border-black/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-slate-300 font-medium";

  const stepProgressBar = (
    <div className="flex gap-2 mb-8">
      {["credentials", "otp"].map((s, i) => (
        <div
          key={s}
          className={`h-1 flex-1 rounded-full transition-all ${
            step === s || (step === "otp" && i < 1)
              ? "bg-black"
              : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  );

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-transparent font-body">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white border border-black/8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-3xl p-10 space-y-6">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-black flex items-center justify-center text-white">
                <span className="text-lg font-black tracking-tighter">F</span>
              </div>
              <span className="text-xl font-black tracking-[0.2em] text-black uppercase">
                FinPilot
              </span>
            </Link>
          </div>

          {stepProgressBar}

          {/* STEP 1: Credentials */}
          {step === "credentials" && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-black tracking-tight text-black">
                  Welcome Back
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Step 1 of 2: Sign in
                </p>
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
                className="w-full bg-black text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Continue <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-black font-black hover:underline"
                >
                  Create one
                </Link>
              </p>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === "otp" && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-black tracking-tight text-black">
                  Verify OTP
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Step 2 of 2: Enter 6-digit code from Google Authenticator
                </p>
              </div>

              <div className="bg-slate-50 border border-black/10 rounded-xl p-6">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full text-center text-2xl font-black tracking-widest bg-transparent border-b border-black/20 pb-4 focus:outline-none placeholder:text-slate-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-black text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Sign In <Check size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <ShieldCheck size={12} />
            256-bit encrypted · GDPR compliant
          </div>
        </div>
      </div>
    </main>
  );
}
