import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Taologos CMS",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070b12",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ height: "100vh", margin: 0, padding: 0 }}>{children}</div>
  );
}
