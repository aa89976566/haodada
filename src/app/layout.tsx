import type { Metadata, Viewport } from "next";
import { BRAND } from "@/data/brand";
import { asset } from "@/lib/asset";
import "./globals.css";

const TITLE = `${BRAND.name}｜${BRAND.studio} ${BRAND.furmosa}`;
const DESCRIPTION = BRAND.description;
const SITE_URL = "https://aa89976566.github.io/haodada/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "嚎大大雞霸",
    "匠寵",
    "FURMOSA",
    "雞肉零食",
    "低溫烘乾",
    "寵物零食",
    "狗公園",
    "無添加",
  ],
  authors: [{ name: `${BRAND.studio} ${BRAND.furmosa}` }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: BRAND.name,
    type: "website",
    locale: "zh_TW",
    images: [{ url: `${SITE_URL}social/sharecard-facebook.png` }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}social/sharecard-twitter.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#1a42c2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="stylesheet" href={`${asset("/haodada-site-v15.css")}?v=outer-side-report-v16`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
