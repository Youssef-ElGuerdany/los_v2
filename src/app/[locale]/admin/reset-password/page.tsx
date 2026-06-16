"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Lock, Loader2, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const locale = useLocale();
  const router = useRouter();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function verifyRecoverySession() {
      if (!supabase) {
        setCheckingAuth(false);
        return;
      }
      
      // Supabase parses recovery hashes automatically on load and establishes session.
      // We check if a valid session exists.
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setHasSession(true);
      } else {
        setErrorMsg("Invalid or expired password reset link. You will be redirected to the login page shortly.");
        setTimeout(() => {
          router.push(`/${locale}/admin/login`);
        }, 5000);
      }
      setCheckingAuth(false);
    }
    verifyRecoverySession();
  }, [locale, router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Password updated successfully! Redirecting you to the dashboard...");
      setTimeout(() => {
        router.push(`/${locale}/admin`);
      }, 2000);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
        <p className="text-slate-400 font-semibold animate-pulse text-sm">Verifying reset token...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden px-4 py-12">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight">
            LAND OF <span className="text-amber-500">SAND</span>
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Establish a new admin password
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          
          {/* Notification Alerts */}
          {errorMsg && (
            <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-2xl flex items-start gap-3 text-red-400 text-sm animate-[fadeIn_0.3s_ease-out]">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-green-950/30 border border-green-900/50 rounded-2xl flex items-start gap-3 text-green-400 text-sm animate-[fadeIn_0.3s_ease-out]">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {hasSession ? (
            /* Reset password form */
            <form onSubmit={handleResetPassword} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-5 py-4 bg-slate-950/40 border border-slate-850 focus:border-amber-600 rounded-2xl outline-none text-white text-sm transition-all focus:ring-1 focus:ring-amber-600/35"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-5 py-4 bg-slate-950/40 border border-slate-850 focus:border-amber-600 rounded-2xl outline-none text-white text-sm transition-all focus:ring-1 focus:ring-amber-600/35"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:scale-[1.01] active:scale-[0.99] flex justify-center items-center gap-2 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Update Password <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : (
            /* Redirect Helper fallback */
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push(`/${locale}/admin/login`)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all"
              >
                Go to Login Gate
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
