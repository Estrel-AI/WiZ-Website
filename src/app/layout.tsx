import type { Metadata } from "next";
import Script from "next/script";
import { PolicyModalProvider } from "@/src/components/website/policy-modal-provider";
import { FRONTEND_BASE_URL, GA_MEASUREMENT_ID } from "@/src/config/public-env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(FRONTEND_BASE_URL),
  title: {
    default: "WiiZ",
    template: "%s | WiiZ",
  },
  description: "AI orchestration and automation",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "WiiZ",
    description: "AI orchestration and automation",
    siteName: "WiiZ",
    images: [
      {
        url: "/images/new-logo.png",
        width: 1200,
        height: 630,
        alt: "WiiZ Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WiiZ",
    description: "AI orchestration and automation",
    images: ["/images/new-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        ) : null}
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <PolicyModalProvider>{children}</PolicyModalProvider>
      </body>
    </html>
  );
}
