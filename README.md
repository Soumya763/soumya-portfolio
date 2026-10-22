# Soumya Singh — Portfolio

AI Generalist · AI Product Design · UI/UX · Creative Technology

A static Next.js site with two in-depth case studies:

- **Konsa Pehnu**: AI personal stylist (React, Capacitor, Supabase, Auth0, Claude API)
- **Threat Hunting & Security Monitoring Platform**: Logstash, Grok, OpenSearch, FastAPI, React

It also includes an interactive, rule-based **AI Lab** prototype. It runs in the browser and calls no model.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm run lint
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/app/page.tsx` | Homepage: hero, selected work, AI Lab, technical thinking, process, skills, about, contact |
| `src/app/work/konsa-pehnu/` | Case study 01 |
| `src/app/work/threat-hunting/` | Case study 02 |
| `src/app/globals.css` | Design system: tokens, type scale, layout, components |
| `src/components/` | Nav, HeroStack, StyleLab, RequestFlow, Diagrams, ParseExplorer, SocConcept, CaseToc, Media |
| `src/lib/site.ts` | Name, links, email, repositories (edit here) |
| `src/lib/logSamples.ts` | Grok patterns and sample lines used by the hero and parse explorer |
| `public/work/` | Optimised WebP screenshots (each labelled on the site by provenance) |

## Image provenance

Every image is labelled on the site:

- **Running build**: the real app, run and captured locally.
- **Design export**: Google Stitch exports the React app was built from.
- **Real UI · sample data**: the real security frontend, run locally with sample API responses.
- **Concept**: proposed, not implemented.

## Deploy

### Vercel (recommended)
1. Import `Soumya763/soumya-portfolio` at vercel.com/new (framework: Next.js, defaults are fine).
2. Optional: set `NEXT_PUBLIC_SITE_URL` to your final domain. Without it, the production `*.vercel.app` URL is used for canonical, Open Graph and sitemap URLs.
3. Deploy. Pages are public, no login required.

### GitHub Pages (alternative)
Settings → Pages → Source: **GitHub Actions**, then run the **Deploy to GitHub Pages** workflow.
The site will be at `https://soumya763.github.io/soumya-portfolio/`.
