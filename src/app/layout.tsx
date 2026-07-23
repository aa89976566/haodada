import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Illegal Chips",
  description:
    "Horse, Fugu, and Casu Marzu potato chips: these are the flavors the government doesn’t want you to try!",
  keywords: [
    "Horse",
    "Fugu",
    "Casu Marzu",
    "Maggot",
    "Blowfish",
    "Chips",
    "Potato",
    "MSCHF",
    "Illegal",
    "Flavor",
    "Bag",
  ],
  authors: [{ name: "MSCHF" }],
  openGraph: {
    title: "Illegal Chips",
    description:
      "Horse, Fugu, and Casu Marzu potato chips: these are the flavors the government doesn’t want you to try!",
    url: "https://illegalchips.com",
    siteName: "Illegal Chips",
    type: "website",
    images: [{ url: "/social/sharecard-facebook.png" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mschfxyz",
    title: "Illegal Chips",
    description:
      "Horse, Fugu, and Casu Marzu potato chips: these are the flavors the government doesn’t want you to try!",
    images: ["/social/sharecard-twitter.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
