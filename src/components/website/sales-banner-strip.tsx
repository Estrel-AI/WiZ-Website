"use client";

type SalesBannerStripProps = {
  text: string;
  className?: string;
};

function formatBannerText(text: string) {
  const trimmed = text.trim();

  if (trimmed.includes("?")) {
    return trimmed;
  }

  return `✨ ${trimmed} ✨`;
}

export default function SalesBannerStrip({
  text,
  className = "",
}: SalesBannerStripProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r from-[#6D1843] via-[#B4286E] to-[#912059] ${className}`.trim()}
    >
      <div
        className="absolute bottom-0 top-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent md:w-1/4"
        style={{ animation: "banner-slide 3s infinite linear" }}
      />
      <div className="relative z-10 container mx-auto flex items-center justify-center px-4 py-1 text-center font-sans text-[13px] font-semibold text-white sm:px-6 sm:py-2 md:text-base lg:px-8">
        {formatBannerText(text)}
      </div>
    </div>
  );
}
