"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { setToken, setUserId } from "@/lib/auth";
import { authApi } from "@/lib/sumo-api";
import { QRCodeCanvas } from "qrcode.react";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Check,
} from "lucide-react";

type RegistrationStep = "form" | "qr" | "otp";

interface RegistrationData {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<RegistrationStep>("form");
  const [loading, setLoading] = useState(false);

  // Step 1: Form data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: QR Code
  const [qrCodeUri, setQrCodeUri] = useState("");
  const [userId, setUserIdState] = useState("");

  // Step 3: OTP
  const [otp, setOtp] = useState("");

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !phone) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.register({
        full_name: fullName,
        email,
        password,
        phone_number: phone,
      });

      if (response.user_id && response.qr_code_uri) {
        setUserIdState(response.user_id);
        setQrCodeUri(response.qr_code_uri);
        setStep("qr");
        toast.success("QR Code generated. Scan with Google Authenticator");
      } else {
        toast.error("Failed to generate QR code");
      }
    } catch (err: any) {
      toast.error(
        err.message || "Registration failed. Please check your details.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.verify2fa({
        user_id: userId,
        otp_code: otp,
      });

      if (response.access_token) {
        setToken(response.access_token);
        setUserId(userId);
        toast.success("Account created successfully!");
        router.push("/dashboard");
      } else {
        toast.error("Invalid OTP. Please try again");
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
      {["form", "qr", "otp"].map((s, i) => (
        <div
          key={s}
          className={`h-1 flex-1 rounded-full transition-all ${step === s || (step === "qr" && i < 1) || (step === "otp" && i < 2)
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

          {/* STEP 1: Registration Form */}
          {step === "form" && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-black tracking-tight text-black">
                  Create Account
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Step 1 of 3: Your details
                </p>
              </div>

              {[
                {
                  icon: User,
                  value: fullName,
                  set: setFullName,
                  placeholder: "Full Name",
                  type: "text",
                },
                {
                  icon: Mail,
                  value: email,
                  set: setEmail,
                  placeholder: "Email Address",
                  type: "email",
                },
                {
                  icon: Lock,
                  value: password,
                  set: setPassword,
                  placeholder: "Password (min 8 chars)",
                  type: "password",
                },
                {
                  icon: Phone,
                  value: phone,
                  set: setPhone,
                  placeholder: "Phone Number",
                  type: "tel",
                },
              ].map(({ icon: Icon, value, set, placeholder, type }) => (
                <div key={placeholder} className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                    <Icon size={16} />
                  </div>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Next Step <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-black font-black hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}

          {/* STEP 2: QR Code Display */}
          {step === "qr" && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-black tracking-tight text-black">
                  Scan QR Code
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Step 2 of 3: Set up 2FA
                </p>
              </div>

              <div className="bg-slate-50 border border-black/10 p-6 rounded-xl flex flex-col items-center gap-4">
                {qrCodeUri && (
                  <QRCodeCanvas
                    value={qrCodeUri}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                )}
                <p className="text-center text-xs text-slate-600 font-medium">
                  Open Google Authenticator on your phone and scan this QR code
                </p>
              </div>

              <button
                onClick={() => setStep("otp")}
                className="w-full bg-black text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg"
              >
                I've Scanned the Code <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 3: OTP Verification */}
          {step === "otp" && (
            <form onSubmit={handleStep3Submit} className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-black tracking-tight text-black">
                  Verify OTP
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Step 3 of 3: Enter 6-digit code
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
                    Verify & Create Account <Check size={16} />
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
