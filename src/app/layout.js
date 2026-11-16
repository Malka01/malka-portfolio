import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Malka Sandaruwan | WordPress & Custom Full Stack Web Developer Sri Lanka",
    template: "%s | Malka",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Malka Sandaruwan",
    title: "Malka Sandaruwan | WordPress & Custom Web Developer Sri Lanka",
    description: siteConfig.description,
    images: [
      {
        url: "/Logo/Cybernaxe-Solutions-Logo.jpg",
        width: 1200,
        height: 630,
        alt: "Cybernaxe Solutions logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Malka Sandaruwan | WordPress & Custom Web Developer Sri Lanka",
    description: siteConfig.description,
    images: ["/Logo/Cybernaxe-Solutions-Logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
