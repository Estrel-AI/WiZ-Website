"use client";

import PolicyModalTrigger from "@/src/components/website/policy-modal-trigger";
import SocialAuthButtons from "@/src/components/website/social-auth-buttons";
import { RECAPTCHA_SITE_KEY } from "@/src/config/public-env";
import { DEVELOPER_LOGIN_URL } from "@/src/features/auth/website-auth";
import { isEmailAlreadyRegistered, requestSignupOtp, verifyOtp, submitSignup } from "@/src/services/website-auth-service";
import { Check, CircleAlert, Pencil, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

export type DeveloperFormData = {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
};

export type DeveloperRegistrationFormProps = {
  planId?: number;
  planName?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  showPlanBadge?: boolean;
  initialEmail?: string;
  onStepChange?: (step: RegisterStep) => void;
};

type RegisterStep = "email" | "otp" | "details" | "success";
type PasswordStrength = "weak" | "moderate" | "strong";

const initialSignupForm: DeveloperFormData = {
  first_name: "",
  last_name: "",
  username: "",
  password: "",
};

const OTP_RESEND_COOLDOWN_SECONDS = 300;
const STRONG_PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

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

  if (!password) return "weak";
  if (STRONG_PASSWORD_REGEX.test(password)) return "strong";
  if (password.length >= 8 && passedChecks >= 3) return "moderate";
  return "weak";
}

