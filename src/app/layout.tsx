import type { Metadata, Viewport } from "next";
import { BRAND } from "@/data/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: BRAND.name,
  description: BRAND.description,
  keywords: [
    "嚎大大雞霸",
    "雞霸",
    "寵物零食",
    "狗零食",
    "貓零食",
    "原肉",
    "雞排",
    "低溫烘培",
  ],
  authors: [{ name: BRAND.name }],
  openGraph: {
    title: BRAND.name,
    description: BRAND.description,
    url: "https://aa89976566.github.io/haodada/",
    siteName: BRAND.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: BRAND.name,
    description: BRAND.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#213c86",
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
