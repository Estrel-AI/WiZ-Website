import type { Metadata } from "next";
import { FRONTEND_BASE_URL } from "@/src/config/public-env";

type OgImage = {
  url: string;
  width?: number;
  height?: number;
};

type WebsiteOgConfig = {
  title: string | { absolute: string };
  description: string;
  path: string;
  image: OgImage;
  type?: "website" | "article";
};

export const websiteOgImages = {
  about: { url: "/images/icon-light.png", width: 1812, height: 897 },
  blog: { url: "/images/icon-light.png", width: 1813, height: 901 },
  contact: { url: "/images/icon-light.png", width: 1819, height: 907 },
  home: { url: "/images/icon-light.png", width: 1893, height: 903 },
  partner: { url: "/images/icon-light.png", width: 1759, height: 901 },
  pricing: { url: "/images/icon-light.png", width: 1792, height: 906 },
  usecase: { url: "/images/icon-light.png", width: 1893, height: 903 },
} as const;

const absoluteUrl = (path: string) => new URL(path, `${FRONTEND_BASE_URL}/`).toString();

export function WebsiteOgTags({
  title,
  description,
  path,
  image,
  type = "website",
}: WebsiteOgConfig) {
  const pageUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(image.url);
  const logoUrl = absoluteUrl("/images/new-logo.png");
  const plainTitle = typeof title === "string" ? title : title.absolute;

  return (
  <>
    {/* Standard Meta Tags (Crucial for SEO and some older crawlers) */}
    <title>{plainTitle}</title>
    <meta name="description" content={description} />

    {/* Essential OG Tags */}
    <meta property="og:type" content={type || "website"} />
    <meta property="og:site_name" content="WiiZ" />
    <meta property="og:title" content={plainTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={pageUrl} />

    {/* Conditionally render ONLY ONE set of image tags */}
    {imageUrl ? (
      <>
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:secure_url" content={imageUrl} />
        {/* Recommend forcing JPEG or WebP type if you dynamically generate these */}
        <meta property="og:image:type" content="image/jpeg" /> 
        {image?.width && <meta property="og:image:width" content={String(image.width)} />}
        {image?.height && <meta property="og:image:height" content={String(image.height)} />}
        <meta property="og:image:alt" content={plainTitle} />
        <meta name="twitter:image" content={imageUrl} />
      </>
    ) : (
      <>
        <meta property="og:image" content={logoUrl} />
        <meta property="og:image:secure_url" content={logoUrl} />
        {/* Update this to "image/png" or "image/jpeg" based on your actual logoUrl file type */}
        <meta property="og:image:type" content="image/png" /> 
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="WiiZ Logo" />
        <meta name="twitter:image" content={logoUrl} />
      </>
    )}

    {/* Twitter Base Tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content="wiiz.it" />
    {/* If you have a Twitter handle, add it here, e.g., content="@WiiZ" */}
    <meta name="twitter:site" content="@yourtwitterhandle" /> 
    <meta name="twitter:title" content={plainTitle} />
    <meta name="twitter:description" content={description} />
  </>
);
}

export function buildWebsiteMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: WebsiteOgConfig): Metadata {
  const plainTitle = typeof title === "string" ? title : title.absolute;
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title: plainTitle,
      description,
      url: absoluteUrl(path),
      siteName: "WiiZ",
      type,
      images: [
        {
          url: absoluteUrl(image.url),
          width: image.width,
          height: image.height,
          alt: plainTitle,
        },
        {
          url: absoluteUrl("/images/new-logo.png"),
          width: 1200,
          height: 630,
          alt: "WiiZ Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: plainTitle,
      description,
      images: [absoluteUrl(image.url), absoluteUrl("/images/new-logo.png")],
    },
  };
}
