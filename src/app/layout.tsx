import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://soumya-portfolio-rouge.vercel.app";
const siteTitle = "Soumya Singh | Full Stack Developer & Cybersecurity";
const siteDescription =
  "Portfolio of Soumya Singh, a full stack developer and cybersecurity enthusiast. Projects include blockchain healthcare security and HR workflow automation.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Soumya Singh",
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Soumya Singh",
  jobTitle: "Full Stack Developer",
  description: siteDescription,
  url: siteUrl,
  image: `${siteUrl}/profile.jpeg`,
  sameAs: [
    "https://github.com/Soumya763",
    "https://www.linkedin.com/in/soumya04",
  ],
  knowsAbout: [
    "Full stack development",
    "Cybersecurity",
    "Blockchain",
    "Data structures and algorithms",
    "Generative AI",
    "Workflow automation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
