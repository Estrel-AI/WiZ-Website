"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { RECAPTCHA_SITE_KEY, UTILITY_API_BASE_URL, buildPublicApiUrl } from "@/src/config/public-env";
import { partnerLogos } from "@/src/data/partners";
import {
  sanitizeEmailInput,
  sanitizeFormTextInput,
  sanitizePhoneInput,
  sanitizeWebsiteInput,
} from "@/src/lib/input-sanitization";

type PartnerForm = {
  first_name: string;
  last_name: string;
  email: string;
  mobile_phone: string;
  job_title: string;
  organization: string;
  company_website: string;
  primary_industry: string;
};

const initialFormData: PartnerForm = {
  first_name: "",
  last_name: "",
  email: "",
  mobile_phone: "",
  job_title: "",
  organization: "",
  company_website: "",
  primary_industry: "",
};

const findPartnerCards = [
  {
    name: "Alphadata",
    logoPath: "/images/partner-logos/alpha_data.jpg",
    logoPanelClassName: "bg-white",
    infoPanelClassName: "bg-primary hover:bg-gradient-to-br hover:from-[#240D1A] hover:via-[#240D1A] hover:to-[#9120595d]",
    titleClassName: "text-white",
  },
  {
    name: "AWS",
    logoPath: "/images/partner-logos/aws.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: "bg-primary hover:bg-gradient-to-br hover:from-[#240D1A] hover:via-[#240D1A] hover:to-[#9120595d]",
    titleClassName: "text-white",
  },
  {
    name: "Google Cloud",
    logoPath: "/images/partner-logos/google-cloud.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: "bg-primary hover:bg-gradient-to-br hover:from-[#240D1A] hover:via-[#240D1A] hover:to-[#9120595d]",
    titleClassName: "text-white",
  },
  {
    name: "Nangia",
    logoPath: "/images/partner-logos/nangia.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: "bg-primary hover:bg-gradient-to-br hover:from-[#240D1A] hover:via-[#240D1A] hover:to-[#9120595d]",
    titleClassName: "text-white",
  },
  {
    name: "NVIDIA",
    logoPath: "/images/partner-logos/nvidia.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: "bg-primary hover:bg-gradient-to-br hover:from-[#240D1A] hover:via-[#240D1A] hover:to-[#9120595d]",
    titleClassName: "text-white",
  },
  {
    name: "Raqmiyat",
    logoPath: "/images/partner-logos/raqmiyat.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: "bg-primary hover:bg-gradient-to-br hover:from-[#240D1A] hover:via-[#240D1A] hover:to-[#9120595d]",
    titleClassName: "text-white",
  },
  {
    name: "SISL",
    logoPath: "/images/partner-logos/sisl.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: "bg-primary hover:bg-gradient-to-br hover:from-[#240D1A] hover:via-[#240D1A] hover:to-[#9120595d]",
    titleClassName: "text-white",
  },
  {
    name: "Harrier",
    logoPath: "/images/partner-logos/Harrier.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: "bg-primary hover:bg-gradient-to-br hover:from-[#240D1A] hover:via-[#240D1A] hover:to-[#9120595d]",
    titleClassName: "text-white",
  },
];

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

  return "An error occurred. Please try again.";
}

export default function PartnerPage() {
  const [selectedProgram, setSelectedProgram] = useState("integration");
  const [formData, setFormData] = useState<PartnerForm>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const recaptchaWidgetIdRef = useRef<number | null>(null);
  const formSectionRef = useRef<HTMLElement | null>(null);
  const pathwaySectionRef = useRef<HTMLElement | null>(null);
  const findPartnerSectionRef = useRef<HTMLElement | null>(null);

  const markRecaptchaAsLoaded = () => {
    if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
      setRecaptchaLoaded(true);
    }
  };

  useEffect(() => {
    if (!recaptchaLoaded || !recaptchaContainerRef.current || recaptchaWidgetIdRef.current !== null) {
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
  }, [recaptchaLoaded]);

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

  const handleChange =
    (field: keyof PartnerForm) =>
      (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const rawValue = event.target.value;
        const nextValue =
          field === "email"
            ? sanitizeEmailInput(rawValue)
            : field === "mobile_phone"
              ? sanitizePhoneInput(rawValue)
              : field === "company_website"
                ? sanitizeWebsiteInput(rawValue)
                : field === "primary_industry"
                  ? rawValue
                  : sanitizeFormTextInput(rawValue, { trim: false });

        setFormData((previous) => ({
          ...previous,
          [field]: nextValue,
        }));
      };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const mobilePhone = sanitizePhoneInput(formData.mobile_phone);
    const firstName = sanitizeFormTextInput(formData.first_name);
    const lastName = sanitizeFormTextInput(formData.last_name);
    const email = sanitizeEmailInput(formData.email);
    const jobTitle = sanitizeFormTextInput(formData.job_title);
    const organization = sanitizeFormTextInput(formData.organization);
    const companyWebsite = sanitizeWebsiteInput(formData.company_website);
    const primaryIndustry = formData.primary_industry.trim();
    const phoneRegex = /^(?:\+91|91)?[6789]\d{9}$/;

    if (mobilePhone && !phoneRegex.test(mobilePhone)) {
      setErrorMessage("Please enter a valid mobile number.");
      setSuccessMessage("");
      return;
    }

    if (
      !firstName ||
      !lastName ||
      !email ||
      !jobTitle ||
      !organization ||
      !companyWebsite ||
      !primaryIndustry
    ) {
      setErrorMessage("Please fill in all required fields before submitting.");
      setSuccessMessage("");
      return;
    }

    if (!recaptchaToken) {
      setErrorMessage("Please complete the reCAPTCHA.");
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      job_title: jobTitle,
      mobile_phone: mobilePhone,
      organization,
      company_website: companyWebsite,
      primary_industry: primaryIndustry,
      program_system_integration: selectedProgram === "integration" ? "Yes" : "No",
      program_technology: selectedProgram === "technology" ? "Yes" : "No",
      program_education: selectedProgram === "education" ? "Yes" : "No",
      recaptcha_token: recaptchaToken,
    };

    try {
      const response = await fetch(buildPublicApiUrl(UTILITY_API_BASE_URL, "/partnerProgram"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message || `HTTP error! status: ${response.status}`);
      }

      setFormData(initialFormData);
      setSelectedProgram("integration");
      setRecaptchaToken("");
      setErrorMessage("");
      setSuccessMessage(payload?.message || "Your partner application has been sent successfully.");

      if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetIdRef.current);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setSuccessMessage("");
      setRecaptchaToken("");

      if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetIdRef.current);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToPathway = () => {
    pathwaySectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToFindPartner = () => {
    findPartnerSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main>
      {/* Banner */}
    
   <main className="bg-primary min-h-[60vh] flex items-center justify-center relative overflow-hidden px-4 py-10 lg:py-20 font-sans">
        <div className="md:block hidden absolute top-1/2  left-0 -translate-y-1/2 -translate-x-1/2 w-[160%] lg:w-[120%] xl:w-[90%] h-[100%] bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none  [-webkit-mask-image:radial-gradient(circle_at_center, quaternary_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>
        <div className="md:block hidden absolute top-1/2  right-0 -translate-y-1/2 translate-x-1/2 w-[160%] lg:w-[120%] xl:w-[90%] h-[100%]  bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none [-webkit-mask-image:radial-gradient(circle_at_center,quaternary_0_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>
        <div className="absolute -top-[250px] left-1/2 transform -translate-x-1/2 w-[600px] h-[500px] bg-gradient-about blur-[200px] rounded-full pointer-events-none"></div>
  <div className="container mx-auto py-8 md:py-12 lg:pb-24 px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-1/2 flex flex-col justify-center relative">
              {/* <span className="text-secondary font-medium text-xs uppercase tracking-widest mb-2 md:mb-4 block" data-aos="fade-right"
                data-aos-duration="1000">
                Partner Program
              </span> */}

              <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight md:leading-[1.1] font-semibold text-white mb-3 md:mb-6 tracking-tight text-center lg:text-left" data-aos="fade-right"
                data-aos-delay="100">
                Become a Partner
              </h2>

              <p className="text-gray-300 text-base md:text-lg md:leading-relaxed mb-4 md:mb-8 lg:max-w-lg text-center lg:text-left" data-aos="fade-right"
                data-aos-delay="150">
                Partner with us and empower your customers by supporting them
                in simplifying their AI journey and how they can leverage
                Agentic AI with Governance and Orchestration.
              </p>

   <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                type="button"
                onClick={scrollToPathway}
                className="inline-flex items-center md:mx-0 mx-auto md:justify-start justify-center gap-2 bg-gradient-to-r to-[#912059] from-[#D87AAA] transition-transform hover:scale-105 duration-300 shadow-xl text-white px-4 xl:px-8 md:px-3 py-2 md:py-3 rounded-full font-medium transition-colors w-fit"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                Explore and Apply
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 17L17 7M7 7h10v10"
                  />
                </svg>
              </button>
               <button
                type="button"
                onClick={scrollToFindPartner}
                className="inline-flex items-center md:mx-0 mx-auto md:justify-start justify-center gap-2 border border-secondary text-secondary hover:bg-secondary hover:text-primary transition-transform hover:scale-105 duration-300 shadow-xl text-white px-4 xl:px-8 md:px-3 py-2 md:py-3 rounded-full font-medium transition-colors w-fit"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                Find a Partner
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 17L17 7M7 7h10v10"
                  />
                </svg>
              </button>
            </div>
  </div>
            <div className="w-full lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[16/11]">
                <img
                  src="/images/partner-banner.jpg"
                  alt="Partnership meeting"
                  className="w-full h-full object-cover relative"
                />
              </div>
            </div>
          </div>
        </div>
       
      </main>

      {/* Pathway */}
      <section ref={pathwaySectionRef} className="bg-primary relative overflow-hidden py-8 md:py-12 lg:py-16 font-sans">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 ">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-white mb-2" data-aos="fade-up"
              data-aos-duration="800">
              Find Your Partnership Pathway
            </h2>
            <p className="text-gray-300  text-base md:text-lg" data-aos="fade-up"
              data-aos-delay="100">
              We offer distinct partnership models designed to align with your
              business goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className=" bg-gradient-to-br from-[#240D1A] via-[#240D1A] to-[#9120595d] backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-5 xl:p-8 flex flex-col h-full transition-transform hover:-translate-y-1 duration-300 shadow-lg">
              <div className="w-12 md:w-14 h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-3 md:mb-6 shrink-0 shadow-inner">
                <svg
                  className="w-6 md:w-7 h-6 md:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>

              <h3 className="text-xl md:text-2xl font-semibold text-secondary mb-1 md:mb-2">
                System Integration Partner
              </h3>
              <p className="text-gray-300 text-sm md:text-base mb-2 md:mb-4  leading-relaxed">
                For software reselling and professional services
                organization.
              </p>

              <ul className="space-y-1 lg:space-y-3 mb-4 md:mb-8 flex-grow  text-gray-300 text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                  <span>Build and deploy robust AI solutions for clients.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                  <span>
                    Accelerate project delivery and effectively mitigate risks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                  <span>
                    Receive valuable referrals and expanded co-selling
                    opportunities to grow your business.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0"></span>
                  <span>Access dedicated technical and sales support.</span>
                </li>
              </ul>

              <div className="mt-auto">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-block bg-gradient-to-r from-[#912059] to-[#D87AAA] transition-transform hover:scale-105 duration-300 shadow-xl text-white text-sm px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium transition-colors duration-300"
                >
                  Register Now
                </button>
              </div>
            </div>

            <div className=" bg-gradient-to-br from-[#240D1A] via-[#240D1A] to-[#9120595d] backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-5 xl:p-8 flex flex-col h-full transition-transform hover:-translate-y-1 duration-300 shadow-lg">
              <div className="w-12 md:w-14 h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-3 md:mb-6 shrink-0 shadow-inner">
                <svg
                  className="w-6 md:w-7 h-6 md:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>

              <h3 className="text-xl md:text-2xl font-semibold text-secondary mb-1 md:mb-2">
                Technology Partner
              </h3>
              <p className="text-gray-300  text-sm md:text-base mb-2 md:mb-4 leading-relaxed">
                For software companies wanting to embed AI orchestration into
                their own products.
              </p>

              <ul className="space-y-1 lg:space-y-3 mb-4 md:mb-8 flex-grow  text-gray-300 text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                  <span>Embed WiiZ&apos;s engine directly into your platform.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                  <span>Offer unparalleled automation to your customers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                  <span>
                    Create new value with a seamless, integrated experience.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                  <span>Unlock new joint revenue and marketing models.</span>
                </li>
              </ul>

              <div className="mt-auto">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-block bg-gradient-to-r from-[#912059] to-[#D87AAA] transition-transform hover:scale-105 duration-300 shadow-xl text-white text-sm px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium transition-colors duration-300 "
                >
                  Register Now
                </button>
              </div>
            </div>

            <div className=" bg-gradient-to-br from-[#240D1A] via-[#240D1A] to-[#9120595d] backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-5 xl:p-8 flex flex-col h-full transition-transform hover:-translate-y-1 duration-300 shadow-lg">
              <div className="w-12 md:w-14 h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-3 md:mb-6 shrink-0 shadow-inner">
                <svg
                  className="w-6 md:w-7 h-6 md:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 14v7"
                  />
                </svg>
              </div>

              <h3 className="text-xl md:text-2xl font-semibold text-secondary mb-1 md:mb-2">
                Education Partner
              </h3>
              <p className="text-gray-300 text-sm md:text-base  mb-2 md:mb-4 leading-relaxed">
                For institutions training AI to the next generation professionals.
              </p>

              <ul className="space-y-1 lg:space-y-3 mb-4 md:mb-8 flex-grow text-gray-300  text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                  <span>
                    Access full-tier platform licenses designed specifically for
                    extensive academic use.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                  <span>
                    Receive industry-recognized certifications that validate
                    skills and expertise.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 shrink-0"></span>
                  <span>
                    Deploy a structured, ready-to-use curriculum tailored for
                    effective learning.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0"></span>
                  <span>Join a global community of AI creators.</span>
                </li>
              </ul>

              <div className="mt-auto">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-block bg-gradient-to-r from-[#912059] to-[#D87AAA] transition-transform hover:scale-105 duration-300 shadow-xl text-white text-sm p-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium transition-colors duration-300"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Benefits */}
      <section className="bg-primary relative overflow-hidden py-8 md:py-12 lg:py-24 font-sans">
        <div className="absolute top-0 md:top-1/2 md:left-0 -translate-y-1/2 -translate-x-1/2 w-full lg:w-[82%] h-[60%] md:h-[60%] lg:h-[82%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0" />
        <div className="absolute top-0 md:top-1/2 md:right-0 -translate-y-1/2 translate-x-1/2 w-full lg:w-[82%] h-[60%] md:h-[60%] lg:h-[82%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0" />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center  text-white tracking-tight mb-2" data-aos="fade-up"
              data-aos-duration="700">
              Partner Benefits
            </h2>
            <p className="text-gray-300  text-base md:text-lg md:leading-relaxed" data-aos="fade-up"
              data-aos-delay="100">
              Accelerate your success with trusted support, innovative strategies, and resources designed to maximize your growth potential.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 lg:grid-rows-2 gap-6">
            <div className="bg-[#FFFFFF0D] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 duration-300 lg:row-span-2" data-aos="fade-up"
              data-aos-delay="100">
              <div className="w-full h-48 md:h-44 lg:h-[340px] overflow-hidden">
                <img
                  src="/images/revenue_growth.jpg"
                  alt="Revenue Growth Meeting"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 lg:p-4 xl:p-8 flex flex-col flex-1">
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-1 md:mb-2">
                  Revenue Growth
                </h3>
                <p className="text-gray-300 text-sm lg:text-base md:leading-relaxed">
                  Unlock new recurring revenue streams and scale your business sustainably.
                </p>
              </div>
            </div>

            <div className="bg-[#FFFFFF0D] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col lg:flex-row-reverse transition-transform hover:-translate-y-1 duration-300 h-full" data-aos="fade-up"
              data-aos-delay="150">
              <div className="w-full h-48 md:h-44 lg:w-2/5 lg:h-auto overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                  alt="Dedicated Support Team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 lg:p-4 xl:p-8 flex-1 flex flex-col">
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-1 md:mb-2">
                  Dedicated Support
                </h3>
                <p className="text-gray-300 text-sm lg:text-base md:leading-relaxed">
                  Get direct access to our partner success team for guidance and ongoing support.
                </p>
              </div>
            </div>

            <div className="bg-[#FFFFFF0D] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col lg:flex-row-reverse transition-transform hover:-translate-y-1 duration-300 h-full" data-aos="fade-up"
              data-aos-delay="150">
              <div className="w-full h-48 md:h-44 lg:w-2/5 lg:h-auto overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
                  alt="Training and Certification"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 lg:p-4 xl:p-8 flex-1 flex flex-col">
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-1 md:mb-2">
                  Training & Certification
                </h3>
                <p className="text-gray-300 text-sm lg:text-base md:leading-relaxed">
                  Become a certified WiiZ expert with hands-on training and practical learning. Gain recognized credentials to showcase your skills and boost your career.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-16 flex justify-center">
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#912059] to-[#D87AAA] transition-transform hover:scale-105 duration-300 shadow-xl text-white px-4 md:px-6 lg:px-10 py-2 md:py-3.5 font-medium rounded-full transition-all duration-300 "
            >
            Apply to Become a Partner
            </button>
          </div>
        </div>
      </section>

      {/* Form */}
      <section
        ref={formSectionRef}
        className="bg-primary relative overflow-hidden py-8 md:py-12 lg:py-24 font-sans scroll-mt-24"
      >
        <div className="absolute top-0 md:top-1/2 md:left-0 -translate-y-1/2 -translate-x-1/2 w-full lg:w-[82%] h-[45%] md:h-[60%] lg:h-[82%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0" />
        <div className="absolute top-0 md:top-1/2 md:right-0 -translate-y-1/2 translate-x-1/2 w-full lg:w-[82%] h-[45%] md:h-[60%] lg:h-[82%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0" />
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-white mb-2" data-aos="fade-up"
              data-aos-duration="700">
              Partner Program Application
            </h2>
            <p className="text-gray-300  text-base md:text-lg" data-aos="fade-up"
              data-aos-delay="100">
              Please submit the below form to connect with the WiiZ partner
              team.
            </p>
          </div>

          <div className="bg-gradient-to-b to-primary from-[#251321] border border-white/20 rounded-xl md:rounded-[1rem] md:rounded-[2rem] p-4 md:p-8 lg:p-12 shadow-2xl">
            <form onSubmit={handleSubmit}>
              <h3 className="flex items-center gap-4 text-secondary text-[13px] uppercase mb-4 md:mb-6">
                <span className="whitespace-nowrap tracking-widest">
                  Your Details
                </span>
                <span className="flex-1 h-[1px] bg-white/10"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-12">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">First Name *</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange("first_name")}
                    placeholder="John"
                    className="bg-[#FFFFFF0D] border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-tertiary  transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Last Name *</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange("last_name")}
                    placeholder="Deo"
                    className="bg-[#FFFFFF0D] border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-tertiary  transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    placeholder="john@company.com"
                    className="bg-[#FFFFFF0D] border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-tertiary  transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Mobile Number</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.mobile_phone}
                    onChange={handleChange("mobile_phone")}
                    placeholder="9876543210"
                    className="bg-[#FFFFFF0D] border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-tertiary  transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">Job Title *</label>
                  <input
                    type="text"
                    value={formData.job_title}
                    onChange={handleChange("job_title")}
                    placeholder="Product VP"
                    className="bg-[#FFFFFF0D] border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-3  text-white focus:outline-none focus:border-tertiary  transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={handleChange("organization")}
                    placeholder="Enter Your Company Name"
                    className="bg-[#FFFFFF0D] border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-tertiary  transition-colors"
                    required
                  />
                </div>
              </div>
              <h3 className="flex items-center gap-4 text-secondary text-[13px] uppercase mb-4 md:mb-6">
                <span className="whitespace-nowrap tracking-widest">
                  Company Details
                </span>
                <span className="flex-1 h-[1px] bg-white/10"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-12">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">
                    Company Website *
                  </label>
                  <input
                    type="url"
                    value={formData.company_website}
                    onChange={handleChange("company_website")}
                    placeholder="Share your Corporate website"
                    className="bg-[#FFFFFF0D] border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-tertiary  transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">
                    Primary Industry *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.primary_industry}
                      onChange={handleChange("primary_industry")}
                      className="w-full bg-[#FFFFFF0D] border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-tertiary  transition-colors appearance-none"
                      required
                    >
                      <option
                        value=""
                        disabled
                        className="bg-[#1b1016] text-gray-400"
                      >
                        Select
                      </option>
                      <option value="tech" className="bg-[#1b1016] text-white">
                        Technology
                      </option>
                      <option
                        value="financial_services"
                        className="bg-[#1b1016] text-white"
                      >
                        Financial Services
                      </option>
                      <option
                        value="education"
                        className="bg-[#1b1016] text-white"
                      >
                        Education
                      </option>
                      <option
                        value="healthcare"
                        className="bg-[#1b1016] text-white"
                      >
                        Healthcare
                      </option>
                      <option
                        value="manufacturing"
                        className="bg-[#1b1016] text-white"
                      >
                        Manufacturing
                      </option>
                      <option
                        value="retail_ecommerce"
                        className="bg-[#1b1016] text-white"
                      >
                        Retail / E-commerce
                      </option>
                      <option value="other" className="bg-[#1b1016] text-white">
                        Other
                      </option>
                    </select>

                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

              <h3 className="flex items-center gap-4 text-secondary text-[13px] uppercase mb-4 md:mb-6">
                <span className="whitespace-nowrap tracking-widest">
                  Program Selection
                </span>
                <span className="flex-1 h-[1px] bg-white/10"></span>
              </h3>
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-10"
                role="radiogroup"
                aria-label="Program selection"
              >
                <label
                  className={`cursor-pointer relative rounded-2xl p-4 md:p-6 flex flex-col transition-all ${selectedProgram === "integration"
                      ? "bg-gradient-to-br from-[#240D1A] via-[#240D1A] to-[#9120595d] border border-[#912059] shadow-[0_0_15px_rgba(171,56,106,0.2)]"
                      : "bg-[#FFFFFF0D] border border-white/5 hover:border-white/20"
                    }`}
                >
                  <input
                    type="radio"
                    name="program"
                    value="integration"
                    className="hidden"
                    checked={selectedProgram === "integration"}
                    onChange={() => setSelectedProgram("integration")}
                  />
                  <div
                    className={`absolute top-4 right-4 w-6 md:w-8 h-6 md:h-8 rounded-full border flex items-center justify-center transition-all ${selectedProgram === "integration"
                        ? "bg-white/10 border-[#912059]"
                        : "bg-white/5 border-white/10"
                      }`}
                  >
                    {selectedProgram === "integration" && (
                      <svg
                        className="w-3 md:w-4 h-3 md:h-4 text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    className={`w-8 md:w-10 h-8 md:h-10 border rounded-lg flex items-center justify-center mb-4 ${selectedProgram === "integration"
                        ? "bg-white/10 border-white/10"
                        : "bg-white/5 border-white/10"
                      }`}
                  >
                    <svg
                      className={`md:w-5 md:h-5 w-4 h-4 ${selectedProgram === "integration"
                          ? "text-white"
                          : "text-gray-400"
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold text-lg mb-2">
                    System Integration Partner
                  </h4>
                  <p className="text-gray-300 text-[13px]  leading-relaxed">
                    For software reselling and professional services
                    organization.
                  </p>
                </label>

                <label
                  className={`cursor-pointer relative rounded-2xl p-4 md:p-6 flex flex-col transition-all ${selectedProgram === "technology"
                      ? "bg-gradient-to-br from-[#240D1A] via-[#240D1A] to-[#9120595d] border border-[#912059] shadow-[0_0_15px_rgba(171,56,106,0.2)]"
                      : "bg-[#FFFFFF0D] border border-white/5 hover:border-white/20"
                    }`}
                >
                  <input
                    type="radio"
                    name="program"
                    value="technology"
                    className="hidden"
                    checked={selectedProgram === "technology"}
                    onChange={() => setSelectedProgram("technology")}
                  />
                  <div
                    className={`absolute top-4 right-4 w-5 md:w-8 h-5 md:h-8 rounded-full border flex items-center justify-center transition-all ${selectedProgram === "technology"
                        ? "bg-white/10 border-[#912059]"
                        : "bg-white/5 border-white/10"
                      }`}
                  >
                    {selectedProgram === "technology" && (
                      <svg
                        className="w-3 md:w-4 h-3 md:h-4 text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    className={`w-8 md:w-10 h-8 md:h-10 border rounded-lg flex items-center justify-center mb-4 ${selectedProgram === "technology"
                        ? "bg-white/10 border-white/10"
                        : "bg-white/5 border-white/10"
                      }`}
                  >
                    <svg
                      className={`md:w-5 md:h-5 w-4 h-4 ${selectedProgram === "technology"
                          ? "text-white"
                          : "text-gray-400"
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold text-lg mb-2">
                    Technology Partner
                  </h4>
                  <p className="text-gray-300  text-[13px] leading-relaxed">
                    For software companies embedding AI orchestration into their
                    products.
                  </p>
                </label>

                <label
                  className={`cursor-pointer relative rounded-2xl p-4 md:p-6 flex flex-col transition-all ${selectedProgram === "education"
                      ? "bg-gradient-to-br from-[#240D1A] via-[#240D1A] to-[#9120595d] border border-[#912059] shadow-[0_0_15px_rgba(171,56,106,0.2)]"
                      : "bg-[#FFFFFF0D] border border-white/5 hover:border-white/20"
                    }`}
                >
                  <input
                    type="radio"
                    name="program"
                    value="education"
                    className="hidden"
                    checked={selectedProgram === "education"}
                    onChange={() => setSelectedProgram("education")}
                  />
                  <div
                    className={`absolute top-4 right-4 w-5 md:w-8 h-5 md:h-8 rounded-full border flex items-center justify-center transition-all ${selectedProgram === "education"
                        ? "bg-white/10 border-[#912059]"
                        : "bg-white/5 border-white/10"
                      }`}
                  >
                    {selectedProgram === "education" && (
                      <svg
                        className="w-3 md:w-4 h-3 md:h-4 text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    className={`w-8 md:w-10 h-8 md:h-10 border rounded-lg flex items-center justify-center mb-4 ${selectedProgram === "education"
                        ? "bg-white/10 border-white/10"
                        : "bg-white/5 border-white/10"
                      }`}
                  >
                    <svg
                      className={`w-4 h-4 md:w-5 md:h-5 ${selectedProgram === "education"
                          ? "text-white"
                          : "text-gray-400"
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14v7"
                      />
                    </svg>
                  </div>
                  <h4 className="text-white font-semibold text-lg mb-2">
                    Education Partner
                  </h4>
                  <p className="text-gray-300  text-[13px] leading-relaxed">
                    For institutions training AI to the next generation
                    professionals.
                  </p>
                </label>
              </div>

              <div className="mt-6 md:mt-8 flex flex-col items-center gap-4 text-center">
                <div className="w-full md:w-auto shrink-0 overflow-hidden flex justify-center">
                  <div
                    ref={recaptchaContainerRef}
                    className="min-h-[72px] sm:min-h-[78px] inline-flex origin-center scale-[0.92] sm:scale-100 rounded-md overflow-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-gradient-to-r from-[#912059] to-[#D87AAA] hover:scale-105 disabled:hover:scale-100 disabled:opacity-70 text-white px-4 md:px-8 py-2.5 md:py-3.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg"
                >
                  {isSubmitting ? "Submitting..." : "Apply to Become a Partner"}
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {errorMessage ? (
                  <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {errorMessage}
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    {successMessage}
                  </div>
                ) : null}
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* Logos */}
      <section ref={findPartnerSectionRef} className="bg-primary relative overflow-hidden py-8 md:py-12 lg:py-16 font-sans">
        <div className="absolute top-0 md:top-1/2 md:left-0 -translate-y-1/2 -translate-x-1/2 w-full lg:w-[82%] h-[45%] md:h-[60%] lg:h-[82%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0" />
        <div className="absolute top-0 md:top-1/2 md:right-0 -translate-y-1/2 translate-x-1/2 w-full lg:w-[82%] h-[45%] md:h-[60%] lg:h-[82%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0" />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-white mb-2" data-aos="fade-up"
              data-aos-duration="700">
              Find a Partner
            </h2>
            <p className="text-gray-300  text-base md:text-lg" data-aos="fade-up"
              data-aos-delay="100">
              Discover trusted partners to scale your business with AI
              solutions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {partnerLogos.map((partner) => (
              <div
                key={partner.name}
                className="bg-[#24151e] border border-white/20 rounded-[1rem] md:rounded-[2rem] overflow-hidden flex flex-col transition-transform hover:-translate-y-1 shadow-lg group"
              >
                <div className={`flex min-h-[150px] items-center justify-center px-4 py-6 md:min-h-[190px] ${partner.logoPanelClassName}`}>
                  <img
                    src={partner.logoPath}
                    alt={`${partner.name} logo`}
                    className="h-auto max-h-[110px] w-full object-contain md:max-h-[130px]"
                  />
                </div>
                <div className={`p-4 md:p-6 text-center transition-colors duration-300 flex-1 ${partner.infoPanelClassName}`}>
                  <h3 className={`font-semibold text-lg ${partner.titleClassName}`}>{partner.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
