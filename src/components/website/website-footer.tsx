import {
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import PolicyModalTrigger from "@/src/components/website/policy-modal-trigger";

const footerExploreLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Partner", href: "/partner" },
  { label: "Pricing", href: "/pricing" },
];

const footerResourceLinks = [
  { label: "Contact", href: "/contact" },

];

const footerSocialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/showcase/estrel-wiiz-it/", Icon: Linkedin },
 { label: "Instagram", href: "https://www.instagram.com/wiiz.it?", Icon: Instagram },
  { label: "Youtube", href: "https://youtube.com/@wiiz-it?si=Zih4KEVCWIAuvSfD", Icon: Youtube },
  // { label: "Facebook", href: "#", Icon: Facebook },
  // { label: "Discord", href: "#", Icon: MessageCircle },
  { label: "Product Hunt", href: "https://www.producthunt.com/products/wiiz?launch=wiiz-altas-2-0-public-beta", Icon: ProductHuntIcon },
];

function ProductHuntIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1.53 11.15h-2.44v3.32H8.91V7.53h4.62a2.81 2.81 0 0 1 0 5.62Zm-.1-3.58h-2.34v1.54h2.34a.77.77 0 0 0 0-1.54Z"
      />
    </svg>
  );
}

export default function WebsiteFooter() {
  return (
    <footer className="bg-[#0F1115] pt-10 md:pt-16 lg:pt-20 pb-8 md:pb-10 font-sans border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-12 lg:gap-8 mb-16 md:mb-16">
          <div className="lg:col-span-2 md:col-span-3 col-span-2 pr-0 lg:pr-12">
            <Link href="/" className="inline-block mb-0 md:mb-0" aria-label="WiiZ Home">
              <img src="/images/new-logo.png" alt="" className="h-14 lg:h-16 w-auto" />
            </Link>
            <p className="text-[15px] text-gray-300 ml-0 lg:ml-2 leading-relaxed lg:max-w-[340px]">
              WiiZ is the enterprise platform for AI orchestration, governance, and
              agent-based automation.
            </p>
          </div>
          <nav aria-label="Explore Navigation" className="order-1">
            <h3 className="text-[15px] font-semibold text-white mb-2 md:mb-6 tracking-wide">
              Explore
            </h3>
            <ul className="space-y-2">
              {footerExploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
       
          <nav className="md:col-span-1 col-span-2 order-3 md:order-2" aria-label="Social Media Navigation">
            <h3 className="text-[15px] font-semibold text-white mb-2 md:mb-6 tracking-wide">
              Resources
            </h3>
             <ul className="space-y-2 flex justify-start md:gap-0 gap-4 md:flex-col">
              {footerResourceLinks.map((item) => (
                <li key={item.label} >
                  <Link
                    href={item.href}
                    className="text-[15px] text-gray-400 hover:text-white text-left transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <PolicyModalTrigger
                  policy="cookies"
                  className="text-[15px] text-gray-400 hover:text-white text-left transition-colors duration-200"
                >
                  Cookie Policy
                </PolicyModalTrigger>
              </li>
              <li>
                <PolicyModalTrigger
                  policy="privacy"
                  className="text-[15px] text-gray-400 hover:text-white text-left transition-colors duration-200"
                >
                  Privacy Policy
                </PolicyModalTrigger>
              </li>
              <li>
                <PolicyModalTrigger
                  policy="terms"
                  className="text-[15px] text-gray-400 hover:text-white text-left transition-colors duration-200"
                >
                  Terms and Conditions
                </PolicyModalTrigger>
              </li>
            </ul>
          </nav>

             <nav aria-label="Resources Navigation" className="order-2 md:order-3">
            <h3 className="text-[15px] font-semibold text-white mb-2 md:mb-6 tracking-wide">
              Social
            </h3>
             <ul className="space-y-2">
              {footerSocialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[15px] text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="w-full h-[1px] bg-[#2a2a2a] mb-4 md:mb-8" aria-hidden="true" />
        <div className="flex justify-center items-center text-center">
          <p className="text-[14px] text-gray-400 tracking-wide">
            &copy; 2026 WiiZ Platform Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    
  );
}
