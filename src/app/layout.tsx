import type { Metadata, Viewport } from "next";
import { asset } from "@/lib/asset";
import "./globals.css";

const TITLE = "DOG PARK LAB — 壕大大雞霸";
const DESCRIPTION =
  "DOG PARK EXPERIMENT. Public fake laboratory studying chicken jerky and unexpected conversations.";
const SITE_URL = "https://aa89976566.github.io/haodada/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "DOG PARK LAB",
    "壕大大雞霸",
    "匠寵",
    "Furmosa",
    "dog park experiment",
    "寵物零食",
  ],
  authors: [{ name: "DOG UNIT" }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "DOG PARK LAB",
    type: "website",
    images: [{ url: `${SITE_URL}images/hero-drive.jpg` }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}images/hero-drive.jpg`],
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
      <head>
        <link rel="stylesheet" href={asset("/thisfoot.css")} />
      </head>
      <body>{children}</body>
    </html>
  );
}
