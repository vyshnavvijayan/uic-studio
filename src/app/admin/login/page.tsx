"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { verifyUserIsAdmin } from "@/lib/content-service";
import { Lock, Mail, ShieldAlert, ArrowLeft, KeyRound, Sparkles, UserPlus, LogIn, CheckCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const supabaseReady = isSupabaseConfigured();

  // If already logged in and verified admin, navigate straight to CMS
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.auth
        .getUser()
        .then(async ({ data: { user } }) => {
          if (user) {
            const isAdmin = await verifyUserIsAdmin(user.id);
            if (isAdmin) {
              router.push("/admin");
            }
          }
        })
        .catch(() => {});
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setErrorMsg("Supabase is not configured. Use Preview Sandbox Mode below to test the CMS editor.");
      setLoading(false);
      return;
    }

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          // Automatic session created (no email confirmation needed)
          router.push("/admin");
          return;
        }

        if (data.user) {
          setSuccessMsg("Account created! Check your email inbox for the activation link, or sign in now.");
          setAuthMode("signin");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (!data.user) {
          setErrorMsg("Failed to authenticate user.");
          setLoading(false);
          return;
        }

        // Check if user is an approved admin in site_admins table
        const isAdmin = await verifyUserIsAdmin(data.user.id);
        if (!isAdmin) {
          await supabase.auth.signOut();
          setErrorMsg(
            "Access Denied: Your account is authenticated but not listed in the approved 'site_admins' table. Contact studio administration."
          );
          setLoading(false);
          return;
        }

        router.push("/admin");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected authentication error occurred.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080809] text-[#f5f5f7] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#c6f36b] selection:text-[#080809]">
      {/* Return to Public Site */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-mono text-[#90909c] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to UIC Studio</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-4 text-[#c6f36b]">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
            UIC Studio CMS
          </h1>
          <p className="mt-2 text-xs font-mono text-[#90909c]">
            Section-Based Visual Website Editor &amp; Publisher
          </p>
        </div>

        {/* Login / Signup Card */}
        <div className="p-8 rounded-3xl bg-[#0d0d10] border border-white/[0.08] shadow-2xl">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                authMode === "signin"
                  ? "bg-[#c6f36b] text-[#080809] font-bold shadow"
                  : "text-[#90909c] hover:text-white"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("signup");
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                authMode === "signup"
                  ? "bg-[#c6f36b] text-[#080809] font-bold shadow"
                  : "text-[#90909c] hover:text-white"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs leading-relaxed font-mono">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs leading-relaxed font-mono flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#c6f36b] flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#585863]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@uic.studio"
                  className="w-full bg-[#161619] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c6f36b]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] block mb-2">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#585863]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#161619] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c6f36b]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !supabaseReady}
              className="mt-2 w-full rounded-xl bg-[#c6f36b] disabled:opacity-40 disabled:cursor-not-allowed text-[#080809] hover:bg-[#b5e656] py-3 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="font-mono">Processing...</span>
              ) : (
                <span>{authMode === "signup" ? "Create Admin Account" : "Authenticate & Open CMS"}</span>
              )}
            </button>
          </form>

          {/* Sandbox Direct Button (Always accessible for testing/demo) */}
          <div className="mt-6 pt-6 border-t border-white/[0.08] text-center">
            <Link
              href="/admin?mode=sandbox"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/10 hover:border-[#c6f36b]/40 bg-white/[0.02] hover:bg-[#c6f36b]/5 text-xs font-mono text-white transition-all group"
            >
              <span>Launch Sandbox Editor (No Auth Required)</span>
              <Sparkles className="w-3.5 h-3.5 text-[#c6f36b] group-hover:rotate-12 transition-transform" />
            </Link>
            <p className="text-[11px] text-[#585863] font-mono mt-1.5">
              Instant access: edit all sections, toggle viewports, and test drafts in browser storage.
            </p>
          </div>
        </div>

        {/* Security Policy Reminder */}
        <div className="mt-8 text-center text-[11px] font-mono text-[#585863] leading-relaxed">
          Connected to Supabase Project: <code className="text-[#90909c]">nnvjdfjizpgqyxwlhgnu</code>
        </div>
      </div>
    </div>
  );
}
