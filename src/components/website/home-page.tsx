"use client";

import Image from "next/image";
import Link from "next/link";
import type {
  HeroSectionData,
  HomeFeatureRow,
  HomeUseCasePublicRow,
} from "@/src/types/admin-api";
import type { HomePageContent } from "@/src/types/admin-cms";
import { ComplianceChatbotPreview } from "@/src/components/website/compliance-chatbot-preview";
import { WEBSITE_CHATBOT_OPEN_EVENT } from "@/src/components/website/website-chatbot-iframe";
import WebsiteCtaButton, {
  resolveWebsiteCtaHref,
} from "@/src/components/website/website-cta-button";
import { partnerLogos } from "@/src/data/partners";
import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  Layers,
  Plug,
  ShieldCheck,
} from "lucide-react";
import AOS from "aos";
import { useEffect, useRef, useState } from "react";

type HomePageProps = {
  managedContent: HomePageContent;
  heroSection?: HeroSectionData | null;
  homeFeatures?: HomeFeatureRow[];
  homeUseCases?: HomeUseCasePublicRow[];
};

function getHeroMediaUrl(filepath: string | null) {
  if (!filepath) {
    return null;
  }

  const [folder, fileName] = filepath.split("/");
  if (!folder || !fileName) {
    return null;
  }

  return `/api/media/${folder}/${fileName}`;
}

function getFeatureMediaUrl(filepathOrUrl: string | null) {
  if (!filepathOrUrl) {
    return null;
  }

  if (filepathOrUrl.startsWith("/")) {
    return filepathOrUrl;
  }

  try {
    const parsed = new URL(filepathOrUrl);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : null;
  } catch {
    const [folder, fileName] = filepathOrUrl.split("/");
    if (!folder || !fileName) {
      return null;
    }

    return `/api/media/${folder}/${fileName}`;
  }
}

function isVideoMedia(path: string | null) {
  if (!path) {
    return false;
  }

  const normalized = path.toLowerCase();
  return normalized.endsWith(".mp4") || normalized.endsWith(".webm") || normalized.endsWith(".mov") || normalized.endsWith(".ogv");
}

type ResolvedFeatureMedia =
  | { kind: "video"; src: string }
  | { kind: "embed"; src: string }
  | { kind: "image"; src: string };

