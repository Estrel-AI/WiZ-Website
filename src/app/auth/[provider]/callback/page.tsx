"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type CallbackState = "loading" | "error";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export default function OAuthCallbackPage() {
  const params = useParams<{ provider: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = typeof params.provider === "string" ? params.provider : "";

  const [state, setState] = useState<CallbackState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const providerError = searchParams.get("error");

    if (providerError) {
      setState("error");
      setErrorMessage(`Authentication was cancelled: ${providerError}.`);
      return;
    }

    const run = async () => {
      setState("loading");
      setErrorMessage("");

      try {
        const response = await fetch(`/api/auth/${provider}/callback?${searchParams.toString()}`, {
          method: "GET",
          credentials: "include",
        });
        const responseData = (await response.json().catch(() => null)) as
          | {
              success?: boolean;
              message?: string;
              redirect_to?: string;
              [key: string]: unknown;
            }
          | null;

        if (!response.ok || !responseData?.success) {
          throw new Error(responseData?.message || "Unable to complete authentication.");
        }

        if (typeof responseData.redirect_to === "string" && responseData.redirect_to) {
          router.replace(responseData.redirect_to);
          return;
        }

        throw new Error("Unable to determine where to continue your signup.");
      } catch (error) {
        setState("error");
        setErrorMessage(getErrorMessage(error));
      }
    };

    void run();
  }, [provider, router, searchParams]);

  return (
    <main>
      <section className="bg-[#110a10] text-white py-10 md:py-20 px-4 min-h-screen flex items-center justify-center font-sans relative overflow-hidden">
        <div className="md:block hidden absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-1/3 h-[50%] md:h-[88%] bg-quaternary/20 rounded-[50%] blur-[60px] pointer-events-none z-0" />
        <div className="md:block hidden absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-1/3 h-[50%] md:h-[88%] bg-quaternary/20 rounded-[50%] blur-[60px] pointer-events-none z-0" />

        <div className="w-full max-w-xl bg-gradient-to-b to-primary from-[#251321] border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl relative z-10">
          <h1 className="text-2xl text-white">{`Continue with ${provider}`}</h1>

          {errorMessage ? (
            <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          ) : null}

          {state === "loading" ? (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-gray-300">
              Verifying your email and preparing signup...
            </div>
          ) : null}

          {state === "error" ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-300">
                We couldn&apos;t complete your social authentication this time.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-xl bg-gradient-to-r from-[#912059] to-[#D87AAA] px-4 py-3 text-center text-sm font-medium text-white transition-all hover:scale-[1.02]"
                >
                  Back to Register
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Try Again
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
