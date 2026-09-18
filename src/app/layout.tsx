import type { Metadata, Viewport } from "next";
import { BRAND } from "@/data/brand";
import { SITE_URL } from "@/data/site";
import { asset } from "@/lib/asset";
import "./globals.css";

const TITLE = `${BRAND.name}｜${BRAND.studio} ${BRAND.furmosa}`;
const DESCRIPTION = BRAND.description;
const OG_IMAGE = `${SITE_URL}social/sharecard-facebook.png`;
const TW_IMAGE = `${SITE_URL}social/sharecard-twitter.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: BRAND.name,
    type: "website",
    locale: "zh_TW",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [TW_IMAGE],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: `${BRAND.studio} ${BRAND.furmosa}`,
      url: "https://furmosa.com/",
      sameAs: [BRAND.igUrl, BRAND.lineUrl],
    },
    {
      "@type": "Product",
      name: BRAND.name,
      description: BRAND.description,
      image: OG_IMAGE,
      url: BRAND.shopUrl,
      brand: {
        "@type": "Brand",
        name: `${BRAND.studio} ${BRAND.furmosa}`,
      },
      offers: {
        "@type": "Offer",
        url: BRAND.shopUrl,
        priceCurrency: "TWD",
        price: "89",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <head>
        <link
          rel="stylesheet"
          href={`${asset("/haodada-site-v15.css")}?v=prod-domain-v55`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
