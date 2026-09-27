import type { Metadata } from "next";
import { Barlow_Condensed, Manrope, Noto_Sans_Ethiopic } from "next/font/google";
import { findHeroImage } from "@/lib/content/section-defaults";
import { getPageContent } from "@/lib/content/get-page-content";
import "./globals.css";

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ethiopic = Noto_Sans_Ethiopic({
  variable: "--font-ethiopic",
  subsets: ["ethiopic"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent();
  const heroImage = findHeroImage(content.sections);
  return {
    title: content.seo.title,
    description: content.seo.description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ),
    icons: {
      icon: [
        { url: "/favicon.ico?v=2", type: "image/x-icon" },
        { url: "/icon-32.png?v=2", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180" }],
    },
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: heroImage,
          alt: content.brand.legalName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.title,
      description: content.seo.description,
      images: [heroImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${ethiopic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
