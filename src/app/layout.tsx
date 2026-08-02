import type { Metadata, Viewport } from "next";
import { BRAND } from "@/data/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: BRAND.name,
  description: BRAND.description,
  keywords: [
    "壕大大雞霸",
    "壕大大",
    "雞霸",
    "匠寵",
    "Furmosa",
    "寵物零食",
    "狗零食",
    "貓零食",
    "雞胸肉",
    "低溫烘乾",
  ],
  authors: [{ name: BRAND.studio }],
  openGraph: {
    title: BRAND.displayName,
    description: BRAND.description,
    url: "https://aa89976566.github.io/haodada/",
    siteName: BRAND.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: BRAND.displayName,
    description: BRAND.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#213c86",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
