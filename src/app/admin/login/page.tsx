"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { verifyUserIsAdmin } from "@/lib/content-service";
import { Lock, Mail, ShieldAlert, ArrowLeft, KeyRound, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const supabaseReady = isSupabaseConfigured();

  // If already logged in and verified admin, navigate straight to CMS
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (user) {
          const isAdmin = await verifyUserIsAdmin(user.id);
          if (isAdmin) {
            router.push("/admin");
          }
        }
      });
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setErrorMsg("Supabase is not configured. Use Preview Sandbox Mode below to test the CMS editor.");
      setLoading(false);
      return;
    }

    try {
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
        // Enforce permissions in database: sign out unauthorized user immediately
        await supabase.auth.signOut();
        setErrorMsg("Access Denied: Your account is authenticated but not listed in the approved 'site_admins' table. Contact studio administration.");
        setLoading(false);
        return;
      }

      router.push("/admin");
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
            Restricted Administrative Access
          </p>
        </div>

        {/* Sandbox Notice if Supabase not configured */}
        {!supabaseReady && (
          <div className="mb-6 p-4 rounded-2xl bg-[#161619] border border-amber-500/30 text-amber-200/90 text-xs leading-relaxed flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold text-amber-400 font-mono uppercase tracking-wider text-[11px]">
              <ShieldAlert className="w-4 h-4" />
              <span>Supabase Not Configured</span>
            </div>
            <p>
              Environment variables (<code className="text-white">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-white">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>) are not yet set.
            </p>
            <div className="pt-2 border-t border-amber-500/20">
              <Link
                href="/admin?mode=sandbox"
                className="inline-flex items-center gap-1.5 text-white underline font-semibold hover:text-[#c6f36b]"
              >
                <span>Enter Labelled Preview Sandbox Mode</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
              <span className="block text-[11px] text-[#90909c] mt-1">
                Allows testing all section editors, layout tools, and live responsive previews immediately.
              </span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="p-8 rounded-3xl bg-[#0d0d10] border border-white/[0.08] shadow-2xl">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs leading-relaxed font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
                <span className="font-mono">Authenticating...</span>
              ) : (
                <span>Authenticate Admin</span>
              )}
            </button>
          </form>

          {/* Sandbox Direct Button */}
          {!supabaseReady && (
            <div className="mt-6 pt-6 border-t border-white/[0.08] text-center">
              <Link
                href="/admin?mode=sandbox"
                className="w-full inline-block py-2.5 px-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] text-xs font-mono text-[#90909c] hover:text-white transition-all"
              >
                Launch Sandbox Editor (No Auth Required)
              </Link>
            </div>
          )}
        </div>

        {/* Security Policy Reminder */}
        <div className="mt-8 text-center text-[11px] font-mono text-[#585863] leading-relaxed">
          Public registration is strictly disabled. Administrative credentials must be approved in Supabase <code className="text-[#90909c]">site_admins</code> table.
        </div>
      </div>
    </div>
  );
}
