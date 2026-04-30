"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { setToken, setUserId } from "@/lib/auth";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Loader2,
} from "lucide-react";

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // Step 1 fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2/3 state
  const [userId, setUserIdState] = useState("");
  const [qrCodeUri, setQrCodeUri] = useState("");
  const [otp, setOtp] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          phone_number: phone,
        }),
      });
      setUserIdState(data.user_id);
      setQrCodeUri(data.qr_code_uri);
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter a 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch("/auth/verify-2fa", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, otp_code: otp }),
      });
      setToken(data.access_token);
      setUserId(userId);
      toast.success("Account verified! Redirecting…");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error("Invalid code. Check your authenticator and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-slate-50 border border-black/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all placeholder:text-slate-300 font-medium";

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-3 mb-8">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div className={`flex items-center gap-2 ${step === s ? "opacity-100" : step > s ? "opacity-60" : "opacity-30"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
              step > s ? "bg-black text-white" : step === s ? "bg-black text-white" : "border-2 border-black/20 text-black"
            }`}>
              {step > s ? <CheckCircle2 size={14} /> : s}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 hidden sm:block">
              {s === 1 ? "Details" : s === 2 ? "Scan QR" : "Verify"}
            </span>
          </div>
          {s < 3 && <div className={`h-px w-8 transition-all ${step > s ? "bg-black" : "bg-black/15"}`} />}
        </React.Fragment>
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
              <span className="text-xl font-black tracking-[0.2em] text-black uppercase">FinPilot</span>
            </Link>
          </div>

          <StepIndicator />

          {/* STEP 1 — Registration Form */}
          {step === 1 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="text-center mb-2">
                <h1 className="text-2xl font-black tracking-tight text-black">Create Account</h1>
                <p className="text-xs text-slate-400 font-medium mt-1">Start your financial journey with FinPilot</p>
              </div>

              {[
                { icon: User, value: fullName, set: setFullName, placeholder: "Full Name", type: "text", required: true },
                { icon: Mail, value: email, set: setEmail, placeholder: "Email Address", type: "email", required: true },
                { icon: Lock, value: password, set: setPassword, placeholder: "Password (min 8 chars)", type: "password", required: true },
                { icon: Phone, value: phone, set: setPhone, placeholder: "Phone Number (+91...)", type: "tel", required: true },
              ].map(({ icon: Icon, value, set, placeholder, type, required }) => (
                <div key={placeholder} className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                    <Icon size={16} />
                  </div>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    required={required}
                    className={inputClass}
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>Continue <ArrowRight size={16} /></>}
              </button>

              <p className="text-center text-xs text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-black font-black hover:underline">Sign in</Link>
              </p>
            </form>
          )}

          {/* STEP 2 — QR Code */}
          {step === 2 && (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-black mb-1">Set Up Authenticator</h2>
                <p className="text-xs text-slate-400 font-medium">Scan this QR code with Google Authenticator</p>
              </div>

              <div className="flex justify-center">
                <div className="p-4 border-2 border-black/8 rounded-2xl inline-block bg-white shadow-inner">
                  <QRCodeSVG value={qrCodeUri} size={200} level="M" />
                </div>
              </div>

              <div className="bg-slate-50 border border-black/8 rounded-xl p-4 text-left space-y-2">
                {[
                  "Open Google Authenticator on your phone",
                  'Tap "+" → "Scan QR Code"',
                  "Point camera at the QR code above",
                  "A 6-digit code will appear",
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                    <p className="text-xs font-medium text-slate-600">{step}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full bg-black text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98]"
              >
                I've Scanned It <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 3 — OTP Verification */}
          {step === 3 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-slate-50 border border-black/8 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone size={24} className="text-black" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-black mb-1">Enter OTP</h2>
                <p className="text-xs text-slate-400 font-medium">6-digit code from Google Authenticator</p>
              </div>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center text-3xl font-black tracking-[0.5em] border-2 border-black/10 rounded-xl py-5 focus:outline-none focus:border-black transition-all bg-slate-50"
              />

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-black text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg disabled:opacity-40"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={16} /> Verify & Enter</>}
              </button>

              <button type="button" onClick={() => setStep(2)} className="w-full text-xs text-slate-400 font-medium hover:text-black transition-colors">
                ← Back to QR Code
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