function getYouTubeEmbedUrl(url: URL) {
  const host = url.hostname.toLowerCase();

  if (host.includes("youtu.be")) {
    const videoId = url.pathname.split("/").filter(Boolean)[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  if (host.includes("youtube.com")) {
    if (url.pathname.startsWith("/shorts/")) {
      const videoId = url.pathname.split("/")[2];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (url.pathname.startsWith("/embed/")) {
      return url.toString();
    }

    const videoId = url.searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  return null;
}

function getVimeoEmbedUrl(url: URL) {
  const host = url.hostname.toLowerCase();
  if (!host.includes("vimeo.com")) {
    return null;
  }

  if (url.pathname.startsWith("/video/")) {
    return `https://player.vimeo.com${url.pathname}`;
  }

  const videoId = url.pathname.split("/").filter(Boolean).find((segment) => /^\d+$/.test(segment));
  return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
}

function getGoogleDriveFileId(url: URL) {
  const host = url.hostname.toLowerCase();
  if (!host.includes("drive.google.com")) {
    return null;
  }

  const pathMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
  if (pathMatch?.[1]) {
    return pathMatch[1];
  }

  const searchId = url.searchParams.get("id");
  return searchId?.trim() || null;
}

function getGoogleDriveEmbedUrl(url: URL) {
  if (url.pathname.includes("/preview")) {
    return url.toString();
  }

  const fileId = getGoogleDriveFileId(url);
  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
}

function getGoogleDriveImageUrl(url: URL) {
  const fileId = getGoogleDriveFileId(url);
  return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000` : null;
}

function getLoomEmbedUrl(url: URL) {
  const host = url.hostname.toLowerCase();
  if (!host.includes("loom.com")) {
    return null;
  }

  if (url.pathname.startsWith("/embed/")) {
    return url.toString();
  }

  const videoId = url.pathname.split("/").filter(Boolean).pop();
  return videoId ? `https://www.loom.com/embed/${videoId}` : null;
}

function resolveFeatureMedia(mediaType: string | null, mediaUrl: string | null): ResolvedFeatureMedia | null {
  const resolvedUrl = getFeatureMediaUrl(mediaUrl);

  if (!resolvedUrl) {
    return null;
  }

  if (mediaType !== "video") {
    try {
      const parsedUrl = new URL(resolvedUrl);
      const googleDriveEmbedUrl = getGoogleDriveEmbedUrl(parsedUrl);
      if (googleDriveEmbedUrl) {
        return { kind: "embed", src: googleDriveEmbedUrl };
      }

      return { kind: "image", src: getGoogleDriveImageUrl(parsedUrl) ?? resolvedUrl };
    } catch {
      return { kind: "image", src: resolvedUrl };
    }
  }

  if (isVideoMedia(resolvedUrl)) {
    return { kind: "video", src: resolvedUrl };
  }

  try {
    const parsedUrl = new URL(resolvedUrl);
    const embedUrl =
      getYouTubeEmbedUrl(parsedUrl)
      ?? getVimeoEmbedUrl(parsedUrl)
      ?? getGoogleDriveEmbedUrl(parsedUrl)
      ?? getLoomEmbedUrl(parsedUrl)
      ?? resolvedUrl;

    return { kind: "embed", src: embedUrl };
  } catch {
    return { kind: "video", src: resolvedUrl };
  }
}

function stripHtml(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const defaultServiceTabs = [
  {
    id: "tab-mcp",
    mobile: "Workflow Builder",
    desktop: "Workflow Builder",
    title: "No-Code Workflow Builder & Intent Studio",
    body: "Build agent workflows visually with clear intent definition and execution logic.",
    points: [
      "Drag-and-drop workflow design",
      "Intent configuration and flow logic",
      "Faster prototyping and deployment",
    ],
    icon: Check,
    video: "/images/videos-home/workflow-builder.mp4",
  },
  {
    id: "tab-governance-ai",
    mobile: "Orchestration",
    desktop: "Orchestration",
    title: "Agent Orchestration Engine",
    body: "Coordinate multiple AI agents across enterprise workflows.",
    points: [
      "Multi-agent collaboration",
      "Task sequencing and orchestration",
      "Reliable workflow execution",
    ],
    icon: ShieldCheck,
    video: "/images/videos-home/multi-agent.mp4",
  },
  {
    id: "tab-multimodal",
    mobile: "EvalOps",
    desktop: "EvalOps",
    title: "Built-in EvalOps & Monitoring",
    body: "Track, evaluate, and improve agent performance continuously.",
    points: [
      "Execution visibility",
      "Performance monitoring",
      "Built-in evaluation framework",
    ],
    icon: Layers,
  },
  {
    id: "tab-observability",
    mobile: "Guardrails",
    desktop: "Guardrails",
    title: "AI Governance Guardrails & Policy Enforcement",
    body: "Apply enterprise control across AI workflows and agent actions.",
    points: [
      "Policy enforcement",
      "Role-based access control",
      "Audit trails and compliance visibility",
    ],
    icon: Activity,
    video: "/images/videos-home/guardrail.mp4",
  },
  {
    id: "tab-integrations",
    mobile: "MCP Integrations",
    desktop: "MCP Integration",
    title: "MCP Administration & Integrations",
    body: "Securely connect agents with enterprise systems through Model Context Protocol (MCP).",
    points: [
      "Centralized MCP management",
      "Secure access to tools, APIs, and databases",
      "Controlled enterprise data connectivity",
    ],
    icon: Plug,
    video: "/images/videos-home/mcp.mp4",
  },
  {
    id: "tab-handling",
    mobile: "Multimodal",
    desktop: "Multimodal",
    title: "Multimodal Data Handling",
    body: "Enable agents to work across multiple data formats and enterprise content types.",
    points: [
      "Text and documents",
      "PDFs, images, and video",
      "Emails, databases, and APIs"

    ],
    icon: Activity,
  },
  {
    id: "tab-infra",
    mobile: "Deployment",
    desktop: "Deployment",
    title: "Flexible Deployment Infrastructure",
    body: "Deploy WiiZ based on enterprise infrastructure needs.",
    points: [
      "SaaS or self-hosted",
      "Private cloud or on-premise",
      "Air-gapped environments",
    ],
    icon: Activity,
  },
];

const testimonials = [
  {
    id: "card-1",
    name: "Sai Shruthi",
    role: "Agentic AI Developer",
    image:
      "https://ui-avatars.com/api/?name=Sai+Shruthi&background=912059&color=ffffff&bold=true",
    quote:
      "WiiZ has been instrumental in bridging the gap between AI capabilities and business applications. It supports practical implementation, making it easier to deliver scalable and impactful solutions.",
  },
  {
    id: "card-2",
    name: "Paarth",
    role: "AI Engineer",
    image:
      "https://ui-avatars.com/api/?name=Paarth&background=D87AAA&color=ffffff&bold=true",
    quote:
      "Using WiiZ has significantly improved the way I build and manage AI workflows. The platform is intuitive yet powerful, reducing manual effort and accelerating workflow development.",
  },
  {
    id: "card-3",
    name: "Gowtham Sai",
    role: "AI Engineer",
    image:
      "https://ui-avatars.com/api/?name=Gowtham+Sai&background=7a314f&color=ffffff&bold=true",
    quote:
      "WiiZ redefines the integration of automation and AI through a highly intuitive and scalable platform. It transformed complex concepts into efficient real-world workflows with speed and flexibility.",
  },
  {
    id: "card-4",
    name: "Aravind",
    role: "Software Engineer",
    image:
      "https://ui-avatars.com/api/?name=Aravind&background=4f2238&color=ffffff&bold=true",
    quote:
      "WiiZ transforms the complexity of AI orchestration into an intuitive, streamlined process. It has been a significant catalyst in advancing my technical expertise and understanding of enterprise AI efficiency.",
  },
  {
    id: "card-5",
    name: "Ankur",
    role: "AI Engineer",
    image:
      "https://ui-avatars.com/api/?name=Ankur&background=aa5b7f&color=ffffff&bold=true",
    quote:
      "WiiZ is a strong platform for building AI workflows in a clear and structured way. It simplifies complex automation while still allowing full control over how systems are designed.",
  },
];

const faqs = [
  {
    question: "What is WiiZ?",
    answer:
      "WiiZ is an Enterprise Agentic AI Operating System that enables organizations to design, orchestrate, govern, monitor, and scale AI agents from one unified platform.",
  },
  {
    question: "How is WiiZ different from traditional AI automation platforms?",
    answer:
      "WiiZ goes beyond workflow automation by providing enterprise-grade AI orchestration, governance, observability, EvalOps, multi-agent coordination, and centralized AI operations in a single platform.",
  },
  {
    question: "Can WiiZ orchestrate multiple AI agents and models together?",
    answer:
      "Yes. WiiZ supports multi-agent orchestration and centralized provisioning across multiple LLMs, VLMs, enterprise systems, APIs, and workflows.",
  },
  {
    question: "Does WiiZ provide AI governance and compliance controls?",
    answer:
      "Yes. WiiZ includes enterprise governance capabilities such as policy enforcement, audit visibility, monitoring, guardrails, access control, and AI execution oversight.",
  },
  {
    question: "Can WiiZ work with existing enterprise systems?",
    answer:
      "Yes. WiiZ integrates with enterprise applications, APIs, databases, cloud platforms, and existing AI infrastructure through its orchestration and integration framework.",
  },
  {
    question: "Does WiiZ support on-premise or air-gapped deployments?",
    answer:
      "Yes. WiiZ supports SaaS, private cloud, on-premise, and air-gapped enterprise deployments for organizations with strict security and compliance requirements.",
  },
  {
    question: "What is EvalOps in WiiZ?",
    answer:
      "EvalOps continuously monitors AI workflows, agent performance, hallucinations, execution quality, and operational reliability to ensure trustworthy enterprise AI operations.",
  },
  {
    question: "Who is WiiZ designed for?",
    answer:
      "WiiZ is designed for enterprise business teams, AI engineering teams, IT governance teams, system integrators, and organizations scaling enterprise AI adoption.",
  },
  {
    question: "Does WiiZ require coding expertise?",
    answer:
      "No. WiiZ includes a no-code orchestration environment that allows teams to design and manage AI workflows visually while still supporting advanced extensibility for technical teams.",
  },
  {
    question: "Can WiiZ monitor AI usage and operational costs?",
    answer:
      "Yes. WiiZ provides centralized visibility into AI usage, token consumption, workflow execution, performance metrics, and operational insights across the enterprise.",
  },
  {
    question: "How does WiiZ help enterprises scale AI adoption?",
    answer:
      "WiiZ centralizes AI orchestration, governance, visibility, and operations, helping organizations move from fragmented AI experiments to scalable enterprise AI operations.",
  },
  {
    question: "Is WiiZ only for AI chatbots?",
    answer:
      "No. WiiZ supports enterprise AI workflows, autonomous agents, orchestration pipelines, multimodal AI operations, business process automation, and cross-system AI collaboration.",
  },
  {
    question: "What deployment models does WiiZ support?",
    answer:
      "WiiZ supports cloud, private tenant, hybrid, self-hosted, and enterprise on-premise deployments.",
  },
  {
    question: "Can WiiZ support enterprise security requirements?",
    answer:
      "Yes. WiiZ supports enterprise-grade security including RBAC, JWT authentication, audit logging, credential vaulting, governance controls, and policy enforcement.",
  },
  {
    question: "Why do enterprises need an AI Operating System?",
    answer:
      "As AI adoption grows, enterprises need centralized orchestration, governance, visibility, and operational control to manage AI agents securely and at scale. WiiZ provides that unified control layer.",
  },
];

const audienceCards = [
  {
    title: "Enterprise Business Teams",
    image: "/images/Product_builder.jpg",
    desc: "Adopt AI confidently across your everyday business operations with visibility, governance, and measurable performance.",
    bullets: [
      "Difficulty moving AI from pilots to daily operations",
      "Limited visibility into AI performance and business impact",
      "Low confidence in scaling AI across teams and workflows",
    ],
    cta: "Book an Appointment",
    positive: false,
  },
  {
    title: "Enterprise IT & AI Governance",
    image: "/images/Enterprice_it.jpg",
    desc: "Design, Deploy, Maintain centralized control, governance, security, and compliance across enterprise AI operations.",
    bullets: [
      "Shadow AI and unmanaged agents",
      "Lack of AI governance and observability",
      "Compliance, security, and audit risks",
    ],
    cta: "Book an Appointment",
    positive: true,
  },
  {
    title: "System Integrators & Partners",
    image: "/images/system_integrator.jpg",
    desc: "Deliver enterprise AI transformation faster with a unified orchestration and governance platform.",
    bullets: [
      "Complex enterprise integrations",
      "Managing multi-client AI deployments",
      "Long implementation timelines",
    ],
    cta: "Partner with Us",
    positive: false,
  },
  {
    title: "Legacy Product Enhancement",
    image: "/images/Ai_Team.jpg",
    desc: "Enhance your existing platforms with ease using the Embedded WiiZ Platform",
    bullets: [
      "Multi-agent orchestration complexity",
      "Integrating models, APIs, and enterprise systems",
      "Scaling AI workflows into production",
    ],
    cta: "Partner with Us",
    positive: true,
  },
];

const audienceCardCtaHrefMap: Record<string, string> = {
  "Start Free": "/register",
  "Book an Appointment": "/contact",
  "Partner with Us": "/partner",
};

function MissingArtwork({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[linear-gradient(145deg,#09090b_20%,#3b1429_65%,#a0386c_100%)] ${className}`}>
      <div className="absolute inset-0 bg-[url('/images/texture.png')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="relative z-10 flex h-full min-h-[260px] items-center justify-center p-8 text-center">
        <div>
          <div className="text-2xl font-bold text-white">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({
  managedContent,
  heroSection,
  homeFeatures = [],
  homeUseCases = [],
}: HomePageProps) {
  const hero = managedContent.hero;
  const serviceTabs = homeFeatures.length
    ? homeFeatures.map((feature) => ({
      id: `feature-${feature.id}`,
      mobile: feature.label,
      desktop: feature.label,
      title: feature.title,
      body: feature.description ?? "",
      points: feature.features,
      icon: Check,
      mediaType: feature.mediaType,
      mediaUrl: feature.mediaUrl,
    }))
    : defaultServiceTabs.map((tab) => ({
      ...tab,
      mediaType: tab.video ? "video" : null,
      mediaUrl: tab.video ?? null,
    }));
  const heroPrimaryButton =
    hero.buttons.find((button) => button.variant === "primary") ?? hero.buttons[0];
  const heroSecondaryButton =
    hero.buttons.find((button) => button.variant === "secondary") ?? hero.buttons[1];
  const heroBackgroundMedia = getHeroMediaUrl(heroSection?.filepath ?? null);
  const resolvedHeroHeading = heroSection?.heroHeading?.trim() || hero.heading;
  const resolvedHeroHighlight = heroSection?.highlightedHeading?.trim() || hero.highlightedText;
  const resolvedHeroDescription = heroSection?.shortDescription?.trim() || hero.subheading;
  const resolvedHeroButtonText = heroSection?.buttonText?.trim() || heroSecondaryButton?.label || "Get Started";
  const resolvedHeroButtonText2 = heroSection?.buttonText2?.trim() || heroPrimaryButton?.label || "Book Enterprise Demo";
  const resolvedHeroSecondaryHref = resolveWebsiteCtaHref(heroSecondaryButton?.href, "/register");
  const resolvedHeroPrimaryHref = resolveWebsiteCtaHref(heroPrimaryButton?.href, "/contact");
  const featuredHomeUseCase = homeUseCases[0] ?? null;
  const secondaryHomeUseCases = homeUseCases.slice(1, 3);
  const [activeService, setActiveService] = useState(serviceTabs[0]?.id ?? "");
  const currentActiveService = serviceTabs.some((tab) => tab.id === activeService)
    ? activeService
    : serviceTabs[0]?.id ?? "";
  const testimonialLoopOffset = testimonials.length * 2;
  const testimonialLoopItems = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];
  const [activeTestimonial, setActiveTestimonial] = useState(
    testimonialLoopOffset,
  );
  const [mobileActiveTestimonial, setMobileActiveTestimonial] = useState(
    testimonialLoopOffset,
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const testimonialTabsRef = useRef<HTMLDivElement | null>(null);
  const testimonialBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileTestimonialsRef = useRef<HTMLDivElement | null>(null);
  const mobileScrollTimeoutRef = useRef<number | null>(null);
  const mobileHasInitializedRef = useRef(false);
  const mobileIsSyncingRef = useRef(false);
  const currentTestimonial =
    testimonials[activeTestimonial % testimonials.length];
  const currentMobileTestimonial =
    testimonials[mobileActiveTestimonial % testimonials.length];

  useEffect(() => {
    AOS.init({ duration: 800, once: false, offset: 100, mirror: true });
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveTestimonial((prev) => prev + 1);
    }, 2500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setMobileActiveTestimonial((prev) => prev + 1);
    }, 2500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const container = testimonialTabsRef.current;
    const activeBtn = testimonialBtnRefs.current[activeTestimonial];
    if (!container || !activeBtn) return;
    container.scrollTo({
      left:
        activeBtn.offsetLeft -
        container.offsetWidth / 2 +
        activeBtn.offsetWidth / 2,
      behavior: "smooth",
    });
  }, [activeTestimonial]);

  useEffect(() => {
    const container = testimonialTabsRef.current;
    if (!container) return;

    const loopSize = testimonials.length;
    let resetIndex = activeTestimonial;

    if (activeTestimonial >= loopSize * 4) {
      resetIndex = activeTestimonial - loopSize;
    } else if (activeTestimonial < loopSize) {
      resetIndex = activeTestimonial + loopSize;
    }

    if (resetIndex === activeTestimonial) return;

    const resetBtn = testimonialBtnRefs.current[resetIndex];
    if (!resetBtn) return;

    window.requestAnimationFrame(() => {
      container.scrollTo({
        left:
          resetBtn.offsetLeft -
          container.offsetWidth / 2 +
          resetBtn.offsetWidth / 2,
        behavior: "auto",
      });
      setActiveTestimonial(resetIndex);
    });
  }, [activeTestimonial]);

  useEffect(() => {
    const container = mobileTestimonialsRef.current;
    if (!container || mobileHasInitializedRef.current) return;

    const initialCard = container.children[testimonialLoopOffset] as
      | HTMLElement
      | undefined;
    if (!initialCard) return;

    mobileIsSyncingRef.current = true;
    container.scrollTo({
      left: initialCard.offsetLeft,
      behavior: "auto",
    });

    window.requestAnimationFrame(() => {
      mobileHasInitializedRef.current = true;
      mobileIsSyncingRef.current = false;
    });
  }, [testimonialLoopOffset]);

  useEffect(() => {
    const container = mobileTestimonialsRef.current;
    if (!container || !mobileHasInitializedRef.current) return;

    const activeCard = container.children[mobileActiveTestimonial] as
      | HTMLElement
      | undefined;
    if (!activeCard) return;

    mobileIsSyncingRef.current = true;
    container.scrollTo({
      left: activeCard.offsetLeft,
      behavior: "smooth",
    });

    window.setTimeout(() => {
      mobileIsSyncingRef.current = false;
    }, 350);
  }, [mobileActiveTestimonial]);

  useEffect(() => {
    const container = mobileTestimonialsRef.current;
    if (!container || !mobileHasInitializedRef.current) return;

    const loopSize = testimonials.length;
    let resetIndex = mobileActiveTestimonial;

    if (mobileActiveTestimonial >= loopSize * 4) {
      resetIndex = mobileActiveTestimonial - loopSize;
    } else if (mobileActiveTestimonial < loopSize) {
      resetIndex = mobileActiveTestimonial + loopSize;
    }

    if (resetIndex === mobileActiveTestimonial) return;

    const resetCard = container.children[resetIndex] as HTMLElement | undefined;
    if (!resetCard) return;

    window.requestAnimationFrame(() => {
      mobileIsSyncingRef.current = true;
      container.scrollTo({
        left: resetCard.offsetLeft,
        behavior: "auto",
      });
      setMobileActiveTestimonial(resetIndex);

      window.requestAnimationFrame(() => {
        mobileIsSyncingRef.current = false;
      });
    });
  }, [mobileActiveTestimonial]);

  useEffect(() => {
    return () => {
      if (mobileScrollTimeoutRef.current !== null) {
        window.clearTimeout(mobileScrollTimeoutRef.current);
      }
    };
  }, []);

  const handleMobileTestimonialsScroll = () => {
    if (mobileIsSyncingRef.current) return;

    if (mobileScrollTimeoutRef.current !== null) {
      window.clearTimeout(mobileScrollTimeoutRef.current);
    }

    mobileScrollTimeoutRef.current = window.setTimeout(() => {
      const container = mobileTestimonialsRef.current;
      if (!container) return;

      const cards = Array.from(container.children) as HTMLElement[];
      if (!cards.length) return;

      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setMobileActiveTestimonial(closestIndex);
    }, 120);
  };

  const visibleFaqs = faqs.slice(0, 3);

  return (
    <>
      <main className="bg-[#1D0612] min-h-[70vh] lg:min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden px-4 py-8 md:py-20 font-sans">
        {heroBackgroundMedia ? (
          <div className="absolute inset-0">
            {isVideoMedia(heroBackgroundMedia) ? (
              <video className="h-full w-full object-cover opacity-55" autoPlay muted loop playsInline>
                <source src={heroBackgroundMedia} />
              </video>
            ) : (
              <Image
                src={heroBackgroundMedia}
                alt={resolvedHeroHeading}
                fill
                className="object-cover opacity-55"
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-[#1D0612]/50" />
          </div>
        ) : null}
        <div className="absolute -top-1/2 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-hero blur-[160px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1
            data-aos="fade-up"
            data-aos-duration="1000"
            className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-tight md:leading-[1.1] font-bold text-white mb-3 md:mb-6 tracking-tight"
          >
            {resolvedHeroHeading}
            <br />
            <span className="bg-gradient-to-r from-secondary to-[#E68F17] bg-clip-text text-transparent">
              {resolvedHeroHighlight}
            </span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
            className="text-base md:text-xl text-[#FDFDFD] max-w-2xl text-center  mx-auto mb-5 md:mb-10"
          >
            {resolvedHeroDescription}
          </p>
          <div
            className="flex gap-4 flex-col sm:flex-row justify-center items-center"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            <WebsiteCtaButton
              href={resolvedHeroSecondaryHref}
              fallbackHref="/register"
              className="hero-cta inline-flex w-fit items-center justify-center bg-transparent border border-white/50 text-white px-4 md:px-8 py-2 md:py-3 rounded-full md:rounded-lg md:text-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-tertiary/20 transition-all duration-300"
            >
              {resolvedHeroButtonText}
            </WebsiteCtaButton>
            <WebsiteCtaButton
              href={resolvedHeroPrimaryHref}
              fallbackHref="/contact"
              className="hero-cta inline-flex w-fit items-center justify-center bg-gradient-to-r from-quaternary to-[#AD2D45] text-white px-4 md:px-8 py-2 md:py-3 rounded-full md:rounded-lg md:text-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-tertiary/20 transition-all duration-300 group"
            >
              {resolvedHeroButtonText2}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </WebsiteCtaButton>
          </div>
        </div>
      </main>

      <section className="border-y border-gray-200 bg-white flex items-stretch font-sans">
        <div className="container mx-auto flex items-center justify-start w-full overflow-hidden relative py-6 md:py-8 lg:py-10">
          <div className="flex-shrink-0 hidden md:flex items-center justify-center w-40 xl:w-64 border-r border-gray-200 bg-white z-10">
            <span className="text-sm md:text-base font-medium text-gray-800 tracking-[0.15em] uppercase">
              Trusted By
            </span>
          </div>
          <div className="flex-1 flex items-center overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="flex animate-scroll whitespace-nowrap items-center w-max">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="flex items-center space-x-12 md:space-x-10 px-6 md:px-8"
                >
                  {partnerLogos.map((partner, index) => (
                    <span
                      key={`${copy}-${partner.name}-${partner.logoPath}-${index}`}
                      className="relative flex h-10 w-36 items-center justify-center md:h-12 md:w-44"
                    >
                      <Image
                        src={partner.logoPath}
                        alt={`${partner.name} logo`}
                        fill
                        sizes="176px"
                        className={`object-contain transition-transform ${partner.homepageLogoClassName ?? ""}`}
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-10 md:py-16 xl:py-24 relative overflow-hidden font-sans">
        <div className="absolute top-0 left-0 w-full max-w-[500px] h-full bg-[url('/images/side-left.png')] bg-no-repeat bg-left-top pointer-events-none" />
        <div className="absolute top-0 right-0 w-full max-w-[500px] h-full bg-[url('/images/side-right.png')] bg-no-repeat bg-right-top pointer-events-none" />
        <div className="md:block hidden absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-[400px] h-[400px] bg-quaternary/10 rounded-[50%] blur-[60px] pointer-events-none z-0" />
        <div className="md:block hidden absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-[400px] h-[400px] bg-quaternary/10 rounded-[50%] blur-[60px] pointer-events-none z-0" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-section">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
            <h2
              data-aos="fade-up"
              data-aos-duration="700"
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4 tracking-tight"
            >
              Everything you need to move from prototype to production
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="150"
              className="text-base md:text-lg font-light text-[#EBEBEB] md:px-20"
            >
              WiiZ brings together the core capabilities required to Orchestrate enterprise AI agents at scale.
            </p>
          </div>
          <div className="flex md:hidden flex-wrap justify-center gap-2 items-center w-max mx-auto mb-8 overflow-x-auto max-w-full hide-scrollbar">
            {serviceTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveService(tab.id)}
                className={`px-4 py-2 rounded-full text-sm border border-white/10 transition-all duration-300 ${currentActiveService === tab.id ? "text-white bg-gradient-to-r from-quaternary to-[#D87AAA] shadow-lg bg-black/30" : "text-[#DFDFDF] bg-black/30 hover:text-white"}`}
              >
                {tab.mobile}
              </button>
            ))}
          </div>
          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="bg-gradient-to-t from-[#FFFFFF0D] to-[#0D0A1947] backdrop-blur-lg border border-white/20 rounded-2xl md:rounded-2xl md:rounded-3xl p-4 md:p-4 lg:p-10 shadow-2xl relative"
          >
            <div className="hidden md:flex flex-wrap justify-center items-center bg-black/30 rounded-full p-2 xl:p-2 lg:w-max lg:mx-auto mb-6 lg:mb-12 border border-white/5 overflow-x-auto max-w-full">
              {serviceTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveService(tab.id)}
                  className={`px-2 lg:px-5 xl:px-6 py-2 lg:py-2.5 rounded-full text-base md:text-[13px] lg:text-sm transition-all duration-300 ${currentActiveService === tab.id ? "text-white bg-gradient-to-r from-quaternary to-[#D87AAA] shadow-lg" : "text-[#DFDFDF] hover:text-white"}`}
                >
                  {tab.desktop}
                </button>
              ))}
            </div>
            <div className="relative grid grid-cols-1 grid-rows-1 w-full items-start">
              {serviceTabs.map((tab) => {
                const Icon = tab.icon;
                const active = currentActiveService === tab.id;
                const resolvedMedia = resolveFeatureMedia(tab.mediaType, tab.mediaUrl);
                return (
                  <div
                    key={tab.id}
                    className={`row-start-1 col-start-1 grid md:grid-cols-2 gap-0 md:gap-12 items-center md:items-stretch transition-all duration-500 ${active ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"}`}
                  >
                    <div className="order-1 md:order-0 flex flex-col justify-center py-4 md:py-0">
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 lg:mb-4">
                        {tab.title}
                      </h3>
                      <p className="text-gray-300 mb-4 lg:mb-8 leading-relaxed">
                        {tab.body}
                      </p>
                      <ul className="space-y-2 lg:space-y-4">
                        {tab.points.map((point) => (
                          <li key={point} className="flex items-start">
                            <Icon
                              className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-secondary"
                            />
                            <span className="text-gray-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="order-0 md:order-1 h-full min-h-[260px] overflow-hidden">
                      {resolvedMedia ? (
                        <div className="relative h-[260px] w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl md:h-full md:min-h-[320px] md:max-h-[460px]">
                          {resolvedMedia.kind === "video" ? (
                            <video
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="block h-full w-full max-w-full object-cover"
                            >
                              <source src={resolvedMedia.src} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : resolvedMedia.kind === "embed" ? (
                            <>
                              <iframe
                                src={resolvedMedia.src}
                                title={tab.title}
                                className="block h-full min-h-[260px] w-full max-w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                              />
                              <div className="absolute bottom-3 right-3">
                                <Link
                                  href={tab.mediaUrl ?? resolvedMedia.src}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur"
                                >
                                  Open media
                                </Link>
                              </div>
                            </>
                          ) : (
                            <img
                              src={resolvedMedia.src}
                              alt={tab.title}
                              className="block h-full w-full max-w-full object-cover object-center"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(145deg,#09090b_20%,#3b1429_65%,#a0386c_100%)] rounded-xl">
                          <div className="absolute inset-0 bg-[url('/images/texture.png')] bg-cover bg-center opacity-20" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <div className="relative z-10 flex h-full min-h-[260px] items-center justify-center p-8 text-center">
                            <div className="text-2xl font-bold text-white">
                              {tab.desktop}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-10 md:py-16 xl:py-24 relative overflow-hidden font-sans">
        {/* <div className="absolute top-0 md:top-1/2 md:left-0 -translate-y-1/2 -translate-x-1/2 w-full h-[70%] md:h-[80%] md:w-[80%] lg:w-[88%] lg:h-[88%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0" />
        <div className="absolute top-0 md:top-1/2 md:right-0 -translate-y-1/2 translate-x-1/2 w-full h-[70%] md:h-[80%] md:w-[80%] lg:w-[88%] lg:h-[88%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0" /> */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            data-aos="fade-up"
            className="flex flex-col md:flex-row md:items-end gap-6 justify-between mb-8 md:mb-12"
          >
            <div className="flex flex-col md:items-start items-center">
              <div className="inline-block px-3 py-1 rounded-full border border-white/40 bg-[#211A2533] mb-2 md:mb-4">
                <span className="text-[12px] font-bold text-secondary tracking-widest uppercase">
                  Use Cases
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-left text-white tracking-tight">
                Leaderboard of WiiZ Built AI Agents
              </h2>
              <p className="text-base lg:text-lg mt-3 text-center md:text-left font-light text-[#EBEBEB]">
                Examples of AI agents built on WiiZ for real enterprise
                workflows.
              </p>
            </div>
            <Link
              href="/ai-agents"
              className="flex-shrink-0 hidden md:inline-flex items-center justify-center border border-secondary text-secondary hover:bg-secondary hover:text-primary px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 group"
            >
              View All Agents
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
            <div className="lg:col-span-2 flex min-h-0 flex-col gap-6">
              {featuredHomeUseCase ? (
                <>
                  <div
                    className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 lg:p-9 shadow-xl"
                    data-aos="fade-right"
                  >
                    <div className="grid gap-7 md:grid-cols-[1.1fr_1fr] md:items-center">
                      <div>
                        <div className="mb-5 flex items-center gap-4">
                          <div className="h-12 w-12 shrink-0 rounded-xl bg-[#f3e8ed] text-[#922358] flex items-center justify-center">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          {featuredHomeUseCase.industryTitle ? (
                            <span className="text-md md:text-md font-semibold uppercase tracking-[0.10em] text-[#922358]">
                              {featuredHomeUseCase.industryTitle}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-950 mb-5 tracking-tight">
                          {featuredHomeUseCase.useCaseTitle}
                        </h3>
                        <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                          {featuredHomeUseCase.useCaseDescription ||
                            stripHtml(featuredHomeUseCase.impactDescription) ||
                            featuredHomeUseCase.challenges[0] ||
                            "Use case details are not available yet."}
                        </p>
                      </div>

                      <div className="bg-[#fafaff] rounded-lg border border-[#edeefa] p-5 md:p-7 shadow-sm">
                        <p className="text-[#922358] text-xs font-bold uppercase tracking-[0.35em] mb-7">
                          Impact
                        </p>
                        <p className="text-base text-gray-500 leading-relaxed">
                          {stripHtml(featuredHomeUseCase.impactDescription) ||
                            featuredHomeUseCase.useCaseDescription ||
                            "Impact details are not available for this use case yet."}
                        </p>
                        <Link
                          href={{
                            pathname: "/ai-agents/usecasedetail",
                            query: {
                              useCaseId: featuredHomeUseCase.useCaseId,
                              industryTitle: featuredHomeUseCase.industryTitle ?? "",
                              functionTitle: featuredHomeUseCase.functionTitle ?? "",
                            },
                          }}
                          className="mt-6 inline-flex items-center text-[#922358] font-semibold group"
                        >
                          Explore Use Case
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {secondaryHomeUseCases.map((card, index) => {
                      const Icon = index === 0 ? ChartNoAxesColumnIncreasing : ClipboardList;

                      return (
                        <div
                          key={card.id}
                          className="bg-white rounded-2xl md:rounded-3xl p-6 lg:p-9 shadow-xl min-h-[260px] flex flex-col"
                          data-aos="fade-right"
                          data-aos-duration="1000"
                        >
                          <div>
                            <div className="mb-5 flex items-center gap-4">
                              <div className="h-12 w-12 shrink-0 rounded-xl bg-[#f3e8ed] text-[#922358] flex items-center justify-center">
                                <Icon className="w-6 h-6" />
                              </div>
                              {card.industryTitle ? (
                                <span className="text-md md:text-md font-semibold uppercase tracking-[0.10em] text-[#922358]">
                                  {card.industryTitle}
                                </span>
                              ) : null}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-950 mb-4 tracking-tight">
                              {card.useCaseTitle}
                            </h3>
                            <p className="text-base text-gray-500 leading-relaxed max-w-sm">
                              {card.useCaseDescription ||
                                stripHtml(card.impactDescription) ||
                                card.challenges[0] ||
                                "Use case details are not available yet."}
                            </p>
                          </div>
                          <Link
                            href={{
                              pathname: "/ai-agents/usecasedetail",
                              query: {
                                useCaseId: card.useCaseId,
                                industryTitle: card.industryTitle ?? "",
                                functionTitle: card.functionTitle ?? "",
                              },
                            }}
                            className="mt-auto inline-flex w-fit items-center text-[#922358] font-semibold pt-8 group"
                          >
                            Explore Use Case
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
            <div className="md:col-span-1 lg:col-span-1 min-h-0">
              <div className="bg-gradient-to-b from-[#91205996] to-[#6b1b4396] rounded-2xl md:rounded-2xl md:rounded-3xl shadow-2xl h-full min-h-0 flex flex-col border border-white/10" data-aos="fade-left" >
                {/* <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 text-white rounded-xl flex items-center justify-center mb-3 md:mb-6 backdrop-blur-sm">
                  <Headset className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1 md:mb-2">
                  Enterprise Compliance Assistant
                </h3>
                <ul className="list-disc list-inside text-gray-300 mb-6">
                  <li>Consumer protection checks</li>
                  <li>Internal policy traceability</li>
                  <li>Immutable audit visibility</li>
                </ul> */}
                <ComplianceChatbotPreview />
              </div>
            </div>
          </div>

          <div className="md:hidden flex w-full items-center justify-center">
            <Link
              href="/ai-agents"
              className="inline-flex items-center justify-center border border-secondary text-secondary hover:bg-secondary hover:text-primary px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 mt-6 group"
            >
              View All Agents
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-primary py-8 md:py-12 xl:py-20 relative overflow-hidden font-sans">
        <div className="absolute top-0 md:top-1/2 md:left-0 -translate-y-1/2 -translate-x-1/2 w-full lg:w-[65%] h-[45%] md:h-[60%] lg:h-[65%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0" />
        <div className="absolute top-0 md:top-1/2 md:right-0 -translate-y-1/2 translate-x-1/2 w-full lg:w-[65%] h-[45%] md:h-[60%] lg:h-[65%] bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            data-aos="fade-down"
            className="text-center max-w-3xl mx-auto mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4 tracking-tight">
              Accelerating Enterprise AI Adoption{" "}
              <span className="text-secondary"></span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 xl:gap-8">
            {audienceCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl md:rounded-3xl overflow-hidden flex flex-col bg-[#2b1c27] border border-white/5 shadow-2xl"
              >
                <div className="h-[260px] sm:h-[200px] xl:h-[220px] lg:h-[150px] relative">
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <MissingArtwork label={card.title} />
                  )}
                </div>
                <div className="p-4 sm:p-6 lg:p-4 xl:p-5 flex-1 flex flex-col justify-start">
                  <h3 className="text-xl sm:text-xl font-bold text-secondary mb-2 sm:mb-3 text-center">
                    {card.title}
                  </h3>
                  <p className="mb-2 md:mb-4 text-base text-gray-300 text-center">
                    {card.desc}
                  </p>
                  {/* <ul className="space-y-3 lg:space-y-6">
                    {card.bullets.map((item) => (
                      <li key={item} className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-secondary mr-2 sm:mr-4 mt-1 flex-shrink-0" />{" "}
                        <span className="text-gray-300 text-sm md:text-base">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul> */}
                  <div className="mt-auto pt-6 text-center">
                    <WebsiteCtaButton
                      href={audienceCardCtaHrefMap[card.cta] ?? "/register"}
                      fallbackHref="/register"
                      className="inline-flex w-fit items-center justify-center bg-gradient-to-r from-tertiary to-quaternary text-white hover:text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-semibold transition-all duration-300"
                    >
                      {card.cta}
                    </WebsiteCtaButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-4 md:py-10 lg:py-20 relative overflow-hidden font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20 relative z-10">
          <div className="relative bg-gradient-to-t to-[#4639418F] from-[#4921421A] border border-white/5 rounded-[1rem] md:rounded-[2rem] py-12 px-6 sm:px-10 md:py-12 lg:py-20 shadow-[inset_0_12px_12px_-12px_#FF8E5D4D] flex flex-col items-center text-center overflow-hidden">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-48 pointer-events-none hidden md:block">
              <svg
                width="134"
                height="215"
                viewBox="0 0 134 215"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.25">
                  <path
                    d="M-12.9999 2H22.7404C35.4428 2.00007 45.7403 12.2976 45.7404 25V41.0986H45.7423V43.2051C45.7423 57.0122 56.9352 68.205 70.7423 68.2051H133.828V66.2051H70.7423C58.0398 66.205 47.7423 55.9076 47.7423 43.2051V26.6445H47.7404V25C47.7402 11.193 36.5473 6.8033e-05 22.7404 0H-12.9999V2Z"
                    fill="url(#paint0_linear_157_1104)"
                  />
                  <path
                    d="M-12.9999 212.609H22.7404C35.4428 212.609 45.7403 202.312 45.7404 189.609V173.511H45.7423V171.404C45.7423 157.597 56.9352 146.404 70.7423 146.404H133.828V148.404H70.7423C58.0398 148.404 47.7423 158.702 47.7423 171.404V187.965H47.7404V189.609C47.7402 203.416 36.5473 214.609 22.7404 214.609H-12.9999V212.609Z"
                    fill="url(#paint1_linear_157_1104)"
                  />
                  <path
                    d="M133.832 107.305H10.8231"
                    stroke="white"
                    strokeOpacity="0.2"
                    strokeWidth="2"
                  />
                  <path
                    d="M133.832 107.305H52.4292"
                    stroke="url(#paint2_linear_157_1104)"
                    strokeWidth="2"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_157_1104"
                    x1="127.053"
                    y1="67.7351"
                    x2="-25.7935"
                    y2="26.8045"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#353535" />
                    <stop offset="0.5" stopColor="white" />
                    <stop offset="1" stopColor="#353535" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_157_1104"
                    x1="127.053"
                    y1="146.874"
                    x2="-25.7935"
                    y2="187.805"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#353535" />
                    <stop offset="0.5" stopColor="white" />
                    <stop offset="1" stopColor="#353535" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_157_1104"
                    x1="130.076"
                    y1="108.298"
                    x2="129.199"
                    y2="99.4158"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#353535" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-48 pointer-events-none hidden md:block">
              <svg
                width="135"
                height="215"
                viewBox="0 0 135 215"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.25">
                  <path
                    d="M146.83 2H111.09C98.3873 2.00007 88.0898 12.2976 88.0897 25V41.0986H88.0878V43.2051C88.0878 57.0122 76.8948 68.205 63.0878 68.2051H0.00183105V66.2051H63.0878C75.7903 66.205 86.0878 55.9076 86.0878 43.2051V26.6445H86.0897V25C86.0898 11.193 97.2827 6.8033e-05 111.09 0H146.83V2Z"
                    fill="url(#paint0_linear_157_1116)"
                  />
                  <path
                    d="M146.83 212.41H111.09C98.3873 212.41 88.0898 202.113 88.0897 189.41V173.312H88.0878V171.205C88.0878 157.398 76.8948 146.205 63.0878 146.205H0.00183105V148.205H63.0878C75.7903 148.205 86.0878 158.503 86.0878 171.205V187.766H86.0897V189.41C86.0898 203.217 97.2827 214.41 111.09 214.41H146.83V212.41Z"
                    fill="url(#paint1_linear_157_1116)"
                  />
                  <path
                    d="M0.000244141 107.205H123.009"
                    stroke="white"
                    strokeOpacity="0.2"
                    strokeWidth="2"
                  />
                  <path
                    d="M0.000244141 107.205H81.4034"
                    stroke="url(#paint2_linear_157_1116)"
                    strokeWidth="2"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_157_1116"
                    x1="6.7768"
                    y1="67.7351"
                    x2="159.624"
                    y2="26.8045"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#353535" />
                    <stop offset="0.5" stopColor="white" />
                    <stop offset="1" stopColor="#353535" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_157_1116"
                    x1="6.7768"
                    y1="146.675"
                    x2="159.624"
                    y2="187.606"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#353535" />
                    <stop offset="0.5" stopColor="white" />
                    <stop offset="1" stopColor="#353535" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_157_1116"
                    x1="3.75635"
                    y1="108.198"
                    x2="4.6335"
                    y2="99.3162"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#353535" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="relative z-20 max-w-3xl mx-auto w-full">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight"
                data-aos="fade-up"
              >
                Operationalize Enterprise AI
                <br className="hidden md:block" />
                with Confidence
              </h2>
              <p
                className="max-w-xl mx-auto text-base md:text-lg text-gray-300 mb-8 sm:mb-10 px-2 sm:px-0"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Defragment your AI Chaos with WiiZ, Centralize AI agents, governance, and observability across your Organization.
              </p>

              <div
                className="max-w-md mx-auto mb-8 mt-4"

              >
                <div className="grid grid-cols-4 gap-3 mt-5 justify-items-center" data-aos="fade-up"
                  data-aos-delay="100">
                  <img
                    src="/images/certificates/iso27001.png"
                    alt=""
                    className="rounded-full md:w-20 md:h-20 h-16 w-16 object-cover"
                  />

                  <img
                    src="/images/certificates/hippa.jpg"
                    alt=""
                    className="rounded-full md:w-20 md:h-20 h-16 w-16 object-cover"
                  />

                  <img
                    src="/images/certificates/gdpr.png"
                    alt=""
                    className="rounded-full md:w-20 md:h-20 h-16 w-16 object-cover"
                  />

                  <img
                    src="/images/certificates/aicpa.png"
                    alt=""
                    className="rounded-full md:w-20 md:h-20 h-16 w-16 object-cover"
                  />
                </div>
              </div>
              <div
                className="relative flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                <WebsiteCtaButton
                  href="/register"
                  fallbackHref="/register"
                  className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center border-white/50 text-white px-8 py-3.5 lg:py-4 rounded-full text-base font-medium transition-transform hover:scale-105 duration-300 shadow-xl border border-white/5"
                >
                  Get Started
                </WebsiteCtaButton>
                <WebsiteCtaButton
                  href="/contact"
                  fallbackHref="/contact"
                  className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-quaternary to-[#D87AAA] text-white px-8 sm:px-10 py-3.5 lg:py-4 rounded-full text-base font-medium transition-transform hover:scale-105 duration-300"
                >
                  Book Enterprise Demo
                </WebsiteCtaButton>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="block md:hidden mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-full border border-white/40 p-6 rounded-[2.5rem] bg-[linear-gradient(145deg,#09090b_35%,#3b1429_70%,#a0386c_100%)] backdrop-blur-xl shadow-2xl text-center md:text-left">
            <h1 className="text-[28px] font-bold text-white leading-[1.2] tracking-tight mb-3">
              Start Building
              <br />
              Smarter AI
              <br />
              Workflows Today
            </h1>
            <p className="text-[14px] font-normal text-gray-300 leading-relaxed mb-8 pr-2">
              Join 500+ engineering teams orchestrating the future of enterprise
              intelligence.
            </p>
            <a
              href="#"
              className="inline-block text-[14px] font-medium text-white px-6 py-2.5 rounded-full bg-gradient-to-r from-[#9e3367] to-[#d671a5] hover:opacity-90 transition-opacity duration-300 shadow-md"
            >
              Get started for free
            </a>
          </div>
        </div> */}
      </section>

      <section className="bg-primary py-8 md:py-12 xl:py-20 relative overflow-hidden font-sans bg-gray-900">
        <div className="hidden md:block absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[150%] lg:w-[90%] h-full bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0" />
        <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[150%] lg:w-[90%] h-full bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-24 mb-8 md:mb-16 relative md:min-h-[300px]">
            <div
              className="flex flex-col justify-center items-center md:items-start "
              data-aos="fade-right"
            >
              <div className="inline-flex max-w-[120px] px-3 py-1 rounded-full border border-white/30 bg-[#211A2533] mb-4">
                <span className="text-[12px] font-bold text-secondary tracking-widest uppercase">
                  TESTIMONIAL
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-6 leading-tight font-sans text-center md:text-left">
                What our
                <br />
                builders say
              </h2>
              <p className="text-base md:text-lg text-gray-300 max-w-lg lg:max-w-md font-sans text-center md:text-left">
                Real feedback from engineers and developers building practical
                AI workflows with WiiZ.
              </p>
            </div>
            <div
              className="relative w-full h-full hidden md:flex items-center mt-16 lg:mt-0"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  className={`absolute w-full transition-all duration-500 ${item.id === currentTestimonial.id ? "opacity-100 translate-y-0 z-10" : "opacity-0 translate-y-4 pointer-events-none z-0"}`}
                >
                  <div className="bg-gradient-to-t from-[#2A0E1C] to-[#00000000] border border-white/10 rounded-xl md:rounded-2xl p-6 lg:p-10 shadow-2xl lg:h-[320px] h-[240px] overflow-hidden">
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-full border border-white/10 object-cover"
                      />
                      <div>
                        <h4 className="text-white font-semibold text-lg">
                          {item.name}
                        </h4>
                        <span className="text-gray-300 text-sm">
                          {item.role}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed custom-line-clamp-4">
                      &quot;{item.quote}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:hidden relative">
              <div
                ref={mobileTestimonialsRef}
                onScroll={handleMobileTestimonialsScroll}
                className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar scroll-smooth"
              >
                {testimonialLoopItems.map((item, index) => (
                  <div
                    key={`${item.id}-mobile-${index}`}
                    className="w-full shrink-0 snap-center"
                  >
                    <div className="min-h-[200px] bg-gradient-to-t from-[#2A0E1C] to-[#00000000] border border-white/10 rounded-[1rem] md:rounded-[1.5rem] p-6 shadow-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <h3 className="text-[16px] font-semibold text-white leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-[14px] font-normal text-[#a1949b] mt-1">
                            {item.role}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm md:text-[16px] font-normal text-[#e8e2e5] leading-relaxed tracking-wide custom-line-clamp-4">
                        {item.quote}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-center gap-2">
                {testimonials.map((item) => {
                  const isActive = item.id === currentMobileTestimonial.id;

                  return (
                    <button
                      key={`${item.id}-mobile-dot`}
                      type="button"
                      aria-label={`Show testimonial from ${item.name}`}
                      onClick={() =>
                        setMobileActiveTestimonial(
                          testimonialLoopOffset +
                          testimonials.findIndex(
                            (testimonial) => testimonial.id === item.id,
                          ),
                        )
                      }
                      className={`h-2 rounded-full transition-all duration-300 ${isActive
                        ? "w-4 bg-gradient-to-r from-quaternary to-[#D87AAA]"
                        : "w-2 bg-white/20"
                        }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="lg:pt-0 md:pt-28 hidden md:block relative w-full border-b border-white/10"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div
              ref={testimonialTabsRef}
              className="flex overflow-x-auto snap-x snap-mandatory cursor-grab select-none no-scrollbar transition-all"
            >
              {testimonialLoopItems.map((item, index) => {
                const normalizedIndex = index % testimonials.length;
                const active = index === activeTestimonial;
                return (
                  <button
                    key={`${item.id}-${index}`}
                    ref={(el) => {
                      testimonialBtnRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() =>
                      setActiveTestimonial(
                        testimonialLoopOffset + normalizedIndex,
                      )
                    }
                    className={`group flex-shrink-0 w-full md:w-1/3 xl:w-1/5 flex items-center gap-4 px-8 py-4 border-b-2 snap-start transition-all ${active ? "bg-gradient-to-t from-white/15 to-transparent border-secondary" : "hover:bg-white/5 border-transparent"}`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-12 h-12 rounded-full border-2 object-cover transition-colors ${active ? "border-secondary/50" : "border-transparent"}`}
                    />
                    <div className="text-left overflow-hidden">
                      <span className="block text-white font-medium truncate">
                        {item.name}
                      </span>
                      <span className="block text-gray-400 text-sm truncate">
                        {item.role}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-8 md:py-12 lg:py-24 font-sans bg-gray-900 font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
            <div className="col-span-1 md:col-span-5 pr-0 md:pr-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-6 tracking-tight leading-[1.1] text-center md:text-left">
                Frequently Asked
                <br />
                Questions
              </h2>
            </div>
            <div className="col-span-1 md:col-span-7 gap-3 md:gap-0 flex flex-col md:border-t border-white/10">
              {visibleFaqs.map((item, index) => {
                const actualIndex = faqs.findIndex(
                  (faq) => faq.question === item.question,
                );
                const open = openFaq === actualIndex;
                return (
                  <div
                    key={item.question}
                    className="border md:border-0 rounded-xl md:rounded-none md:border-b border-white/10 faq-item px-4 md:px-0 bg-gradient-to-r from-[#B15081b8] to-[#632243b8] md:bg-none"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : actualIndex)}
                      className="w-full flex justify-between items-center py-3 md:py-6 text-left group focus:outline-none"
                    >
                      <span className="font-sans text-base md:text-lg text-gray-200 group-hover:text-white transition-colors duration-200">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#D1CECE] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{ maxHeight: open ? 160 : 0 }}
                    >
                      <p className="font-sans pb-6 text-gray-300 text-base leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div
                className="mt-4 md:mt-8 flex justify-center md:justify-end"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event(WEBSITE_CHATBOT_OPEN_EVENT))}
                  className="flex items-center gap-2 text-sm md:text-base px-6 py-2 md:py-2.5 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-colors duration-300 focus:outline-none"
                >
                  <span>View More</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[380px] overflow-hidden bg-primary px-4 py-12 font-sans flex items-center justify-center sm:min-h-[420px] sm:py-14 md:min-h-[450px] md:py-12 lg:py-24">
        <div className="absolute top-1/2 left-0 h-[120px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-quaternary blur-[60px] pointer-events-none z-0 sm:w-[360px] md:w-[400px]" />
        <div className="absolute top-1/2 right-0 h-[120px] w-[260px] translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-quaternary blur-[60px] pointer-events-none z-0 sm:w-[360px] md:w-[400px]" />
        <div className="absolute top-1/2 left-0 h-full w-[220%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_70%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_70%)] z-0 sm:w-[150%] lg:w-[86%]" />
        <div className="absolute top-1/2 right-0 h-full w-[220%] translate-x-1/2 -translate-y-1/2 rounded-full bg-quaternary/40 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_70%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_70%)] z-0 sm:w-[150%] lg:w-[86%]" />
        <div className="absolute left-0 top-1/2 hidden w-[110px] -translate-y-1/2 pointer-events-none z-0 sm:block md:w-[150px] lg:w-[180px] xl:w-[350px] xl:h-[300px]">
          <img src="/images/cta-svg-left.png" alt="" className="h-full" />
        </div>
        <div className="absolute right-0 top-1/2 hidden w-[110px] -translate-y-1/2 pointer-events-none z-0 sm:block md:w-[150px] lg:w-[180px] xl:w-auto xl:h-[300px]">
          <img src="/images/cta-svg-right.png" alt="" className="h-full" />
        </div>
        <div className="relative z-10 w-full max-w-2xl text-center sm:px-6">
          <h2
            className="mx-auto mb-4 max-w-[18rem] text-[28px] font-bold leading-[1.15] tracking-tight text-white sm:max-w-xl sm:text-4xl md:mb-6 md:text-4xl lg:text-5xl"
            data-aos="fade-up"
          >
            Start Building Enterprise
            <br />
            AI Agents Today
          </h2>
          <p
            className="mx-auto mb-7 max-w-[21rem] text-sm font-normal leading-relaxed text-gray-300/80 sm:mb-9 sm:max-w-xl sm:text-base md:text-[18px] lg:mb-10"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Join teams using WiiZ to design, deploy, and scale enterprise AI
            systems with confidence.
          </p>
          <div
            className="relative mx-auto flex w-full max-w-xs flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <WebsiteCtaButton
              href="/register"
              fallbackHref="/register"
              className="relative z-10 inline-flex w-full items-center justify-center rounded-full border border-white/50 px-6 py-3 text-sm font-medium text-white shadow-xl transition-transform duration-300 hover:scale-105 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
            >
              Get Started
            </WebsiteCtaButton>
            <WebsiteCtaButton
              href="/contact"
              fallbackHref="/contact"
              className="relative z-10 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-quaternary to-[#D87AAA] px-6 py-3 text-sm font-medium text-white shadow-xl transition-transform duration-300 hover:scale-105 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
            >
              Book Enterprise Demo
            </WebsiteCtaButton>
          </div>
        </div>

      </section>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-section {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </>
  );
}
