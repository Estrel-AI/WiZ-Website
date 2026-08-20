"use client";

import PolicyModalTrigger from "@/src/components/website/policy-modal-trigger";
import SocialAuthButtons from "@/src/components/website/social-auth-buttons";
import { HUB_LOGIN_URL } from "@/src/features/auth/website-auth";
import { RECAPTCHA_SITE_KEY } from "@/src/config/public-env";
import { requestSignupOtp, submitSignup } from "@/src/services/website-auth-service";
import { Check, CircleAlert, Pencil } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

type RegisterStep = "email" | "otp" | "details" | "success";

type SignupForm = {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
};

type PasswordStrength = "weak" | "moderate" | "strong";

const initialSignupForm: SignupForm = {
  first_name: "",
  last_name: "",
  username: "",
  password: "",
};

const OTP_RESEND_COOLDOWN_SECONDS = 300;
const STRONG_PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
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
        }
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

function getPasswordChecks(password: string) {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
    specialCharacter: /[#?!@$%^&*-]/.test(password),
  };
}

function getPasswordStrength(password: string): PasswordStrength {
  const checks = getPasswordChecks(password);
  const passedChecks = Object.values(checks).filter(Boolean).length;

  if (!password) {
    return "weak";
  }

  if (STRONG_PASSWORD_REGEX.test(password)) {
    return "strong";
  }

  if (password.length >= 8 && passedChecks >= 3) {
    return "moderate";
  }

  return "weak";
}

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<RegisterStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState<SignupForm>(initialSignupForm);
  const [hasAcceptedPolicies, setHasAcceptedPolicies] = useState(false);
  const [loading, setLoading] = useState<"otp" | "signup" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const recaptchaWidgetIdRef = useRef<number | null>(null);

  const markRecaptchaAsLoaded = () => {
    if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
      setRecaptchaLoaded(true);
    }
  };

  useEffect(() => {
    const oauthError = searchParams.get("oauth_error");
    const oauthStep = searchParams.get("oauth_step");
    const oauthEmail = searchParams.get("oauth_email");
    const oauthFirstName = searchParams.get("oauth_first_name");
    const oauthLastName = searchParams.get("oauth_last_name");
    const oauthUsername = searchParams.get("oauth_username");
    const oauthVerified = searchParams.get("oauth_verified");

    if (oauthError) {
      setErrorMessage(oauthError);
      setSuccessMessage("");
      setStep("email");
      return;
    }

    if (oauthStep === "details" && oauthEmail && oauthVerified === "1") {
      setEmail(oauthEmail);
      setOtp("");
      setErrorMessage("");
      setSuccessMessage("Your email has been verified successfully. Complete the remaining details.");
      setFormData((previous) => ({
        ...previous,
        first_name: oauthFirstName ?? previous.first_name,
        last_name: oauthLastName ?? previous.last_name,
        username: oauthUsername ?? oauthEmail,
      }));
      setIsUsernameEditable(false);
      setStep("details");
    }
  }, [searchParams]);

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCountdown((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (step !== "details" || !recaptchaLoaded || !recaptchaContainerRef.current || recaptchaWidgetIdRef.current !== null) {
      return;
    }

    const renderRecaptcha = () => {
      if (!window.grecaptcha || typeof window.grecaptcha.render !== "function" || !recaptchaContainerRef.current) {
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
  }, [recaptchaLoaded, step]);

  useEffect(() => {
    const scriptId = "google-recaptcha-script";
    let pollTimer: number | null = null;

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

  const sendOtp = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setLoading("otp");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await requestSignupOtp({ email: email.trim() });
      window.onOtpSent?.();

      setStep("otp");
      setResendCountdown(OTP_RESEND_COOLDOWN_SECONDS);
      setSuccessMessage("OTP sent successfully. Please check your email.");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      window.onOtpFailed?.("OTP_SEND_FAILED", errorMessage);
      setErrorMessage(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  const handleOtpSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!otp.trim()) {
      setErrorMessage("Please enter the OTP.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setFormData((previous) => ({
      ...previous,
      username: previous.username || email.trim(),
    }));
    setIsUsernameEditable(false);
    setStep("details");
  };

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendOtp();
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isOAuthSignup = searchParams.get("oauth_verified") === "1" && Boolean(searchParams.get("oauth_provider"));
    if (!formData.first_name || !formData.last_name || !formData.username || !formData.password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!STRONG_PASSWORD_REGEX.test(formData.password)) {
      setErrorMessage(
        "Please enter a strong password with at least 8 characters, uppercase, lowercase, number, and special character.",
      );
      return;
    }

    if (!recaptchaToken) {
      setErrorMessage("Please complete the reCAPTCHA verification.");
      return;
    }

    if (!hasAcceptedPolicies) {
      setErrorMessage("Please accept the Terms and Conditions and Privacy Policy.");
      return;
    }

    setLoading("signup");
    setErrorMessage("");
    setSuccessMessage("");

    const data: Record<string, unknown> = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      username: formData.username,
      email: email.trim(),
      password: formData.password,
      plan: "free_trial",
      recaptcha_token: recaptchaToken,
    };

    data.otp = otp.trim();

    try {
      const signupResponse = await submitSignup({
        first_name: String(data.first_name),
        last_name: String(data.last_name),
        username: String(data.username),
        email: String(data.email),
        password: String(data.password),
        plan: String(data.plan),
        recaptcha_token: String(data.recaptcha_token),
        otp: typeof data.otp === "string" ? data.otp : undefined,
        login_type: isOAuthSignup ? "social" : undefined,
      });

      const method = isOAuthSignup ? "social" : "email";
      const teamId =
        (signupResponse as { team_id?: string | number })?.team_id ??
        ((signupResponse as { data?: { team_id?: string | number } })?.data?.team_id ?? null);

      if (teamId !== null) {
        window.trackEvent?.("signup_complete", {
          method,
          account_type: "free_trial",
          team_id: String(teamId),
        });
      } else {
        window.onSignupComplete?.(method, "free_trial");
      }

      setStep("success");
      setSuccessMessage("Your account has been created successfully.");
      setFormData(initialSignupForm);
      setIsUsernameEditable(false);
      setHasAcceptedPolicies(false);
      setRecaptchaToken("");
      setErrorMessage("");

      if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetIdRef.current);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      window.onOtpFailed?.("OTP_VERIFY_OR_SIGNUP_FAILED", errorMessage);
      setErrorMessage(errorMessage);
      setRecaptchaToken("");
      if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetIdRef.current);
      }
    } finally {
      setLoading(null);
    }
  };

  const inputClassName =
    "w-full bg-[#FFFFFF05] border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-3 text-white placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#ab386a] transition-colors";
  const otpHintClassName =
    "w-full bg-[#FFFFFF05] border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-3 text-white placeholder:text-gray-500 text-center text-xl md:text-2xl tracking-[0.35em] font-mono focus:outline-none focus:border-[#ab386a] transition-colors";
  const usernameInputClassName = isUsernameEditable
    ? `${inputClassName} pr-14 border-[#D87AAA]/70 bg-[#FFFFFF08] shadow-[0_0_0_1px_rgba(216,122,170,0.15)]`
    : `${inputClassName} pr-14 border-white/5 bg-white/[0.03] text-gray-300 cursor-default`;
  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthConfig = {
    weak: {
      label: "Weak",
      textClassName: "text-red-300",
      barClassName: "bg-red-400",
      helperClassName: "text-red-200",
    },
    moderate: {
      label: "Moderate",
      textClassName: "text-orange-300",
      barClassName: "bg-orange-400",
      helperClassName: "text-orange-200",
    },
    strong: {
      label: "Strong",
      textClassName: "text-emerald-300",
      barClassName: "bg-emerald-400",
      helperClassName: "text-emerald-200",
    },
  } as const;
  const activePasswordStrength = passwordStrengthConfig[passwordStrength];
  const passwordStrengthText = formData.password
    ? `Your password is ${activePasswordStrength.label.toLowerCase()}.`
    : "Enter a password.";
  const resendLabel =
    resendCountdown > 0
      ? `Resend in ${String(Math.floor(resendCountdown / 60)).padStart(2, "0")}:${String(
          resendCountdown % 60
        ).padStart(2, "0")}`
      : "Resend";

  return (
    <main>
      <section className="bg-[#110a10] text-white py-10 md:py-20 px-4 min-h-screen flex items-center justify-center font-sans relative overflow-hidden">
        <div className="md:block hidden absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-1/3 h-[50%] md:h-[88%] bg-quaternary/20 rounded-[50%] blur-[60px] pointer-events-none z-0" />
        <div className="md:block hidden absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-1/3 h-[50%] md:h-[88%] bg-quaternary/20 rounded-[50%] blur-[60px] pointer-events-none z-0" />

        <div className="w-full max-w-xl bg-gradient-to-b to-primary from-[#251321] border border-white/20 rounded-2xl p-4 md:p-6 lg:p-10 shadow-2xl relative z-10">
          <h2 className="text-xl md:text-2xl mb-2 font-bold text-center">Create an Account</h2>
          <p className="text-sm text-gray-300 mb-6 text-center">
            {step === "email" && "Enter your email address to receive an OTP."}
            {step === "otp" && "Enter the OTP sent to your email to continue."}
            {step === "details" && "Complete the remaining details to create your account."}
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

          {step === "email" ? (
            <form className="space-y-4 md:space-y-5" onSubmit={handleEmailSubmit}>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Verify your Email ID <span className="text-white">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your Email ID"
                  className={inputClassName}
                />
              </div>

              <button
                type="submit"
                disabled={loading === "otp" || !email.trim()}
                className="w-full bg-gradient-to-r from-[#912059] to-[#D87AAA] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 text-white py-2.5 md:py-3.5 rounded-xl text-sm font-medium transition-all shadow-lg mt-2"
              >
                {loading === "otp" ? "Sending OTP..." : "Send OTP"}
              </button>

              <SocialAuthButtons intent="signup" variant="icons" />
            </form>
          ) : null}

          {step === "otp" ? (
            <form className="space-y-4 md:space-y-5" onSubmit={handleOtpSubmit}>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Verify your Email ID <span className="text-white">*</span>
                </label>
                <input type="email" value={email} readOnly className={`${inputClassName} opacity-70`} />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-gray-300">
                    Verification Code <span className="text-white">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={loading === "otp" || resendCountdown > 0}
                    className="text-xs text-[#D87AAA] hover:underline disabled:no-underline disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading === "otp" ? "Sending..." : resendLabel}
                  </button>
                </div>
                <input
                  type="text"
                  name="otp"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit OTP"
                  className={otpHintClassName}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#912059] to-[#D87AAA] hover:scale-105 text-white py-2.5 md:py-3.5 rounded-xl text-sm font-medium transition-all shadow-lg mt-2"
              >
                Verify OTP
              </button>
            </form>
          ) : null}

          {step === "details" ? (
            <form className="space-y-4 md:space-y-5" onSubmit={handleSignup}>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
                <p>
                  Verified email: <span className="text-white">{email}</span>
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    First Name <span className="text-white">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, first_name: event.target.value }))}
                    placeholder="John"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Last Name <span className="text-white">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, last_name: event.target.value }))}
                    placeholder="Doe"
                    className={inputClassName}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Username <span className="text-white">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, username: event.target.value }))
                    }
                    placeholder="john_doe"
                    readOnly={!isUsernameEditable}
                    aria-readonly={!isUsernameEditable}
                    className={usernameInputClassName}
                  />
                  <button
                    type="button"
                    onClick={() => setIsUsernameEditable((previous) => !previous)}
                    className={`absolute inset-y-1.5 right-1.5 flex w-10 items-center justify-center rounded-lg border transition-all ${
                      isUsernameEditable
                        ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                        : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                    aria-label={isUsernameEditable ? "Finish editing username" : "Edit username"}
                    title={isUsernameEditable ? "Finish editing username" : "Edit username"}
                  >
                    {isUsernameEditable ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm text-gray-300">
                    Password <span className="text-white">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPasswordHint((previous) => !previous)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Show password requirements"
                    >
                      <CircleAlert className="h-4 w-4" />
                    </button>
                    {showPasswordHint ? (
                      <div className="absolute right-0 top-10 z-20 w-72 rounded-xl border border-white/10 bg-[#24141f] p-4 text-xs text-gray-300 shadow-2xl">
                        <p className="mb-2 font-medium text-gray-100">
                          Enter a strong password with:
                        </p>
                        <p>At least 8 characters</p>
                        <p>At least one uppercase English letter</p>
                        <p>At least one lowercase English letter</p>
                        <p>At least one digit</p>
                        <p>At least one special character: `# ? ! @ $ % ^ & * -`</p>
                      </div>
                    ) : null}
                  </div>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Enter your password"
                  className={inputClassName}
                />
                <p className={`mt-2 text-xs ${activePasswordStrength.textClassName}`}>
                  {passwordStrengthText}
                </p>
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

              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={hasAcceptedPolicies}
                  onChange={(event) => setHasAcceptedPolicies(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent accent-[#D87AAA]"
                />
                <span>
                  I agree to the{" "}
                  <PolicyModalTrigger
                    policy="terms"
                    className="text-gray-200 underline transition-colors hover:text-white"
                  >
                    Terms and Conditions
                  </PolicyModalTrigger>{" "}
                  and{" "}
                  <PolicyModalTrigger
                    policy="privacy"
                    className="text-gray-200 underline transition-colors hover:text-white"
                  >
                    Privacy Policy
                  </PolicyModalTrigger>{" "}
                  <span className="text-white">*</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading === "signup"}
                className="w-full bg-gradient-to-r from-[#912059] to-[#D87AAA] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 text-white py-2.5 md:py-3.5 rounded-xl text-sm font-medium transition-all shadow-lg mt-2"
              >
                {loading === "signup" ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          ) : null}

          <div className="text-center space-y-4 pt-4">
            <p className="text-xs text-gray-400">
              Already have an account?{" "}
                <Link
                  href={HUB_LOGIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:underline transition-all"
                >
                  Log in
                </Link>
            </p>
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
              </PolicyModalTrigger>{" "}
              *
            </p>
          </div>
        </div>

        {step === "success" ? (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#1b1119] p-6 md:p-8 shadow-2xl">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-2xl text-emerald-300">
                ✓
              </div>
              <h3 className="text-2xl font-semibold text-white">You are successfully registered</h3>
              <p className="mt-3 text-sm leading-6 text-gray-300">
                Your account is ready. You can explore plans or continue to the hub login page.
              </p>

              <div className="mt-6 space-y-3">
                {/* <Link
                  href="/pricing"
                  className="block w-full rounded-xl bg-gradient-to-r from-[#912059] to-[#D87AAA] px-4 py-3 text-center text-sm font-medium text-white transition-all hover:scale-[1.02]"
                >
                  Go to Pricing
                </Link> */}
                <Link
                  href={HUB_LOGIN_URL}
                  target="_blank"
                  className="block w-full rounded-xl bg-gradient-to-r from-[#912059] to-[#D87AAA] px-4 py-3 text-center text-sm font-medium text-white transition-all hover:scale-[1.02]"
                  // className="block w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Go to WiiZ for Developer
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
