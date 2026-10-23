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
    logoPath: "/api/assets/dummy_image/alpha_data.jpg",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "AWS",
    logoPath: "/api/assets/dummy_image/aws.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "Google Cloud",
    logoPath: "/api/assets/dummy_image/google-cloud.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "Nangia",
    logoPath: "/api/assets/dummy_image/nangia.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "NVIDIA",
    logoPath: "/api/assets/dummy_image/nvidia.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "Raqmiyat",
    logoPath: "/api/assets/dummy_image/raqmiyat.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "SISL",
    logoPath: "/api/assets/dummy_image/sisl.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: defaultInfoPanelClassName,
    titleClassName: "text-white",
  },
  {
    name: "Harrier",
    logoPath: "/api/assets/dummy_image/Harrier.png",
    logoPanelClassName: "bg-white",
    infoPanelClassName: "bg-primary hover:bg-gradient-to-br hover:from-[#240D1A] hover:via-[#240D1A] hover:to-[#9120595d]",
    titleClassName: "text-white",
    homepageLogoClassName: "scale-125 md:scale-[1.35]",
  },
];
