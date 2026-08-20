"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { clearAdminAuthToken, setAdminAuthToken } from "@/src/services/admin-auth-storage.service";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(payload?.message ?? "Unable to sign in.");
      setLoading(false);
      return;
    }

    const payload = (await response.json().catch(() => null)) as
      | {
          data?: {
            token?: string;
          };
        }
      | null;

    const token = payload?.data?.token?.trim();

    if (token) {
      setAdminAuthToken(token);
    } else {
      clearAdminAuthToken();
    }

    const redirectTo = searchParams.get("redirect") || "/admin";
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#110a10] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#d87aaa22_0%,#110a10_52%)]" />
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#912059]/20 blur-3xl" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#d87aaa]/15 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-[30px] border border-white/15 bg-gradient-to-b from-[#251321] to-[#170e17] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <ShieldCheck className="h-7 w-7 text-[#d87aaa]" />
          </div>

          <div className="mt-5 text-center">
            <div className="text-xs uppercase tracking-[0.28em] text-gray-400">Admin Login</div>
            <h1 className="mt-3 text-3xl font-semibold text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-300">
              Sign in to access the admin dashboard.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm text-gray-200">Username</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#FFFFFF05] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-[#d87aaa]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-gray-200">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#FFFFFF05] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-[#d87aaa]"
              />
            </label>

            {error ? (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#912059] to-[#D87AAA] px-4 py-3 font-medium text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Enter Admin Panel"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
