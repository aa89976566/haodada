import type { Metadata, Viewport } from "next";
import { asset } from "@/lib/asset";
import "./globals.css";

const TITLE = "This Foot Does Not Exist";
const DESCRIPTION =
  "We trained a computer to create fake foot pics. Text 607-409-3339. It'll send you feet.";
const SITE_URL = "https://aa89976566.github.io/haodada/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "foot",
    "feet",
    "does not exist",
    "gan",
    "ai",
    "generate picture",
    "chatbot",
    "mschf",
  ],
  authors: [{ name: "mschf" }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "thisfootdoesnotexist",
    type: "website",
    images: [{ url: `${SITE_URL}social/sharecard-facebook.png` }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mschfxyz",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}social/sharecard-twitter.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
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
    <html lang="en">
      <head>
        <link rel="stylesheet" href={asset("/thisfoot.css")} />
      </head>
      <body>{children}</body>
    </html>
  );
}