export default function DeveloperRegistrationForm({
  planId = 1,
  planName = "Starter Plan",
  onSuccess,
  onClose,
  showPlanBadge = true,
  initialEmail = "",
  onStepChange,
}: DeveloperRegistrationFormProps) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<RegisterStep>("email");
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState<DeveloperFormData>(initialSignupForm);
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
    if (typeof window !== "undefined" && window.grecaptcha && typeof window.grecaptcha.render === "function") {
      setRecaptchaLoaded(true);
    }
  };

  useEffect(() => {
    if (!searchParams) return;
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
    onStepChange?.(step);
  }, [step, onStepChange]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
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

      try {
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
      } catch {
        // Handle widget re-render
      }
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
      if (pollTimer !== null) window.clearInterval(pollTimer);
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
        if (pollTimer !== null) window.clearInterval(pollTimer);
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
      if (pollTimer !== null) window.clearInterval(pollTimer);
    };
  }, []);

  const sendOtp = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (await isEmailAlreadyRegistered(email.trim())) {
      setErrorMessage("This email is already registered. Please log in to your existing account instead.");
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
      const errStr = getErrorMessage(error);
      window.onOtpFailed?.("OTP_SEND_FAILED", errStr);
      setErrorMessage(errStr);
    } finally {
      setLoading(null);
    }
  };

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendOtp();
  };

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!otp.trim()) {
      setErrorMessage("Please enter the OTP.");
      return;
    }

    setLoading("otp");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await verifyOtp({ email: email.trim(), otp: otp.trim() });
      setFormData((previous) => ({
        ...previous,
        username: previous.username || email.trim(),
      }));
      setIsUsernameEditable(false);
      setStep("details");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(null);
    }
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isOAuthSignup = searchParams?.get("oauth_verified") === "1" && Boolean(searchParams?.get("oauth_provider"));
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

    try {
      const signupResponse = await submitSignup({
        userType: "developer",
        user_type: "developer",
        plan_id: planId,
        plan_name: planName,
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: email.trim(),
        password: formData.password,
        plan: "starter",
        recaptcha_token: recaptchaToken,
        otp: otp.trim() ? otp.trim() : undefined,
        login_type: isOAuthSignup ? "social" : undefined,
      });

      const method = isOAuthSignup ? "social" : "email";
      const teamId =
        (signupResponse as { team_id?: string | number })?.team_id ??
        ((signupResponse as { data?: { team_id?: string | number } })?.data?.team_id ?? null);

      if (teamId !== null) {
        window.trackEvent?.("signup_complete", {
          method,
          account_type: "developer",
          plan_id: planId,
          plan_name: planName,
          team_id: String(teamId),
        });
      } else {
        window.onSignupComplete?.(method, "developer");
      }

      setStep("success");
      setSuccessMessage("Your developer account has been created successfully.");
      setFormData(initialSignupForm);
      setIsUsernameEditable(false);
      setHasAcceptedPolicies(false);
      setRecaptchaToken("");
      setErrorMessage("");

      if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetIdRef.current);
      }

      onSuccess?.();
    } catch (error) {
      const errStr = getErrorMessage(error);
      window.onOtpFailed?.("OTP_VERIFY_OR_SIGNUP_FAILED", errStr);
      setErrorMessage(errStr);
      setRecaptchaToken("");
      if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetIdRef.current);
      }
    } finally {
      setLoading(null);
    }
  };

  const inputClassName =
    "w-full bg-[#FFFFFF05] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-gray-400 text-base sm:text-sm focus:outline-none focus:border-[#ab386a] transition-colors";
  const otpHintClassName =
    "w-full bg-[#FFFFFF05] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 text-center text-xl sm:text-2xl tracking-[0.35em] font-mono focus:outline-none focus:border-[#ab386a] transition-colors";
  const usernameInputClassName = isUsernameEditable
    ? `${inputClassName} pr-12 border-[#D87AAA]/70 bg-[#FFFFFF08] shadow-[0_0_0_1px_rgba(216,122,170,0.15)]`
    : `${inputClassName} pr-12 border-white/5 bg-white/[0.03] text-gray-300 cursor-default`;
  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthConfig = {
    weak: { label: "Weak", textClassName: "text-red-300" },
    moderate: { label: "Moderate", textClassName: "text-orange-300" },
    strong: { label: "Strong", textClassName: "text-emerald-300" },
  } as const;
  const activePasswordStrength = passwordStrengthConfig[passwordStrength];
  const passwordStrengthText = formData.password
    ? `Your password is ${activePasswordStrength.label.toLowerCase()}.`
    : "Enter a password.";
  const resendLabel =
    resendCountdown > 0
      ? `Resend in ${String(Math.floor(resendCountdown / 60)).padStart(2, "0")}:${String(
          resendCountdown % 60,
        ).padStart(2, "0")}`
      : "Resend";

  return (
    <div className="w-full">
      {showPlanBadge && (
        <div className="mb-4 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#912059]/30 border border-[#D87AAA]/40 text-[#D87AAA] text-xs sm:text-sm font-semibold tracking-wide">
            Selected Plan: {planName}
          </span>
        </div>
      )}

      {errorMessage ? (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      {successMessage && step !== "success" ? (
        <div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {successMessage}
        </div>
      ) : null}

      {step === "email" ? (
        <form className="space-y-4 sm:space-y-5 py-2" onSubmit={handleEmailSubmit}>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
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
            className="w-full bg-gradient-to-r from-[#912059] to-[#D87AAA] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] text-white py-3 rounded-xl text-sm sm:text-base font-semibold transition-all shadow-lg mt-2"
          >
            {loading === "otp" ? "Sending OTP..." : "Send OTP"}
          </button>

          <SocialAuthButtons intent="signup" variant="icons" />

          <p className="text-center text-sm text-gray-400 pt-1">
            Already have an account?{" "}
            <a href={DEVELOPER_LOGIN_URL} className="text-[#D87AAA] hover:underline font-medium">
              Log in
            </a>
          </p>

          <p className="text-center text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <PolicyModalTrigger policy="terms" className="text-gray-300 underline hover:text-white">
              Terms and Conditions
            </PolicyModalTrigger>{" "}
            and{" "}
            <PolicyModalTrigger policy="privacy" className="text-gray-300 underline hover:text-white">
              Privacy Policy
            </PolicyModalTrigger>{" "}
            <span className="text-white">*</span>
          </p>
        </form>
      ) : null}

      {step === "otp" ? (
        <form className="space-y-4 sm:space-y-5 py-2" onSubmit={handleOtpSubmit}>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
              Verify your Email ID <span className="text-white">*</span>
            </label>
            <input type="email" value={email} readOnly className={`${inputClassName} opacity-70`} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs sm:text-sm font-medium text-gray-300">
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
            className="w-full bg-gradient-to-r from-[#912059] to-[#D87AAA] hover:scale-[1.02] text-white py-3 rounded-xl text-sm sm:text-base font-semibold transition-all shadow-lg mt-2"
          >
            Verify OTP
          </button>
        </form>
      ) : null}

      {step === "details" ? (
        <form className="space-y-4 py-2" onSubmit={handleSignup}>
          <div className="flex items-center gap-3 my-1">
            <span className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wide uppercase">
              Personal Information
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
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
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
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

            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                Username <span className="text-white">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(event) => setFormData((prev) => ({ ...prev, username: event.target.value }))}
                  placeholder="john_doe"
                  readOnly={!isUsernameEditable}
                  aria-readonly={!isUsernameEditable}
                  className={usernameInputClassName}
                />
                <button
                  type="button"
                  onClick={() => setIsUsernameEditable((previous) => !previous)}
                  className={`absolute inset-y-1.5 right-1.5 flex w-9 items-center justify-center rounded-lg border transition-all ${
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

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-300">
                Verified Email ID <span className="text-white">*</span>
              </label>
              <input type="email" value={email} readOnly className={`${inputClassName} opacity-80`} />
            </div>

            <div className="md:col-span-2">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-300">
                  Password <span className="text-white">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPasswordHint((previous) => !previous)}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Show password requirements"
                  >
                    <CircleAlert className="h-3.5 w-3.5" />
                  </button>
                  {showPasswordHint ? (
                    <div className="absolute right-0 top-8 z-20 w-72 rounded-xl border border-white/10 bg-[#24141f] p-3.5 text-xs text-gray-300 shadow-2xl">
                      <p className="mb-1.5 font-medium text-gray-100">Enter a strong password with:</p>
                      <p>At least 8 characters</p>
                      <p>Uppercase & lowercase letters</p>
                      <p>At least one digit & special character</p>
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
              <p className={`mt-1.5 text-xs ${activePasswordStrength.textClassName}`}>{passwordStrengthText}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
              Verify you are human <span className="text-white">*</span>
            </label>
            <div className="flex min-h-[72px] w-full items-center justify-start overflow-hidden sm:justify-center md:justify-start">
              <div
                ref={recaptchaContainerRef}
                className="inline-flex max-w-full origin-left scale-[0.92] sm:scale-100 rounded-md overflow-hidden"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-gray-300">
            <input
              type="checkbox"
              checked={hasAcceptedPolicies}
              onChange={(event) => setHasAcceptedPolicies(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent accent-[#D87AAA]"
            />
            <span>
              I agree to the{" "}
              <PolicyModalTrigger policy="terms" className="text-gray-200 underline transition-colors hover:text-white">
                Terms and Conditions
              </PolicyModalTrigger>{" "}
              and{" "}
              <PolicyModalTrigger policy="privacy" className="text-gray-200 underline transition-colors hover:text-white">
                Privacy Policy
              </PolicyModalTrigger>{" "}
              <span className="text-white">*</span>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading === "signup"}
            className="w-full bg-gradient-to-r from-[#912059] to-[#D87AAA] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] text-white py-3 rounded-xl text-sm sm:text-base font-semibold transition-all shadow-lg mt-2"
          >
            {loading === "signup" ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      ) : null}

      {step === "success" ? (
        <div className="text-center py-6 space-y-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-white">Account Created!</h3>
          <p className="text-sm text-emerald-200">{successMessage}</p>
          <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={DEVELOPER_LOGIN_URL}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#912059] to-[#D87AAA] text-white font-semibold text-sm hover:opacity-90 transition-all text-center"
            >
              Go to Dashboard
            </a>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white font-medium text-sm transition-all"
              >
                Close
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
