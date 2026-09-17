import type { Metadata } from "next";
import { Barlow_Condensed, Manrope, Noto_Sans_Ethiopic } from "next/font/google";
import { seedContent } from "@/lib/content/seed";
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

export const metadata: Metadata = {
  title: seedContent.seo.title,
  description: seedContent.seo.description,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: seedContent.seo.title,
    description: seedContent.seo.description,
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/hero-cover.jpg", alt: "Taologos General Contractor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: seedContent.seo.title,
    description: seedContent.seo.description,
    images: ["/images/hero-cover.jpg"],
  },
};

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
      <body className="min-h-full flex flex-col font-sans">
        <a
          href="#who-we-are"
          className="sr-only"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
