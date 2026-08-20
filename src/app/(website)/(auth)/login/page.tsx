"use client";

import PolicyModalTrigger from "@/src/components/website/policy-modal-trigger";
import { RECAPTCHA_SITE_KEY } from "@/src/config/public-env";
import { HUB_LOGIN_URL, persistWebsiteLogin } from "@/src/features/auth/website-auth";
import { requestPasswordReset, submitSignin } from "@/src/services/website-auth-service";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type LoginView = "login" | "reset" | "success";

type LoginForm = {
  username: string;
  password: string;
};

declare global {
  interface Window {
    grecaptcha?: {
      ready?: (callback: () => void) => void;
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export default function LoginPage() {
  const [view, setView] = useState<LoginView>("login");
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: "", password: "" });
  const [resetEmail, setResetEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingResetLink, setIsSendingResetLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const recaptchaWidgetIdRef = useRef<number | null>(null);

  const inputClassName =
    "w-full bg-[#FFFFFF05] border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-3 text-white placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#ab386a] transition-colors";

  const resetRecaptchaWidget = () => {
    setRecaptchaToken("");

    if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
      window.grecaptcha.reset(recaptchaWidgetIdRef.current);
    }
  };

  useEffect(() => {
    if (view !== "login") {
      recaptchaWidgetIdRef.current = null;
      setRecaptchaToken("");
    }
  }, [view]);

  useEffect(() => {
    if (
      view !== "login" ||
      !recaptchaLoaded ||
      !recaptchaContainerRef.current ||
      recaptchaWidgetIdRef.current !== null
    ) {
      return;
    }

    const renderRecaptcha = () => {
      if (!window.grecaptcha || !recaptchaContainerRef.current) {
        return;
      }

      recaptchaWidgetIdRef.current = window.grecaptcha.render(recaptchaContainerRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (token: string) => {
          setRecaptchaToken(token);
          setErrorMessage("");
        },
        "expired-callback": () => {
          setRecaptchaToken("");
        },
        "error-callback": () => {
          setRecaptchaToken("");
          setErrorMessage("reCAPTCHA could not be verified. Please try again.");
        },
      });
    };

    if (typeof window.grecaptcha?.ready === "function") {
      window.grecaptcha.ready(renderRecaptcha);
      return;
    }

    renderRecaptcha();
  }, [recaptchaLoaded, view]);

  useEffect(() => {
    const scriptId = "google-recaptcha-script";
    let pollTimer: number | null = null;

    const markRecaptchaAsLoaded = () => {
      if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
        setRecaptchaLoaded(true);
      }
    };

    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    const startPolling = () => {
      if (pollTimer !== null) {
        window.clearInterval(pollTimer);
      }

      pollTimer = window.setInterval(() => {
        if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
          setRecaptchaLoaded(true);
          if (pollTimer !== null) {
            window.clearInterval(pollTimer);
            pollTimer = null;
          }
        }
      }, 300);
    };

    if (existingScript) {
      existingScript.addEventListener("load", markRecaptchaAsLoaded);
      markRecaptchaAsLoaded();
      startPolling();

      return () => {
        existingScript.removeEventListener("load", markRecaptchaAsLoaded);
        if (pollTimer !== null) {
          window.clearInterval(pollTimer);
        }
      };
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", markRecaptchaAsLoaded);
    document.body.appendChild(script);
    startPolling();

    return () => {
      script.removeEventListener("load", markRecaptchaAsLoaded);
      if (pollTimer !== null) {
        window.clearInterval(pollTimer);
      }
    };
  }, []);

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setErrorMessage("Please fill in username and password.");
      return;
    }

    if (!recaptchaToken) {
      setErrorMessage("Please complete the reCAPTCHA.");
      return;
    }

    setIsLoggingIn(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const responseData = await submitSignin({
        username: loginForm.username.trim(),
        password: loginForm.password,
        recaptcha_token: recaptchaToken,
      });

      if (!responseData?.success) {
        throw new Error(responseData?.message || "Unable to log in right now.");
      }

      persistWebsiteLogin(responseData as Record<string, unknown>);
      setView("success");
      setSuccessMessage("Login successful. You can continue to the hub now.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoggingIn(false);
      resetRecaptchaWidget();
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!resetEmail.trim()) {
      setErrorMessage("Please enter your email address.");
      setSuccessMessage("");
      return;
    }

    setIsSendingResetLink(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const responseData = await requestPasswordReset({ email: resetEmail.trim() });

      if (!responseData?.success) {
        throw new Error(responseData?.message || "Unable to send the password reset link.");
      }

      setSuccessMessage(
        responseData?.message || "Password reset link sent to your email address.",
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSendingResetLink(false);
    }
  };

  return (
    <main>
      <section className="bg-[#110a10] text-white py-10 md:py-20 px-4 min-h-screen flex items-center justify-center font-sans relative overflow-hidden">
        <div className="md:block hidden absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-1/3 h-[50%] md:h-[88%] bg-quaternary/20 rounded-[50%] blur-[60px] pointer-events-none z-0" />
        <div className="md:block hidden absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-1/3 h-[50%] md:h-[88%] bg-quaternary/20 rounded-[50%] blur-[60px] pointer-events-none z-0" />

        <div className="w-full max-w-xl bg-gradient-to-b to-primary from-[#251321] border border-white/20 rounded-2xl p-4 md:p-6 lg:p-10 shadow-2xl relative z-10">
          <h2 className="text-xl md:text-2xl mb-2">Login</h2>
          <p className="text-sm text-gray-300 mb-6">
            {view === "login" && "Sign in with your username and password."}
            {view === "reset" && "Enter your email address and we will send you a password reset link."}
            {view === "success" && "Your request was completed successfully."}
          </p>

          {errorMessage ? (
            <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {successMessage}
            </div>
          ) : null}

          {view === "success" ? (
            <div className="space-y-4">
              <Link
                href={HUB_LOGIN_URL}
                target="_blank"
                className="block w-full rounded-xl bg-gradient-to-r from-[#912059] to-[#D87AAA] px-4 py-3 text-center text-sm font-medium text-white transition-all hover:scale-[1.02]"
              >
                Continue to Hub
              </Link>
              <button
                type="button"
                onClick={() => {
                  setView("login");
                  setErrorMessage("");
                }}
                className="block w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Back to Login
              </button>
            </div>
          ) : null}

          {view === "reset" ? (
            <form className="space-y-4 md:space-y-5 mb-3" onSubmit={handleResetPassword}>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Email Address <span className="text-white">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  placeholder="john@wiiz.ai"
                  className={inputClassName}
                />
              </div>

              <button
                type="submit"
                disabled={isSendingResetLink}
                className="w-full bg-gradient-to-r from-[#912059] to-[#D87AAA] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 text-white py-2.5 md:py-3.5 rounded-xl text-sm font-medium transition-all shadow-lg mt-2"
              >
                {isSendingResetLink ? "Sending Reset Link..." : "Send Reset Link"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setView("login");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Back to Login
              </button>
            </form>
          ) : null}

          {view === "login" ? (
            <form className="space-y-4 md:space-y-5 mb-3" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Username <span className="text-white">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={loginForm.username}
                  onChange={(event) =>
                    setLoginForm((previous) => ({ ...previous, username: event.target.value }))
                  }
                  placeholder="Enter your username"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Password <span className="text-white">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((previous) => ({ ...previous, password: event.target.value }))
                  }
                  placeholder="Enter your password"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Verify you are human <span className="text-white">*</span>
                </label>
                <div className="w-full overflow-hidden">
                  <div
                    ref={recaptchaContainerRef}
                    className="min-h-[72px] sm:min-h-[78px] inline-flex origin-left scale-[0.92] sm:scale-100 rounded-md overflow-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-[#912059] to-[#D87AAA] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 text-white py-2.5 md:py-3.5 rounded-xl text-sm font-medium transition-all shadow-lg mt-2"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : null}

          <div className="text-center space-y-4">
            {view === "login" ? (
              <>
                <p className="text-xs text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-white hover:underline transition-all">
                    Create one
                  </Link>
                </p>
                <p className="text-xs text-gray-400">
                  <button
                    type="button"
                    onClick={() => {
                      setView("reset");
                      setErrorMessage("");
                      setSuccessMessage("");
                      resetRecaptchaWidget();
                    }}
                    className="text-white hover:underline transition-all"
                  >
                    Forgot password?
                  </button>
                </p>
              </>
            ) : null}

            <p className="text-[12px] text-gray-400 px-4">
              By continuing, you agree to our{" "}
              <PolicyModalTrigger
                policy="terms"
                className="text-gray-300 hover:text-white underline"
              >
                Terms and Conditions
              </PolicyModalTrigger>{" "}
              and{" "}
              <PolicyModalTrigger
                policy="privacy"
                className="text-gray-300 hover:text-white underline"
              >
                Privacy Policy
              </PolicyModalTrigger>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
