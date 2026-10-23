"use client";

import PolicyModalTrigger from "@/src/components/website/policy-modal-trigger";
import SocialAuthButtons from "@/src/components/website/social-auth-buttons";
import { RECAPTCHA_SITE_KEY } from "@/src/config/public-env";
import { BUSINESS_LOGIN_URL } from "@/src/features/auth/website-auth";
import { generateBusinessOtp, verifyBusinessOtp, submitBusinessSignup } from "@/src/services/auth.service";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

export type BusinessFormData = {
  first_name: string;
  last_name: string;
  official_email: string;
  contact_number: string;
  organisation_name: string;
  preferred_system_username: string;
  organisation_address: string;
  tax_id: string;
  password: string;
  confirm_password: string;
};

export type BusinessRegistrationFormProps = {
  planId?: number;
  planName?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  showPlanBadge?: boolean;
  initialEmail?: string;
  onStepChange?: (step: RegisterStep) => void;
};

type RegisterStep = "email" | "otp" | "details" | "success";

const initialBusinessForm: BusinessFormData = {
  first_name: "",
  last_name: "",
  official_email: "",
  contact_number: "",
  organisation_name: "",
  preferred_system_username: "",
  organisation_address: "",
  tax_id: "",
  password: "",
  confirm_password: "",
};

const OTP_RESEND_COOLDOWN_SECONDS = 60;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s().-]{6,}$/;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

function mapApiErrorField(message: string): string | null {
  const lower = message.toLowerCase();
  if (/otp|verification code/.test(lower)) return "otp";
  if (/email/.test(lower)) return "official_email";
  if (/username/.test(lower)) return "preferred_system_username";
  if (/password/.test(lower)) return "password";
  if (/recaptcha|captcha|human/.test(lower)) return "captcha";
  if (/tax/.test(lower)) return "tax_id";
  if (/phone|contact/.test(lower)) return "contact_number";
  if (/org/.test(lower)) return "organisation_name";
  if (/first name/.test(lower)) return "first_name";
  if (/last name/.test(lower)) return "last_name";
  return null;
}

