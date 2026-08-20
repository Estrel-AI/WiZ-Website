"use client";

import "leaflet/dist/leaflet.css";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import {
  RECAPTCHA_SITE_KEY,
  UTILITY_API_BASE_URL,
  buildPublicApiUrl,
} from "@/src/config/public-env";
import {
  sanitizeEmailInput,
  sanitizeFormTextInput,
} from "@/src/lib/input-sanitization";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialFormData: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const contactSocialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/showcase/estrel-wiiz-it/", Icon: Linkedin },
  {
    label: "Instagram",
    href: "https://www.instagram.com/wiiz.it?",
    Icon: Instagram,
  },
  {
    label: "Youtube",
    href: "https://youtube.com/@wiiz-it?si=Zih4KEVCWIAuvSfD",
    Icon: Youtube,
  },
  // { label: "Facebook", href: "#", Icon: Facebook },
  {
    label: "Product Hunt",
    href: "https://www.producthunt.com/products/wiiz?launch=wiiz-altas-2-0-public-beta",
    Icon: ProductHuntIcon,
  },
];

function ProductHuntIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1.53 11.15h-2.44v3.32H8.91V7.53h4.62a2.81 2.81 0 0 1 0 5.62Zm-.1-3.58h-2.34v1.54h2.34a.77.77 0 0 0 0-1.54Z"
      />
    </svg>
  );
}

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

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const recaptchaWidgetIdRef = useRef<number | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<unknown>(null);

  const markRecaptchaAsLoaded = () => {
    if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
      setRecaptchaLoaded(true);
    }
  };

  useEffect(() => {
    if (
      !RECAPTCHA_SITE_KEY ||
      !recaptchaLoaded ||
      !recaptchaContainerRef.current ||
      recaptchaWidgetIdRef.current !== null
    ) {
      return;
    }

    const renderRecaptcha = () => {
      if (
        !window.grecaptcha ||
        typeof window.grecaptcha.render !== "function" ||
        !recaptchaContainerRef.current
      ) {
        return;
      }

      recaptchaWidgetIdRef.current = window.grecaptcha.render(
        recaptchaContainerRef.current,
        {
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
            setErrorMessage(
              "reCAPTCHA could not be verified. Please try again.",
            );
          },
        },
      );
    };

    if (typeof window.grecaptcha?.ready === "function") {
      window.grecaptcha.ready(renderRecaptcha);
      return;
    }

    renderRecaptcha();
  }, [recaptchaLoaded]);

  useEffect(() => {
    let isCancelled = false;

    const initializeMap = async () => {
      if (!mapContainerRef.current || mapInstanceRef.current) {
        return;
      }

      const L = await import("leaflet");
      if (isCancelled || !mapContainerRef.current) {
        return;
      }

      const defaultMarkerIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const offices: Array<{ label: string; coords: [number, number] }> = [
        { label: "Dubai, UAE", coords: [25.2048, 55.2708] },
        { label: "Delhi, India", coords: [28.6139, 77.209] },
        { label: "Bengaluru, India", coords: [12.9716, 77.5946] },
      ];

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;
      map.attributionControl.setPrefix(false);

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        {
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, HERE, Garmin, Intermap, increment P Corp.',
        },
      ).addTo(map);

      const markers = offices.map((office) => {
        const marker = L.marker(office.coords, { icon: defaultMarkerIcon }).addTo(map);
        marker.bindPopup(office.label);
        return marker;
      });

      const bounds = L.featureGroup(markers).getBounds();
      map.fitBounds(bounds, { padding: [30, 30] });
    };

    initializeMap();

    return () => {
      isCancelled = true;
      const map = mapInstanceRef.current as { remove?: () => void } | null;
      if (map && typeof map.remove === "function") {
        map.remove();
      }
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const scriptId = "google-recaptcha-script";
    let pollTimer: number | null = null;

    const existingScript = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null;

    const startPolling = () => {
      if (pollTimer !== null) {
        window.clearInterval(pollTimer);
      }

      pollTimer = window.setInterval(() => {
        if (
          window.grecaptcha &&
          typeof window.grecaptcha.render === "function"
        ) {
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
    (field: keyof ContactForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue =
        field === "email"
          ? sanitizeEmailInput(event.target.value)
          : sanitizeFormTextInput(event.target.value, {
              preserveLineBreaks: field === "message",
              trim: false,
            });

      setFormData((previous) => ({
        ...previous,
        [field]: nextValue,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      name: sanitizeFormTextInput(formData.name),
      email: sanitizeEmailInput(formData.email),
      subject: sanitizeFormTextInput(formData.subject),
      message: sanitizeFormTextInput(formData.message, {
        preserveLineBreaks: true,
      }),
      recaptcha_token: recaptchaToken,
    };

    if (!data.name || !data.email || !data.subject || !data.message) {
      setErrorMessage("Please fill in all fields before submitting.");
      setSuccessMessage("");
      return;
    }

    if (!data.recaptcha_token) {
      setErrorMessage("Please complete the reCAPTCHA verification.");
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        buildPublicApiUrl(UTILITY_API_BASE_URL, "/contactMessage"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.message || "Unable to send your message. Please try again.",
        );
      }

      setFormData(initialFormData);
      setRecaptchaToken("");
      setSuccessMessage(
        payload?.message || "Your message has been sent successfully.",
      );
      setErrorMessage("");

      if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetIdRef.current);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setRecaptchaToken("");

      if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetIdRef.current);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <section className="bg-primary text-white py-8 md:py-12 lg:py-20 px-4 md:px-6 lg:px-4 font-sans min-h-screen font-sans">
        <div className="container mx-auto md:px-6 lg:px-8">
          <div className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">
              Get In Touch
            </h2>
            <p className="text-gray-300  md:text-base">
              Please submit the below form to connect with the WiiZ team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-12 lg:gap-6  xl:gap-16">
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-b to-primary from-[#251321] border border-white/20  rounded-xl md:rounded-[2rem] p-4 md:p-6 lg:p-10 shadow-2xl">
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block  text-sm text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={handleChange("name")}
                        placeholder="John"
                        className="w-full bg-[#FFFFFF0D] border border-white/10 rounded-xl px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-[#ab386a] transition-colors  placeholder:text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm  text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={handleChange("email")}
                        placeholder="example@gmail.com"
                        className="w-full bg-[#FFFFFF0D] border border-white/10  rounded-xl  px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-[#ab386a] transition-colors placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm  text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={handleChange("subject")}
                      placeholder="How can we help?"
                      className="w-full bg-[#FFFFFF0D] border border-white/10  rounded-xl  px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-[#ab386a] transition-colors placeholder:text-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm  text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={handleChange("message")}
                      placeholder="Tell us more about your project..."
                      className="w-full bg-[#FFFFFF0D] border border-white/10 font-light rounded-xl  px-3 md:px-4 py-2 md:py-3 text-white focus:outline-none focus:border-[#ab386a] transition-colors resize-none placeholder:text-gray-300"
                    ></textarea>
                  </div>

                  {errorMessage ? (
                    <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {errorMessage}
                    </p>
                  ) : null}

                  {successMessage ? (
                    <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      {successMessage}
                    </p>
                  ) : null}

                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2">
                      Verify you are human
                    </label>
                    <div className="w-full overflow-hidden">
                      <div
                        ref={recaptchaContainerRef}
                        className="min-h-[72px] sm:min-h-[78px] inline-flex origin-left scale-[0.92] sm:scale-100 rounded-md overflow-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-[#912059] to-[#D87AAA] disabled:cursor-not-allowed disabled:opacity-70 hover:scale-105 text-white px-4 md:px-6 lg:px-8 py-2.5 md:py-3.5 rounded-full text-sm md:text-base font-medium transition-all shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col pt-4">
              <h3 className="text-xl font-semibold mb-4 md:mb-8">Contact Us</h3>

              <a
                data-aos="fade-left"
                data-aos-duration="700"
                href="https://maps.app.goo.gl/pVmcqY4Ao14z44om9"
                target="_blank"
                rel="noreferrer"
                className="flex gap-5 mb-8"
              >
                <div className="flex-shrink-0 w-8 md:w-12 h-8 md:h-12 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-gray-200">
                  <svg
                    className="md:w-5 md:h-5 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1 md:mb-2">
                    Middle East Headquarters
                  </h4>
                  <p className="text-gray-300 hover:text-white text-sm leading-relaxed">
                    Unit 102 Office, Level 01, Innovation One, DIFC
                    <br />
                    Dubai, UAE. P.O. Box 507211
                  </p>
                </div>
              </a>

              <a
                data-aos="fade-left"
                data-aos-duration="700"
                href="https://maps.app.goo.gl/Tv1zo6tzLoVBxbc56"
                target="_blank"
                rel="noreferrer"
                className="flex gap-5 mb-8"
              >
                <div className="flex-shrink-0 w-8 md:w-12 h-8 md:h-12 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-gray-200">
                  <svg
                    className="md:w-5 md:h-5 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1 md:mb-2">
                    India Headquarters
                  </h4>
                  <p className="text-gray-300 hover:text-white text-sm leading-relaxed">
                    Floor No. 12, Flat No. 1206, Marathon Icon,
                    <br />
                    Ganpatrao Kadam Marg,
                    <br />
                    Opp. Peninsula Corporate Park,
                    <br />
                    Lower Parel West, Mumbai, Maharashtra – 400013
                  </p>
                </div>
              </a>
              <a
                data-aos="fade-left"
                data-aos-duration="700"
                href="https://maps.app.goo.gl/dvGYut9Ycdge3S6E8"
                target="_blank"
                rel="noreferrer"
                className="flex gap-5 mb-8"
              >
                <div className="flex-shrink-0 w-8 md:w-12 h-8 md:h-12 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-gray-200">
                  <svg
                    className="md:w-5 md:h-5 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1 md:mb-2">
                    Product R&D Center
                  </h4>
                  <p className="text-gray-300 hover:text-white text-sm leading-relaxed">
                    Bangalore, India
                  </p>
                </div>
              </a>

              <a
                data-aos="fade-left"
                data-aos-delay="150"
                href="mailto:sales@estrel.ai"
                className="flex gap-5 mb-6 md:mb-10"
              >
                <div className="flex-shrink-0 w-8 h-8 md:w-12 md:h-12 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-gray-200">
                  <svg
                    className="md:w-5 md:h-5 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                    Email Address
                  </h4>
                  <div className="text-gray-300 text-sm hover:text-white transition-colors">
                    sales@estrel.ai
                  </div>
                </div>
              </a>
              <div
                data-aos="fade-left"
                data-aos-delay="180"
                className="mb-8 md:mb-10"
              >
                <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                  Follow Us
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  {contactSocialLinks.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      title={label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-gray-200 transition-all hover:-translate-y-0.5 hover:border-secondary/50 hover:bg-white/15 hover:text-white"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="lg:col-span-5 w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-white p-2"
            >
              <div
                ref={mapContainerRef}
                aria-label="WiiZ office locations map"
                className="contact-map h-[280px] w-full rounded-xl md:h-[360px]"
              />
            </div> */}
          </div>

         
        </div>
      </section>
    </main>
  );
}
