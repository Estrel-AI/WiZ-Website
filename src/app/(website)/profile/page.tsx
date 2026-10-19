"use client";

import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/src/features/auth/website-auth";
import { getHubLoginUrl } from "@/src/features/auth/user-type";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    setIsAuthenticated(Boolean(token));
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#110a10] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl">Please log in</h2>
          <Link href="/login" className="inline-block rounded-xl bg-gradient-to-r from-[#912059] to-[#D87AAA] px-6 py-3 text-white">Login</Link>
        </div>
      </main>
    );
  }

  const displayName = String(user?.display_name || user?.first_name || user?.username || "User");
  const email = String(user?.email || "");
  const role = String(user?.role || "");
  const plan = String(user?.plan || "");

  return (
    <main className="min-h-screen bg-[#110a10] text-white py-10 md:py-20 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-gradient-to-b to-primary from-[#251321] border border-white/20 rounded-3xl p-6 md:p-10 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#912059] to-[#D87AAA] flex items-center justify-center text-2xl font-bold shadow-lg">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{displayName}</h1>
            <p className="text-gray-300 text-sm">{email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-gray-400">Account Type</p>
            <p className="font-semibold text-lg">{role || "Developer / Business"}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-gray-400">Plan</p>
            <p className="font-semibold text-lg">{plan || "Select a plan"}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-gray-400">Status</p>
            <p className="font-semibold text-lg text-emerald-400">Active</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href={getHubLoginUrl()} className="rounded-xl bg-gradient-to-r from-[#912059] to-[#D87AAA] px-6 py-3 text-sm font-medium transition hover:scale-105">Continue to Hub</a>
          <Link href="/pricing" className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium transition hover:bg-white/10">Select / Change Plan</Link>
        </div>
      </div>
    </main>
  );
}