export default function BusinessRegistrationForm({
  planId = 2,
  planName = "Business Plan",
  onSuccess,
  onClose,
  showPlanBadge = true,
  initialEmail = "",
  onStepChange,
}: BusinessRegistrationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<RegisterStep>("email");
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState<BusinessFormData>({
    ...initialBusinessForm,
    official_email: initialEmail,
  });
  const [hasAcceptedPolicies, setHasAcceptedPolicies] = useState(false);
  const [loading, setLoading] = useState<"otp" | "signup" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
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
        official_email: oauthEmail,
        first_name: oauthFirstName ?? previous.first_name,
        last_name: oauthLastName ?? previous.last_name,
        preferred_system_username: oauthUsername ?? oauthEmail,
      }));
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
            clearFieldError("captcha");
          },
          "expired-callback": () => {
            setRecaptchaToken("");
          },
          "error-callback": () => {
            setRecaptchaToken("");
            setFieldErrors((previous) => ({ ...previous, captcha: "reCAPTCHA could not be verified. Please try again." }));
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
    setErrorMessage("");
    setFieldErrors({});

    if (!email.trim()) {
      setFieldErrors({ email: "Please enter your official email address." });
      return;
    }

    if (!emailPattern.test(email.trim())) {
      setFieldErrors({ email: "Please enter a valid official email address." });
      return;
    }

    setLoading("otp");
    setSuccessMessage("");

    try {
      const response = await generateBusinessOtp({ email: email.trim() });
      setStep("otp");
      setResendCountdown(OTP_RESEND_COOLDOWN_SECONDS);
      setSuccessMessage(response?.message || "OTP sent successfully. Please check your email.");
    } catch (error) {
      const errStr = getErrorMessage(error);
      if (mapApiErrorField(errStr) === "official_email") {
        setFieldErrors({ email: errStr });
      } else {
        setErrorMessage(errStr);
      }
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
    setErrorMessage("");
    setFieldErrors({});

    if (!otp.trim()) {
      setFieldErrors({ otp: "Please enter the OTP." });
      return;
    }

    setLoading("otp");
    setSuccessMessage("");

    try {
      await verifyBusinessOtp({ email: email.trim(), otp: otp.trim() });
      setFormData((previous) => ({
        ...previous,
        official_email: email.trim(),
        preferred_system_username: email.trim(),
      }));
      setStep("details");
    } catch (error) {
      const errStr = getErrorMessage(error);
      setFieldErrors({
        otp: errStr.includes("invalid") || errStr.includes("Invalid") ? "Invalid OTP. Please try again." : errStr,
      });
    } finally {
      setLoading(null);
    }
  };

  const clearFieldError = (field: string) => {
    setFieldErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const updateField = (fieldKey: keyof BusinessFormData, value: string) => {
    setFormData((previous) => ({ ...previous, [fieldKey]: value }));
    setErrorMessage("");
    clearFieldError(fieldKey);
  };

  const handleBusinessSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value.trim()]),
    ) as BusinessFormData;
    const officialEmail = (email || trimmed.official_email).trim();

    // Validation Rules
    const errors: Record<string, string> = {};
    if (!trimmed.first_name) {
      errors.first_name = "First Name is required.";
    }
    if (!trimmed.last_name) {
      errors.last_name = "Last Name is required.";
    }
    if (!officialEmail) {
      errors.official_email = "Official Email ID is required.";
    } else if (!emailPattern.test(officialEmail)) {
      errors.official_email = "Please enter a valid official email address.";
    }
    if (!trimmed.contact_number) {
      errors.contact_number = "Contact Number is required.";
    } else if (!phonePattern.test(trimmed.contact_number)) {
      errors.contact_number = "Please enter a valid contact number.";
    }
    if (!trimmed.organisation_name) {
      errors.organisation_name = "Organization Name is required.";
    }
    if (!trimmed.organisation_address) {
      errors.organisation_address = "Organization Address is required.";
    }
    if (!trimmed.password) {
      errors.password = "Password is required.";
    }
    if (!trimmed.confirm_password) {
      errors.confirm_password = "Confirm Password is required.";
    } else if (trimmed.password !== trimmed.confirm_password) {
      errors.confirm_password = "Password and Confirm Password do not match.";
    }
    if (!otp.trim()) {
      errors.otp = "OTP is required before signup.";
    }
    if (!recaptchaToken) {
      errors.captcha = "Please complete the reCAPTCHA verification.";
    }
    if (!hasAcceptedPolicies) {
      errors.policies = "Please accept the Terms and Conditions and Privacy Policy.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage(
        errors.otp && step !== "otp" ? errors.otp : "",
      );
      return;
    }

    setLoading("signup");
    setErrorMessage("");
    setFieldErrors({});
    setSuccessMessage("");

    try {
      const response = await submitBusinessSignup({
        username: officialEmail,
        password: trimmed.password,
        email: officialEmail,
        first_name: trimmed.first_name,
        last_name: trimmed.last_name,
        org_name: trimmed.organisation_name,
        org_address: trimmed.organisation_address,
        tax_id: trimmed.tax_id,
        contact_number: trimmed.contact_number,
        plan: "free_trial",
        otp: otp.trim(),
      });

      setStep("success");
      const successMsg = response?.message || "Your business account has been created successfully.";
      setSuccessMessage(successMsg);
      setFormData(initialBusinessForm);
      setHasAcceptedPolicies(false);
      setRecaptchaToken("");
      setErrorMessage("");
      setFieldErrors({});

      if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetIdRef.current);
      }

      onSuccess?.();

      setTimeout(() => {
        window.location.href = BUSINESS_LOGIN_URL;
      }, 2000);
    } catch (error) {
      const errStr = getErrorMessage(error);
      const field = mapApiErrorField(errStr);
      if (field === "otp" && step !== "otp") {
        setErrorMessage(errStr);
      } else if (field) {
        setFieldErrors({ [field]: errStr });
      } else {
        setErrorMessage(errStr);
      }
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
  const resendLabel =
    resendCountdown > 0
      ? `Resend in ${String(Math.floor(resendCountdown / 60)).padStart(2, "0")}:${String(
          resendCountdown % 60,
        ).padStart(2, "0")}`
      : "Resend";

  const renderField = (
    name: keyof BusinessFormData,
    label: string,
    required = true,
  ) => {
    const isPasswordField = name === "password" || name === "confirm_password";
    const isPasswordVisible = name === "password" ? showPassword : showConfirmPassword;
    const togglePasswordVisibility = () => {
      if (name === "password") {
        setShowPassword((previous) => !previous);
      } else {
        setShowConfirmPassword((previous) => !previous);
      }
    };
    const isReadOnlyUsername = name === "preferred_system_username";
    const isReadOnlyEmail = name === "official_email" && Boolean(email);

    return (
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
          {label} {required ? <span className="text-white">*</span> : null}
        </label>
        <div className="relative">
          <input
            type={isPasswordField ? (isPasswordVisible ? "text" : "password") : name === "official_email" ? "email" : "text"}
            name={name}
            value={name === "official_email" ? email || formData[name] : formData[name]}
            onChange={(event) => updateField(name, event.target.value)}
            placeholder={label}
            readOnly={isReadOnlyUsername || isReadOnlyEmail}
            aria-readonly={isReadOnlyUsername || isReadOnlyEmail}
            className={`${inputClassName} ${isPasswordField || isReadOnlyUsername ? "pr-12" : ""} ${isReadOnlyUsername || isReadOnlyEmail ? "opacity-80 cursor-not-allowed" : ""}`}
          />
          {isPasswordField ? (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-400 transition-colors hover:text-gray-200"
              aria-label={isPasswordVisible ? `Hide ${label}` : `Show ${label}`}
              title={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
        {fieldErrors[name] ? (
          <p className="mt-1.5 text-xs text-red-300">{fieldErrors[name]}</p>
        ) : null}
      </div>
    );
  };

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
              Verify your Official Email ID <span className="text-white">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFieldError("email");
              }}
              placeholder="Verify your Official Email ID"
              className={inputClassName}
            />
            {fieldErrors.email ? (
              <p className="mt-1.5 text-xs text-red-300">{fieldErrors.email}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading === "otp" || !email.trim()}
            className="w-full bg-gradient-to-r from-[#912059] to-[#D87AAA] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] text-white py-3 rounded-xl text-sm sm:text-base font-semibold transition-all shadow-lg mt-2"
          >
            {loading === "otp" ? "Sending OTP..." : "Send OTP"}
          </button>

          <SocialAuthButtons intent="signup" variant="icons" accountType="business" planId={planId} planName={planName} />

          <p className="text-center text-sm text-gray-400 pt-1">
            Already have an account?{" "}
            <a href={BUSINESS_LOGIN_URL} className="text-[#D87AAA] hover:underline font-medium">
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
              Verify your Official Email ID <span className="text-white">*</span>
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
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, ""));
                clearFieldError("otp");
              }}
              placeholder="Verification Code"
              className={otpHintClassName}
            />
            {fieldErrors.otp ? (
              <p className="mt-1.5 text-xs text-red-300">{fieldErrors.otp}</p>
            ) : null}
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
        <form className="space-y-4 py-2" onSubmit={handleBusinessSignup}>
          {/* Personal Information */}
          <div className="flex items-center gap-3 my-1">
            <span className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wide uppercase">
              Personal Information
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {renderField("first_name", "First Name")}
            {renderField("last_name", "Last Name")}
            <div className="md:col-span-2">
              {renderField("preferred_system_username", "Preferred System Username")}
            </div>
          </div>

          {/* Contact & Organization Information */}
          <div className="flex items-center gap-3 my-1 pt-1">
            <span className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wide uppercase">
              Contact & Organization Information
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {renderField("official_email", "Official Email ID")}
            {renderField("contact_number", "Contact Number")}
            {renderField("organisation_name", "Organization Name")}
            <div className="md:col-span-2">
              {renderField("organisation_address", "Organization Address")}
            </div>
          </div>

          {/* Security & Identification */}
          <div className="flex items-center gap-3 my-1 pt-1">
            <span className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wide uppercase">
              Security & Identification
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              {renderField("tax_id", "Tax ID", false)}
            </div>
            {renderField("password", "Password")}
            {renderField("confirm_password", "Confirm Password")}
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
            {fieldErrors.captcha ? (
              <p className="mt-1.5 text-xs text-red-300">{fieldErrors.captcha}</p>
            ) : null}
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-gray-300">
            <input
              type="checkbox"
              checked={hasAcceptedPolicies}
              onChange={(event) => {
                setHasAcceptedPolicies(event.target.checked);
                clearFieldError("policies");
              }}
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
          {fieldErrors.policies ? (
            <p className="-mt-2 text-xs text-red-300">{fieldErrors.policies}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading === "signup"}
            className="w-full bg-gradient-to-r from-[#912059] to-[#D87AAA] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] text-white py-3 rounded-xl text-sm sm:text-base font-semibold transition-all shadow-lg mt-2"
          >
            {loading === "signup" ? "Creating Account..." : "Create Business Account"}
          </button>
        </form>
      ) : null}

      {step === "success" ? (
        <div className="text-center py-6 space-y-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-white">Business Account Created!</h3>
          <p className="text-sm text-emerald-200">{successMessage}</p>
          <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={BUSINESS_LOGIN_URL}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#912059] to-[#D87AAA] text-white font-semibold text-sm hover:opacity-90 transition-all text-center"
            >
              Go to Login Page
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
