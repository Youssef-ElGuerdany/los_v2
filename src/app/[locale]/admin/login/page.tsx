"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { KeyRound, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  
  const [view, setView] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Clear messages when view changes
  useEffect(() => {
    Promise.resolve().then(() => {
      setErrorMsg("");
      setSuccessMsg("");
    });
  }, [view]);

  // Guard: if already logged in, redirect to admin dashboard
  useEffect(() => {
    async function checkSession() {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(`/${locale}/admin`);
      }
    }
    checkSession();
  }, [locale, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setIsLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      router.push(`/${locale}/admin`);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Point to our custom password reset landing page
    const redirectToUrl = `${window.location.origin}/${locale}/admin/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectToUrl
    });

    setIsLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("A password recovery link has been sent to your email.");
      setEmail("");
    }
  };

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
            {view === "login" ? "Admin Dashboard Access Gate" : "Password Recovery Portal"}
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

          {view === "login" ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@landofsand.com"
                    className="w-full pl-12 pr-5 py-4 bg-slate-950/40 border border-slate-850 focus:border-amber-600 rounded-2xl outline-none text-white text-sm transition-all focus:ring-1 focus:ring-amber-600/35"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-xs text-amber-500 hover:text-amber-400 font-semibold transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:scale-[1.01] active:scale-[0.99] flex justify-center items-center gap-2 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="w-full pl-12 pr-5 py-4 bg-slate-950/40 border border-slate-850 focus:border-amber-600 rounded-2xl outline-none text-white text-sm transition-all focus:ring-1 focus:ring-amber-600/35"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">We will send a secure password reset link to this email.</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:scale-[1.01] active:scale-[0.99] flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Send Recovery Link"
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-xs text-slate-400 hover:text-white font-semibold transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
