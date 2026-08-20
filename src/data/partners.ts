export type PartnerLogo = {
  name: string;
  logoPath: string;
  logoPanelClassName: string;
  infoPanelClassName: string;
  titleClassName: string;
  homepageLogoClassName?: string;
};

const defaultInfoPanelClassName =
  "bg-primary hover:bg-gradient-to-br hover:from-[#240D1A] hover:via-[#240D1A] hover:to-[#9120595d]";

export const partnerLogos: PartnerLogo[] = [
  {
    name: "Alphadata",
    logoPath: "/images/partner-logos/alpha_data.jpg",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "AWS",
    logoPath: "/images/partner-logos/aws.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "Google Cloud",
    logoPath: "/images/partner-logos/google-cloud.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "Nangia",
    logoPath: "/images/partner-logos/nangia.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "NVIDIA",
    logoPath: "/images/partner-logos/nvidia.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "Raqmiyat",
    logoPath: "/images/partner-logos/raqmiyat.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "SISL",
    logoPath: "/images/partner-logos/sisl.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "Harrier",
    logoPath: "/images/partner-logos/Harrier.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: "bg-primary hover:bg-gradient-to-br hover:from-[#240D1A] hover:via-[#240D1A] hover:to-[#9120595d]",
    titleClassName: "text-white",
    homepageLogoClassName: "scale-125 md:scale-[1.35]",
  },
];
