import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { OG_IMAGE, SITE_URL, site } from "@/lib/site";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const body = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const title = "Soumya Singh — AI Generalist, AI Product Design & Creative Technology";

export const metadata: Metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: { default: title, template: "%s · Soumya Singh" },
  description: site.description,
  authors: [{ name: site.name, url: site.links.linkedin }],
  alternates: SITE_URL ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    title,
    description: site.description,
    siteName: "Soumya Singh — Portfolio",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: [OG_IMAGE.url],
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0d0c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <footer className="footer">
          <div className="wrap">
            <span>© 2026 Soumya Singh. Designed and built with Next.js.</span>
            <span>Every screen on this site is labelled with where it came from.</span>
          </div>
        </footer>
        <Reveal />
      </body>
    </html>
  );
}
