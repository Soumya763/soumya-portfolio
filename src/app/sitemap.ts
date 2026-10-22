import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Sitemaps require absolute URLs, so entries are emitted once
// NEXT_PUBLIC_SITE_URL is set to the real deployment URL.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL) return [];
  const lastModified = new Date("2026-10-22");
  return [
    { url: `${SITE_URL}/`, lastModified, priority: 1 },
    { url: `${SITE_URL}/work/konsa-pehnu/`, lastModified, priority: 0.9 },
    { url: `${SITE_URL}/work/threat-hunting/`, lastModified, priority: 0.8 },
  ];
}
