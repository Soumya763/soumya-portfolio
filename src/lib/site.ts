// Single source of truth for personal details and links.
// NEXT_PUBLIC_SITE_URL should be set to the real deployment URL once known
// (used for canonical, Open Graph and sitemap URLs).

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : "")).replace(/\/$/, "");

/** Social preview image; resolved against metadataBase (which already includes the base path). */
export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "Soumya Singh — AI generalist portfolio" };

/** Prefix a /public asset path with the deployment base path. */
export function asset(path: string) {
  return `${BASE_PATH}${path}`;
}

export const site = {
  name: "Soumya Singh",
  monogram: "SS",
  role: "AI Generalist · AI Product Design · UI/UX · Creative Technology",
  description:
    "Soumya Singh — AI generalist and creative technologist. Case studies: Konsa Pehnu, a Claude-powered personal stylist app (React, Capacitor, Supabase, Auth0), and a threat hunting & security monitoring platform (Logstash, Grok, OpenSearch).",
  education: {
    degree: "B.Tech, Computer Science Engineering — Cyber Security",
    school: "SRM University, Chennai",
    years: "2023 – 2027",
  },
  email: "soumyarajput004@gmail.com",
  links: {
    linkedin: "https://linkedin.com/in/soumya04",
    github: "https://github.com/Soumya763",
    resume: "/Soumya_resume.pdf",
  },
  repos: {
    konsaApp: "https://github.com/Soumya763/konsapehnu-app",
    konsaHome: "https://github.com/Soumya763/konsapehnu-homepage",
    threat: "https://github.com/Soumya763/threat-hunting-security-monitoring-platform",
  },
};

export const projects = [
  {
    slug: "konsa-pehnu",
    index: "01",
    title: "Konsa Pehnu",
    kicker: "AI personal stylist · Web + Android",
    href: "/work/konsa-pehnu/",
  },
  {
    slug: "threat-hunting",
    index: "02",
    title: "Threat Hunting & Security Monitoring Platform",
    kicker: "Security log pipeline · Detection · Investigation",
    href: "/work/threat-hunting/",
  },
] as const;
